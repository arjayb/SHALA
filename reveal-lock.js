// SHALA Reveal Lock / Piety contract.
// An unresolved Reveal owns the application until a qualifying photo action succeeds.
export const REVEAL_CONFIRMATIONS={
  saved:'Photo saved to device',
  favorite:'Review the photo at The Console by entering the FAVORITES palette'
};

export function normalizeReveal(pending){
  if(!pending)return null;
  return {navigationReleased:false,qualifyingAction:null,confirmation:null,...pending};
}

export function revealOwnsApp(state){
  return Boolean(state.pendingReveal)&&!state.pendingReveal.navigationReleased;
}

export function routeForState(state,requested){
  // Hard router guard: reload, crash recovery, Home, Back, or any ordinary route
  // cannot supersede an unresolved Reveal.
  if(revealOwnsApp(state))return 'reveal';
  return requested||state.screen||'compact';
}

export function successfulSave(state){
  if(!state.pendingReveal)throw new Error('No Reveal to resolve');
  return {...state,pendingReveal:{...normalizeReveal(state.pendingReveal),navigationReleased:true,qualifyingAction:'save',confirmation:REVEAL_CONFIRMATIONS.saved},screen:'reveal'};
}

export function successfulFavorite(state){
  if(!state.pendingReveal)throw new Error('No Reveal to resolve');
  return {...state,pendingReveal:{...normalizeReveal(state.pendingReveal),navigationReleased:true,qualifyingAction:'favorite',confirmation:REVEAL_CONFIRMATIONS.favorite},screen:'reveal'};
}

export function failedAction(state){
  // Failure never earns navigation back.
  if(!state.pendingReveal)return state;
  return {...state,pendingReveal:{...normalizeReveal(state.pendingReveal),navigationReleased:false,qualifyingAction:null,confirmation:null},screen:'reveal'};
}

export function tryNewOne(state){
  // Explicitly abandons the unresolved Reveal and starts a fresh exploration.
  return {...state,pendingReveal:null,screen:'workshop',stage:null,references:{},working:false,workingAttempt:0};
}

export function mayNavigate(state){return !revealOwnsApp(state)}
