/* Изпитателна среда за SME Phishing Defense Toolkit.
 *
 * Зарежда програмните модули на приложението БЕЗ каквато и да е промяна в тях
 * и ги изпълнява извън браузър, в изолиран контекст на Node.js (модул vm).
 * Заместващият обект предоставя единствено пространството от имена, което
 * модулите очакват. Затова получените резултати се отнасят към същия код,
 * който се изпълнява в браузъра.
 *
 * Изисква Node.js 22 или по-нова версия.
 *
 * Пътят към assets/js се определя в следния ред:
 *   1. променлива на средата SPDT_JS
 *   2. автоматично търсене нагоре по дървото от текущата директория
 * Ръчна настройка не е необходима, ако корпусът стои в хранилището или до него.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const MODULES = ['eml-analyzer.js', 'domain-check.js', 'rules.js'];

function isToolkitDir(dir) {
  return MODULES.every(function (f) {
    return fs.existsSync(path.join(dir, f));
  });
}

function resolveBase() {
  if (process.env.SPDT_JS) {
    const explicit = path.resolve(process.env.SPDT_JS);
    if (!isToolkitDir(explicit)) {
      throw new Error(
        'SPDT_JS сочи към ' + explicit + ', но там липсват модулите на toolkit-а.'
      );
    }
    return explicit;
  }

  const roots = [__dirname, process.cwd()];
  for (const root of roots) {
    let dir = root;
    for (let up = 0; up < 6; up++) {
      const candidates = [
        path.join(dir, 'assets', 'js'),
        path.join(dir, 'sme-phishing-defense-toolkit', 'assets', 'js'),
        path.join(dir, 'toolkit', 'sme-phishing-defense-toolkit', 'assets', 'js')
      ];
      for (const c of candidates) {
        if (isToolkitDir(c)) { return c; }
      }
      const parent = path.dirname(dir);
      if (parent === dir) { break; }
      dir = parent;
    }
  }

  throw new Error(
    'Не са намерени модулите на toolkit-а (' + MODULES.join(', ') + ').\n' +
    'Задайте пътя изрично, например:\n' +
    '  SPDT_JS=/път/до/sme-phishing-defense-toolkit/assets/js node run_eml.js'
  );
}

const BASE = resolveBase();

// Минимален заместващ обект за средата на браузъра. Съдържа само това, което
// модулите ползват. Няма DOM, няма fetch, няма хранилище.
const sandbox = {
  window: {},
  console: console,
  TextDecoder: TextDecoder,
  TextEncoder: TextEncoder,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Promise: Promise
};
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

for (const f of MODULES) {
  const file = path.join(BASE, f);
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: f });
}

if (!sandbox.window.SPDT) {
  throw new Error('Модулите се заредиха, но window.SPDT не е дефиниран.');
}

module.exports = { SPDT: sandbox.window.SPDT, BASE: BASE };
