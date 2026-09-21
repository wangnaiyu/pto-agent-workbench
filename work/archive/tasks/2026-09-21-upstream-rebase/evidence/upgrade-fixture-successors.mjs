import { globSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const root=resolve(process.argv[2] ?? process.cwd());
const require=createRequire(root+'/package.json');
const {load}=require('js-yaml');
const {prepareSessionSnapshotFixtureForComparison: upgrade}=await import(pathToFileURL(root+'/packages/test-support/llm-replay/lib/index.js'));
const rows=[];
const changed=new Set(execFileSync('git',['diff','--name-only','0d1f50007f9bca3f52b06e1c3074fa14d5fb0720','ddefc45fbc7f8e46dd73185e68295696d1297887','--','snapshots/**/session*.v3.jsonl'],{cwd:root,encoding:'utf8'}).trim().split('\n'));
for(const manifestPath of globSync('snapshots/*/*/snapshot.yml',{cwd:root})) {
 const path=resolve(root,manifestPath), manifest=load(readFileSync(path,'utf8')), dir=dirname(path);
 if(manifest.sessionFormat||manifest.session)continue;
 const roles=new Map();
 for(const name of readdirSync(dir)){const m=/^session(?:\.(\d+))?(?:\.v(\d+))?\.jsonl$/.exec(name);if(!m)continue;
 const role=m[1]??'',version=Number(m[2]??0);if((roles.get(role)?.version??-1)<version)roles.set(role,{name,version});}
 for(const [role,selected] of roles){let {name,version}=selected;
 const v3='session'+(role?'.'+role:'')+'.v3.jsonl';
 if(version===4){if(!changed.has(manifestPath.replace(/snapshot\.yml$/,v3)))continue;name=v3;version=3;}
 assert.equal(version,3);
 const source=readFileSync(join(dir,name),'utf8'),out=upgrade(source);
 const parsed=out.trim().split('\n').map(JSON.parse);assert.equal(parsed[0].version,4);
 const projected=parsed.map((row,i)=>{if(i===0)return row;const {seq,time,...event}=row;return event;});
 const target='session'+(role?'.'+role:'')+'.v4.jsonl';const replacing=existsSync(join(dir,target));
 const text=projected.map(JSON.stringify).join('\n')+'\n';
 assert.deepEqual(upgrade(text).trim().split('\n').map(JSON.parse),parsed);
 // Both sides pass the same strict catalog; compare decoded events rather than physical envelope spelling.
 assert.deepEqual(upgrade(source).trim().split('\n').slice(1).map(JSON.parse),upgrade(text).trim().split('\n').slice(1).map(JSON.parse));
 writeFileSync(join(dir,target),text,{flag:replacing?'w':'wx'});assert.equal(readFileSync(join(dir,name),'utf8'),source);
 rows.push({owner:manifestPath,source:name,target});
 }
}
for(const path of globSync('snapshots/*/*/snapshot.yml',{cwd:root})){
 const abs=resolve(root,path),source=readFileSync(abs,'utf8'),manifest=load(source);if(!manifest.session)continue;
 const next=manifest.session.source.replace(/session\.v3\.jsonl$/,'session.v4.jsonl');
 if(next!==manifest.session.source&&existsSync(resolve(dirname(abs),next)))writeFileSync(abs,source.replace(manifest.session.source,next));
}
console.log(JSON.stringify(rows,null,2));
