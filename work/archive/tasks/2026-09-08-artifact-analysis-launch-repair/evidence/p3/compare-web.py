import json
import re
from pathlib import Path

out = Path(__file__).resolve().parent
raw = Path('/private/tmp/pto-p3-web.txt').read_text()
current = dict(re.findall(r'^ FAIL  ([^\n]+)\n([^\n]+)', raw, re.M))
previous = json.loads((out.parent / 'p2/web-baseline-comparison.json').read_text())
baseline = {row['failure']: row['baseline'] for row in previous}

def normalize(text):
    return re.sub(r'session-[0-9a-f-]{36}', 'session-<uuid>', text or '')

rows = [{'failure': name, 'candidate': error, 'baseline': baseline.get(name),
         'sameError': normalize(error) == normalize(baseline.get(name))}
        for name, error in current.items()]
(out / 'web-baseline-comparison.json').write_text(json.dumps(rows, indent=2) + '\n')
lines = ['Extracted failure names and first diagnostics; only random Session UUIDs normalize in comparisons.', '']
for name, error in current.items():
    lines.extend([name, error, ''])
lines.extend(line.strip() for line in raw.splitlines()
             if re.match(r'\s*(Test Files|Tests |Start at|Duration )', line))
(out / 'web.txt').write_text('\n'.join(lines).rstrip() + '\n')
print('Failure blocks:', len(rows), 'without baseline:', sum(row['baseline'] is None for row in rows),
      'different first diagnostics:', sum(not row['sameError'] for row in rows))
for row in rows:
    if not row['sameError']:
        print(json.dumps(row))
