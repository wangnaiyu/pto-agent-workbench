import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { checkOfficialProvider } from './check-official-provider.mjs';

const patch = readFileSync(new URL('../../patches/cordis.patch.yml', import.meta.url), 'utf8');
const begin = patch.indexOf('- insert:\n    - id: skill-filesystem-pypto-official-');
assert.notEqual(begin, -1);
const end = patch.indexOf('\n\n# Product origin', begin);
assert.notEqual(end, -1);
const block = patch.slice(begin, end);

test('actual composed web profile has one locked official provider and matching inspector tuple', () => {
  assert.equal(checkOfficialProvider().count, 1);
});

for (const [name, replacement] of [
  ['missing provider', ''],
  ['nonexistent entry override (P0 regression)', block.replace('- insert:\n', '').split('\n').map(line => line.slice(4)).join('\n')],
  ['duplicate provider under a different entry id', block + '\n' + block.replace('id: skill-filesystem-pypto-official-', 'id: duplicate-pypto-official-')],
]) {
  test(`rejects ${name} through actual profile composition`, t => {
    const home = mkdtempSync(join(tmpdir(), 'pto-provider-negative-'));
    t.after(() => rmSync(home, { recursive: true, force: true }));
    const file = join(home, 'patch.yml');
    writeFileSync(file, patch.slice(0, begin) + replacement + patch.slice(end));
    assert.throws(() => checkOfficialProvider(file), /must contain exactly one active official provider/);
  });
}
