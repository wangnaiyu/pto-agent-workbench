// P0 test-only observer. Preserves return values/errors; never changes product admission.
import {appendFileSync, readFileSync} from 'node:fs';
export const name='pto-p0-observer';
export const inject=['ptoArtifactInspection','skills'];
export function apply(ctx){
 const file=process.env.P0_TRACE; let seq=0;
 const emit=(event,data)=>appendFileSync(file,JSON.stringify({seq:++seq,at:new Date().toISOString(),event,...data})+'\n');
 const scope=o=>({cwd:o?.cwd,scopeId:o?.scope?.id});
 const skill=s=>s===undefined?null:({name:s.name,provider:s.provider,source:s.source,path:s.path,resourceBase:s.resourceBase,invocation:s.invocation});
 const wrap=(obj,key,input=(a)=>a,output=(v)=>v)=>{
  const original=obj[key]; if(typeof original!=='function')throw new Error('P0 missing observed method '+key);
  const own=Object.getOwnPropertyDescriptor(obj,key);
  obj[key]=function(...args){const call=++seq;emit(key+'.request',{call,args:input(args)});
   let result;try{result=Reflect.apply(original,this,args)}catch(e){emit(key+'.error',{call,message:e.message});throw e}
   if(result&&typeof result.then==='function')return result.then(value=>{emit(key+'.result',{call,value:output(value)});return value},e=>{emit(key+'.error',{call,message:e.message});throw e});
   emit(key+'.result',{call,value:output(result)});return result;
  };
  ctx.effect(()=>()=>{if(own)Object.defineProperty(obj,key,own);else delete obj[key]},'P0 restore '+key);
 };
 const inspection=ctx.get('ptoArtifactInspection'), skills=ctx.get('skills');
 for(const method of ['inspect','open','close','admitAnalysis'])wrap(inspection,method);
 wrap(inspection,'inspectTarget',a=>[a[0],{path:a[1]?.target?.displayPath}]);
 wrap(inspection,'runDependencyAnalysis',a=>[{recordId:a[0],revision:a[1],agentId:a[2]?.id,cwd:a[2]?.session?.header?.cwd}]);
 wrap(skills,'getQualified',a=>[a[0],scope(a[1])],skill);
 wrap(skills,'snapshot',a=>[scope(a[0])],v=>({complete:v.complete,skills:v.skills.map(skill)}));
 ctx.inject(['ptoExperimentDashboard','ptoExperiments','sessions'],sub=>{
  wrap(sub.get('ptoExperimentDashboard'),'listSession');
 });
 emit('observer.ready',{case:process.env.P0_CASE,cwd:process.cwd()});
}
