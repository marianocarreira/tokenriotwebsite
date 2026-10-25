// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash,webcrypto} from 'node:crypto';
import vm from 'node:vm';

const source=await readFile(new URL('site-entry.js',import.meta.url),'utf8');
const handler=source.slice(source.indexOf('let downloadController='));
const manifest=JSON.parse(await readFile(new URL('dist/downloads/android.json',import.meta.url),'utf8'));
async function download(corrupt=false){
 const elements=new Map();const $=id=>{if(!elements.has(id))elements.set(id,{disabled:false,hidden:true,textContent:''});return elements.get(id);};
 let blob,clicked=false,requests=0;
 const context={$ ,t:s=>s,initCommunity(){},AbortController,Blob,crypto:webcrypto,
  URL:{createObjectURL(value){blob=value;return 'blob:test';},revokeObjectURL(){}},
  document:{body:{append(){}},createElement(){return {click(){clicked=true;},remove(){}};}},window:{addEventListener(){}},
  fetch:async(url,options)=>{requests++;if(url.endsWith('.json')){assert.equal(options.cache,'no-store');return {ok:true,json:async()=>manifest};}
   const data=await readFile(new URL('dist/'+url,import.meta.url));return {ok:true,arrayBuffer:async()=>corrupt?new ArrayBuffer(1):data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength)};
  }};
 vm.runInNewContext(handler,context);
 await $('#download-apk').onclick();
 assert.equal($('#download-apk').disabled,false);
 if(corrupt){assert.equal(clicked,false);assert.match($('#download-status').textContent,/incompleto/);return;}
 assert.equal(clicked,true,'download button must reach APK save');
 assert.equal(requests,manifest.parts.length+1);
 assert.equal(blob.size,manifest.bytes);
 assert.equal(createHash('sha256').update(Buffer.from(await blob.arrayBuffer())).digest('hex'),manifest.sha256);
}
await download();await download(true);
console.log('PASS actual download handler reconstructs the current APK and rejects a truncated part.');
