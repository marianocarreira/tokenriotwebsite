// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {translations} from './site-translations.js';
import {CHINESE} from './site-zh.js';
if(CHINESE.length!==translations.length)throw Error('Incomplete Chinese site catalog');
export const LANGUAGES=Object.freeze(['en','es','zh']);
const spanish=new Map(translations.map(([es,en])=>[en,es])),chinese=new Map(translations.map(([,en],i)=>[en,CHINESE[i]])),canonical=new Map();
for(const [i,[es,en]] of translations.entries()){canonical.set(es,en);canonical.set(en,en);canonical.set(CHINESE[i],en);}
for(const [en,es,zh] of [['Store ↗','Tienda ↗','商店 ↗'],['Store / Tienda ↗','Store / Tienda ↗','商店 ↗'],['Visit the store using the direct link below.','Visitá la tienda usando el enlace directo.','请使用下方的直接链接访问商店。']]){canonical.set(en,en);canonical.set(es,en);canonical.set(zh,en);spanish.set(en,es);chinese.set(en,zh);}
for(const [en,es,zh] of [['PIXEL ART','ARTE PÍXEL','像素画风'],['12 STAGES','12 ESCENARIOS','12 个关卡'],['WEB + ANDROID','WEB + ANDROID','网页 + ANDROID'],['SF → CHINA','SF → CHINA','旧金山 → 中国'],['Final alliance','Alianza final','最终联盟']]){canonical.set(en,en);canonical.set(es,en);canonical.set(zh,en);spanish.set(en,es);chinese.set(en,zh);}
const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
const save=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
const normalize=value=>value==='zh-CN'?'zh':value;
let language=normalize(read('token-riot-site-language'));if(!LANGUAGES.includes(language))language='en';
export const getLanguage=()=>language;
export function t(value){const text=String(value??''),key=canonical.get(text)??text;return language==='en'?key:(language==='zh'?chinese:spanish).get(key)??key;}
const originals=new WeakMap(),attributeOriginals=new WeakMap();
const skip=node=>{const element=node.nodeType===1?node:node.parentElement;return !element||Boolean(element.closest?.('script,style,code,input,textarea,[data-no-translate]'));};
function translateText(node){if(skip(node))return;const current=node.nodeValue??node.data,previous=originals.get(node),source=previous&&current===previous.rendered?previous.source:current,rendered=t(source);originals.set(node,{source,rendered});if(current!==rendered)node.nodeValue=rendered;}
function translateAttributes(element){if(skip(element)||!element.hasAttribute)return;let values=attributeOriginals.get(element);if(!values){values={};attributeOriginals.set(element,values);}for(const attr of ['aria-label','aria-description','alt','title','placeholder','content']){if(!element.hasAttribute(attr)||attr==='content'&&element.tagName!=='META')continue;const current=element.getAttribute(attr),previous=values[attr],source=previous&&current===previous.rendered?previous.source:current,rendered=t(source);values[attr]={source,rendered};if(current!==rendered)element.setAttribute(attr,rendered);}}
function scan(node){if(!node)return;if(node.nodeType===3){translateText(node);return;}translateAttributes(node);const walker=document.createTreeWalker(node,5);let child;while((child=walker.nextNode()))if(child.nodeType===3)translateText(child);else translateAttributes(child);}
export function setLanguage(value){
 value=normalize(value);if(!LANGUAGES.includes(value))return false;language=value;document.documentElement.lang=language==='zh'?'zh-CN':language;scan(document.documentElement);const select=document.querySelector('#language-select');if(select){select.value=language;select.setAttribute?.('aria-label',t('Language'));}save('token-riot-site-language',language);refreshTheme();document.dispatchEvent(new Event('site-language-change'));return true;
}
function refreshTheme(){const dark=document.documentElement.dataset.theme!=='light',button=document.querySelector('#theme-toggle');button?.setAttribute('aria-pressed',String(dark));button?.setAttribute('aria-label',t('Switch theme'));const icon=document.querySelector('#theme-icon'),label=document.querySelector('#theme-label'),meta=document.querySelector('meta[name="theme-color"]');if(icon)icon.textContent=dark?'☾':'☀';if(label)label.textContent=t(dark?'Night mode':'Light mode');if(meta)meta.content=dark?'#080a10':'#f3f6f7';}
export function initPreferences(){const select=document.querySelector('#language-select');if(select)select.onchange=e=>setLanguage(e.target.value);const theme=document.querySelector('#theme-toggle');if(theme)theme.onclick=()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;save('token-riot-site-theme',next);refreshTheme();};setLanguage(language);if(typeof MutationObserver!=='undefined'){const observer=new MutationObserver(records=>{for(const record of records)if(record.type==='characterData')translateText(record.target);else if(record.type==='attributes')translateAttributes(record.target);else for(const node of record.addedNodes)scan(node);});observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','aria-description','alt','title','placeholder','content']});}}
