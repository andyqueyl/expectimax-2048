const { analyze } = require('./engine.js');
function slide(line){ const v=line.filter(x=>x); const out=[]; let sc=0; for(let i=0;i<v.length;i++){ if(v[i]===v[i+1]){out.push(v[i]+1); sc+=1<<(v[i]+1); i++;} else out.push(v[i]); } while(out.length<4) out.push(0); return [out,sc]; }
function move(g,dir){ const n=g.slice(); let sc=0;
  for(let k=0;k<4;k++){ let idx;
    if(dir===3) idx=[k*4,k*4+1,k*4+2,k*4+3]; else if(dir===1) idx=[k*4+3,k*4+2,k*4+1,k*4];
    else if(dir===0) idx=[k,k+4,k+8,k+12]; else idx=[k+12,k+8,k+4,k];
    const [o,s]=slide(idx.map(i=>g[i])); idx.forEach((i,j)=>n[i]=o[j]); sc+=s; }
  return [n,sc]; }
function spawn(g){ const e=[]; g.forEach((v,i)=>{if(!v)e.push(i)}); g[e[Math.random()*e.length|0]]=Math.random()<0.9?1:2; }
const maxDepth=+process.argv[2]||4, games=+process.argv[3]||5;
const results=[];
for(let gi=0;gi<games;gi++){
  let g=new Array(16).fill(0); spawn(g); spawn(g); let score=0, moves=0, ms=0, slow=0;
  while(true){ const r=analyze(g,maxDepth); ms+=r.ms; slow=Math.max(slow,r.ms); if(r.best<0) break;
    const [n,s]=move(g,r.best); // cross-check engine legality
    if(n.every((v,i)=>v===g[i])) { console.log('ENGINE/GAME MISMATCH'); break; }
    g=n; score+=s; moves++; spawn(g); }
  const mx=1<<Math.max(...g); results.push(mx);
  console.log(`game ${gi}: score ${score} max ${mx} moves ${moves} avg ${(ms/moves).toFixed(1)}ms worst ${slow}ms`);
}
for(const t of [2048,4096,8192,16384]) console.log(t, (results.filter(x=>x>=t).length/games*100).toFixed(0)+'%');
