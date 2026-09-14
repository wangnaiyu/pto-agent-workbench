from pathlib import Path
import json,hashlib,shutil,re,subprocess
root=Path.cwd();r=Path(Path('/private/tmp/pto-current-p1-root.txt').read_text().strip());e=root/'work/inbox/tasks/2026-09-08-artifact-analysis-launch-repair/evidence/p1';e.mkdir(exist_ok=True)
rows=[json.loads(x) for x in (r/'p1-host-trace.jsonl').read_text().splitlines()];events=json.loads(next(r.glob('p1-*.decoded.json')).read_text());checks=[]
def check(name,condition):
 assert condition,name
 checks.append(name)
def one(event):
 xs=[x for x in rows if x['event']==event];check(event+' exactly once',len(xs)==1);return xs[0]['value']
receipt=one('admitAnalysis.result');result=one('runDependencyAnalysis.result');qualified=one('getQualified.result');provider='pypto-official-af1d7a016ce5';skilldir=root/'skills/official/releases/pypto-skills-af1d7a016ce5/plugins/pypto-user/skills/dependency-redundancy'
check('qualified provider and locked resource',qualified['provider']==provider and qualified['resourceBase']['path']==str(skilldir))
snapshots=[x['value'] for x in rows if x['event']=='snapshot.result']
check('root/draft and Session snapshots complete, unique and same locked resource',len(snapshots)>=2 and all(s['complete'] and len([k for k in s['skills'] if k['name']=='dependency-redundancy'])==1 and next(k for k in s['skills'] if k['name']=='dependency-redundancy')['resourceBase']==qualified['resourceBase'] for s in snapshots))
requests=[x for x in rows if x['event']=='snapshot.request'];check('both root and Session scopes observed',any(x['args']==[{}] for x in requests) and any(x['args'][0].get('scopeId')==receipt['sessionId'] for x in requests))
check('draft catalog exposes official Skill',any(x['event']=='listDraft.result' and any(k['name']=='dependency-redundancy' for k in x['value']['skills']) for x in rows))
admission=[x for x in events if x.get('data',{}).get('source',{}).get('kind')=='pto-artifact-analysis'];invocations=[x for x in events if x.get('data',{}).get('source',{}).get('kind')=='skill-invocation']
check('one persisted receipt equals Host receipt',len(admission)==1 and admission[0]['data']['source']['receipt']==receipt)
check('one persisted official Skill invocation',len(invocations)==1 and invocations[0]['data']['source']['provider']==provider)
body='\n'.join(c.get('text','') for c in invocations[0]['data']['content']);literal=(skilldir/'SKILL.md').read_text().split('---',2)[2].strip()
check('official literal instructions in injected Skill',literal in body)
check('tool receipt equals admission',result['receipt']==receipt)
check('real dual modes, expected edge and no stderr/fallback',[m['mode'] for m in result['modes']]==['reduced','reduced_dataflow'] and all(m['redundantEdges']==['(1, 1) -> (3, 287)'] and not m['stderr'] and not m['cycleWarning'] for m in result['modes']))
hash=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
outputs=[]
for m in result['modes']:
 p=Path(m['outputRef']);check('real output file '+m['mode'],p.is_file() and 'unique_task_edges: 1221' in p.read_text());outputs.append({'mode':m['mode'],'path':str(p),'bytes':p.stat().st_size,'sha256':hash(p),'summary':p.read_text().split('TASK INDEX')[0].strip()})
model=[json.loads(x) for x in (r/'model-trace.jsonl').read_text().splitlines()];check('model receives receipt context before actual tool result',any(x.get('analysisContext') and x['mode']=='tool' and receipt['requestId'] in x['analysisContext'] for x in model) and any(x.get('lastTool') for x in model))
sample=Path('/Users/wny/Documents/2 领域 Area/工作/EASY CANN/样例数据/20260720-pypto3-qwen3-14b-decode-fwd-l2/raw/_jit_decode_fwd_20260720_010517/dfx_outputs/deps.json');check('readonly sample hash unchanged',hash(sample)=='97ee1e49bf14d9c8dfa69ef1464c0d551bc535dfa9615609c68d5526dd383a4b')
check('no extra provider patch in launcher',"provider.patch.yml" not in (r/'launch.py').read_text() and 'skill-filesystem' not in (r/'common.patch.yml').read_text())
selected=[]
for x in events:
 d=x.get('data',{});s=d.get('source',{})
 if s.get('kind') in ['pto-artifact-analysis','skill-invocation']:selected.append({'type':x['type'],'source':s,'contentSha256':hashlib.sha256(json.dumps(d['content'],ensure_ascii=False).encode()).hexdigest()})
 elif x['type'] in ['session','tool/call','tool/result','turn/end']:selected.append(x)
(e/'session-events.json').write_text(json.dumps(selected,ensure_ascii=False,indent=2)+'\n')
trace=re.sub(r'/pto-artifacts/view/[a-zA-Z0-9_-]+','/pto-artifacts/view/[route omitted]',(r/'p1-host-trace.jsonl').read_text());(e/'host-trace.jsonl').write_text(trace)
for n in ['model-trace.jsonl','draft-catalog-dom.txt','first-send-dom.txt','observer.mjs','launch.py','common.patch.yml']:shutil.copyfile(r/n,e/n)
for src,dest in [('/tmp/pto-p1-red.log','composition-before.txt'),('/private/tmp/pto-p1-consumers.log','consumer-tests.txt')]: (e/dest).write_text(Path(src).read_text().rstrip()+'\n')
meta={'checksPassed':len(checks),'checks':checks,'temporaryRoot':str(r),'workbenchP0Commit':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'harness':subprocess.check_output(['git','-C','harness','rev-parse','HEAD'],text=True).strip(),'receipt':receipt,'hashes':{str(p.relative_to(root)):hash(p) for p in [root/'patches/cordis.patch.yml',skilldir/'SKILL.md',root/'tools/official/pypto-runtime-77fa0171c24a/simpler_setup/tools/deps_viewer.py',root/'harness/.dsh-build/client-build-environment.json']},'sampleSha256':hash(sample),'outputs':outputs,'model':'local deterministic substitute; real Host, Skill and Python tool; no external model quality claim'}
(e/'validation.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n');print('PASS',len(checks))
