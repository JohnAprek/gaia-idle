// Sim v4 — PLAYTEST AKURAT: menyalin persis data & konstanta yang ter-ship di index.html.
// Fokus: pengalaman onboarding (jam pertama) + timeline milestone tiap lapisan.

// ====== SALINAN PERSIS DARI index.html ======
const GENERATORS = [
  { id:'spora',  baseCost:15,      rate:0.1 },   { id:'lumut',  baseCost:120,     rate:1 },
  { id:'semak',  baseCost:1300,    rate:8 },      { id:'pohon',  baseCost:14000,   rate:47 },
  { id:'hutan',  baseCost:160000,  rate:260 },    { id:'danau',  baseCost:1900000, rate:1400 },
  { id:'satwa',  baseCost:25000000,rate:7800 },   { id:'koloni', baseCost:4e8,     rate:44000 },
  { id:'kota',   baseCost:6.5e9,   rate:260000 }, { id:'orbit',  baseCost:1e11,    rate:1.6e6 },
  { id:'bulan',  baseCost:1.3e12,  rate:9e6 },    { id:'mars',   baseCost:1.7e13,  rate:5e7 },
  { id:'asteroid',baseCost:2.2e14, rate:2.8e8 },  { id:'dyson',  baseCost:2.9e15,  rate:1.6e9 },
  { id:'mtbuatan',baseCost:3.8e16, rate:9e9 },    { id:'warp',   baseCost:5e17,    rate:5e10 },
  { id:'cincin', baseCost:6.5e18,  rate:2.8e11 }, { id:'nebula', baseCost:8.5e19,  rate:1.6e12 },
  { id:'kluster',baseCost:1.1e21,  rate:9e12 },   { id:'jaring', baseCost:1.5e22,  rate:5e13 },
];
const UPS=[{cost:120,t:'c',m:2},{cost:6000,t:'c',m:3},{cost:9e5,t:'c',m:4},
  {cost:2500,t:'a',m:2},{cost:9e4,t:'a',m:2},{cost:3.5e6,t:'a',m:3},
  {cost:1.8e8,t:'a',m:3},{cost:1.2e10,t:'a',m:3}];
const G=1.18, GAIA_DIV=1e5, GAIA_B=0.05, GAL_REQ=250, BIN_DIV=250, BIN_B=2, UNI_REQ=300, SING_DIV=300, SING_B=12;
const NG=GENERATORS.length;
const MILES=[10,25,50,100,150,200,300,400,500,750,1000];
function mileCount(n){ let c=0; for(const m of MILES){ if(n>=m) c++; } if(n>1000) c+=Math.floor((n-1000)/500); return c; }

function fmt(n){ if(!isFinite(n))return'∞'; if(n<1000)return n.toFixed(n<10&&n%1?1:0);
  const u=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc']; let t=Math.floor(Math.log10(n)/3);
  if(t>=u.length)return n.toExponential(2); return (n/10**(t*3)).toFixed(2)+u[t]; }
function dur(s){ if(s<90)return s.toFixed(0)+'d'; const m=s/60; if(m<90)return m.toFixed(0)+'m';
  const h=m/60; if(h<48)return h.toFixed(1)+'jam'; return (h/24).toFixed(1)+'hari'; }

