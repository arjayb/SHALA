const STORAGE_KEY = "shala_state_v1";
const defaults = {
  giftOpened:false,
  createMeCompleted:false,
  canon:null,
  favorites:[null,null,null],
  firstFavoriteTriviaShown:false,
  pendingReveal:null,
  screen:"gift",
  focus:null,
  pose:null,
  studio:null,
  stage:null,
  currentImage:null
};
let state = {...defaults, ...load()};
const app = document.querySelector("#app");

function load(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")}catch{return {}}
}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function set(patch){state={...state,...patch};save();render()}
function btn(text, cls, fn){
  const b=document.createElement("button"); b.textContent=text; b.className=cls; b.addEventListener("click",fn); return b;
}
function shell(title){
  app.innerHTML="";
  const s=document.createElement("section"); s.className="screen";
  if(title){const h=document.createElement("div"); h.className="stage center"; h.textContent=title; s.append(h)}
  app.append(s); return s;
}

function render(){
  if(state.pendingReveal && state.screen!=="reveal"){state.screen="reveal"}
  if(!state.giftOpened) return gift();
  if(!state.createMeCompleted) return createMe();
  ({
    compact, workshop, pose, studio, clothing, bag, shoes, accessory, reveal, favorites, trend
  }[state.screen]||compact)();
}

function gift(){
  const s=shell();
  const compact=document.createElement("div"); compact.className="compact"; compact.textContent="SHALA"; s.append(compact);
  const n=document.createElement("div"); n.className="note";
  n.innerHTML=`<div class="cake">🎂</div><h2 class="center">SHALA!</h2><p class="center">Ang app para kay Rasyela</p>
  <p>This is for you to use, explore and most especially—enjoy.</p>
  <p>Thank you for literally saving my life. I'll use up all my chances to return your kindness.</p>
  <p>Forever my sistah, forever your brotha'<br><strong>RJ</strong></p>`;
  s.append(n);
  s.append(btn("♡","btn-go",()=>set({giftOpened:true,screen:"createMe"})));
}

function createMe(){
  const s=shell("CREATE ME");
  const card=document.createElement("div"); card.className="note";
  card.innerHTML=`<h2>Let's get your fit.</h2>
  <p>HEIGHT</p><input id="height" inputmode="decimal" placeholder="165 cm / 5'5&quot;">
  <p>WEIGHT</p><input id="weight" inputmode="decimal" placeholder="58 kg / 128 lb">
  <p>BUST · WAIST · HIPS</p><input id="measure" placeholder="38 · 31 · 37 in">`;
  s.append(card);
  const al=document.createElement("div"); al.className="albus"; al.textContent="🧮"; s.append(al);
  s.append(btn("LOOKS RIGHT","btn-go",()=>set({
    createMeCompleted:true,
    canon:{profile:"seeded-demo"},
    screen:"compact"
  })));
}

function compact(){
  const s=shell();
  const c=document.createElement("div"); c.className="compact"; c.textContent="SHALA"; s.append(c);
  const p=document.createElement("div"); p.className="palette";
  [["MIRROR ON THE WALL","btn-neutral",()=>alert("Mirror: front-camera shell reserved for implementation")],
   ["EXPLORE","pan explore",()=>set({screen:"workshop"})],
   ["TREND ALERT","pan trend",()=>set({screen:"trend"})],
   ["FAVORITES","pan faves",()=>set({screen:"favorites"})]
  ].forEach(([t,cl,f])=>p.append(btn(t,cl,f)));
  s.append(p);
}

function workshop(){
  const s=shell("WHAT ARE WE TRYING ON?");
  const hs=document.createElement("div"); hs.className="hotspots";
  ["CLOTHES","BAGS","SHOES","ACCESSORIES"].forEach(x=>{
    hs.append(btn(`${x}\nTRY ME`,"hotspot",()=>set({focus:x.toLowerCase(),screen:"pose"})));
  });
  s.append(hs);
}

function pose(){
  const s=shell("POSE");
  const g=document.createElement("div"); g.className="pose-grid";
  Array.from({length:10},(_,i)=>g.append(btn(`POSE ${i+1}`,"pose",()=>set({pose:i+1,screen:"studio"}))));
  s.append(g);
  s.append(btn("START AGAIN","btn-peached",()=>set({focus:null,pose:null,studio:null,stage:null,currentImage:null,screen:"workshop"})));
}

function studio(){
  const s=shell("STUDIO");
  ["INDOOR OFFICE","INDOOR LIVING ROOM","INDOOR DISCO","OUTDOOR SUNNY PATIO","OUTDOOR GOLDEN HOUR"].forEach(x=>{
    s.append(btn(x,"btn-neutral",()=>set({studio:x,stage:"clothing",screen:"clothing",currentImage:"POSE + STUDIO"})));
  });
}

