// P0 proof only: actual controller + observed A/B artifacts; no product changes.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PtoViewerController} from '/Users/wny/Documents/1 项目 Projects/pto-agent-workbench/harness/packages/client/ui-workspace/src/client/pto-viewer.ts';
const root=process.argv[2];const events=readFileSync(root+'/b-host-trace.jsonl','utf8').trim().split('\n').map(JSON.parse);
const record=events.find(e=>e.event==='inspect.result').value;const handle=events.find(e=>e.event==='open.result').value;const receipt=events.find(e=>e.event==='admitAnalysis.result').value;
let requests=[];const remote={inspect:async()=>({ok:true,value:record}),open:async()=>({ok:true,value:handle}),close:async()=>({ok:true,value:{closed:true}}),admitAnalysis:async request=>{requests.push(request);return{ok:true,value:{...receipt,requestId:request.requestId,sessionId:request.sessionId}}}};
const c=new PtoViewerController(remote);await c.open('/observed-record');c.stageAnalysis(()=> '1:1::');
assert.equal(await c.admitAnalysis('1:2::standard','probe-session'),undefined);assert.equal(requests.length,0);
let exact=await c.admitAnalysis('1:1::','probe-session');assert.equal(requests.length,1);assert.equal(exact.recordId,record.recordId);
await c.close();let retry=await c.admitAnalysis('1:1::','probe-session');assert.equal(retry.requestId,exact.requestId);
await c.open('/observed-record');c.stageAnalysis(()=> '2:3::');let newer=await c.admitAnalysis('2:3::','probe-session-2');assert.notEqual(newer.requestId,exact.requestId);
const restored=new PtoViewerController(remote);assert.equal(await restored.admitAnalysis('2:3::','probe-session-2'),undefined);
console.log(JSON.stringify({assertions:7,passed:true,scope:'actual controller method proof; target-change schedule is explicit, not proof of precise live relaunch timing',observations:['catalog/preset revision mismatch silently returns undefined with no Remote admission','exact match forwards record identity','close preserves same request id','new staging replaces request id','new controller without memory silently skips admission']},null,2));