function simulate(cps, maxDays, log){
  const owned=new Array(NG).fill(0); let ups=new Array(UPS.length).fill(false);
  const mgr=new Array(NG).fill(0);
  let biomass=0, run=0, bestRun=0, gaia=0, bintang=0, sing=0;
  let t=0; const maxT=maxDays*86400;
  const M={}; let planets=0, galaxies=0, universes=0;
  const genUnlock=new Array(NG).fill(null);

  const allMult=()=>{ let m=1; for(let i=0;i<UPS.length;i++) if(UPS[i].t==='a'&&ups[i])m*=UPS[i].m;
    return m*(1+gaia*GAIA_B)*(1+bintang*BIN_B)*(1+sing*SING_B); };
  const clickM=m=>{ let k=1; for(let i=0;i<UPS.length;i++) if(UPS[i].t==='c'&&ups[i])k*=UPS[i].m; return k*m; };
  const effRate=i=>GENERATORS[i].rate*Math.pow(2,mileCount(owned[i]))*(1+mgr[i]); // milestone + manager
  const psBase=()=>{ let s=0; for(let i=0;i<NG;i++) s+=owned[i]*effRate(i); return s; };
  const cost=i=>GENERATORS[i].baseCost*G**owned[i];
  const mgrCost=i=>GENERATORS[i].baseCost*40*Math.pow(7,mgr[i]);

  function buyAll(){
    for(let i=0;i<UPS.length;i++) if(!ups[i]&&biomass>=UPS[i].cost){ups[i]=true;biomass-=UPS[i].cost;}
    for(let i=0;i<NG;i++){ if(owned[i]>=10&&mgr[i]<1&&biomass>=mgrCost(i)){biomass-=mgrCost(i);mgr[i]=1;}
      else if(owned[i]>=50&&mgr[i]<2&&biomass>=mgrCost(i)){biomass-=mgrCost(i);mgr[i]=2;} }
    for(let it=0;it<60;it++){ const m=allMult(); let best=-1,pb=Infinity;
      for(let i=0;i<NG;i++){ const c=cost(i); if(c>biomass)continue; const p=c/(effRate(i)*m); if(p<pb){pb=p;best=i;} }
      if(best<0)break; const base=GENERATORS[best].baseCost*G**owned[best];
      let q=Math.floor(Math.log((biomass*(G-1))/base+1)/Math.log(G)); if(q<1)q=1; q=Math.min(q,25);
      const tc=base*(G**q-1)/(G-1); if(tc>biomass){biomass-=base;owned[best]++;} else {biomass-=tc;owned[best]+=q;}
      if(genUnlock[best]===null) genUnlock[best]=t; }
  }
  while(t<maxT){
    const m=allMult(); const ps=psBase()*m+cps*clickM(m);
    const dt=Math.max(1, Math.min(3600, t/1500));
    biomass+=ps*dt; run+=ps*dt; t+=dt;
    if(run>bestRun)bestRun=run;
    buyAll();
    if(!M.allGen && owned.every(o=>o>0)) M.allGen=t;
    if(!M.galUnlock && gaia>=GAL_REQ) M.galUnlock=t;
    if(!M.uniUnlock && bintang>=UNI_REQ) M.uniUnlock=t;
    // prestige (atas->bawah), heuristik +50%
    if(bintang>=UNI_REQ){ const g=Math.floor(Math.sqrt(bintang/SING_DIV))-sing;
      if(g>=Math.max(1,Math.ceil(sing*0.5))){ sing+=g;universes++; if(!M.uni1)M.uni1=t;
        bintang=0;gaia=0;bestRun=0;run=0;biomass=0;owned.fill(0);ups.fill(false);mgr.fill(0);continue; } }
    if(gaia>=BIN_DIV){ const g=Math.floor(Math.sqrt(gaia/BIN_DIV))-bintang;   // bisa galaxy sejak gaia>=250
      if(g>=Math.max(1,Math.ceil(bintang*0.5))){ bintang+=g;galaxies++; if(!M.gal1)M.gal1=t;
        gaia=0;bestRun=0;run=0;biomass=0;owned.fill(0);ups.fill(false);mgr.fill(0);continue; } }
    { const g=Math.floor(Math.sqrt(bestRun/GAIA_DIV))-gaia;
      if(g>=Math.max(1,Math.ceil(gaia*0.5))){ gaia+=g;planets++; if(!M.planet1)M.planet1=t;
        run=0;biomass=0;owned.fill(0);ups.fill(false);mgr.fill(0);continue; } }
  }
  return { t, gaia, bintang, sing, planets, galaxies, universes, M, genUnlock, maxBiomass:bestRun };
}

