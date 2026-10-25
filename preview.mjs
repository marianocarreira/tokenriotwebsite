// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import http from 'node:http';
import {readFile,realpath} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=await realpath('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.ogg':'audio/ogg','.mp4':'video/mp4','.bin':'application/octet-stream','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(path.includes('\\')||path.split('/').some(p=>p.startsWith('.')))throw Error();
  const file=await realpath(resolve(root,'.'+path+(path.endsWith('/')?'index.html':'')));
  if(!file.startsWith(root+sep))throw Error();const bytes=await readFile(file);
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(404);res.end();}
}).listen(4174,'127.0.0.1',()=>console.log('TOKEN RIOT site: http://127.0.0.1:4174/'));
