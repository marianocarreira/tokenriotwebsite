// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {t} from './site-preferences.js';

export function initCommunity(){
 const dialog=document.querySelector('#community-dialog'),form=document.querySelector('#community-form');
 const opener=document.querySelector('#community-button'),photo=form.elements.attachment,preview=document.querySelector('#avatar-preview');
 const purpose=form.elements.purpose,counter=document.querySelector('#purpose-counter'),submit=form.querySelector('[type="submit"]');
 let previewURL=null;
 function clearPreview(){if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;preview.removeAttribute('src');preview.hidden=true;}
 function validatePhoto(){
  photo.setCustomValidity('');const file=photo.files[0];
  if(file&&(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024))photo.setCustomValidity(t('Elegí una imagen JPG, PNG o WebP de hasta 5 MB.'));
  return photo.validity.valid;
 }
 function refresh(){purpose.value=purpose.value.slice(0,500);counter.textContent=purpose.value.length+' / 500';form.elements.language.value=document.documentElement.lang;document.querySelector('#avatar-filename').textContent=photo.files[0]?.name??t('Sin imagen seleccionada');validatePhoto();}
 opener.onclick=()=>{dialog.showModal();opener.setAttribute('aria-expanded','true');};
 document.querySelector('#community-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{opener.setAttribute('aria-expanded','false');clearPreview();photo.value='';photo.setCustomValidity('');refresh();});
 photo.addEventListener('change',()=>{clearPreview();refresh();if(!validatePhoto()){photo.reportValidity();return;}if(photo.files[0]){previewURL=URL.createObjectURL(photo.files[0]);preview.src=previewURL;preview.hidden=false;}});
 purpose.addEventListener('input',refresh);
 form.addEventListener('submit',event=>{
  for(const name of ['first_name','last_name','nickname','purpose']){const field=form.elements[name];field.value=field.value.trim();field.setCustomValidity(field.value?'':t('Completá este campo.'));}
  refresh();
  if(!form.checkValidity()){event.preventDefault();form.reportValidity();return;}
  submit.disabled=true;
 });
 for(const field of form.querySelectorAll('input:not([type="file"]),textarea'))field.addEventListener('input',()=>field.setCustomValidity(''));
 window.addEventListener('pageshow',()=>{submit.disabled=false;});
 document.addEventListener('site-language-change',refresh);refresh();
}
