// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {translations} from './site-translations.js';
const spanish=new Map(translations),english=new Map(translations.map(([es,en])=>[en,es]));
const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
const save=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
let language=read('token-riot-site-language')==='es'?'es':'en';
export const t=text=>language==='en'?(spanish.get(text)??text):text;
export function setLanguage(value){
 language=value==='es'?'es':'en';document.documentElement.lang=language;
 const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){if(['SCRIPT','STYLE'].includes(node.parentElement?.tagName))continue;const original=english.get(node.nodeValue)??node.nodeValue;node.nodeValue=language==='en'?(spanish.get(original)??node.nodeValue):original;}
 for(const element of document.querySelectorAll('[aria-label],[alt],meta[name="description"],meta[property="og:description"]'))for(const attr of ['aria-label','alt','content'])if(element.hasAttribute(attr)){const value=element.getAttribute(attr),original=english.get(value)??value;element.setAttribute(attr,language==='en'?(spanish.get(original)??value):original);}
 document.querySelector('#language-select').value=language;save('token-riot-site-language',language);refreshTheme();document.dispatchEvent(new Event('site-language-change'));
}
function refreshTheme(){const dark=document.documentElement.dataset.theme!=='light';document.querySelector('#theme-toggle').setAttribute('aria-pressed',String(dark));document.querySelector('#theme-toggle').setAttribute('aria-label',t('Cambiar tema'));document.querySelector('#theme-icon').textContent=dark?'☾':'☀';document.querySelector('#theme-label').textContent=t(dark?'Modo oscuro':'Modo claro');document.querySelector('meta[name="theme-color"]').content=dark?'#080a10':'#f3f6f7';}
export function initPreferences(){document.querySelector('#language-select').onchange=e=>setLanguage(e.target.value);document.querySelector('#theme-toggle').onclick=()=>{const theme=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=theme;save('token-riot-site-theme',theme);refreshTheme();};setLanguage(language);}
