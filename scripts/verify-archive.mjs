import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const errors=[];const walk=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).filter(x=>x.name!=='.git'&&x.name!=='node_modules').flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
const files=walk(root);let jsonCount=0,linkCount=0,patchCount=0;
for(const f of files){const rel=path.relative(root,f).replaceAll(path.sep,'/');const text=fs.readFileSync(f,'utf8');if(rel.endsWith('.json')){try{JSON.parse(text);jsonCount++;}catch(e){errors.push(rel+': invalid JSON '+e.message);}}
if(rel.endsWith('.md')&&!rel.endsWith('README.original.md')){for(const m of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)){const link=m[1];if(/^(https?:|mailto:|#)/.test(link))continue;const target=decodeURIComponent(link.split('#')[0]);if(!fs.existsSync(path.resolve(path.dirname(f),target)))errors.push(rel+': broken relative link '+link);else linkCount++;}}
if(/\.(patch|diff)$/.test(rel)){try{execFileSync('git',['apply','--numstat',f],{cwd:root,stdio:'pipe'});patchCount++;}catch(e){errors.push(rel+': cannot parse patch');}}
const forbidden=[/-----BEGIN (?:[A-Z ]+)?PRIVATE KEY-----/,/gh[pousr]_[A-Za-z0-9]{30,}/,/github_pat_[A-Za-z0-9_]{30,}/,/https?:\/\/[^\s/:]+:[^\s/@]+@/,/[a-f0-9]{12}-im-bot/,/o9cq80-[A-Za-z0-9_-]{15,}/];
if(rel!=='scripts/verify-archive.mjs')for(const r of forbidden)if(r.test(text))errors.push(rel+': potential credential or live-account identifier');
if(/(^|\/)(accounts|node_modules)(\/|$)|\.context-tokens\.json$|\.sqlite|\.pem$|\.key$|\.env$/.test(rel))errors.push(rel+': forbidden runtime or credential file');
}
const base=fs.readFileSync(path.join(root,'patches/selfheal/weixin-session-selfheal-2.4.9-published-60s.patch'),'utf8');
const local=fs.readFileSync(path.join(root,'patches/selfheal/weixin-session-selfheal-2.4.9-local-15m.patch'),'utf8');
if(!base.includes('RECOVERY_COOLDOWN_MS = 60_000')||!local.includes('RECOVERY_COOLDOWN_MS = 900_000')||local.replace('RECOVERY_COOLDOWN_MS = 900_000','RECOVERY_COOLDOWN_MS = 60_000')!==base)errors.push('Selfheal variants differ beyond the documented cooldown');
for(const id of [328,331,335]){const p=JSON.parse(fs.readFileSync(path.join(root,'references/pr-'+id+'.json'),'utf8'));if(p.number!==id||!p.headRefOid||!p.baseRefOid||!p.url)errors.push('PR metadata incomplete: '+id);}
try{execFileSync(process.execPath,['--check',path.join(root,'components/cross-channel-notify/dist/index.js')],{stdio:'pipe'});}catch(e){errors.push('Archived JavaScript syntax check failed');}
const manifest=path.join(root,'references/files.sha256.json');let hashesChecked=0;if(fs.existsSync(manifest)){const m=JSON.parse(fs.readFileSync(manifest,'utf8'));for(const [name,hash]of Object.entries(m.files)){const f=path.join(root,name);if(!fs.existsSync(f)||crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')!==hash)errors.push('Hash mismatch: '+name);else hashesChecked++;}}else errors.push('Missing SHA-256 manifest');
const report={ok:errors.length===0,checkedAt:new Date().toISOString(),files:files.length,jsonCount,relativeLinks:linkCount,patchesParsed:patchCount,hashesChecked,checks:['json','relative-links','patch-parse','secret-patterns','cooldown-variants','pr-provenance','javascript-syntax','sha256'],deployment:false,liveMessaging:false,errors};console.log(JSON.stringify(report,null,2));process.exitCode=errors.length?1:0;