// ===== Onboarding: tanpa prestige, lihat pace awal (klik manual saja) =====
function onboarding(cps){
  const owned=new Array(NG).fill(0); let ups=new Array(UPS.length).fill(false);
  let biomass=0, t=0; const ev={};
  const allMult=()=>{ let m=1; for(let i=0;i<UPS.length;i++) if(UPS[i].t==='a'&&ups[i])m*=UPS[i].m; return m; };
  const clickM=()=>{ let k=1; for(let i=0;i<UPS.length;i++) if(UPS[i].t==='c'&&ups[i])k*=UPS[i].m; return k*allMult(); };
  const cost=i=>GENERATORS[i].baseCost*G**owned[i];
  while(t<3600){ const m=allMult(); let ps=0; for(let i=0;i<NG;i++) ps+=owned[i]*GENERATORS[i].rate;
    biomass+=(ps*m+cps*clickM()); t+=1;
    let b=true; while(b){ b=false;
      for(let i=0;i<UPS.length;i++) if(!ups[i]&&biomass>=UPS[i].cost){ups[i]=true;biomass-=UPS[i].cost;
        if(!ev['upg1']) ev['upg1']=t; }
      let best=-1,pb=Infinity; for(let i=0;i<NG;i++){ const c=cost(i); if(c>biomass)continue; const p=c/(GENERATORS[i].rate*m); if(p<pb){pb=p;best=i;} }
      if(best>=0){ biomass-=cost(best); owned[best]++; b=true; if(!ev['gen'+best])ev['gen'+best]=t; } }
    if(!ev.canPrestige && Math.floor(Math.sqrt(biomass/GAIA_DIV))>=1) ev.canPrestige=t;
  }
  return { ev, biomassAt1h:biomass, gensAt1h:owned.filter(o=>o>0).length };
}

console.log('========== ONBOARDING (1 jam pertama, tanpa prestige) ==========');
for(const cps of [1,2,4]){
  const o=onboarding(cps);
  console.log(`\ncps=${cps} klik/dtk:`);
  console.log(`  Spora pertama   : ${o.ev.gen0!=null?dur(o.ev.gen0):'—'}`);
  console.log(`  Upgrade pertama : ${o.ev.upg1!=null?dur(o.ev.upg1):'—'}`);
  console.log(`  Lumut(gen2)     : ${o.ev.gen1!=null?dur(o.ev.gen1):'—'}`);
  console.log(`  Bisa prestige   : ${o.ev.canPrestige!=null?dur(o.ev.canPrestige):'>1jam'}`);
  console.log(`  Generator dibuka : ${o.gensAt1h}/20 dalam 1 jam`);
}

console.log('\n========== TIMELINE LENGKAP (pemain aktif) ==========');
for(const cps of [1.5, 0.4]){
  const r=simulate(cps, 90);
  console.log(`\n### cps=${cps} ###`);
  console.log(`  Planet pertama    : ${r.M.planet1!=null?dur(r.M.planet1):'—'}`);
  console.log(`  Buka GALAKSI(g1000): ${r.M.galUnlock!=null?dur(r.M.galUnlock):'—'}`);
  console.log(`  Galaksi pertama   : ${r.M.gal1!=null?dur(r.M.gal1):'—'}`);
  console.log(`  Buka SEMESTA(b300): ${r.M.uniUnlock!=null?dur(r.M.uniUnlock):'—'}`);
  console.log(`  Semesta pertama   : ${r.M.uni1!=null?dur(r.M.uni1):'—'}`);
  console.log(`  Semua 20 generator: ${r.M.allGen!=null?dur(r.M.allGen):'TAK TERCAPAI'}`);
  console.log(`  -- setelah ${dur(r.t)} --  G/B/S: ${fmt(r.gaia)}/${fmt(r.bintang)}/${fmt(r.sing)} | galaksi:${r.galaxies} semesta:${r.universes}`);
  // pace unlock generator (jam ke berapa tiap tier pertama dibeli, kumulatif dari awal sesi)
  console.log('  Unlock generator (waktu kumulatif aktif):');
  let line='   '; GENERATORS.forEach((g,i)=>{ if(r.genUnlock[i]!=null) line+=`${i+1}:${dur(r.genUnlock[i])} `; });
  console.log(line);
}