function buildStage(name,next){
  const s=shell(name.toUpperCase());
  const h=document.createElement("div"); h.className="hero"; h.innerHTML=`<div class="center"><h2>${state.currentImage||"LAST GOOD IMAGE"}</h2><p>SHOW ME</p></div>`; s.append(h);
  const a=document.createElement("div"); a.className="actions";
  a.append(btn("SLAP IT","btn-go",()=>set({currentImage:`${state.currentImage||"LOOK"} + ${name.toUpperCase()}`,stage:next,screen:next||"reveal",pendingReveal:next?state.pendingReveal:{image:`${state.currentImage||"LOOK"} + ${name.toUpperCase()}`}})));
  a.append(btn("SKIP >>>","btn-neutral",()=>set({stage:next,screen:next||"reveal",pendingReveal:next?state.pendingReveal:{image:state.currentImage||"LOOK"}})));
  a.append(btn("START AGAIN","btn-peached",()=>set({focus:null,pose:null,studio:null,stage:null,currentImage:null,pendingReveal:null,screen:"workshop"})));
  s.append(a);
}
const clothing=()=>buildStage("clothing","bag");
const bag=()=>buildStage("bag","shoes");
const shoes=()=>buildStage("shoes","accessory");
const accessory=()=>buildStage("accessory",null);

function reveal(){
  const s=shell();
  const h=document.createElement("div"); h.className="hero"; h.innerHTML=`<div class="center"><h1>WERK!</h1><p>${state.pendingReveal?.image||state.currentImage||"FINAL LOOK"}</p></div>`; s.append(h);
  const c=document.createElement("div"); c.className="reveal-controls hidden";
  c.append(btn("♡ MARK FAVORITE","btn-neutral",favoriteCurrent));
  c.append(btn("↓ SAVE TO DEVICE","btn-neutral",()=>alert("In saving, you serve.")));
  c.append(btn("TRY NEW ONE","btn-go",()=>set({pendingReveal:null,focus:null,pose:null,studio:null,stage:null,currentImage:null,screen:"workshop"})));
  s.append(c);
  let shown=false;
  const show=()=>{if(!shown){shown=true;c.classList.remove("hidden")}};
  const timer=setTimeout(show,10000);
  h.addEventListener("dblclick",()=>{clearTimeout(timer);show()});
  h.addEventListener("click",()=>{if(shown)c.classList.toggle("hidden")});
}
function favoriteCurrent(){
  const img=state.pendingReveal?.image||state.currentImage||"FAVORITE";
  let f=[...state.favorites];
  const order=[1,0,2];
  const slot=order.find(i=>!f[i]);
  if(slot===undefined){alert("Three's a crowd, gurl. Pick one to let go."); return}
  f[slot]=img;
  const showTrivia=!state.firstFavoriteTriviaShown;
  state={...state,favorites:f,firstFavoriteTriviaShown:true}; save();
  if(showTrivia) alert("DID YOU KNOW?\n\nWe rendered 63 versions of you,\nand that's how much we love YOU.");
  render();
}
function favorites(){
  const s=shell("FAVORITE THINGS");
  const g=document.createElement("div"); g.className="pose-grid";
  ["LEFT","CENTER","RIGHT"].forEach((name,i)=>{
    g.append(btn(`${name}\n${state.favorites[i]||"EMPTY FRAME"}`,"pose",()=>{}));
  });
  s.append(g);
  s.append(btn("MANAGE FAVORITES","btn-neutral",()=>alert("Management mode shell reserved.")));
  s.append(btn("HOME","btn-go",()=>set({screen:"compact"})));
}
function trend(){
  const s=shell("TREND ALERT");
  const lanes=["lounge clothes","street style","casual","Sunday's best"];
  const buzz={
    "lounge clothes":["elevated loungewear","co-ord","soft tailoring","luxury basics","relaxed fit"],
    "street style":["fashion week","it girl","runway inspired","streetwear","editorial"],
    "casual":["elevated basics","off duty","effortless","quiet luxury","capsule wardrobe"],
    "Sunday's best":["occasion dressing","polished","feminine","elegant","church outfit"]
  };
  const lane=lanes[Math.floor(Math.random()*lanes.length)];
  const picks=[...buzz[lane]].sort(()=>Math.random()-.5).slice(0,2);
  const now=new Date();
  const month=now.toLocaleString(undefined,{month:"long"});
  const q=`women's ${lane} ${picks.join(" ")} ${month} ${now.getFullYear()} fashion magazine`;
  const d=document.createElement("div"); d.className="note"; d.innerHTML=`<h2>${lane.toUpperCase()}</h2><p>${picks.join(" · ")}</p><p>${month} ${now.getFullYear()}</p>`; s.append(d);
  s.append(btn("SHOW ME","btn-go",()=>window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`,"_blank")));
  s.append(btn("PULL AGAIN","btn-neutral",trend));
  s.append(btn("HOME","btn-neutral",()=>set({screen:"compact"})));
}
render();
