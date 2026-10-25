// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {initCommunity} from './community.js';
import {t,initPreferences} from './site-preferences.js';
const $=s=>document.querySelector(s);
for(const video of document.querySelectorAll('.gameplay video'))video.addEventListener('play',()=>{for(const other of document.querySelectorAll('.gameplay video'))if(other!==video)other.pause();});
$('.menu-toggle').onclick=()=>{const open=document.body.classList.toggle('menu-open');$('.menu-toggle').setAttribute('aria-expanded',String(open));};
for(const link of document.querySelectorAll('nav a'))link.addEventListener('click',()=>{document.body.classList.remove('menu-open');$('.menu-toggle').setAttribute('aria-expanded','false');});
function tabs(selector,onChange){const buttons=[...document.querySelectorAll(selector)];const choose=button=>{buttons.forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;});onChange(button);};for(const [i,button] of buttons.entries()){button.onclick=()=>choose(button);button.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const index=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowLeft'?buttons.length-1:1))%buttons.length;choose(buttons[index]);buttons[index].focus();};}}
const controlSets=[[
 ['Moverse',['W A S D','↑ ← ↓ →']],['Disparar',['SPACE']],['Saltar / Agacharse / Cubrirse',['Z','X','C']],['Abrir consola',['CTRL','C']]
],[['Moverse',['I J K L']],['Disparar',['H']],['Saltar / Agacharse / Cubrirse',['U','O','P']],['Abrir consola',['CTRL','P']]]];
let selectedPlayer=0;
function renderControls(){const button=document.querySelector('[data-player="'+selectedPlayer+'"]');$('#control-panel').setAttribute('aria-labelledby',button.id);$('#control-list').textContent='';for(const [label,keys] of controlSets[selectedPlayer]){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=t(label);for(const text of keys){const key=document.createElement('kbd');key.textContent=text;dd.append(key);}row.append(dt,dd);$('#control-list').append(row);}}
tabs('[data-player]',button=>{selectedPlayer=Number(button.dataset.player);renderControls();});
document.addEventListener('site-language-change',renderControls);
initPreferences();
$('#privacy-open').onclick=()=>$('#privacy-dialog').showModal();$('#privacy-dialog').addEventListener('click',e=>{if(e.target===$('#privacy-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
let downloadController=null,readyURL=null,filename='TOKEN-RIOT-android-v0.1.0.apk';
function saveAPK(){const link=document.createElement('a');link.href=readyURL;link.download=filename;document.body.append(link);link.click();link.remove();}
$('#download-apk').onclick=async()=>{
 if(readyURL){saveAPK();return;}
 const button=$('#download-apk'),status=$('#download-status');downloadController=new AbortController();button.disabled=true;$('#cancel-download').hidden=false;status.textContent=t('Preparando APK… ')+'0%';
 try{const response=await fetch('downloads/android.json',{signal:downloadController.signal,cache:'no-store'});if(!response.ok)throw Error(t('No pudimos encontrar el archivo.'));const manifest=await response.json(),chunks=[];if(!/^TOKEN-RIOT[-a-zA-Z0-9.]*\.apk$/.test(manifest.filename)||!Number.isSafeInteger(manifest.bytes)||manifest.bytes<1||manifest.bytes>200*1024*1024||!Array.isArray(manifest.parts)||manifest.parts.length<1||manifest.parts.length>32||manifest.parts.some(p=>!/^token-riot-(?:[a-f0-9]{12}-)?\d{2}\.bin$/.test(p.file)||!Number.isSafeInteger(p.bytes)||p.bytes<1||p.bytes>8*1024*1024||! /^[a-f0-9]{64}$/.test(p.sha256)))throw Error(t('El archivo está incompleto.'));let received=0;filename=manifest.filename;
  for(const part of manifest.parts){const response=await fetch('downloads/'+part.file,{signal:downloadController.signal});if(!response.ok)throw Error(t('La conexión se interrumpió.'));const bytes=await response.arrayBuffer();if(bytes.byteLength!==part.bytes)throw Error(t('El archivo está incompleto.'));if(crypto.subtle){const digest=await crypto.subtle.digest('SHA-256',bytes),actual=[...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('');if(actual!==part.sha256)throw Error(t('No pudimos verificar el archivo.'));}chunks.push(new Blob([bytes]));received+=part.bytes;status.textContent=t('Preparando APK… ')+Math.round(received/manifest.bytes*100)+'%'+t(' · No cierres esta página.');}
  if(received!==manifest.bytes)throw Error(t('El archivo está incompleto.'));readyURL=URL.createObjectURL(new Blob(chunks,{type:'application/vnd.android.package-archive'}));saveAPK();status.textContent=t('APK preparado. Si no comenzó la descarga, tocá el botón nuevamente.');button.innerHTML=t('VOLVER A DESCARGAR APK ')+'<span>↓</span>';
 }catch(error){status.textContent=error.name==='AbortError'?t('Descarga cancelada. Podés volver a intentarlo.'):error.message+t(' Volvé a intentarlo.');}
 finally{button.disabled=false;$('#cancel-download').hidden=true;downloadController=null;}
};
$('#cancel-download').onclick=()=>downloadController?.abort();window.addEventListener('beforeunload',()=>{downloadController?.abort();if(readyURL)URL.revokeObjectURL(readyURL);});

initCommunity();
