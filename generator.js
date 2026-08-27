export class GenerationError extends Error{
  constructor(message,{retryable=true}={}){super(message);this.name="GenerationError";this.retryable=retryable}
}

function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function escapeXML(s=""){return String(s).replace(/[<>&'\"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;","\"":"&quot;"}[c]))}

export const mockGenerator={
  id:"mock-v1",
  async generate({stage,baseLabel,referenceName,attempt}){
    await wait(700);
    const label=`${baseLabel||"CANON LOOK"} + ${stage.toUpperCase()}`;
    const detail=referenceName?`Reference: ${referenceName}`:"Reference accepted";
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200"><rect width="900" height="1200" fill="#f7efe9"/><rect x="55" y="55" width="790" height="1090" rx="54" fill="#fffaf7" stroke="#d9929c" stroke-width="4"/><text x="450" y="460" text-anchor="middle" font-family="Georgia" font-size="56" fill="#171313">SHALA!</text><text x="450" y="550" text-anchor="middle" font-family="Arial" font-size="28" fill="#171313">${escapeXML(label)}</text><text x="450" y="610" text-anchor="middle" font-family="Arial" font-size="20" fill="#8f8987">${escapeXML(detail)}</text><text x="450" y="680" text-anchor="middle" font-family="Arial" font-size="18" fill="#8f8987">BUILD generator adapter · attempt ${attempt}</text></svg>`;
    return {label,blob:new Blob([svg],{type:"image/svg+xml"}),provider:this.id};
  }
};

let activeProvider=mockGenerator;
export function setGenerationProvider(provider){if(!provider?.generate)throw new TypeError("Generator provider must expose generate().");activeProvider=provider}
export function getGenerationProvider(){return activeProvider}

export async function generateWithRetries(payload,{maxAttempts=3,onAttempt}={}){
  let lastError;
  for(let attempt=1;attempt<=maxAttempts;attempt++){
    try{
      onAttempt?.(attempt);
      return await activeProvider.generate({...payload,attempt});
    }catch(err){
      lastError=err;
      if(err?.retryable===false)break;
    }
  }
  throw lastError||new GenerationError("Generation failed")
}
