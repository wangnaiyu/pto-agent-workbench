from pathlib import Path
import re,json,collections
p=Path('work/inbox/tasks/2026-09-08-artifact-analysis-launch-repair/evidence')
def norm(s):
 return re.sub(r'session-[0-9a-f]{8}-[0-9a-f-]{27,}', 'session-<uuid>', s)
def parse(path):
 s=re.sub(r'\x1b\[[0-9;]*m','',Path(path).read_text())
 rows=[]
 for m in re.finditer(r'^ FAIL  (.+)\n([^\n]*)',s,re.M):
  rows.append({'failure':m.group(1),'diagnostic':m.group(2)})
 summary='\n'.join(x.strip() for x in s.splitlines() if re.match(r'\s*(Test Files|Tests |Start at |Duration )',x))
 return rows,summary
old,_=parse('/private/tmp/pto-p3-web.txt');current,summary=parse('/private/tmp/pto-p4-web.txt')
assert summary and current, 'suite not complete'
known={(r['failure'],norm(r['diagnostic'])) for r in old}
rows=[dict(**r,matchesP3=(r['failure'],norm(r['diagnostic'])) in known) for r in current]
report={'normalization':'Only random Session UUIDs; includes duplicate failure blocks, not only unique test names.','summary':summary,'rawFailureBlocks':len(rows),'uniqueFailureNames':len({r['failure'] for r in rows}),'rows':rows}
(p/'p4/web-baseline-comparison.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
(p/'p4/web.txt').write_text('Extracted every failure block and first diagnostic; duplicate names retained. Full raw log retained at /private/tmp/pto-p4-web.txt.\n\n'+'\n\n'.join(r['failure']+'\n'+r['diagnostic'] for r in rows)+'\n\n'+summary+'\n')
print(summary);print('blocks',len(rows),'unmatched',sum(not r['matchesP3'] for r in rows))
for r in rows:
 if not r['matchesP3']:print(json.dumps(r,ensure_ascii=False))
