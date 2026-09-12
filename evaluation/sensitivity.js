const {SPDT}=require('./harness2.js'); const R=SPDT.rules;
const base = {size:'small',model:'onsite',profile:'partners',unknown:'weekly',attachments:'regular',payments:'sometimes',
  roles:['finance'],criticality:'medium',mfa:'some',domainauth:'spf',filtering:'default',reporting:'informal',
  incident:'informal',training:'adhoc',capacity:'H1',finance:'F1'};
function plan(a){const p=R.buildProfile(a);const pl=R.buildPlan(p);
  return {p, ids:new Set([].concat(pl.first||[],pl.next||[],pl.extra||[]).map(x=>x.id)), def:new Set((pl.deferred||[]).map(x=>x.id))};}
const b=plan(base);
console.log('BASELINE: exposure='+b.p.exposure+' maturity='+b.p.maturity+'('+b.p.maturityPoints+') criticality='+b.p.criticality+' level='+b.p.level+' n='+b.ids.size);
console.log('');
const rows=[];
for (const q of R.QUESTIONS) {
  for (const o of q.options) {
    const a=JSON.parse(JSON.stringify(base));
    if (q.type==='multi') { a[q.id]=[o.value]; } else { a[q.id]=o.value; }
    if (JSON.stringify(a[q.id])===JSON.stringify(base[q.id])) continue;
    const v=plan(a);
    const added=[...v.ids].filter(x=>!b.ids.has(x));
    const removed=[...b.ids].filter(x=>!v.ids.has(x));
    const dimChange=[];
    ['exposure','maturity','criticality','level','capacity','finance'].forEach(d=>{if(v.p[d]!==b.p[d])dimChange.push(d+':'+b.p[d]+'->'+v.p[d]);});
    rows.push({question:q.id, answer:String(o.value), dims:dimChange.join(' '), added:added.length, removed:removed.length,
      n:v.ids.size, deferred:v.def.size, delta:added.length+removed.length});
  }
}
console.table(rows);
const changed=rows.filter(r=>r.delta>0).length;
console.log('answer variations tested:',rows.length,'| variations changing the recommendation set:',changed,
            '('+(100*changed/rows.length).toFixed(0)+'%)',
            '| variations changing at least one profile dimension:',rows.filter(r=>r.dims).length);
