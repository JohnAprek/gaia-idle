// Playtest simulator v2 — model prestige "frontier" (seperti Cookie Clicker heavenly chips).
// Pemain hanya dapat spora baru bila MEMECAHKAN rekor biomassa/run terjauhnya.
// Pemain prestige saat gain >= max(1, 50% dari spora sekarang).

const GENERATORS = [
  { id:'spora',  baseCost:15,         rate:0.1 },
  { id:'lumut',  baseCost:120,        rate:1 },
  { id:'semak',  baseCost:1300,       rate:8 },
  { id:'pohon',  baseCost:14000,      rate:47 },
  { id:'hutan',  baseCost:160000,     rate:260 },
  { id:'danau',  baseCost:1900000,    rate:1400 },
  { id:'satwa',  baseCost:25000000,   rate:7800 },
  { id:'koloni', baseCost:400000000,  rate:44000 },
  { id:'kota',   baseCost:6.5e9,      rate:260000 },
  { id:'orbit',  baseCost:1e11,       rate:1.6e6 },
];
const UPGRADES = [
  { id:'click1', cost:120,    type:'click', mult:2 },
  { id:'click2', cost:6000,   type:'click', mult:3 },
  { id:'click3', cost:900000, type:'click', mult:4 },
  { id:'all1',   cost:2500,   type:'all',   mult:2 },
  { id:'all2',   cost:90000,  type:'all',   mult:2 },
  { id:'all3',   cost:3.5e6,  type:'all',   mult:3 },
  { id:'all4',   cost:1.8e8,  type:'all',   mult:3 },
  { id:'all5',   cost:1.2e10, type:'all',   mult:3 },
];
const R = 1.15;

function fmt(n){ if(n<1000) return n.toFixed(0);
  const u=['','K','M','B','T','Qa','Qi','Sx','Sp']; let t=Math.floor(Math.log10(n)/3); if(t>=u.length)t=u.length-1;
  return (n/10**(t*3)).toFixed(2)+u[t]; }
function dur(s){ if(s<90) return s.toFixed(0)+' dtk';
  const m=s/60; if(m<90) return m.toFixed(1)+' mnt';
  const h=m/60; if(h<48) return h.toFixed(1)+' jam'; return (h/24).toFixed(1)+' hari'; }

// Simulasikan satu run sampai mampu prestige (gain>=threshold) atau batas waktu.
function runUntilPrestige(gaia, DIV, BONUS, cps, maxSeconds){
  const owned=Object.fromEntries(GENERATORS.map(g=>[g.id,0])); const ups={};
  let biomass=0, run=0, t=0; const dt=1;
  const pm=1+gaia*BONUS;
  const allMult=()=>{ let m=1; UPGRADES.forEach(u=>{if(u.type==='all'&&ups[u.id])m*=u.mult;}); return m*pm; };
  const clickMult=()=>{ let m=1; UPGRADES.forEach(u=>{if(u.type==='click'&&ups[u.id])m*=u.mult;}); return m*allMult(); };
  const perSec=()=>{ let s=0; GENERATORS.forEach(g=>s+=owned[g.id]*g.rate); return s*allMult(); };
  const cost=g=>Math.floor(g.baseCost*R**owned[g.id]);
  const totalSpores=r=>Math.floor(Math.sqrt(r/DIV));
  const threshold=Math.max(1, Math.ceil(gaia*0.5)); // prestige bila bisa +50%

  while(t<maxSeconds){
    biomass+=perSec()*dt + cps*clickMult()*dt;
    run+=perSec()*dt + cps*clickMult()*dt;
    t+=dt;
    let bought=true;
    while(bought){ bought=false;
      for(const u of UPGRADES){ if(!ups[u.id]&&biomass>=u.cost){ups[u.id]=true;biomass-=u.cost;bought=true;} }
      let best=null,pb=Infinity;
      for(const g of GENERATORS){ const c=cost(g); if(c>biomass)continue; const gain=g.rate*allMult(); const p=c/gain; if(p<pb){pb=p;best=g;} }
      if(best){ biomass-=cost(best); owned[best.id]++; bought=true; }
    }
    const gain=totalSpores(run)-gaia;
    if(gain>=threshold) return { t, run, gain, perSec:perSec() };
  }
  return { t, run, gain:Math.max(0,totalSpores(run)-gaia), perSec:perSec(), timedOut:true };
}

function fullPlaythrough(DIV, BONUS, cps, label){
  console.log(`\n========== ${label} | DIV=${fmt(DIV)} bonus=+${(BONUS*100)}%/spora | ${cps} klik/dtk ==========`);
  let gaia=0, totalTime=0, planet=0;
  const maxPlanets=20, maxSecPerPlanet=60*60*24*14; // batas 14 hari/planet
  while(planet<maxPlanets){
    planet++;
    const r=runUntilPrestige(gaia, DIV, BONUS, cps, maxSecPerPlanet);
    totalTime+=r.t;
    const newGaia=gaia+r.gain;
    console.log(`Planet #${String(planet).padStart(2)} | durasi ${dur(r.t).padStart(9)} | run ${fmt(r.run).padStart(9)} `+
      `| +${String(r.gain).padStart(4)} Gaia -> ${String(newGaia).padStart(5)} (x${(1+newGaia*BONUS).toFixed(2)}) `+
      `| total main: ${dur(totalTime)}${r.timedOut?' [TIMEOUT]':''}`);
    if(r.gain<=0){ console.log('   (tak ada progres lagi — frontier mentok)'); break; }
    gaia=newGaia;
    if(r.timedOut) break;
  }
}

// Bandingkan beberapa setting balancing
fullPlaythrough(1e5,  0.03, 2, 'A: setting SAAT INI');
fullPlaythrough(1.5e7, 0.05, 2, 'B: usulan (lebih halus)');
fullPlaythrough(1.5e7, 0.05, 0.3, 'B-idle: usulan, pemain santai (0.3 klik/dtk)');
