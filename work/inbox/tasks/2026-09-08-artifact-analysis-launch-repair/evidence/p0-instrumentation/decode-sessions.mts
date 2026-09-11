import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {zstdDecompressSync} from 'node:zlib';
import {scanZstdFrames} from '/Users/wny/Documents/1 项目 Projects/pto-agent-workbench/harness/packages/session/session-persistence-jsonl/src/zstd.ts';
const root=process.argv[2]; const cases=process.argv.slice(3);let result=[];
for(const c of cases){let base=join(root,c,'sessions');const files=readdirSync(base,{recursive:true}).filter(p=>p.endsWith('session.v3.jsonl.zstd'));for(const relative of files){const id=relative.split('/').at(-2);try{let b=readFileSync(join(base,relative));let scan=scanZstdFrames(b);let events=scan.frames.flatMap(f=>zstdDecompressSync(b.subarray(f.start,f.end)).toString().trim().split('\n').filter(Boolean).map(l=>JSON.parse(l)));writeFileSync(join(root,c+'-'+id+'.decoded.json'),JSON.stringify(events,null,2));result.push({case:c,id,frames:scan.frames.length,tornStart:scan.tornStart,events:events.map(e=>({type:e.type,source:e.data?.source,cwd:e.cwd??e.data?.cwd,keys:Object.keys(e)}))});}catch(e){result.push({case:c,id,error:String(e)})}}}
console.log(JSON.stringify(result,null,2));
