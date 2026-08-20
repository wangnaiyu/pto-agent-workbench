#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const MAX_GIT_OUTPUT_BYTES = 128 * 1024 * 1024

const forbiddenPaths = [
  {
    name: 'environment file',
    test: path => /(^|\/)\.env(?:\.|$)/u.test(path),
  },
  {
    name: 'DSH credentials file',
    test: path => /(^|\/)\.credentials\.ya?ml$/iu.test(path),
  },
  {
    name: 'DSH home directory',
    test: path => /(^|\/)\.dsh(?:-pto-workbench)?(?:\/|$)/u.test(path),
  },
]

const detectors = [
  {
    name: 'private key material',
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/u,
  },
  {
    name: 'model-provider API key',
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/u,
  },
  {
    name: 'GitHub token',
    pattern: /\b(?:github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,})\b/u,
  },
  {
    name: 'Google API key',
    pattern: /\bAIza[0-9A-Za-z_-]{30,}\b/u,
  },
  {
    name: 'AWS access key',
    pattern: /\bAKIA[0-9A-Z]{16}\b/u,
  },
  {
    name: 'npm token',
    pattern: /\bnpm_[A-Za-z0-9]{20,}\b/u,
  },
  {
    name: 'Slack token',
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/u,
  },
  {
    name: 'JSON Web Token',
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/u,
  },
  {
    name: 'Bearer credential',
    pattern: /\bBearer\s+[A-Za-z0-9_./+=-]{20,}\b/iu,
  },
  {
    name: 'embedded URL credential',
    pattern: /https?:\/\/[^\s/:@]+:[^\s/@]{8,}@/iu,
  },
  {
    name: 'credential assignment',
    pattern: /(?:api[_-]?key|secret[_-]?key|access[_-]?token|auth[_-]?token|authorization|password)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}/iu,
  },
]

function git(args, encoding = 'utf8') {
  const result = spawnSync('git', args, {
    encoding,
    maxBuffer: MAX_GIT_OUTPUT_BYTES,
  })
  if (result.error !== undefined) throw result.error
  if (result.status !== 0) {
    const message = typeof result.stderr === 'string' ? result.stderr.trim() : 'git command failed'
    throw new Error(message || `git exited with status ${String(result.status)}`)
  }
  return result.stdout
}

function nulSeparatedPaths(output) {
  return output.split('\0').filter(Boolean)
}

function stagedFiles() {
  return nulSeparatedPaths(git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z']))
}

function workingTreeFiles() {
  return nulSeparatedPaths(git(['ls-files', '--cached', '--others', '--exclude-standard', '-z']))
}

function stagedContent(path) {
  return git(['show', `:${path}`], null)
}

function workingTreeContent(path) {
  return readFileSync(path)
}

function scan(files, contentFor) {
  const findings = []
  for (const path of files) {
    for (const rule of forbiddenPaths) {
      if (rule.test(path)) findings.push({ path, rule: rule.name })
    }

    let content
    try {
      content = contentFor(path).toString('latin1')
    } catch (error) {
      findings.push({ path, rule: `could not inspect (${error.message})` })
      continue
    }

    for (const detector of detectors) {
      if (detector.pattern.test(content)) findings.push({ path, rule: detector.name })
    }
  }
  return findings
}

function selfTest() {
  const samples = [
    `sk-${'A'.repeat(32)}`,
    `api_key=${'B'.repeat(32)}`,
    `-----BEGIN ${'PRIVATE KEY'}-----`,
  ]
  for (const sample of samples) {
    if (!detectors.some(detector => detector.pattern.test(sample))) {
      throw new Error('a positive self-test sample was not detected')
    }
  }
  if (detectors.some(detector => detector.pattern.test('DEEPSEEK_API_KEY'))) {
    throw new Error('an environment-variable reference caused a false positive')
  }
  for (const path of ['.env', 'config/.credentials.yaml', '.dsh/settings.yaml', '.dsh-pto-workbench/data']) {
    if (!forbiddenPaths.some(rule => rule.test(path))) {
      throw new Error(`a forbidden-path self-test was not detected: ${path}`)
    }
  }
  process.stdout.write('[secret-check] self-test passed\n')
}

const mode = process.argv[2] ?? '--staged'

if (mode === '--self-test') {
  selfTest()
  process.exit(0)
}

let files
let contentFor
let scope
if (mode === '--staged') {
  files = stagedFiles()
  contentFor = stagedContent
  scope = 'staged file(s)'
} else if (mode === '--working-tree') {
  files = workingTreeFiles()
  contentFor = workingTreeContent
  scope = 'working-tree file(s)'
} else {
  process.stderr.write('usage: check-secrets.mjs [--staged|--working-tree|--self-test]\n')
  process.exit(2)
}

const findings = scan(files, contentFor)
if (findings.length > 0) {
  process.stderr.write('[secret-check] commit blocked: possible secret material detected\n')
  for (const finding of findings) process.stderr.write(`- ${finding.path}: ${finding.rule}\n`)
  process.stderr.write('[secret-check] suspected values are intentionally not printed; remove them before committing\n')
  process.exit(1)
}

process.stdout.write(`[secret-check] OK: scanned ${String(files.length)} ${scope}\n`)
