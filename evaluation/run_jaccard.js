/* Различие между сценариите по мярката на Jaccard.
 *
 * Изчислява доколко се препокриват наборите препоръки на шестте организационни
 * сценария. За всяка двойка се дели броят на общите мерки на броя на всички
 * различни мерки в двата набора. Стойност 1 означава напълно еднакви набори,
 * стойност 0 означава липса на обща мярка.
 *
 * Произвежда числото, посочено в раздел 3.11 на тезата.
 */

const path = require('path');
const { SPDT, BASE } = require('./harness2.js');
const scenarios = require('./scenarios.json');

const R = SPDT.rules;
const names = Object.keys(scenarios);

console.log('Модули на toolkit-а:', BASE);
console.log('Node.js            :', process.version);
console.log('Сценарии           :', names.length);
console.log('');

const sets = {};
for (const n of names) {
  const profile = R.buildProfile(scenarios[n]);
  const plan = R.buildPlan(profile);
  sets[n] = new Set(
    [].concat(plan.first || [], plan.next || [], plan.extra || []).map(x => x.id)
  );
}

console.log('Брой мерки по сценарий');
console.log('='.repeat(34));
for (const n of names) {
  console.log('  %s  %d мерки', n, sets[n].size);
}

const rows = [];
let sum = 0;
let pairs = 0;

for (let i = 0; i < names.length; i++) {
  for (let j = i + 1; j < names.length; j++) {
    const a = sets[names[i]];
    const b = sets[names[j]];
    const common = [...a].filter(x => b.has(x)).length;
    const union = new Set([...a, ...b]).size;
    const jaccard = union ? common / union : 0;
    sum += jaccard;
    pairs++;
    rows.push({
      двойка: names[i] + ' / ' + names[j],
      общи: common,
      всички: union,
      Jaccard: Number(jaccard.toFixed(3))
    });
  }
}

console.log('');
console.table(rows);

const mean = sum / pairs;
const min = Math.min(...rows.map(r => r.Jaccard));
const max = Math.max(...rows.map(r => r.Jaccard));

console.log('');
console.log('Обобщение');
console.log('='.repeat(34));
console.log('  двойки сценарии    :', pairs);
console.log('  средна стойност    :', mean.toFixed(4), '(закръглено', mean.toFixed(3) + ')');
console.log('  най-малка стойност :', min.toFixed(3));
console.log('  най-голяма стойност:', max.toFixed(3));
console.log('');
console.log('Средната стойност под 0,5 означава, че по-малко от половината мерки');
console.log('са общи за произволна двойка сценарии. Наборите препоръки се различават');
console.log('съществено, тоест профилирането води до различен резултат, а не до един');
console.log('и същ списък с разместен ред.');
