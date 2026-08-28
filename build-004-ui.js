import {canonAsset,familyAssets,seedNumber} from './canon-assets.js';
import {mediaURL} from './media-store.js';
import {favoriteSlotOrder,needsFavoriteReplacement,replaceFavoriteAtomic} from './build-004-runtime.js';

function button(text,className,onClick){const b=document.createElement('button');b.textContent=text;b.className=className;b.onclick=onClick;return b}

function neutralCanonFallback(){const d=document.createElement('div');d.className='canon-unavailable';d.textContent='Canon artwork is not installed yet.';return d}

export function canonFigure(canon,{select}={}){
  const asset=canonAsset(canon),wrap=document.createElement(select?'button':'div');wrap.className=select?'body-choice':'canon-art';
  if(select){wrap.type='button';wrap.setAttribute('aria-label','Choose this body reference');wrap.onclick=select}
  if(!asset){wrap.append(neutralCanonFallback());return wrap}
  const img=document.createElement('img');img.src=asset.path;img.alt=asset.alt;img.onerror=()=>{img.replaceWith(neutralCanonFallback())};wrap.append(img);return wrap
}

export function canonCorrectionGrid(canon,onPreview){
  const grid=document.createElement('div');grid.className='body-grid';
  familyAssets(canon).forEach(item=>grid.append(canonFigure({...canon,shape:item.shape,seed:item.seed},{select:()=>onPreview({...canon,shape:item.shape,seed:item.seed,manualOverride:true})})));
  return grid;
}

export function canonReadyScreen(onEnter){
  const d=document.createElement('div');d.className='canon-ready';d.innerHTML='<h1>SHALA!</h1><p>There you are.</p>';d.append(button('ENTER MY WORKSHOP','btn-go',onEnter));return d
}

export async function favoriteFrames(favorites,{manage=false,onSelect}={}){
  const grid=document.createElement('div');grid.className='favorite-frames';
  for(let i=0;i<3;i++){
    const frame=document.createElement(manage&&favorites[i]?'button':'div');frame.className=`gold-frame${favorites[i]?' occupied':''}`;
    if(favorites[i]){const u=await mediaURL(favorites[i]);if(u){const img=document.createElement('img');img.src=u;img.alt='Favorite SHALA look';frame.append(img)}if(manage){frame.type='button';frame.setAttribute('aria-label',`Manage Favorite ${i+1}`);frame.onclick=()=>onSelect?.(i)}}
    grid.append(frame);
  }
  return grid;
}

export async function requestFavorite({state,mediaKey,persist,render}){
  if(!mediaKey)return false;
  const favorites=[...state.favorites];
  if(!needsFavoriteReplacement(favorites)){
    const slot=favoriteSlotOrder(favorites);favorites[slot]=mediaKey;state.favorites=favorites;persist();render();return true;
  }
  state.incomingFavorite=mediaKey;state.favoriteMode='replace';state.screen='favorites';persist();render();return true;
}

export async function commitFavoriteReplacement({state,slot,persist,render}){
  const incoming=state.incomingFavorite;if(!incoming)return false;
  const tx=await replaceFavoriteAtomic({favorites:state.favorites,slot,incomingKey:incoming,stillReferenced:key=>key===state.currentMediaKey||key===state.pendingReveal?.mediaKey});
  state.favorites=tx.next;state.incomingFavorite=null;state.favoriteMode='view';persist();await tx.releasePrevious();render();return true;
}

export function replacementMessage(){const p=document.createElement('p');p.className='favorite-message';p.textContent="Three’s a crowd, gurl. Pick one to let go.";return p}

export function correctedSeed(canon,shape){return seedNumber(canon.height,canon.build,shape)}
