// P4 layout fixture only. Planned rows use the real durable store; terminal rows are labeled presentation fixtures.
import {writeFileSync} from 'node:fs';
export const name='pto-p4-layout-fixture';
export const inject=['ptoExperiments','ptoExperimentDashboard'];
export async function apply(ctx){
 const cwd=process.env.P4_WORKSPACE;
 const existing=await ctx.ptoExperiments.list({cwd},20);
 const rows=[...existing.experiments];
 if(rows.length===0) for(let n=1;n<=12;n++) rows.push(await ctx.ptoExperiments.plan({cwd},{sourceWorkspacePath:cwd+'/source',baselineRunPath:cwd+'/baseline-with-a-long-recognized-fixture-name',candidateOutputPath:cwd+'/source/candidate-'+n+'-with-a-long-output-directory-name',declaredChange:'P4 durable planned layout fixture '+n+': '+('bounded_change_without_execution_'.repeat(12)),evidenceRefs:['P4 synthetic layout fixture; no experiment execution'],stopConditions:'Presentation validation only; do not execute.',rollbackPlan:'Retain isolated fixture as evidence.',executionCommand:'python3 p4_do_not_execute.py'}));
 writeFileSync(process.env.P4_ROOT+'/planned.json',JSON.stringify(rows,null,2));
 const gateway=ctx.ptoExperimentDashboard, original=gateway.listSession;
 gateway.listSession=async function(...args){
  const value=await Reflect.apply(original,this,args);
  if(value.experiments.length===0)return value;
  const sample=value.experiments[0];
  const extra=['completed','failed'].map(status=>({...sample,id:'P4-'+status+'-PRESENTATION-FIXTURE-'+('long_id_'.repeat(10)),status,declaredChange:'P4 '+status+' PRESENTATION FIXTURE; no experiment executed. '+('long_change_'.repeat(30)),metric:null,failureReason:status==='failed'?'P4 synthetic error display: '+('long_failure_detail_'.repeat(20)):null,executionActivity:{active:false,cancellable:false}}));
  return {...value,experiments:[...value.experiments,...extra],total:value.total+extra.length};
 };
 ctx.effect(()=>()=>{gateway.listSession=original},'P4 restore presentation fixture');
}
