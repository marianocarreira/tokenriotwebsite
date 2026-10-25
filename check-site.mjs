// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
process.chdir(dirname(fileURLToPath(import.meta.url)));
const root=resolve('dist'),html=await readFile('dist/index.html','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(ids).size!==ids.length)throw Error('Duplicate IDs');
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const url=m[1];if(url==='#')continue;if(url.startsWith('#')){if(!ids.includes(url.slice(1)))throw Error('Missing anchor '+url);continue;}if(/^(https?:|data:)/.test(url))continue;
 const pathname=url.split(/[?#]/)[0];const file=join(root,pathname.endsWith('/')?pathname+'index.html':pathname);await stat(file);
}
const data=JSON.parse(await readFile('dist/downloads/android.json','utf8')),hash=createHash('sha256');let bytes=0;
for(const part of data.parts){const content=await readFile('dist/downloads/'+part.file);if(content.length!==part.bytes||content.length>8*1024*1024||createHash('sha256').update(content).digest('hex')!==part.sha256)throw Error('Invalid APK piece');hash.update(content);bytes+=content.length;}
if(hash.digest('hex')!==data.sha256||bytes!==data.bytes)throw Error('APK integrity failed');
let totalBytes=0;
async function scan(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=join(dir,entry.name);if(entry.isDirectory())await scan(file);else{totalBytes+=(await stat(file)).size;if((await stat(file)).size>25*1024*1024)throw Error('Static hosting file too large: '+file);if(/\.env|token-riot-save/.test(entry.name))throw Error('Private data in site');}}}
await scan(root);if(totalBytes>256*1024*1024)throw Error('Deployment exceeds hosting archive limit');console.log('Deployment assets: '+(totalBytes/1048576).toFixed(1)+' MiB.');
const game=await readFile('dist/play/game.js','utf8');if(game.includes('http://127.0.0.1:4173'))throw Error('Game depends on developer server');
const store=await readFile('dist/store/index.html','utf8'),redirects=await readFile('dist/_redirects','utf8');
if((await readdir('dist/store')).some(name=>name!=='index.html'))throw Error('Legacy proprietary Store files remain in the public site');
if(!html.includes('href="https://www.token-riot.store/"')||html.includes('href="store/"'))throw Error('Missing direct Store navigation link');
if(/http-equiv="refresh"/i.test(store)||/^\/store(?:\/|\s)/m.test(redirects))throw Error('Unexpected Store redirect');
console.log('PASS direct Store link, website resources, APK integrity and independent game bundle.');
