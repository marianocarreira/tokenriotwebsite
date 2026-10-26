// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {translations} from './site-translations.js';
import {CHINESE} from './site-zh.js';
assert.equal(CHINESE.length,translations.length);
for(const [i,text] of CHINESE.entries()){assert.match(text,/\p{Script=Han}/u,'Chinese entry '+i);assert.ok(text.trim());}
const saved=new Map();globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
const element={nodeType:1,closest:()=>null,hasAttribute:()=>false};
const makeText=value=>({nodeType:3,nodeValue:value,parentElement:element});
const nodes=[makeText('The game'),makeText('Language'),makeText('Preparing APK… ')];
const selector={value:'en'};const attributes=new Map([['alt','Google campus stage']]);
const image={nodeType:1,tagName:'IMG',closest:()=>null,hasAttribute:k=>attributes.has(k),getAttribute:k=>attributes.get(k),setAttribute:(k,v)=>attributes.set(k,v)};
nodes.push(image);
let observer;globalThis.MutationObserver=class{constructor(fn){observer=fn;}observe(){}};
globalThis.document={documentElement:{...element,lang:'en',dataset:{theme:'dark'}},querySelector:s=>s==='#language-select'?selector:null,dispatchEvent(){},createTreeWalker(){let i=0;return{nextNode:()=>nodes[i++]??null};}};
const {t,setLanguage,getLanguage,initPreferences}=await import('./site-preferences.js');
assert.equal(getLanguage(),'en');initPreferences();assert.equal(nodes[0].nodeValue,'The game');
assert.ok(setLanguage('zh'));assert.equal(document.documentElement.lang,'zh-CN');assert.equal(selector.value,'zh');assert.equal(saved.get('token-riot-site-language'),'zh');
assert.equal(nodes[0].nodeValue,'游戏');assert.equal(nodes[1].nodeValue,'语言');assert.equal(attributes.get('alt'),'Google 园区关卡');assert.equal(t('Disparar'),'射击');
nodes[2].nodeValue='Cancel download';observer([{type:'characterData',target:nodes[2]}]);assert.equal(nodes[2].nodeValue,'取消下载');
assert.ok(setLanguage('es'));assert.equal(nodes[0].nodeValue,'El juego');assert.equal(nodes[2].nodeValue,'Cancelar descarga');
assert.ok(setLanguage('en'));assert.equal(nodes[0].nodeValue,'The game');assert.equal(nodes[2].nodeValue,'Cancel download');assert.equal(attributes.get('alt'),'Google campus stage');
assert.equal(setLanguage('fr'),false);assert.equal(getLanguage(),'en');
setLanguage('zh-CN');const reload=await import('./site-preferences.js?reload');assert.equal(reload.getLanguage(),'zh');
console.log('PASS 238 Chinese site entries, English default, reversible en/es/zh DOM/attributes, dynamic updates and persistence.');
