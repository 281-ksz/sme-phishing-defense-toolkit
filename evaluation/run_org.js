const {SPDT}=require('./harness2.js'); const R=SPDT.rules;
const scenarios = {
 'S1 Small internal organization': {size:'micro',model:'onsite',profile:'internal',unknown:'rare',attachments:'rare',payments:'no',roles:[],criticality:'low',mfa:'none',domainauth:'unknown',filtering:'none',reporting:'none',incident:'none',training:'none',capacity:'H0',finance:'F0'},
 'S2 Accounting firm': {size:'small',model:'onsite',profile:'partners',unknown:'weekly',attachments:'core',payments:'often',roles:['finance','management'],criticality:'high',mfa:'some',domainauth:'spf',filtering:'default',reporting:'informal',incident:'informal',training:'none',capacity:'H1',finance:'F1'},
 'S3 Outsourcing company': {size:'medium',model:'hybrid',profile:'outsourcing',unknown:'weekly',attachments:'regular',payments:'sometimes',roles:['itadmin','sales'],criticality:'medium',mfa:'all',domainauth:'monitor',filtering:'managed',reporting:'defined',incident:'informal',training:'adhoc',capacity:'H2',finance:'F2'},
 'S4 Recruitment agency': {size:'small',model:'hybrid',profile:'clients',unknown:'daily',attachments:'core',payments:'sometimes',roles:['hr','sales'],criticality:'medium',mfa:'some',domainauth:'spf',filtering:'default',reporting:'informal',incident:'informal',training:'none',capacity:'H1',finance:'F1'},
 'S5 E-commerce company': {size:'medium',model:'hybrid',profile:'clients',unknown:'daily',attachments:'regular',payments:'often',roles:['finance','sales','itadmin'],criticality:'high',mfa:'all',domainauth:'enforce',filtering:'managed',reporting:'defined',incident:'written',training:'adhoc',capacity:'H2',finance:'F2'},
 'S6 Small technology company': {size:'small',model:'remote',profile:'partners',unknown:'weekly',attachments:'regular',payments:'sometimes',roles:['itadmin'],criticality:'medium',mfa:'resistant',domainauth:'enforce',filtering:'managed',reporting:'defined',incident:'written',training:'regular',capacity:'H3',finance:'F3'}
};
const out=[];
for (const [name,a] of Object.entries(scenarios)) {
  const p = R.buildProfile(a);
  const plan = R.buildPlan(p);
  const ids = h => (plan[h]||[]).map(x=>x.id);
  out.push({name, exposure:p.exposure, maturity:p.maturity+' '+p.maturityPoints+'/'+p.maturityMax, criticality:p.criticality,
            cap:p.capacity, fin:p.finance, level:p.level,
            first:ids('first').length, next:ids('next').length, extra:ids('extra').length, deferred:(plan.deferred||[]).length});
  console.log('### '+name);
  console.log('  exposure=',p.exposure,' maturity=',p.maturity,'('+p.maturityPoints+'/'+p.maturityMax+') criticality=',p.criticality,' capacity=',p.capacity,' finance=',p.finance,' level=',p.level);
  console.log('  first  :', ids('first').join(', '));
  console.log('  next   :', ids('next').join(', '));
  console.log('  extra  :', ids('extra').join(', '));
  console.log('  deferred:', (plan.deferred||[]).map(x=>x.id+'('+(x.requirement||'')+')').join(', '));
  console.log('  total recommendations:', ids('first').length+ids('next').length+ids('extra').length);
  console.log('');
}
console.table(out);
