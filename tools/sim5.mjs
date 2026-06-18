// Sim v5 — FULL economy: generators + upgrades + managers + milestones + planet journey + 3-layer prestige.
// Mengukur pacing waktu-AKTIF. Bandingkan config SAAT INI vs usulan tuning.

const GENS=[
  [15,0.1],[120,1],[1300,8],[14000,47],[160000,260],[1900000,1400],[25000000,7800],[4e8,44000],
  [6.5e9,260000],[1e11,1.6e6],[1.3e12,9e6],[1.7e13,5e7],[2.2e14,2.8e8],[2.9e15,1.6e9],[3.8e16,9e9],
  [5e17,5e10],[6.5e18,2.8e11],[8.5e19,1.6e12],[1.1e21,9e12],[1.5e22,5e13]
];
const UPS=[[120,'c',2],[6000,'c',3],[9e5,'c',4],[2500,'a',2],[9e4,'a',2],[3.5e6,'a',3],[1.8e8,'a',3],[1.2e10,'a',3]];
const NG=GENS.length;
const MILES=[10,25,50,100,150,200,300,400,500,750,1000];
function mileCount(n){let c=0;for(const m of MILES){if(n>=m)c++;}if(n>1000)c+=Math.floor((n-1000)/500);return c;}

function fmt(n){ if(!isFinite(n))return'∞'; if(n<1000)return n.toFixed(0);
  const u=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];let t=Math.floor(Math.log10(n)/3);
  if(t>=u.length)return n.toExponential(2);return (n/10**(t*3)).toFixed(2)+u[t]; }
function dur(s){ if(s<90)return s.toFixed(0)+'d'; const m=s/60; if(m<90)return m.toFixed(0)+'m';
  const h=m/60; if(h<48)return h.toFixed(1)+'jam'; return (h/24).toFixed(1)+'hari'; }

function sim(C, cps, maxDays){
  const G=C.growth;
  const owned=new Array(NG).fill(0), mgr=new Array(NG).fill(0); let ups=new Array(UPS.length).fill(false);
  let biomass=0, run=0, bestRun=0, lifetime=0, gaia=0, bintang=0, sing=0, planet=0;
  let t=0; const maxT=maxDays*86400; const M={}; let planets=0,gx=0,un=0; const gU=new Array(NG).fill(null);

  const planetMul=()=>Math.pow(C.PLANET_B, planet);
  const allMult=()=>{ let m=1; for(let i=0;i<UPS.length;i++) if(UPS[i][1]==='a'&&ups[i]) m*=UPS[i][2];
    return m*(1+gaia*C.GAIA_B)*(1+bintang*C.BIN_B)*(1+sing*C.SING_B)*planetMul(); };
  const clickM=m=>{ let k=1; for(let i=0;i<UPS.length;i++) if(UPS[i][1]==='c'&&ups[i]) k*=UPS[i][2]; return k*m; };
  const effRate=i=>GENS[i][1]*Math.pow(2,mileCount(owned[i]))*(1+mgr[i]);
  const psBase=()=>{ let s=0; for(let i=0;i<NG;i++) s+=owned[i]*effRate(i); return s; };
  const cost=i=>GENS[i][0]*G**owned[i];
  const mgrCost=i=>GENS[i][0]*40*Math.pow(7,mgr[i]);

  function buyAll(){
    for(let i=0;i<UPS.length;i++) if(!ups[i]&&biomass>=UPS[i][0]){ups[i]=true;biomass-=UPS[i][0];}
    for(let i=0;i<NG;i++){ if(owned[i]>=10&&mgr[i]<1&&biomass>=mgrCost(i)){biomass-=mgrCost(i);mgr[i]=1;}
      else if(owned[i]>=50&&mgr[i]<2&&biomass>=mgrCost(i)){biomass-=mgrCost(i);mgr[i]=2;} }
    for(let it=0;it<60;it++){ const m=allMult(); let best=-1,pb=Infinity;
      for(let i=0;i<NG;i++){ const c=cost(i); if(c>biomass)continue; const p=c/(effRate(i)*m); if(p<pb){pb=p;best=i;} }
      if(best<0)break; const base=GENS[best][0]*G**owned[best];
      let q=Math.floor(Math.log((biomass*(G-1))/base+1)/Math.log(G)); if(q<1)q=1; q=Math.min(q,25);
      const tc=base*(G**q-1)/(G-1); if(tc>biomass){biomass-=base;owned[best]++;} else {biomass-=tc;owned[best]+=q;}
      if(gU[best]===null) gU[best]=t; }
  }
  while(t<maxT){
    const m=allMult(); const inc=(psBase()*m+cps*clickM(m))*Math.max(1,Math.min(3600,t/1500));
    const dt=Math.max(1,Math.min(3600,t/1500)); biomass+=psBase()*m*dt+cps*clickM(m)*dt; run+=psBase()*m*dt; lifetime+=psBase()*m*dt; t+=dt;
    if(run>bestRun)bestRun=run;
    buyAll();
    // planet journey (auto-travel saat lifetime cukup)
    while(planet+1<C.GOALS.length && lifetime>=C.GOALS[planet+1]){ planet++; if(!M['p'+planet])M['p'+planet]=t; }
    if(!M.allGen && owned.every(o=>o>0)) M.allGen=t;
    if(!M.galU && gaia>=C.GAL_REQ) M.galU=t;
    if(!M.uniU && bintang>=C.UNI_REQ) M.uniU=t;
    if(bintang>=C.UNI_REQ){ const g=Math.floor(Math.sqrt(bintang/C.SING_DIV))-sing;
      if(g>=Math.max(1,Math.ceil(sing*0.5))){ sing+=g;un++; if(!M.uni1)M.uni1=t; bintang=0;gaia=0;bestRun=0;run=0;biomass=0;owned.fill(0);ups.fill(false);mgr.fill(0); continue; } }
    if(gaia>=C.BIN_DIV){ const g=Math.floor(Math.sqrt(gaia/C.BIN_DIV))-bintang;
      if(g>=Math.max(1,Math.ceil(bintang*0.5))){ bintang+=g;gx++; if(!M.gal1)M.gal1=t; gaia=0;bestRun=0;run=0;biomass=0;owned.fill(0);ups.fill(false);mgr.fill(0); continue; } }
    { const g=Math.floor(Math.sqrt(bestRun/C.GAIA_DIV))-gaia;
      if(g>=Math.max(1,Math.ceil(gaia*0.5))){ gaia+=g;planets++; if(!M.planet1)M.planet1=t; run=0;biomass=0;owned.fill(0);ups.fill(false);mgr.fill(0); continue; } }
  }
  return {t,gaia,bintang,sing,planet,planets,gx,un,M,gU,lifetime};
}

