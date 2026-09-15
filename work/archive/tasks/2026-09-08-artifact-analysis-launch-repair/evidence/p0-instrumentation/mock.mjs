// P0 deterministic external-model substitute. Calls actual advertised PTO tool; never fabricates its output.
import {createServer} from 'node:http';import {readFileSync,writeFileSync,appendFileSync} from 'node:fs';import {randomUUID} from 'node:crypto';
const root=process.env.P0_ROOT;let count=0;
const server=createServer(async(req,res)=>{try{
 let bytes='';for await(const chunk of req)bytes+=chunk;const body=JSON.parse(bytes);const messages=body.messages??[];const tools=body.tools??[];
 const texts=messages.flatMap(m=>typeof m.content==='string'?[m.content]:Array.isArray(m.content)?m.content.filter(p=>p.type==='text').map(p=>p.text):[]);
 const joined=texts.join('\n');const blocks=[...joined.matchAll(/<pto_artifact_analysis>([\s\S]*?)<\/pto_artifact_analysis>/g)];const block=blocks.at(-1)?.[1];
 const value=k=>block?.match(new RegExp('(?:^|\\n)'+k+': ([^\\n]+)'))?.[1];
 const admitted=Boolean(block)&&tools.some(t=>t.function?.name==='pto_dependency_redundancy');
 const control=JSON.parse(readFileSync(root+'/mock-control.json','utf8'));
 const main=tools.length>0;let mode=admitted&&messages.at(-1)?.role!=='tool'?'tool':'text';
 if(main&&control.failNext){control.failNext=false;writeFileSync(root+'/mock-control.json',JSON.stringify(control));mode='fail';}
 appendFileSync(root+'/model-trace.jsonl',JSON.stringify({request:++count,at:new Date().toISOString(),mode,roles:messages.map(m=>m.role),toolNames:tools.map(t=>t.function?.name),analysisContext:block??null,lastTool:messages.at(-1)?.role==='tool'?messages.at(-1):null})+'\n');
 if(mode==='fail'){res.writeHead(400,{'content-type':'application/json'}).end(JSON.stringify({error:{message:'P0 deterministic model failure',code:'p0_test_failure'}}));return;}
 const delta=mode==='tool'?{role:'assistant',tool_calls:[{index:0,id:'p0-call-'+randomUUID(),type:'function',function:{name:'pto_dependency_redundancy',arguments:JSON.stringify({record_id:value('record_id'),record_revision:value('record_revision')})}}]}:{role:'assistant',content:'P0 local mock completed. Tool output, if present, is recorded separately.'};
 const finish=mode==='tool'?'tool_calls':'stop';
 if(!body.stream){res.writeHead(200,{'content-type':'application/json'}).end(JSON.stringify({id:'p0',choices:[{index:0,message:delta,finish_reason:finish}],usage:{prompt_tokens:1,completion_tokens:1,total_tokens:2}}));return;}
 res.writeHead(200,{'content-type':'text/event-stream'});res.write('data: '+JSON.stringify({id:'p0',choices:[{index:0,delta,finish_reason:null}]})+'\n\n');res.write('data: '+JSON.stringify({id:'p0',choices:[{index:0,delta:{},finish_reason:finish}],usage:{prompt_tokens:1,completion_tokens:1,total_tokens:2}})+'\n\n');res.end('data: [DONE]\n\n');
}catch(e){res.writeHead(500).end(String(e))}});
server.listen(0,'127.0.0.1',()=>{const port=server.address().port;writeFileSync(root+'/mock-ready.json',JSON.stringify({port,baseURL:`http://127.0.0.1:${port}/v1`}));console.log('P0 mock ready',port)});
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>{server.closeAllConnections();server.close(()=>process.exit(0))});
