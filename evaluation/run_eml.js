/* Етап А1. Възпроизвеждане на документираните случаи.
 *
 * Изпълнява тринадесетте тестови случая от docs/TESTING.md и сравнява
 * установените индикатори, изчислената сума и определената категория с
 * очакваните стойности.
 *
 * Изход: код 0 при пълно съвпадение, код 1 при поне едно разминаване.
 */

const fs = require('fs');
const path = require('path');
const { SPDT, BASE } = require('./harness2.js');

const DIR = path.join(__dirname, 'fixtures-documented');

const expected = {
 'c01_clean.eml':      {ind:[], score:0, verdict:'low'},
 'c02_dmarc_fail.eml': {ind:['dmarc_fail','spf_fail'], score:7, verdict:'high'},
 'c03_replyto.eml':    {ind:['replyto_mismatch'], score:3, verdict:'moderate'},
 'c04_returnpath.eml': {ind:['returnpath_mismatch'], score:1, verdict:'low'},
 'c05_urls.eml':       {ind:['url_punycode','url_ip_host','url_shortener'], score:7, verdict:'high'},
 'c06_html.eml':       {ind:['html_form','url_text_mismatch','url_redirect_param'], score:9, verdict:'high'},
 'c07_userinfo.eml':   {ind:['url_userinfo'], score:3, verdict:'moderate'},
 'c08_malformed_auth.eml':{ind:['auth_malformed'], score:1, verdict:'low'},
 'c09_minimal.eml':    {ind:['auth_absent'], score:1, verdict:'insufficient'},
 'c10_manyhops.eml':   {ind:['received_many'], score:1, verdict:'low'},
 'c11_attachments.eml':{ind:['att_executable','att_double_ext','att_macro'], score:11, verdict:'high'},
 'c12_displayname.eml':{ind:['display_address_mismatch','dkim_absent'], score:4, verdict:'moderate'},
 'c13_cp1251.eml':     {ind:['auth_absent'], score:1, verdict:'low'}
};

console.log('Модули на toolkit-а:', BASE);
console.log('Фикстъри            :', DIR);
console.log('Node.js             :', process.version);
console.log('');

let pass = 0, fail = 0, missing = 0;
const rows = [];

for (const f of Object.keys(expected)) {
  const file = path.join(DIR, f);
  if (!fs.existsSync(file)) {
    missing++;
    rows.push({ file: f, score: '-', verdict: 'ЛИПСВА ФАЙЛ', ok: 'FAIL' });
    continue;
  }
  const bytes = new Uint8Array(fs.readFileSync(file));
  const msg = SPDT.eml.fromBytes(bytes);
  const r = SPDT.eml.analyze(msg);
  const got = r.indicators.map(i => i.id).sort();
  const exp = expected[f].ind.slice().sort();
  const ok = r.score === expected[f].score &&
             r.verdict === expected[f].verdict &&
             JSON.stringify(got) === JSON.stringify(exp);
  ok ? pass++ : fail++;
  rows.push({
    file: f,
    score: r.score + '/' + expected[f].score,
    verdict: r.verdict + '/' + expected[f].verdict,
    ok: ok ? 'PASS' : 'FAIL',
    _got: got.join(','), _exp: exp.join(',')
  });
}

console.table(rows.map(r => ({ file: r.file, score: r.score, verdict: r.verdict, ok: r.ok })));

rows.filter(r => r.ok === 'FAIL' && r._got !== undefined).forEach(r => {
  console.log('РАЗМИНАВАНЕ', r.file);
  console.log('  установени:', r._got);
  console.log('  очаквани  :', r._exp);
});

console.log('');
console.log('PASS', pass, 'FAIL', fail, missing ? '(липсващи файлове: ' + missing + ')' : '');

process.exitCode = fail === 0 ? 0 : 1;
