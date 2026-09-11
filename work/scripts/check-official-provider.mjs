import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(join(root, 'harness/packages/boot/app-boot/package.json'));
const yaml = require('js-yaml');
const provider = 'pypto-official-af1d7a016ce5';
const skillRoot = "process.getBuiltinModule('node:path').resolve(process.env.PTO_WORKBENCH_ROOT ?? process.cwd(), 'skills/official/releases/pypto-skills-af1d7a016ce5/plugins/pypto-user/skills')";

// Exercise the built CLI's real web profile and Loader patch layers. A textual
// patch assertion would miss the difference between a skipped override and insert.
export function checkOfficialProvider(patch = join(root, 'patches/cordis.patch.yml')) {
  const home = mkdtempSync(join(tmpdir(), 'pto-provider-composition-'));
  try {
    const run = spawnSync(process.execPath, [join(root, 'harness/apps/cli/lib/bin.js'),
      'web', '--patch', resolve(patch), '--dump-config'], {
      cwd: root, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, DSH_HOME: home, PTO_WORKBENCH_ROOT: root },
    });
    assert.equal(run.status, 0, run.error?.message ?? run.stderr);
    const tree = yaml.load(run.stdout, { schema: yaml.DEFAULT_SCHEMA.extend([new yaml.Type('tag:yaml.org,2002:js', { kind: 'scalar', construct: value => value })]) });
    const entries = [];
    const visit = rows => { for (const row of rows) {
      if (row.disabled === true) continue;
      entries.push(row);
      if (Array.isArray(row.config) && row.group) visit(row.config);
    } };
    visit(tree);
    const matches = entries.filter(row => row.name === '@deepseek-ai/dsh-skill-filesystem' && row.config?.providerName === provider);
    assert.equal(matches.length, 1, 'effective web profile must contain exactly one active official provider');
    assert.deepEqual(matches[0].config, {
      providerName: provider, includeDefaultRoots: false, watch: false, bundledSkillDir: skillRoot,
    });
    const inspector = entries.find(row => row.id === 'pto-artifact-inspection');
    assert.ok(inspector, 'artifact inspection must be active');
    assert.equal(inspector.config.officialDependencySkillProvider, provider);
    assert.equal(inspector.config.officialDependencySkillRevision, 'af1d7a016ce50ba109c4b4224580a6b758bde7da');
    assert.equal(inspector.config.dependencyAnalysisToolRevision, '77fa0171c24a4e1c323fb29a6a86239df93edb58');
    assert.equal(inspector.config.dependencyAnalysisToolPath,
      "process.getBuiltinModule('node:path').resolve(process.env.PTO_WORKBENCH_ROOT ?? process.cwd(), 'tools/official/pypto-runtime-77fa0171c24a/simpler_setup/tools/deps_viewer.py')");
    assert.doesNotMatch(run.stderr, /patch: entry .* not found/);
    return { provider, count: matches.length, skillRoot, warnings: run.stderr.trim() };
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(JSON.stringify(checkOfficialProvider(process.argv[2]), null, 2));
}
