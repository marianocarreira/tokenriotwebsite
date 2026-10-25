// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
export function initCollectibles(){
 const dialog=document.querySelector('#gadgets-dialog');
 document.querySelector('#gadgets-open').onclick=()=>dialog.showModal();
 document.querySelector('#gadgets-close').onclick=()=>dialog.close();
}
