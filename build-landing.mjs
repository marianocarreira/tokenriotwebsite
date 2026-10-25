// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {secureHTML,writeHeaders} from './security-build.mjs';
import {build} from 'esbuild';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await build({absWorkingDir:dirname(fileURLToPath(import.meta.url)),entryPoints:['site-entry.js'],bundle:true,format:'esm',target:'chrome120',outfile:'dist/site.js',minify:true,legalComments:'none'});
console.log('Landing interactions built.');

const siteRoot=dirname(fileURLToPath(import.meta.url));await secureHTML(siteRoot+'/dist/index.html','strict-origin-when-cross-origin');await writeHeaders(siteRoot+'/dist/_headers');
