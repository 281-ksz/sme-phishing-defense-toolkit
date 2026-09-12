const {SPDT}=require('./harness2.js'); const D=SPDT.domain;
console.log('=== SPF ===');
const spfCases=[
 ['', 'not present / missing'],
 ['v=spf1 include:_spf.google.com ~all','valid, ~, 1 lookup'],
 ['v=spf1 ip4:198.51.100.0/24 -all','valid, -, 0 lookups'],
 ['v=spf1 +all','valid, issue spf_plus_all'],
 ['v=spf1 ptr:example.com a mx','3 lookups, spf_ptr + spf_no_all'],
 ['v=spf1 '+Array.from({length:11},(_,i)=>'include:s'+i+'.example.com').join(' ')+' ~all','11 lookups, spf_lookup_limit'],
 ['include:foo ~all','invalid, spf_no_version'],
 ['"v=spf1 include:_spf.exa" "mple.com -all"','valid, -, 1 lookup (joined)']
];
spfCases.forEach(([rec,exp],i)=>{
  const r=D.parseSpf(D.normalizeTxt? D.normalizeTxt(rec):rec);
  console.log(` ${i+1}. present=${r.present} valid=${r.valid} term=${r.terminalQualifier} lookups=${r.lookupTerms} issues=[${r.issues}] mechs=${(r.includes||[]).join('|')}  << ${exp}`);
});
console.log('\n=== DMARC ===');
const dmCases=[
 ['',''],
 ['v=DMARC1; p=none; rua=mailto:d@example.com',''],
 ['v=DMARC1; p=quarantine; rua=mailto:d@example.com; adkim=s; aspf=s',''],
 ['v=DMARC1; p=reject; sp=reject; np=reject; rua=mailto:d@example.com; fo=1',''],
 ['v=DMARC1; p=reject; t=y; rua=mailto:d@example.com',''],
 ['v=DMARC1; p=quarantine; pct=50; rf=afrf; ri=86400; rua=mailto:d@example.com',''],
 ['v=DMARC1; rua=mailto:d@example.com',''],
 ['v=DMARC1; p=reject; rua=http://example.com/x',''],
 ['p=reject','']
];
dmCases.forEach(([rec],i)=>{
  const r=D.parseDmarc(rec);
  console.log(` ${i+1}. present=${r.present} valid=${r.valid} p=${r.policy} eff=${r.effectivePolicy} sp=${r.subdomainPolicy} np=${r.nonExistentPolicy} t=${r.testMode} adkim=${r.adkim} aspf=${r.aspf} rua=${(r.rua||[]).length} issues=[${r.issues}] deprecated=[${r.deprecated||''}]`);
});
console.log('\n=== DKIM / MTA-STS / TLS-RPT / BIMI ===');
const b64='A'.repeat(216);
console.log(' dkim valid:', JSON.stringify(D.parseDkim('v=DKIM1; k=rsa; p='+b64)).slice(0,200));
console.log(' dkim revoked:', JSON.stringify(D.parseDkim('v=DKIM1; k=rsa; p=')));
console.log(' dkim empty:', JSON.stringify(D.parseDkim('')));
console.log(' mtasts:', JSON.stringify(D.parseMtaSts('v=STSv1; id=20260101T000000Z')));
console.log(' tlsrpt:', JSON.stringify(D.parseTlsRpt('v=TLSRPTv1; rua=mailto:tls@example.com')));
console.log(' bimi:', JSON.stringify(D.parseBimi('v=BIMI1; l=https://example.com/logo.svg')));

console.log('\n=== Posture scoring ===');
function assess(spf,dmarc,dkim,mtasts,tlsrpt,checked){
  return D.assess({domain:'example.com',
    spf:D.parseSpf(spf), dmarc:D.parseDmarc(dmarc), dkim:D.parseDkim(dkim),
    mtasts:D.parseMtaSts(mtasts), tlsrpt:D.parseTlsRpt(tlsrpt), bimi:D.parseBimi(''),
    checked:checked});
}
const full={spf:1,dmarc:1,dkim:1,mtasts:1,tlsrpt:1};
const noDkim={spf:1,dmarc:1,mtasts:1,tlsrpt:1};
const rows=[
 ['nothing configured', assess('','','','','',noDkim)],
 ['SPF ~all only', assess('v=spf1 include:a.example ~all','','','','',noDkim)],
 ['SPF ~all + DMARC p=none + rua', assess('v=spf1 include:a.example ~all','v=DMARC1; p=none; rua=mailto:d@example.com','','','',noDkim)],
 ['full strong', assess('v=spf1 ip4:198.51.100.0/24 -all','v=DMARC1; p=reject; rua=mailto:d@example.com','v=DKIM1; k=rsa; p='+b64,'v=STSv1; id=1','v=TLSRPTv1; rua=mailto:t@example.com',full)],
 ['same with t=y', assess('v=spf1 ip4:198.51.100.0/24 -all','v=DMARC1; p=reject; t=y; rua=mailto:d@example.com','v=DKIM1; k=rsa; p='+b64,'v=STSv1; id=1','v=TLSRPTv1; rua=mailto:t@example.com',full)]
];
rows.forEach(([n,r])=>console.log(` ${n}: ${r.points}/${r.max} ratio=${r.ratio.toFixed(2)} enforcing=${r.enforcing} posture=${r.posture} states=${JSON.stringify(r.states)}`));

console.log('\n=== Query plan for пример.бг ===');
const plan=D.queryPlan('пример.бг',['selector1','google']);
console.log(JSON.stringify(plan,null,1));
console.log('\n invalid input "not a domain":', JSON.stringify(D.queryPlan('not a domain',[])));