function report(name,C,cps,maxDays){
  const r=sim(C,cps,maxDays); const m=r.M;
  console.log(`\n### ${name} | cps=${cps} | growth=${C.growth} GAIA_DIV=${fmt(C.GAIA_DIV)} PLANET_B=${C.PLANET_B} ###`);
  const row=(k,v)=>console.log(`  ${k.padEnd(24)}: ${v}`);
  row('Planet prestige pertama', m.planet1!=null?dur(m.planet1):'—');
  row('Semua 20 generator', m.allGen!=null?dur(m.allGen):'TAK TERCAPAI');
  row('Galaksi pertama', m.gal1!=null?dur(m.gal1):'TAK ('+maxDays+'h)');
  row('Semesta pertama', m.uni1!=null?dur(m.uni1):'TAK ('+maxDays+'h)');
  row('Jelajah 10 planet', m['p9']!=null?dur(m['p9']):'belum (planet idx '+r.planet+')');
  console.log(`  -- setelah ${dur(r.t)} aktif: planet#${r.planet} | G/B/S ${fmt(r.gaia)}/${fmt(r.bintang)}/${fmt(r.sing)} | galaksi ${r.gx} semesta ${r.un}`);
}

const CUR={ growth:1.18, GAIA_DIV:1e5, GAIA_B:0.05, GAL_REQ:250, BIN_DIV:250, BIN_B:2,
  UNI_REQ:300, SING_DIV:300, SING_B:12, PLANET_B:1.4,
  GOALS:[0,5e3,5e5,5e7,5e9,5e11,5e13,5e15,5e17,5e19] };

console.log('========== KONDISI SAAT INI (semua sistem aktif) ==========');
report('SAAT INI (aktif)', CUR, 1.5, 120);

const T1={ growth:1.20, GAIA_DIV:2e5, GAIA_B:0.04, GAL_REQ:1000, BIN_DIV:1000, BIN_B:1.5,
  UNI_REQ:1000, SING_DIV:1000, SING_B:8, PLANET_B:1.25,
  GOALS:[0,3e4,3e6,3e8,3e10,3e12,3e15,3e18,3e22,3e26] };
const T2={ growth:1.22, GAIA_DIV:3e5, GAIA_B:0.035, GAL_REQ:1500, BIN_DIV:1500, BIN_B:1.4,
  UNI_REQ:1500, SING_DIV:1500, SING_B:6, PLANET_B:1.22,
  GOALS:[0,5e4,1e7,1e9,1e12,1e15,1e18,1e22,1e27,1e32] };
const T3={ growth:1.25, GAIA_DIV:5e5, GAIA_B:0.03, GAL_REQ:2500, BIN_DIV:2500, BIN_B:1.3,
  UNI_REQ:2000, SING_DIV:2000, SING_B:5, PLANET_B:1.2,
  GOALS:[0,1e5,5e7,5e9,5e12,5e16,5e20,5e24,5e29,5e35] };

console.log('\n========== KANDIDAT TUNING (pemain aktif cps=1.5, 120 hari) ==========');
report('T1 (sedang)', T1, 1.5, 120);
report('T2 (lambat)', T2, 1.5, 120);
report('T3 (sangat lambat)', T3, 1.5, 120);

const FINAL={ growth:1.23, GAIA_DIV:4e5, GAIA_B:0.035, GAL_REQ:2000, BIN_DIV:2000, BIN_B:1.3,
  UNI_REQ:2500, SING_DIV:2500, SING_B:5, PLANET_B:1.2,
  GOALS:[0,1e5,5e7,5e9,5e12,5e16,5e20,5e25,5e31,5e38] };
console.log('\n========== FINAL PILIHAN ==========');
report('FINAL (aktif)', FINAL, 1.5, 120);
report('FINAL (kasual)', FINAL, 0.4, 120);
