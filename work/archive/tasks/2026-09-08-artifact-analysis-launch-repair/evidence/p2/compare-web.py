import re,json,pathlib
out=pathlib.Path('work/inbox/tasks/2026-09-08-artifact-analysis-launch-repair/evidence/p2')
def failures(name):
 s=pathlib.Path('/private/tmp/pto-p2-'+name+'.log').read_text()
 return {m[1]:m[2] for m in re.finditer(r'^ FAIL  ([^\n]+)\n([^\n]+)',s,re.M)}
cur=failures('web-tests');base={}
for n in ['baseline-web','baseline-web2','baseline-web3','baseline-workspace-full']:base.update(failures(n))
rows=[]
for name,err in cur.items():
 rows.append({'failure':name,'candidate':err,'baseline':base.get(name),'sameError':re.sub(r'session-[0-9a-f-]{36}', 'session-<uuid>', err)==re.sub(r'session-[0-9a-f-]{36}', 'session-<uuid>', base.get(name,''))})
print('candidate failure blocks',len(cur),'missing baseline',sum(r['baseline'] is None for r in rows),'different first error lines',sum(not r['sameError'] for r in rows))
for r in rows:
 if not r['sameError']: print(r)
(out/'web-baseline-comparison.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
# Preserve diagnostic identity without build output or terminal formatting.
for n in ['web-tests','baseline-web','baseline-web2','baseline-web3','baseline-workspace-full']:
 s=pathlib.Path('/private/tmp/pto-p2-'+n+'.log').read_text()
 rows=['Extracted failure names and first error lines; random ids are preserved. Full raw logs remain in the isolated test environment.','']
 for m in re.finditer(r'^ FAIL  ([^\n]+)\n([^\n]+)',s,re.M):rows.extend([m[1],m[2],''])
 rows.extend(line.strip() for line in s.splitlines() if re.match(r'\s*(Test Files|Tests |Start at|Duration )',line))
 (out/(n+'.txt')).write_text('\n'.join(rows).rstrip()+'\n')
