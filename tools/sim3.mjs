// Sim v3.1 — ekonomi 3 lapisan, dioptimasi (bulk-buy closed-form + dt adaptif).
//   run (biomassa) -> Gaia (planet) -> Bintang (galaksi) -> Singularitas (semesta)
// Semua bonus ADITIF: mult = (1+gaia*B1)(1+bintang*B2)(1+sing*B3)  (anti-runaway)

const CFG = {
  NGEN: 16, cost0: 15, costRatio: 11, rate0: 0.1, rateRatio: 6.2, growth: 1.15,
  D1: 1e5,   B1: 0.05,            // Gaia (planet)
  GAL_REQ: 150, D2: 150, B2: 0.5, // Galaksi
  UNI_REQ: 80,  D3: 80,  B3: 3,   // Semesta
  cps: 1.5, maxDays: 60,
};

function buildGens(c){ const g=[]; for(let i=0;i<c.NGEN;i++) g.push({ baseCost:c.cost0*c.costRatio**i, rate:c.rate0*c.rateRatio**i }); return g; }
const UPS=[{cost:120,t:'c',m:2},{cost:6000,t:'c',m:3},{cost:9e5,t:'c',m:4},
  {cost:2500,t:'a',m:2},{cost:9e4,t:'a',m:2},{cost:3.5e6,t:'a',m:3},
  {cost:1.8e8,t:'a',m:3},{cost:1.2e10,t:'a',m:3},{cost:5e12,t:'a',m:3},{cost:2e15,t:'a',m:3}];

function fmt(n){ if(!isFinite(n)) return '∞'; if(n<1000) return n.toFixed(0);
  const u=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc']; let t=Math.floor(Math.log10(n)/3);
  if(t>=u.length) return n.toExponential(2); return (n/10**(t*3)).toFixed(2)+u[t]; }
function dur(s){ if(s<90) return s.toFixed(0)+'d'; const m=s/60; if(m<90) return m.toFixed(0)+'m';
  const h=m/60; if(h<48) return h.toFixed(1)+'jam'; return (h/24).toFixed(1)+'hari'; }

function simulate(c){
  const GEN=buildGens(c), R=c.growth;
  const owned=new Array(c.NGEN).fill(0); let ups=new Array(UPS.length).fill(false);
  let biomass=0, run=0, bestRun=0, gaia=0, bintang=0, sing=0;
  let t=0; const maxT=c.maxDays*86400;
  const M={}; let galaxies=0, universes=0, planets=0, maxBiomass=0;

  const allMult=()=>{ let m=1; for(let i=0;i<UPS.length;i++) if(UPS[i].t==='a'&&ups[i]) m*=UPS[i].m;
    return m*(1+gaia*c.B1)*(1+bintang*c.B2)*(1+sing*c.B3); };
  const clickM=m=>{ let k=1; for(let i=0;i<UPS.length;i++) if(UPS[i].t==='c'&&ups[i]) k*=UPS[i].m; return k*m; };
  const psBase=()=>{ let s=0; for(let i=0;i<c.NGEN;i++) s+=owned[i]*GEN[i].rate; return s; };
  const cost=i=>GEN[i].baseCost*R**owned[i];

  function buyAll(){
    for(let i=0;i<UPS.length;i++) if(!ups[i]&&biomass>=UPS[i].cost){ ups[i]=true; biomass-=UPS[i].cost; }
    for(let iter=0;iter<50;iter++){
      const m=allMult(); let best=-1,pb=Infinity;
      for(let i=0;i<c.NGEN;i++){ const cc=cost(i); if(cc>biomass) continue;
        const pbk=cc/(GEN[i].rate*m); if(pbk<pb){pb=pbk;best=i;} }
      if(best<0) break;
      const base=GEN[best].baseCost*R**owned[best];
      let qty=Math.floor(Math.log((biomass*(R-1))/base+1)/Math.log(R)); if(qty<1)qty=1;
      // batasi agar tak borong semua sekaligus (biar menyebar antar tier)
      qty=Math.min(qty, 25);
      const tc=base*(R**qty-1)/(R-1);
      if(tc>biomass){ biomass-=base; owned[best]++; } else { biomass-=tc; owned[best]+=qty; }
    }
  }

  let allGenDone=false;
  while(t<maxT){
    const m=allMult();
    const ps=psBase()*m + c.cps*clickM(m);
    const dt=Math.max(2, Math.min(3600, t/1500)); // adaptif: halus di awal, kasar di akhir
    const inc=ps*dt; biomass+=inc; run+=inc; t+=dt;
    if(run>bestRun) bestRun=run; if(biomass>maxBiomass) maxBiomass=biomass;
    buyAll();
    if(!allGenDone && owned.every(o=>o>0)){ allGenDone=true; M.allGen=t; }

    if(bintang>=c.UNI_REQ){ const g=Math.floor(Math.sqrt(bintang/c.D3))-sing;
      if(g>=Math.max(1,Math.ceil(sing*0.5))){ sing+=g; universes++; if(!M.firstUniverse)M.firstUniverse=t;
        bintang=0;gaia=0;bestRun=0;run=0;biomass=0;owned.fill(0);ups.fill(false);planets=0; continue; } }
    if(gaia>=c.GAL_REQ){ const g=Math.floor(Math.sqrt(gaia/c.D2))-bintang;
      if(g>=Math.max(1,Math.ceil(bintang*0.5))){ bintang+=g; galaxies++; if(!M.firstGalaxy)M.firstGalaxy=t;
        gaia=0;bestRun=0;run=0;biomass=0;owned.fill(0);ups.fill(false);planets=0; continue; } }
    { const g=Math.floor(Math.sqrt(bestRun/c.D1))-gaia;
      if(g>=Math.max(1,Math.ceil(gaia*0.5))){ gaia+=g; planets++; if(!M.firstPlanet)M.firstPlanet=t;
        run=0;biomass=0;owned.fill(0);ups.fill(false); continue; } }
  }
  return { t, gaia, bintang, sing, galaxies, universes, planets, M, maxBiomass, finalMult:allMult() };
}

