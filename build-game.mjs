// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {secureHTML,writeHeaders} from './security-build.mjs';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
process.chdir(dirname(fileURLToPath(import.meta.url)));
import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
await build({absWorkingDir:dirname(fileURLToPath(import.meta.url)),entryPoints:['game-entry.js'],bundle:true,format:'esm',target:'chrome120',outfile:'dist/play/game.js',minify:true,legalComments:'none'});
const js=await readFile('dist/play/game.js','utf8');await writeFile('dist/play/game.js',js.replaceAll('.wav','.ogg'));
const html=(await readFile('game-src/index.html','utf8')).replaceAll('.wav','.ogg').replace('src="app.js"','src="game.js?v=campaign-checkpoints-1"').replace('</head>','<style>.site-return{color:#b8f8f0;text-decoration:none;font-size:11px}header{flex-wrap:wrap;gap:12px}</style></head>');
await writeFile('dist/play/index.html',html);
await writeFile('dist/play/style.css',await readFile('game-src/style.css'));await secureHTML('dist/play/index.html');await writeHeaders('dist/_headers');
console.log('Playable web edition built with on-device token storage.');
