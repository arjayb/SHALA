import {canonAsset,familyAssets,seedNumber} from './canon-assets.js';
import {getMedia,deleteMedia} from './media-store.js';

// BUILD 004 runtime contract. Height/build band thresholds remain provisional
// until POLARIS explicitly locks them; seed addressing and correction behavior do not.
export function resolveSeed({height,build,shape}){
  return seedNumber(height,build,shape);
}

export function resolvedCanon(canon){
  if(!canon)return null;
  return {...canon,seed:resolveSeed(canon),asset:canonAsset(canon)};
}

export function correctionFamily(canon){
  return familyAssets(canon).map(item=>({...item,available:true}));
}

export function correctedCanon(canon,shape){
  return resolvedCanon({...canon,shape,manualOverride:true});
}

export function canonReadyCopy(){
  return {title:'SHALA!',body:'There you are.',action:'ENTER MY WORKSHOP'};
}

export function favoriteSlotOrder(favorites){
  // First Favorite CENTER, second LEFT, third RIGHT.
  const order=[1,0,2];
  return order.find(i=>!favorites[i]);
}

export function needsFavoriteReplacement(favorites){
  return favorites.filter(Boolean).length>=3;
}

export async function replaceFavoriteAtomic({favorites,slot,incomingKey,stillReferenced=()=>false}){
  if(!Number.isInteger(slot)||slot<0||slot>2)throw new Error('Invalid Favorite slot');
  if(!incomingKey)throw new Error('Incoming Favorite is required');
  const incoming=await getMedia(incomingKey);
  if(!incoming)throw new Error('Incoming Favorite media is not secured');
  const previous=favorites[slot]||null;
  const next=[...favorites];
  next[slot]=incomingKey;
  // Caller persists `next` before asking us to release old media. This function
  // returns a commit/release pair so replacement cannot delete first.
  return {
    next,
    previous,
    async releasePrevious(){
      if(previous&&previous!==incomingKey&&!next.includes(previous)&&!stillReferenced(previous)){
        await deleteMedia(previous);
      }
    }
  };
}
