// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {secureHTML} from './security-build.mjs';
const root=dirname(fileURLToPath(import.meta.url)),out=join(root,'dist/store'),target='https://www.token-riot.store/';
await mkdir(out,{recursive:true});
await writeFile(join(out,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TOKEN RIOT — Store</title><link rel="stylesheet" href="../site.css"></head><body><main class="section-wrap"><h1>TOKEN RIOT — Store</h1><p lang="en">Visit the store using the direct link below.</p><p lang="es">Visitá la tienda usando el enlace directo.</p><a class="button primary" href="${target}" target="_blank" rel="noopener noreferrer">Store / Tienda ↗</a></main></body></html>`);
await secureHTML(join(out,'index.html'),'strict-origin-when-cross-origin');
const redirectsFile=join(root,'dist/_redirects');let redirects='';try{redirects=await readFile(redirectsFile,'utf8')}catch(error){if(error.code!=='ENOENT')throw error;}
redirects=redirects.split(/\r?\n/).filter(line=>!/^\/store(?:\/|\s)/.test(line)).join('\n').trim();
await writeFile(redirectsFile,redirects+(redirects?'\n':''));
const landingFile=join(root,'dist/index.html');
const landing=await readFile(landingFile,'utf8');
await writeFile(landingFile,landing.replace(/<a href="store\/">Store ↗<\/a>/g,`<a href="${target}" target="_blank" rel="noopener noreferrer">Store ↗</a>`));
console.log('Direct Store link built: '+target);
