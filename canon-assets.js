// SHALA Canon asset contract.
// The resolver is intentionally data-driven: production artwork can be dropped in
// without changing CREATE ME mathematics or exploration state.
export const HEIGHTS=['short','medium','tall'];
export const BUILDS=['lean','medium','full'];
export const SHAPES=['hourglass','bottom-hourglass','top-hourglass','pear','inverted-triangle','rectangle','apple'];

export function seedNumber(height,build,shape){
  const h=HEIGHTS.indexOf(height),b=BUILDS.indexOf(build),s=SHAPES.indexOf(shape);
  if(h<0||b<0||s<0)return null;
  return h*21+b*7+s+1;
}
export function seedPath(seed){
  if(!Number.isInteger(seed)||seed<1||seed>63)return null;
  return `assets/canon/seed-${String(seed).padStart(2,'0')}.webp`;
}
export function canonAsset(canon){
  if(!canon)return null;
  const seed=canon.seed||seedNumber(canon.height,canon.build,canon.shape);
  return seed?{seed,path:seedPath(seed),alt:'SHALA Canon body reference'}:null;
}
export function familyAssets(canon){
  if(!canon)return[];
  return SHAPES.map(shape=>{const seed=seedNumber(canon.height,canon.build,shape);return{shape,seed,path:seedPath(seed),alt:'SHALA Canon body reference'}});
}
