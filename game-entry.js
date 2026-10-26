// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {createOfflineEconomy} from './game-src/offline-economy.js';
import abilities from './game-src/abilities.json';
import combatModels from './game-src/combat-models.json';
import prices from './game-src/token-price-cache.json';
const nativeFetch=window.fetch.bind(window);
const service=createOfflineEconomy({abilities,models:combatModels,prices,read:async key=>localStorage.getItem('tokenriot-web:'+key),write:async(key,value)=>localStorage.setItem('tokenriot-web:'+key,value),refreshPrices:async(brand,q)=>{
 const response=await nativeFetch('https://openrouter.ai/api/v1/models',{signal:AbortSignal.timeout(3500)});if(!response.ok)throw Error('offline');const data=await response.json(),model=data.data?.find(m=>m.id===q.modelId),rate=Number(model?.pricing?.completion);if(!model||!Number.isFinite(rate)||rate<0)throw Error('unavailable');return {...q,modelName:model.name,usdPerToken:rate,pricedAt:new Date().toISOString(),cached:false};
}});
window.fetch=async(url,options)=>{
 if(url==='/api/config')return new Response(JSON.stringify({abilities,combatModels}));
 if(url==='/api/llm')try{return new Response(JSON.stringify(await service(JSON.parse(options.body))));}catch(error){return new Response(JSON.stringify({error:error.message}),{status:400});}
 return nativeFetch(url,options);
};
await import('./game-src/app.js');
const leave=document.createElement('a');leave.href='../';leave.className='site-return';leave.textContent='← Back to site';document.querySelector('header').append(leave);