function report(c){
  console.log(`\n=== cps=${c.cps} | D1=${fmt(c.D1)} B1=${c.B1} | GAL_REQ=${c.GAL_REQ} D2=${c.D2} B2=${c.B2} | UNI_REQ=${c.UNI_REQ} D3=${c.D3} B3=${c.B3} ===`);
  const r=simulate(c); const m=r.M; const row=(k,v)=>console.log(`  ${k.padEnd(24)}: ${v}`);
  row('Planet pertama', m.firstPlanet!=null?dur(m.firstPlanet):'—');
  row('Semua 16 generator', m.allGen!=null?dur(m.allGen):'TAK TERCAPAI');
  row('Galaksi pertama', m.firstGalaxy!=null?dur(m.firstGalaxy):'TAK TERCAPAI ('+c.maxDays+'hari)');
  row('Semesta pertama', m.firstUniverse!=null?dur(m.firstUniverse):'TAK TERCAPAI ('+c.maxDays+'hari)');
  console.log(`  -- setelah ${dur(r.t)} aktif --`);
  row('Galaksi / Semesta total', `${r.galaxies} / ${r.universes}`);
  row('Gaia/Bintang/Sing', `${fmt(r.gaia)} / ${fmt(r.bintang)} / ${fmt(r.sing)}`);
  row('Mult akhir', 'x'+fmt(r.finalMult));
  row('Biomassa puncak', fmt(r.maxBiomass)+(r.maxBiomass>1e300?' ⚠️OVERFLOW':''));
}

// FINAL: 20 generator, biaya lebih curam (lebih banyak "dekade" untuk didaki tiap run)
const FINAL = { NGEN:20, cost0:15, costRatio:9.5, rate0:0.1, rateRatio:5.5, growth:1.18,
  D1:1e5, B1:0.025, GAL_REQ:2000, D2:2000, B2:2.5, UNI_REQ:1000, D3:1000, B3:15, maxDays:120 };
console.log('\n############ FINAL — pemain AKTIF (cps 1.5) ############');
report({...FINAL, cps:1.5});
console.log('\n############ FINAL — pemain SUPER-AKTIF (cps 3) ############');
report({...FINAL, cps:3});
console.log('\n############ FINAL — pemain KASUAL (cps 0.3) ############');
report({...FINAL, cps:0.3});
