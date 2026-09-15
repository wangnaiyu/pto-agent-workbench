import os,json,sys
from pathlib import Path
r=Path(__file__).parent
case=sys.argv[1]
root='/Users/wny/Documents/1 项目 Projects/pto-agent-workbench'
env=dict(os.environ)
for k in ['DSH_SHELL','DSH_SESSION_ID','DSH_SESSION_JSONL','DSH_WEB_URL']:env.pop(k,None)
env.update(DSH_HOME=str(r/case),PTO_WORKBENCH_ROOT=root,DEEPSEEK_BASE_URL=json.loads((r/'mock-ready.json').read_text())['baseURL'],DEEPSEEK_API_KEY='local-test-only',P0_TRACE=str(r/(case+'-host-trace.jsonl')),P0_CASE=case)
args=['node',root+'/harness/apps/cli/lib/bin.js','web','--patch',root+'/patches/cordis.patch.yml','--patch',str(r/'common.patch.yml')]
if case!='a':args+=['--patch',str(r/'provider.patch.yml')]
args+=['--no-open','--host','127.0.0.1','--port','0']
os.chdir(root)
os.execvpe('node',args,env)
