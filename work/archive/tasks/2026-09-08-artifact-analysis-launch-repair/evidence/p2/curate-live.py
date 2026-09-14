import pathlib,json,hashlib,sys
root=pathlib.Path('/Users/wny/Documents/1 项目 Projects/pto-agent-workbench')
r=pathlib.Path(sys.argv[1])
out=pathlib.Path(sys.argv[2]);out.mkdir(exist_ok=True)
rows=[dict(json.loads(x), case=case) for case in ['p2','p2-final'] for x in (r/(case+'-host-trace.jsonl')).read_text().splitlines()]
keep=[]
for x in rows:
 if x['event'].startswith('admitAnalysis') or x['event']=='runDependencyAnalysis.result':
  x=json.loads(json.dumps(x).replace(str(r),'<isolated-home>'))
  keep.append(x)
(out/'live-admission.json').write_text(json.dumps(keep,indent=2,ensure_ascii=False)+'\n')
summary=[]
for f in r.glob('p2*-session-*.decoded.json'):
 ev=json.loads(f.read_text());sources=[];user=[]
 for e in ev:
  s=e.get('data',{}).get('source',{})
  if s.get('kind') in ['skill-invocation', 'pto-artifact-analysis']:sources.append({'seq':e.get('seq'),'type':e['type'],'source':s})
  if e['type']=='user/message' and s.get('kind')=='user':user.append({'seq':e.get('seq'),'source':s})
 summary.append({'file':f.name,'turns':sum(e['type']=='turn/start' for e in ev),'sources':sources,'userMessages':user})
(out/'live-session-sources.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False)+'\n')
models=[json.loads(x) for x in (r/'model-trace.jsonl').read_text().splitlines()]
(out/'live-model-summary.json').write_text(json.dumps([{k:x[k] for k in ['request','at','mode','analysisContext']} for x in models],indent=2,ensure_ascii=False)+'\n')
outputs=[]
for f in r.glob('p2*/pto-analysis/*/*.txt'):
 b=f.read_bytes();outputs.append({'file':str(f.relative_to(r)),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
(out/'live-derived-hashes.json').write_text(json.dumps(outputs,indent=2)+'\n')
print('admission rows',len(keep),'sessions',len(summary),'model requests',len(models),'derived files',len(outputs))
