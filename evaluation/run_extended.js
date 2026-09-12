/* Етап А2. Разширяване на корпуса и измерване на достижимостта.
 *
 * Изпълнява документирания и разширения корпус и установява кои от
 * индикаторите в таблицата с тегла се задействат поне веднъж.
 *
 * Възпроизвежда числата за покритие, посочени в README и в раздел 3.11.
 */

const fs = require('fs');
const path = require('path');
const { SPDT, BASE } = require('./harness2.js');

const DIRS = {
  'документирани (A1-A13)': path.join(__dirname, 'fixtures-documented'),
  'разширени (Б1-Б18)':     path.join(__dirname, 'fixtures-extended')
};

const ALL = Object.keys(SPDT.eml.WEIGHTS);

console.log('Модули на toolkit-а:', BASE);
console.log('Node.js            :', process.version);
console.log('Индикатори в таблицата с тегла:', ALL.length);
console.log('');

const bySet = {};
const rows = [];

for (const [label, dir] of Object.entries(DIRS)) {
  if (!fs.existsSync(dir)) {
    console.log('ПРОПУСНАТА директория:', dir);
    bySet[label] = new Set();
    continue;
  }
  const hit = new Set();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.eml')).sort();
  for (const f of files) {
    const bytes = new Uint8Array(fs.readFileSync(path.join(dir, f)));
    const r = SPDT.eml.analyze(SPDT.eml.fromBytes(bytes));
    const ids = r.indicators.map(i => i.id).sort();
    ids.forEach(i => hit.add(i));
    rows.push({
      набор: label,
      файл: f,
      сума: r.score,
      категория: r.verdict,
      индикатори: ids.join(', ') || '(няма)'
    });
  }
  bySet[label] = hit;
}

console.table(rows);

const documented = bySet['документирани (A1-A13)'] || new Set();
const union = new Set([...Object.values(bySet).flatMap(s => [...s])]);
const uncovered = ALL.filter(i => !union.has(i));

const pct = s => (100 * s.size / ALL.length).toFixed(1) + ' %';

console.log('');
console.log('Покритие на индикаторите');
console.log('='.repeat(52));
console.log('  само документираните :', documented.size + '/' + ALL.length, pct(documented));
console.log('  с разширения корпус  :', union.size + '/' + ALL.length, pct(union));
console.log('  недостигнати         :', uncovered.length ? uncovered.join(', ') : 'няма');

if (uncovered.includes('from_mixed_script')) {
  console.log('');
  console.log('Бележка за from_mixed_script (случай Б17, e30_from_mixed_script.eml):');
  console.log('  Заглавни полета със сурово 8-битово UTF-8 съдържание (RFC 6531) не се');
  console.log('  декодират до Unicode; декодира се само пътят през RFC 2047. Засегнати са');
  console.log('  показваното изписвано име, темата и този индикатор. Тялото на съобщението');
  console.log('  НЕ е засегнато. Виж e31_raw_utf8_header.eml.');
}
