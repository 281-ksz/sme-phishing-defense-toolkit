/* i18n.js
   Interface strings and long-form content in Bulgarian and English.
   Every entry stores both languages next to each other so a change to one
   language makes the missing translation obvious during review.
   No build step, no modules: this file defines window.SPDT.i18n. */

window.SPDT = window.SPDT || {};

(function (SPDT) {
  'use strict';

  var STR = {

    /* ---- accessibility and chrome ---- */
    'a11y.skip': { bg: 'Към основното съдържание', en: 'Skip to main content' },
    'brand.sub': { bg: 'Локален инструмент за защита от фишинг', en: 'Local phishing defense toolkit' },
    'net.local': { bg: 'Локален режим. Няма мрежова активност.', en: 'Local mode. No network activity.' },
    'net.online': { bg: 'Мрежова заявка в момента: DNS проверка.', en: 'Network request in progress: DNS lookup.' },
    'net.done': { bg: 'Мрежовата заявка приключи. Отново в локален режим.', en: 'Network request finished. Back in local mode.' },
    'nav.menu': { bg: 'Меню', en: 'Menu' },

    'nav.home': { bg: 'Начало', en: 'Home' },
    'nav.analyze': { bg: 'Анализ на имейл', en: 'Analyze email' },
    'nav.domain': { bg: 'Проверка на домейн', en: 'Check domain' },
    'nav.assess': { bg: 'Оценка на организацията', en: 'Assess organization' },
    'nav.plan': { bg: 'План за действие', en: 'Action plan' },
    'nav.checklists': { bg: 'Чеклисти', en: 'Checklists' },
    'nav.trees': { bg: 'Дървета за решение', en: 'Decision trees' },
    'nav.guide': { bg: 'Техническо ръководство', en: 'Technical guide' },
    'nav.glossary': { bg: 'Речник', en: 'Glossary' },
    'nav.privacy': { bg: 'Поверителност', en: 'Privacy' },
    'nav.sources': { bg: 'Източници', en: 'Sources' },

    /* ---- home ---- */
    'home.kicker': { bg: 'Работи офлайн. Без профил. Без изкуствен интелект.', en: 'Works offline. No account. No AI.' },
    'home.title': {
      bg: 'Три технически проверки и ясни стъпки след подозрителен имейл.',
      en: 'Three technical checks and clear steps after a suspicious message.'
    },
    'home.lede': {
      bg: 'Инструментът анализира подозрителни съобщения във вашия браузър, оценява защитата на имейл домейн и профилира организацията ви. Съдържанието на имейлите не напуска устройството.',
      en: 'The toolkit analyzes suspicious messages inside your browser, assesses the email security posture of a domain and profiles your organization. Email content does not leave the device.'
    },
    'home.cta.analyze': { bg: 'Анализирай подозрителен имейл', en: 'Analyze a suspicious email' },
    'home.cta.domain': { bg: 'Провери домейн', en: 'Check an email domain' },
    'home.cta.assess': { bg: 'Оцени организацията', en: 'Assess my organization' },
    'home.cta.incident': { bg: 'Бърз чеклист при инцидент', en: 'Open quick incident checklist' },

    /* ---- analyze ---- */
    'analyze.title': { bg: 'Анализ на имейл', en: 'Analyze email' },
    'analyze.lede': {
      bg: 'Заредете подозрително съобщение като файл .eml. Разборът се извършва изцяло в браузъра.',
      en: 'Load a suspicious message as an .eml file. Parsing happens entirely in the browser.'
    },
    'badge.local': { bg: 'Обработва се локално на това устройство', en: 'Processed locally on this device' },
    'analyze.help.summary': { bg: 'Как да получа файл .eml?', en: 'How do I get an .eml file?' },
    'analyze.drop.title': { bg: 'Пуснете файл .eml тук', en: 'Drop an .eml file here' },
    'analyze.drop.hint': { bg: 'или изберете файл от устройството. Приемат се само файлове .eml.', en: 'or choose a file from your device. Only .eml files are accepted.' },
    'analyze.drop.pick': { bg: 'Избери файл', en: 'Choose file' },
    'analyze.err.ext': {
      bg: 'Приемат се само файлове .eml. Ако имате .msg от класически Outlook, вижте указанията по-горе.',
      en: 'Only .eml files are accepted. If you have a .msg file from classic Outlook, see the instructions above.'
    },
    'analyze.err.size': { bg: 'Файлът е по-голям от 25 MB и няма да бъде обработен.', en: 'The file is larger than 25 MB and will not be processed.' },
    'analyze.err.read': { bg: 'Файлът не можа да бъде прочетен.', en: 'The file could not be read.' },
    'analyze.err.parse': { bg: 'Файлът не изглежда като съобщение по RFC 5322. Проверете дали е запазен като необработен източник.', en: 'The file does not look like an RFC 5322 message. Check that it was saved as raw source.' },
    'analyze.newfile': { bg: 'Анализирай друг файл', en: 'Analyze another file' },
    'analyze.clear': { bg: 'Изчисти резултата', en: 'Clear result' },
    'analyze.print': { bg: 'Отпечатай или запази като PDF', en: 'Print or save as PDF' },

    /* ---- verdicts ---- */
    'verdict.label': { bg: 'Техническо подозрение', en: 'Technical suspicion' },
    'verdict.high': { bg: 'Високо техническо подозрение', en: 'High technical suspicion' },
    'verdict.moderate': { bg: 'Умерено техническо подозрение', en: 'Moderate technical suspicion' },
    'verdict.low': { bg: 'Ниско техническо подозрение', en: 'Low technical suspicion' },
    'verdict.manual': { bg: 'Препоръчва се ръчна проверка', en: 'Manual verification recommended' },
    'verdict.insufficient': { bg: 'Недостатъчно данни', en: 'Insufficient evidence' },
    'verdict.caveat': {
      bg: 'Техническите индикатори не доказват намерение. Резултатът описва какво е открито във файла, не дали подателят е измамник.',
      en: 'Technical indicators cannot prove intent. The result describes what was found in the file, not whether the sender is malicious.'
    },
    'verdict.score': { bg: 'Сбор от точки', en: 'Indicator score' },
    'verdict.reasons': { bg: 'Основания', en: 'Main reasons' },
    'verdict.noreasons': { bg: 'Не са открити индикатори от списъка с проверки.', en: 'None of the checked indicators were found.' },
    'verdict.next': { bg: 'Препоръчана следваща стъпка', en: 'Recommended next step' },
    'evidence': { bg: 'Данни', en: 'Evidence' },
    'limitation': { bg: 'Ограничение', en: 'Limitation' },
    'weight': { bg: 'Тежест', en: 'Weight' },

    /* ---- analyzer detail sections ---- */
    'detail.headers': { bg: 'Заглавни полета', en: 'Header fields' },
    'detail.auth': { bg: 'Резултати от автентикация', en: 'Authentication results' },
    'detail.routing': { bg: 'Маршрут на съобщението', en: 'Message routing' },
    'detail.urls': { bg: 'Извлечени адреси', en: 'Extracted URLs' },
    'detail.attachments': { bg: 'Прикачени файлове', en: 'Attachments' },
    'detail.mime': { bg: 'Структура MIME', en: 'MIME structure' },
    'detail.raw': { bg: 'Необработени стойности на заглавните полета', en: 'Raw header values' },
    'detail.body': { bg: 'Текст на съобщението (пречистен)', en: 'Message text (sanitized)' },
    'detail.none': { bg: 'Няма', en: 'None' },
    'detail.notfound': { bg: 'Липсва', en: 'Not present' },
    'urls.count': { bg: 'Открити адреси', en: 'URLs found' },
    'urls.noopen': { bg: 'Адресите не се отварят и не се изпращат никъде. Показани са само за преглед.', en: 'URLs are never opened and never sent anywhere. They are shown for review only.' },
    'urls.col.url': { bg: 'Адрес', en: 'URL' },
    'urls.col.host': { bg: 'Хост', en: 'Host' },
    'urls.col.flags': { bg: 'Индикатори', en: 'Indicators' },
    'att.col.name': { bg: 'Име', en: 'Name' },
    'att.col.type': { bg: 'Обявен тип', en: 'Declared type' },
    'att.col.size': { bg: 'Приблизителен размер', en: 'Approximate size' },
    'att.col.flags': { bg: 'Индикатори', en: 'Indicators' },
    'att.noopen': { bg: 'Прикачените файлове не се отварят, не се разархивират и не се изпълняват.', en: 'Attachments are never opened, decompressed or executed.' },
    'routing.hops': { bg: 'Брой записи Received', en: 'Received header count' },
    'routing.note': { bg: 'Сложен маршрут сам по себе си не означава фишинг. Препращане, пощенски списъци и филтри добавят записи.', en: 'A complex route by itself does not mean phishing. Forwarding, mailing lists and filters all add entries.' },
    'auth.none': {
      bg: 'Файлът не съдържа поле Authentication-Results. Това е обичайно за съобщения, запазени преди обработка от получаващия сървър, и не е индикатор за измама само по себе си.',
      en: 'The file contains no Authentication-Results field. This is normal for messages saved before the receiving server processed them and is not by itself a sign of fraud.'
    },
    'auth.trust': {
      bg: 'Тези резултати са записани от получаващата инфраструктура. Инструментът ги разчита, но не ги преизчислява криптографски.',
      en: 'These results were recorded by the receiving infrastructure. The toolkit reads them and does not recompute them cryptographically.'
    },

    /* ---- domain ---- */
    'domain.title': { bg: 'Проверка на домейн', en: 'Check domain' },
    'domain.subtitle': { bg: 'Състояние на защитата на имейл домейн', en: 'Email Domain Security Posture' },
    'domain.lede': {
      bg: 'Оценка на състоянието на защитата на имейл домейн. Това не е пълен одит на сигурността.',
      en: 'An assessment of the email security posture of a domain. This is not a complete security audit.'
    },
    'domain.mode.title': { bg: 'Изберете режим', en: 'Choose a mode' },
    'domain.mode.privacy.title': { bg: 'Режим без мрежа', en: 'Privacy mode' },
    'domain.mode.privacy.desc': { bg: 'Поставяте DNS записите ръчно. Не се изпраща нищо навън.', en: 'You paste the DNS records manually. Nothing is sent anywhere.' },
    'domain.mode.online.title': { bg: 'Онлайн DNS проверка', en: 'Online DNS lookup' },
    'domain.mode.online.desc': { bg: 'Изпраща само име на домейн и тип запис към избран DNS резолвер.', en: 'Sends only a domain name and a record type to a chosen DNS resolver.' },
    'domain.manual.title': { bg: 'Ръчно въведени записи', en: 'Manually entered records' },
    'domain.manual.run': { bg: 'Анализирай въведените записи', en: 'Analyze the entered records' },
    'domain.field.domain': { bg: 'Домейн (по избор, само за етикет в резултата)', en: 'Domain (optional, only used as a label in the result)' },
    'domain.field.spf': { bg: 'SPF запис (TXT на домейна)', en: 'SPF record (TXT at the domain)' },
    'domain.field.dmarc': { bg: 'DMARC запис (TXT на _dmarc.домейн)', en: 'DMARC record (TXT at _dmarc.domain)' },
    'domain.field.dkim': { bg: 'DKIM запис (TXT на селектор._domainkey.домейн)', en: 'DKIM record (TXT at selector._domainkey.domain)' },
    'domain.field.mtasts': { bg: 'MTA-STS запис (TXT на _mta-sts.домейн)', en: 'MTA-STS record (TXT at _mta-sts.domain)' },
    'domain.field.tlsrpt': { bg: 'TLS-RPT запис (TXT на _smtp._tls.домейн)', en: 'TLS-RPT record (TXT at _smtp._tls.domain)' },
    'domain.field.bimi': { bg: 'BIMI запис (TXT на default._bimi.домейн)', en: 'BIMI record (TXT at default._bimi.domain)' },
    'domain.online.title': { bg: 'Онлайн проверка', en: 'Online lookup' },
    'domain.online.domain': { bg: 'Домейн за проверка', en: 'Domain to check' },
    'domain.online.selectors': { bg: 'DKIM селектори (по избор, разделени със запетая)', en: 'DKIM selectors (optional, comma separated)' },
    'domain.online.resolver': { bg: 'DNS резолвер', en: 'DNS resolver' },
    'domain.online.expand': { bg: 'Проследи включванията в SPF (изпраща допълнителни имена на домейни към резолвера)', en: 'Follow SPF includes (sends additional domain names to the resolver)' },
    'domain.online.run': { bg: 'Стартирай DNS проверката', en: 'Start the DNS lookup' },
    'domain.online.running': { bg: 'Изпълнява се DNS проверка...', en: 'Running the DNS lookup...' },
    'domain.consent.title': { bg: 'Какво напуска устройството', en: 'What leaves your device' },
    'domain.consent.willquery': { bg: 'Ще бъдат заявени:', en: 'These names will be queried:' },
    'domain.consent.whatfor': { bg: 'Под всяко име е обяснено какво проверява то.', en: 'Under each name is an explanation of what it checks.' },
    'nav.jump': { bg: 'Бърз преход', en: 'Jump to' },
    'trees.pick': { bg: 'Изберете сценарий', en: 'Choose a scenario' },
    'domain.consent.agree': { bg: 'Разбирам и стартирам проверката', en: 'I understand and want to start the lookup' },
    'domain.err.domain': { bg: 'Въведете валидно име на домейн, например example.com.', en: 'Enter a valid domain name, for example example.com.' },
    'domain.err.network': { bg: 'DNS заявката не успя. Проверете мрежовата връзка или опитайте с другия резолвер.', en: 'The DNS lookup failed. Check your network connection or try the other resolver.' },
    'domain.err.empty': { bg: 'Въведете поне един запис за анализ.', en: 'Enter at least one record to analyze.' },
    'domain.selector.note': {
      bg: 'Без селектор DKIM не може да бъде проверен. Селекторът се вижда в полето DKIM-Signature на реален имейл от домейна.',
      en: 'Without a selector DKIM cannot be checked. The selector appears in the DKIM-Signature field of a real message from the domain.'
    },
    'domain.selector.fromeml': { bg: 'Използвай селектора от заредения файл .eml', en: 'Use the selector from the loaded .eml file' },
    'domain.result.title': { bg: 'Състояние на защитата', en: 'Security posture' },
    'domain.result.control': { bg: 'Механизъм', en: 'Control' },
    'domain.result.state': { bg: 'Състояние', en: 'State' },
    'domain.result.finding': { bg: 'Констатация', en: 'Finding' },
    'domain.result.record': { bg: 'Запис', en: 'Record' },
    'domain.posture.basic': { bg: 'Базово', en: 'Basic' },
    'domain.posture.intermediate': { bg: 'Средно', en: 'Intermediate' },
    'domain.posture.strong': { bg: 'Силно', en: 'Strong' },
    'domain.posture.points': { bg: 'точки от', en: 'points out of' },
    'domain.posture.method': { bg: 'Как се изчислява това', en: 'How this is calculated' },
    'state.configured': { bg: 'Настроен', en: 'Configured' },
    'state.partial': { bg: 'Частично настроен', en: 'Partially configured' },
    'state.missing': { bg: 'Липсва', en: 'Missing' },
    'state.invalid': { bg: 'Невалиден или съмнителен', en: 'Invalid or suspicious' },
    'state.unknown': { bg: 'Неизвестно', en: 'Unknown' },
    'state.notchecked': { bg: 'Не е проверяван', en: 'Not checked' },
    'domain.recommend': { bg: 'Препоръки за този домейн', en: 'Recommendations for this domain' },
    'domain.fromeml.title': { bg: 'Домейн от заредения имейл', en: 'Domain from the loaded email' },
    'domain.fromeml.use': { bg: 'Провери този домейн', en: 'Check this domain' },
    'domain.fromeml.note': {
      bg: 'Нищо не се проверява автоматично. Проверката започва само след като я стартирате.',
      en: 'Nothing is checked automatically. A lookup starts only when you start it.'
    },

    /* ---- assess ---- */
    'assess.title': { bg: 'Оценка на организацията', en: 'Assess organization' },
    'assess.lede': {
      bg: 'Въпросникът не пита за име, домейн, адрес или друга идентифицираща информация.',
      en: 'The questionnaire does not ask for a name, domain, address or any other identifying information.'
    },
    'assess.run': { bg: 'Изчисли профила', en: 'Calculate the profile' },
    'assess.reset': { bg: 'Изчисти отговорите', en: 'Clear the answers' },
    'assess.err.incomplete': { bg: 'Отговорете на всички въпроси, за да се изчисли профилът.', en: 'Answer every question so the profile can be calculated.' },
    'assess.result.title': { bg: 'Профил на организацията', en: 'Organizational profile' },
    'assess.result.because': { bg: 'Защо', en: 'Why' },
    'assess.result.from': { bg: 'От отговорите', en: 'From your answers' },
    'assess.result.next': { bg: 'Какво следва', en: 'What to do next' },
    'assess.result.toplan': { bg: 'Виж плана за действие', en: 'See the action plan' },
    'assess.dim.exposure': { bg: 'Комуникационна експозиция', en: 'Communication exposure' },
    'assess.dim.maturity': { bg: 'Зрялост на защитата', en: 'Security maturity' },
    'assess.dim.capacity': { bg: 'ИТ капацитет', en: 'IT capacity' },
    'assess.dim.finance': { bg: 'Финансова възможност', en: 'Financial capability' },
    'assess.dim.criticality': { bg: 'Оперативна критичност', en: 'Operational criticality' },
    'assess.dim.level': { bg: 'Препоръчано ниво на защита', en: 'Recommended protection level' },

    /* ---- plan ---- */
    'plan.title': { bg: 'План за действие', en: 'Action plan' },
    'plan.lede': {
      bg: 'Приоритизирани мерки в три хоризонта. След попълване на оценката планът се съобразява с капацитета ви.',
      en: 'Prioritized measures across three horizons. After you complete the assessment the plan adapts to your capacity.'
    },
    'plan.generic': {
      bg: 'Показан е общият план. Попълнете оценката на организацията, за да се подредят мерките според вашия капацитет и експозиция.',
      en: 'This is the general plan. Complete the organizational assessment to order the measures according to your capacity and exposure.'
    },
    'plan.tailored': { bg: 'Планът е подреден според профила ви.', en: 'The plan is ordered according to your profile.' },
    'plan.first': { bg: 'Първо', en: 'Do first' },
    'plan.next': { bg: 'Следващ етап', en: 'Next stage' },
    'plan.extra': { bg: 'Допълнителна защита', en: 'Additional protection' },
    'plan.why': { bg: 'Защо', en: 'Why' },
    'plan.benefit': { bg: 'Очакван ефект', en: 'Expected benefit' },
    'plan.complexity': { bg: 'Сложност', en: 'Complexity' },
    'plan.resource': { bg: 'Нужен ресурс', en: 'Required resource' },
    'plan.prereq': { bg: 'Предпоставки', en: 'Prerequisites' },
    'plan.breaks': { bg: 'Какво може да се счупи', en: 'What can break' },
    'plan.verify': { bg: 'Как да проверите', en: 'How to verify' },
    'complexity.low': { bg: 'Ниска', en: 'Low' },
    'complexity.medium': { bg: 'Средна', en: 'Medium' },
    'complexity.high': { bg: 'Висока', en: 'High' },
    'resource.config': { bg: 'Само настройка', en: 'Configuration only' },
    'resource.dns': { bg: 'Достъп до DNS', en: 'DNS access' },
    'resource.license': { bg: 'Лиценз или покупка', en: 'License or purchase' },
    'resource.time': { bg: 'Време на служителите', en: 'Staff time' },
    'resource.external': { bg: 'Външна услуга', en: 'External service' },

    /* ---- checklists and trees ---- */
    'checklists.title': { bg: 'Чеклисти', en: 'Checklists' },
    'checklists.lede': { bg: 'Отметките са само за текущата сесия. Нищо не се запазва.', en: 'Ticks last for this session only. Nothing is saved.' },
    'checklists.progress': { bg: 'Отметнати', en: 'Ticked' },
    'trees.title': { bg: 'Дървета за решение', en: 'Decision trees' },
    'trees.lede': { bg: 'Кратки последователности от въпроси за използване по време на инцидент.', en: 'Short question sequences for use during an incident.' },
    'trees.start': { bg: 'Започни', en: 'Start' },
    'trees.restart': { bg: 'Започни отначало', en: 'Start over' },
    'trees.back': { bg: 'Назад', en: 'Back' },
    'trees.outcome': { bg: 'Какво да направите', en: 'What to do' },

    /* ---- guide, glossary, privacy, sources ---- */
    'guide.title': { bg: 'Техническо ръководство', en: 'Technical guide' },
    'guide.lede': { bg: 'Всяка тема следва един и същ шаблон от девет въпроса.', en: 'Every topic follows the same nine question template.' },
    'guide.q1': { bg: 'Какво е това?', en: 'What is it?' },
    'guide.q2': { bg: 'Какъв проблем решава?', en: 'What problem does it solve?' },
    'guide.q3': { bg: 'Какво не решава?', en: 'What does it not solve?' },
    'guide.q4': { bg: 'На кого е нужно?', en: 'Who needs it?' },
    'guide.q5': { bg: 'Кой трябва да го настрои?', en: 'Who should configure it?' },
    'guide.q6': { bg: 'Как нетехнически човек може да провери дали го има?', en: 'How can a nontechnical person check whether it exists?' },
    'guide.q7': { bg: 'Какво може да се обърка?', en: 'What can go wrong?' },
    'guide.q8': { bg: 'Как да се въведе безопасно?', en: 'How should it be introduced safely?' },
    'guide.q9': { bg: 'Как да проверите, че работи?', en: 'How can you verify that it works?' },
    'glossary.title': { bg: 'Речник', en: 'Glossary' },
    'glossary.lede': { bg: 'Кратки определения на термините, използвани в инструмента.', en: 'Short definitions of the terms used in the toolkit.' },
    'glossary.filter': { bg: 'Филтрирай по термин', en: 'Filter by term' },
    'glossary.empty': { bg: 'Няма съвпадение.', en: 'No match.' },
    'privacy.title': { bg: 'Поверителност', en: 'Privacy' },
    'sources.title': { bg: 'Източници', en: 'Sources' },
    'sources.lede': {
      bg: 'Пълният списък с дата на последна проверка се намира в docs/SOURCES.md на хранилището.',
      en: 'The full list with the date each source was last checked is in docs/SOURCES.md in the repository.'
    },

    /* ---- footer and shared ---- */
    'footer.reset': { bg: 'Изчисти цялото състояние', en: 'Reset everything' },
    'footer.reset.note': {
      bg: 'Всички данни се пазят само в паметта на страницата. Затварянето или презареждането ги изтрива.',
      en: 'All data is held in page memory only. Closing or reloading the page erases it.'
    },
    'footer.reset.done': { bg: 'Състоянието е изчистено.', en: 'State cleared.' },
    'yes': { bg: 'Да', en: 'Yes' },
    'no': { bg: 'Не', en: 'No' },
    'unknown': { bg: 'Не знам', en: 'Not sure' },
    'more': { bg: 'Подробности', en: 'Details' },
    'copy': { bg: 'Копирай', en: 'Copy' },
    'copied': { bg: 'Копирано', en: 'Copied' }
  };

  var lang = 'bg';

  function t(key) {
    var entry = STR[key];
    if (!entry) { return key; }
    return entry[lang] || entry.en || key;
  }

  /* Pick a bilingual value out of a content object: {bg: '...', en: '...'} */
  function pick(obj) {
    if (obj === null || obj === undefined) { return ''; }
    if (typeof obj === 'string') { return obj; }
    return obj[lang] !== undefined ? obj[lang] : (obj.en || '');
  }

  SPDT.i18n = {
    strings: STR,
    content: {},
    get lang() { return lang; },
    setLang: function (next) {
      if (next !== 'bg' && next !== 'en') { return; }
      lang = next;
    },
    detect: function () {
      var nav = (typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage)) || 'bg';
      lang = String(nav).toLowerCase().indexOf('bg') === 0 ? 'bg' : 'en';
      return lang;
    },
    t: t,
    pick: pick
  };

})(window.SPDT);

/* ------------------------------------------------------------------
   Content: home, .eml export help, privacy summary, source summary.
   ------------------------------------------------------------------ */

(function (SPDT) {
  'use strict';
  var C = SPDT.i18n.content;

  C.home = [
    {
      h: { bg: 'Какво прави инструментът', en: 'What the toolkit does' },
      p: [
        { bg: 'Инструментът събира на едно място четири неща: технически анализ на подозрително съобщение, оценка на защитата на имейл домейн, самооценка на организацията и практични указания за действие.',
          en: 'The toolkit brings four things together in one place: technical analysis of a suspicious message, an assessment of a domain email security posture, an organizational self assessment and practical guidance for what to do.' },
        { bg: 'Той не решава вместо вас дали едно съобщение е измама. Той показва какви технически следи съдържа файлът и обяснява какво означава всяка от тях.',
          en: 'It does not decide for you whether a message is fraudulent. It shows which technical traces the file contains and explains what each of them means.' }
      ]
    },
    {
      h: { bg: 'За кого е', en: 'Who it is for' },
      list: [
        { bg: 'собственици и управители на малки и средни предприятия', en: 'owners and managers of small and medium enterprises' },
        { bg: 'ИТ специалисти с общ профил, които не са тесни специалисти по киберсигурност', en: 'IT generalists who do not specialize in cybersecurity' },
        { bg: 'системни администратори', en: 'system administrators' },
        { bg: 'външни ИТ доставчици и управлявани доставчици на услуги', en: 'external IT providers and managed service providers' },
        { bg: 'служители, които току-що са получили съмнително съобщение', en: 'employees who have just received a suspicious message' }
      ]
    },
    {
      h: { bg: 'Какво се проверява локално', en: 'What is checked locally' },
      list: [
        { bg: 'разбор на файла .eml: заглавни полета, структура MIME, текстови части', en: 'parsing of the .eml file: header fields, MIME structure, text parts' },
        { bg: 'разчитане на записаните резултати от SPF, DKIM, DMARC и ARC', en: 'reading the recorded SPF, DKIM, DMARC and ARC results' },
        { bg: 'сравнение между From, Sender, Reply-To и Return-Path', en: 'comparison between From, Sender, Reply-To and Return-Path' },
        { bg: 'извличане и пасивен анализ на адресите в съобщението', en: 'extraction and passive analysis of the URLs in the message' },
        { bg: 'метаданни на прикачените файлове', en: 'attachment metadata' },
        { bg: 'анализ на ръчно поставени DNS записи', en: 'analysis of manually pasted DNS records' },
        { bg: 'въпросникът за организацията и целият изчислен профил', en: 'the organizational questionnaire and the entire calculated profile' }
      ]
    },
    {
      h: { bg: 'Какви мрежови проверки съществуват', en: 'Which optional network checks exist' },
      p: [
        { bg: 'Само една функция може да изпрати нещо навън: онлайн DNS проверката в раздел Проверка на домейн. Тя изпраща име на домейн и тип запис към избран от вас резолвер по DNS-over-HTTPS. Не се изпраща съдържание на имейл.',
          en: 'Only one feature can send anything outward: the online DNS lookup in the Check domain section. It sends a domain name and a record type to a resolver you choose over DNS-over-HTTPS. No email content is sent.' },
        { bg: 'Тя не тръгва автоматично. Преди всяка заявка виждате точния списък с имена, които ще бъдат заявени.',
          en: 'It never starts automatically. Before each request you see the exact list of names that will be queried.' }
      ]
    },
    {
      h: { bg: 'Обещанието за поверителност', en: 'The privacy promise' },
      p: [
        { bg: 'Съдържанието на имейла, заглавните полета, извлечените адреси и отговорите от въпросника остават в паметта на браузъра. Няма телеметрия, няма аналитика, няма профили, няма облачна база данни и няма запазване между сесиите.',
          en: 'Email content, header fields, extracted URLs and questionnaire answers stay in browser memory. There is no telemetry, no analytics, no accounts, no cloud database and nothing is stored between sessions.' },
        { bg: 'Не е нужен профил и не е нужен ключ за програмен достъп. Инструментът работи и когато отворите index.html директно от диска.',
          en: 'No account and no API key is needed. The toolkit works even when you open index.html directly from disk.' }
      ]
    }
  ];

  C.emlHelp = {
    intro: [
      { bg: 'Файлът .eml съдържа съобщението такова, каквото е пристигнало, заедно с всички заглавни полета. Препращането на съобщение по обичайния начин губи част от тези полета, затова експортът е по-добър.',
        en: 'An .eml file contains the message as it arrived, together with all header fields. Forwarding a message the ordinary way loses some of those fields, so exporting is better.' },
      { bg: 'Ако вашият клиент не предлага експорт, препратете съобщението като прикачен файл. Така оригиналните заглавни полета се запазват.',
        en: 'If your client offers no export, forward the message as an attachment. That preserves the original header fields.' }
    ],
    clients: [
      {
        name: { bg: 'Gmail в браузър', en: 'Gmail in a browser' },
        steps: [
          { bg: 'Отворете съобщението.', en: 'Open the message.' },
          { bg: 'Натиснете менюто с три точки в самото съобщение.', en: 'Click the three dot menu inside the message.' },
          { bg: 'Изберете Download message. Файлът се запазва като .eml.', en: 'Choose Download message. The file is saved as .eml.' },
          { bg: 'Като алтернатива изберете Show original и след това Download original.', en: 'As an alternative choose Show original and then Download original.' }
        ],
        note: { bg: 'Мобилните приложения на Gmail не предлагат тази опция. Използвайте настолната версия в браузър.',
                en: 'The Gmail mobile apps do not offer this option. Use the desktop version in a browser.' }
      },
      {
        name: { bg: 'Нов Outlook за Windows и Outlook в браузър', en: 'New Outlook for Windows and Outlook on the web' },
        steps: [
          { bg: 'Отворете или маркирайте съобщението.', en: 'Open or select the message.' },
          { bg: 'В заглавната лента на съобщението изберете More actions, тоест бутона с три точки.', en: 'In the message header choose More actions, the three dot button.' },
          { bg: 'Изберете Save as и след това формата EML.', en: 'Choose Save as and then the EML format.' },
          { bg: 'Може също да щракнете с десния бутон върху съобщението в списъка и да изберете Save as.', en: 'You can also right click the message in the list and choose Save as.' }
        ],
        note: { bg: 'Файлът обикновено отива в папката Downloads.', en: 'The file usually lands in the Downloads folder.' }
      },
      {
        name: { bg: 'Класически Outlook за Windows', en: 'Classic Outlook for Windows' },
        steps: [
          { bg: 'Класическият Outlook няма опция за запазване като .eml. Save as дава файл .msg, който този инструмент не чете.', en: 'Classic Outlook has no save as .eml option. Save as produces a .msg file, which this toolkit does not read.' },
          { bg: 'Отворете същата пощенска кутия в Outlook в браузър или в новия Outlook и запазете оттам като EML.', en: 'Open the same mailbox in Outlook on the web or in new Outlook and save as EML from there.' },
          { bg: 'Ако това не е възможно, препратете съобщението като прикачен файл до себе си и запазете прикачения файл.', en: 'If that is not possible, forward the message as an attachment to yourself and save the attachment.' }
        ],
        note: { bg: 'Обикновеното препращане пренаписва заглавните полета и намалява стойността на анализа.', en: 'Ordinary forwarding rewrites the header fields and reduces the value of the analysis.' }
      },
      {
        name: { bg: 'Apple Mail на macOS', en: 'Apple Mail on macOS' },
        steps: [
          { bg: 'Маркирайте съобщението.', en: 'Select the message.' },
          { bg: 'Изберете File и след това Save As.', en: 'Choose File and then Save As.' },
          { bg: 'В полето за формат изберете Raw Message Source. Резултатът е файл .eml.', en: 'In the format field choose Raw Message Source. The result is an .eml file.' },
          { bg: 'Може също просто да плъзнете съобщението върху работния плот.', en: 'You can also simply drag the message onto the desktop.' }
        ],
        note: { bg: 'При плъзгане на цяла кореспонденция всяко съобщение се запазва като отделен файл.', en: 'When you drag a whole conversation each message is saved as a separate file.' }
      },
      {
        name: { bg: 'Mozilla Thunderbird', en: 'Mozilla Thunderbird' },
        steps: [
          { bg: 'Щракнете с десния бутон върху съобщението в списъка.', en: 'Right click the message in the list.' },
          { bg: 'Изберете Save As и посочете папка.', en: 'Choose Save As and pick a folder.' },
          { bg: 'Може също да използвате File, после Save As, после File.', en: 'You can also use File, then Save As, then File.' }
        ],
        note: { bg: 'Thunderbird запазва съобщенията директно във формат .eml.', en: 'Thunderbird saves messages directly in .eml format.' }
      }
    ],
    outro: {
      bg: 'Ако съобщението вече е било изтрито от вас, не го възстановявайте сами от кошчето на друг служител. Свържете се с отговорния ИТ контакт.',
      en: 'If the message has already been deleted, do not recover it yourself from another employee mailbox. Contact your responsible IT contact.'
    }
  };

  C.privacy = [
    {
      h: { bg: 'Какво остава на устройството', en: 'What stays on the device' },
      list: [
        { bg: 'съдържанието на файла .eml', en: 'the content of the .eml file' },
        { bg: 'заглавните полета на съобщението', en: 'the message header fields' },
        { bg: 'текстът на съобщението, използван при разбора', en: 'the message body text used during parsing' },
        { bg: 'извлечените адреси', en: 'the extracted URLs' },
        { bg: 'отговорите от въпросника', en: 'the questionnaire answers' },
        { bg: 'изчислените резултати и препоръки', en: 'the calculated results and recommendations' }
      ]
    },
    {
      h: { bg: 'Какво може да напусне устройството', en: 'What can leave the device' },
      p: [
        { bg: 'Онлайн DNS проверката изпраща името на домейна и типа на записа към резолвера, който сте избрали. Избраният резолвер вижда кой домейн проверявате и от кой мрежов адрес идва заявката.',
          en: 'The online DNS lookup sends the domain name and the record type to the resolver you chose. That resolver can see which domain you are checking and the network address the request comes from.' },
        { bg: 'Ако включите проследяване на включванията в SPF, към резолвера отиват и имената на домейните, посочени в механизмите include и redirect.',
          en: 'If you enable SPF include following, the domain names named in the include and redirect mechanisms are sent to the resolver as well.' },
        { bg: 'Незадължителният локален помощник в tools изпраща заявка към самия проверяван адрес. Този сайт вижда публичния адрес на машината, от която тръгва заявката. Това има както следствия за поверителността, така и следствия при разследване на инцидент.',
          en: 'The optional local helper in tools contacts the inspected URL itself. That site can see the public address of the machine the request comes from. This has both privacy consequences and consequences for incident investigation.' }
      ]
    },
    {
      h: { bg: 'Какво не се използва', en: 'What is not used' },
      list: [
        { bg: 'телеметрия, аналитика и рекламни проследяващи скриптове', en: 'telemetry, analytics and advertising trackers' },
        { bg: 'отдалечени модели с изкуствен интелект и отдалечено оценяване', en: 'remote AI models and remote scoring' },
        { bg: 'облачни бази данни, потребителски профили и синхронизация', en: 'cloud databases, user accounts and sync' },
        { bg: 'външни шрифтови услуги, външни библиотеки и мрежи за доставка на съдържание', en: 'external font services, external libraries and content delivery networks' },
        { bg: 'localStorage, sessionStorage, бисквитки и IndexedDB', en: 'localStorage, sessionStorage, cookies and IndexedDB' }
      ]
    },
    {
      h: { bg: 'Колко дълго се пазят данните', en: 'How long data is kept' },
      p: [
        { bg: 'Само докато страницата е отворена. Презареждането, затварянето на раздела или бутонът за изчистване премахват всичко от паметта.',
          en: 'Only while the page is open. Reloading, closing the tab or the reset button removes everything from memory.' }
      ]
    }
  ];

  C.sources = [
    { title: 'RFC 9989: Domain-based Message Authentication, Reporting, and Conformance (DMARC)', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc9989',
      use: { bg: 'Разбор на DMARC записи, значение на тагове и политики.', en: 'DMARC record parsing, tag meanings and policies.' } },
    { title: 'RFC 9990: DMARC Aggregate Reporting', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc9990',
      use: { bg: 'Обобщени отчети и значение на тага rua.', en: 'Aggregate reports and the meaning of the rua tag.' } },
    { title: 'RFC 9991: DMARC Failure Reporting', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc9991',
      use: { bg: 'Отчети за неуспех и значение на таговете ruf и fo.', en: 'Failure reports and the meaning of the ruf and fo tags.' } },
    { title: 'RFC 7208: Sender Policy Framework (SPF) version 1', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc7208',
      use: { bg: 'Механизми на SPF, ограничението от десет DNS заявки, значение на all.', en: 'SPF mechanisms, the ten DNS lookup limit, the meaning of all.' } },
    { title: 'RFC 6376: DomainKeys Identified Mail (DKIM) Signatures', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc6376',
      use: { bg: 'Полета на DKIM-Signature и роля на селектора.', en: 'DKIM-Signature fields and the role of the selector.' } },
    { title: 'RFC 8601: Message Header Field for Indicating Message Authentication Status', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc8601',
      use: { bg: 'Разчитане на полето Authentication-Results.', en: 'Reading the Authentication-Results field.' } },
    { title: 'RFC 8617: The Authenticated Received Chain (ARC) Protocol', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc8617',
      use: { bg: 'Полета на ARC и статус на спецификацията.', en: 'ARC fields and the status of the specification.' } },
    { title: 'RFC 8461: SMTP MTA Strict Transport Security (MTA-STS)', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc8461',
      use: { bg: 'Записът _mta-sts и изискването за политика през HTTPS.', en: 'The _mta-sts record and the HTTPS policy requirement.' } },
    { title: 'RFC 8460: SMTP TLS Reporting', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc8460',
      use: { bg: 'Записът _smtp._tls и отчетите за TLS.', en: 'The _smtp._tls record and TLS reporting.' } },
    { title: 'RFC 5322: Internet Message Format', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc5322',
      use: { bg: 'Структура на заглавните полета и разгъване на дълги редове.', en: 'Header field structure and unfolding of long lines.' } },
    { title: 'RFC 2047: MIME Part Three, Message Header Extensions for Non-ASCII Text', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc2047',
      use: { bg: 'Декодиране на кодирани думи в Subject и в имената на подателите.', en: 'Decoding encoded words in Subject and in sender names.' } },
    { title: 'RFC 8484: DNS Queries over HTTPS (DoH)', org: 'IETF', url: 'https://www.rfc-editor.org/info/rfc8484',
      use: { bg: 'Механизмът, използван при незадължителната онлайн проверка.', en: 'The mechanism used by the optional online lookup.' } },
    { title: 'Trace an email with its full header', org: 'Google', url: 'https://support.google.com/mail/answer/29436',
      use: { bg: 'Стъпките за Show original и Download original в Gmail.', en: 'The Show original and Download original steps in Gmail.' } },
    { title: 'Save an Outlook message as a .eml file, a PDF file, or as a draft', org: 'Microsoft', url: 'https://support.microsoft.com/en-us/outlook/mail/save-an-outlook-message-as-a-eml-file-a-pdf-file-or-as-a-draft',
      use: { bg: 'Save as в новия Outlook и в Outlook в браузър.', en: 'Save as in new Outlook and Outlook on the web.' } },
    { title: 'Save emails as files or PDFs in Mail on Mac', org: 'Apple', url: 'https://support.apple.com/en-euro/guide/mail/mlhlp1044/mac',
      use: { bg: 'Форматът Raw Message Source в Apple Mail.', en: 'The Raw Message Source format in Apple Mail.' } },
    { title: 'Brand Indicators for Message Identification (BIMI)', org: 'IETF', url: 'https://datatracker.ietf.org/doc/draft-brand-indicators-for-message-identification/',
      use: { bg: 'Статусът на BIMI като работен документ, а не стандарт.', en: 'The status of BIMI as a working draft rather than a standard.' } }
  ];

})(window.SPDT);

/* ------------------------------------------------------------------
   Technical guide. Every topic answers the same nine questions.
   T(id, [titleBg, titleEn], [[bg, en] x 9])
   ------------------------------------------------------------------ */

(function (SPDT) {
  'use strict';
  var C = SPDT.i18n.content;

  function T(id, title, answers) {
    var topic = { id: id, title: { bg: title[0], en: title[1] } };
    for (var i = 0; i < 9; i++) {
      topic['q' + (i + 1)] = { bg: answers[i][0], en: answers[i][1] };
    }
    return topic;
  }

  C.guide = [

    T('spf', ['SPF (Sender Policy Framework)', 'SPF (Sender Policy Framework)'], [
      ['Запис в DNS, който изброява кои сървъри имат право да изпращат поща от името на домейна.',
       'A DNS record that lists which servers are allowed to send mail on behalf of the domain.'],
      ['Затруднява изпращането на поща от произволен сървър с вашия домейн в плика на съобщението.',
       'Makes it harder to send mail from an arbitrary server using your domain in the message envelope.'],
      ['Не защитава видимия адрес в полето From, който вижда потребителят. Проверява адреса в плика (Return-Path). Често се къса при препращане.',
       'It does not protect the visible From address that the user sees. It checks the envelope address (Return-Path). It frequently breaks when mail is forwarded.'],
      ['Всеки домейн, от който се изпраща поща, както и домейните, които не изпращат поща.',
       'Every domain that sends mail, and also domains that send no mail at all.'],
      ['Човекът или доставчикът с достъп до DNS зоната на домейна.',
       'The person or provider with access to the DNS zone of the domain.'],
      ['Използвайте раздела Проверка на домейн в този инструмент, или помолете вашия ИТ доставчик за TXT записа на домейна.',
       'Use the Check domain section in this toolkit, or ask your IT provider for the TXT record of the domain.'],
      ['Пропуснат легитимен подател означава отхвърлена поща. Записът има твърдо ограничение от десет DNS заявки и при надвишаване целият SPF се проваля.',
       'A missed legitimate sender means rejected mail. The record has a hard limit of ten DNS lookups and the whole SPF evaluation fails when it is exceeded.'],
      ['Първо съставете списък на всичко, което изпраща поща от ваше име: пощенски доставчик, счетоводен софтуер, магазин, бюлетини, системи за фактуриране. Започнете с ~all и минете към -all чак когато сте сигурни, че списъкът е пълен.',
       'First inventory everything that sends mail on your behalf: mail provider, accounting software, shop, newsletters, invoicing systems. Start with ~all and move to -all only when you are confident the inventory is complete.'],
      ['Проверете записа тук след промяна и наблюдавайте обобщените отчети от DMARC за подателите, които се провалят.',
       'Check the record here after each change and watch the DMARC aggregate reports for senders that fail.']
    ]),

    T('dkim', ['DKIM (DomainKeys Identified Mail)', 'DKIM (DomainKeys Identified Mail)'], [
      ['Криптографски подпис, който изпращащият сървър добавя към съобщението, и публичен ключ, публикуван в DNS.',
       'A cryptographic signature that the sending server adds to the message, plus a public key published in DNS.'],
      ['Позволява на получателя да провери, че определени части на съобщението не са променяни и че домейнът наистина стои зад него.',
       'Lets the recipient verify that certain parts of the message were not altered and that the domain really stands behind it.'],
      ['Не крие съдържанието и не гарантира, че съобщението е добронамерено. Подписаният домейн може да е измамен домейн със собствен валиден подпис.',
       'It does not hide content and does not guarantee that a message is benign. A signing domain can be a fraudulent domain with its own valid signature.'],
      ['Всеки домейн, изпращащ поща, особено през външни доставчици.',
       'Every domain that sends mail, especially through external providers.'],
      ['Пощенският доставчик генерира ключа. Записът се публикува от този, който управлява DNS.',
       'The mail provider generates the key. The record is published by whoever manages DNS.'],
      ['Отворете реален имейл от домейна и потърсете DKIM-Signature. Частта s= е селекторът, който е нужен за проверка тук.',
       'Open a real message from the domain and look for DKIM-Signature. The s= part is the selector needed to check it here.'],
      ['Изтекли или премахнати ключове, забравени селектори при смяна на доставчик, промяна на съобщението от списък или защитен шлюз, което разваля подписа.',
       'Expired or removed keys, forgotten selectors after a provider change, message modification by a mailing list or security gateway that breaks the signature.'],
      ['Включете подписването при доставчика, публикувайте записа и изчакайте разпространението в DNS, преди да разчитате на DMARC.',
       'Enable signing at the provider, publish the record and wait for DNS propagation before relying on DMARC.'],
      ['Изпратете съобщение до външна кутия и проверете Authentication-Results за dkim=pass с очаквания домейн.',
       'Send a message to an external mailbox and check Authentication-Results for dkim=pass with the expected domain.']
    ]),

    T('dmarc', ['DMARC', 'DMARC'], [
      ['Политика в DNS, която свързва резултатите от SPF и DKIM с видимия домейн в полето From и казва на получателя какво да прави при несъответствие.',
       'A DNS policy that ties the SPF and DKIM results to the visible From domain and tells the recipient what to do when they do not match.'],
      ['Това е механизмът, който реално затруднява подправянето на вашия домейн във видимия адрес. Освен това носи обобщени отчети за това кой изпраща поща от ваше име.',
       'This is the mechanism that actually makes spoofing of your domain in the visible address hard. It also brings aggregate reports about who sends mail on your behalf.'],
      ['Не спира съобщения от подобни домейни, които не са вашите, нито от безплатни пощи с вашето име като показвано име. Не защитава входящата поща.',
       'It does not stop messages from lookalike domains that are not yours, or from free mail accounts using your name as the display name. It does not protect incoming mail.'],
      ['Всеки домейн, който изпраща поща, и всеки паркиран домейн.',
       'Every domain that sends mail, and every parked domain.'],
      ['Този, който управлява DNS, съвместно с човека, който ще чете отчетите.',
       'Whoever manages DNS, together with the person who will read the reports.'],
      ['Проверете тук записа _dmarc на домейна и вижте стойността на тага p.',
       'Check the _dmarc record of the domain here and look at the value of the p tag.'],
      ['Прекият преход към p=reject без предварителен списък на подателите блокира легитимна поща: бюлетини, фактури, системи за резервации. Тагът t=y изключва прилагането на политиката, което често се пропуска.',
       'Jumping straight to p=reject without a prior sender inventory blocks legitimate mail: newsletters, invoices, booking systems. The t=y tag disables policy enforcement, which is easy to overlook.'],
      ['Започнете с p=none и адрес за обобщени отчети. Четете отчетите поне няколко седмици, поправете подателите, които се провалят, минете на quarantine и едва накрая на reject.',
       'Start with p=none and an aggregate report address. Read the reports for at least several weeks, fix the senders that fail, move to quarantine and only then to reject.'],
      ['Обобщените отчети показват дял на успелите съобщения по подател. Когато легитимните източници са трайно на pass, затягането е безопасно.',
       'The aggregate reports show the share of passing messages per sender. When legitimate sources pass consistently, tightening is safe.']
    ]),

    T('arc', ['ARC (Authenticated Received Chain)', 'ARC (Authenticated Received Chain)'], [
      ['Набор от заглавни полета, с които посредник записва какви са били резултатите от автентикацията, преди той да пипне съобщението.',
       'A set of header fields with which an intermediary records what the authentication results were before it touched the message.'],
      ['Помага на легитимна поща, минала през пощенски списък или препращане, да не бъде отхвърлена, макар SPF и DKIM да са се счупили по пътя.',
       'Helps legitimate mail that passed through a mailing list or forwarder avoid rejection even though SPF and DKIM broke along the way.'],
      ['Не е защитна мярка срещу фишинг и не доказва нищо, ако посредникът не заслужава доверие.',
       'It is not a phishing control and proves nothing if the intermediary is not trustworthy.'],
      ['Основно пощенски списъци, шлюзове и доставчици, които препращат чужда поща.',
       'Mainly mailing lists, gateways and providers that forward third party mail.'],
      ['Доставчикът на пощенската услуга. Малките организации рядко го настройват сами.',
       'The mail service provider. Small organizations rarely configure it themselves.'],
      ['Ако в анализа на имейл виждате полета ARC-Seal и ARC-Authentication-Results, съобщението е минало през посредник, който поддържа ARC.',
       'If the email analysis shows ARC-Seal and ARC-Authentication-Results fields, the message passed through an intermediary that supports ARC.'],
      ['Доверието към ARC зависи изцяло от доверието към посредника. Спецификацията е публикувана като експериментална.',
       'Trust in ARC depends entirely on trust in the intermediary. The specification is published as experimental.'],
      ['Не се въвежда от малка организация. Обмисля се само ако сами управлявате пощенски списък или шлюз.',
       'Not something a small organization introduces. Consider it only if you run a mailing list or gateway yourself.'],
      ['Наличието на валидна верига ARC се вижда в полето Authentication-Results на получателя.',
       'The presence of a valid ARC chain appears in the Authentication-Results field at the recipient.']
    ]),

    T('headers', ['Анализ на заглавните полета', 'Email header analysis'], [
      ['Четене на техническите полета на съобщението: кой го е изпратил, през кои сървъри е минало и какви проверки са били записани.',
       'Reading the technical fields of a message: who sent it, which servers it passed through and which checks were recorded.'],
      ['Показва разминавания, които не се виждат в пощенския клиент, например отговор към съвсем друг домейн.',
       'Reveals mismatches that the mail client does not show, for example a reply address at a completely different domain.'],
      ['Заглавните полета могат да бъдат подправени навсякъде преди първия ваш доверен сървър. Не доказват самоличност сами по себе си.',
       'Header fields can be forged anywhere before the first server you trust. On their own they do not prove identity.'],
      ['Всеки, който проверява подозрително съобщение, включително нетехнически потребител с помощта на този инструмент.',
       'Anyone checking a suspicious message, including a nontechnical user with the help of this toolkit.'],
      ['Не се настройва. Това е умение и процедура, не механизъм.',
       'Nothing to configure. This is a skill and a procedure, not a mechanism.'],
      ['Заредете файла .eml в раздел Анализ на имейл. Инструментът показва полетата и обяснява всяко от тях.',
       'Load the .eml file in the Analyze email section. The toolkit shows the fields and explains each of them.'],
      ['Прибързан извод от един единствен индикатор. Много легитимни системи имат различен Return-Path и дълги вериги Received.',
       'Jumping to a conclusion from a single indicator. Many legitimate systems have a different Return-Path and long Received chains.'],
      ['Въведете правило винаги да се гледа целият файл .eml, а не препратено съобщение, което вече е загубило част от полетата.',
       'Adopt a rule to always look at the whole .eml file rather than a forwarded message that has already lost some fields.'],
      ['Сравнете анализа с известно легитимно съобщение от същия подател. Разликите са по-информативни от абсолютните стойности.',
       'Compare the analysis with a known legitimate message from the same sender. The differences are more informative than absolute values.']
    ]),

    T('urls', ['Анализ на адреси', 'URL analysis'], [
      ['Разглеждане на структурата на връзка, без тя да бъде отваряна: схема, име на хост, път и параметри.',
       'Examining the structure of a link without opening it: scheme, host name, path and parameters.'],
      ['Открива класически трикове: видим текст, различен от истинската цел, адрес с числов IP, кирилски или гръцки букви, имитиращи латински.',
       'Catches classic tricks: visible text different from the real destination, numeric IP addresses, Cyrillic or Greek letters imitating Latin ones.'],
      ['Не казва дали страницата е злонамерена. Съвсем нов измамен домейн изглежда напълно нормално по структура.',
       'It does not tell you whether the page is malicious. A brand new fraudulent domain can look perfectly normal structurally.'],
      ['Всеки потребител, който се колебае дали да натисне връзка.',
       'Any user hesitating over a link.'],
      ['Не се настройва. Инструментът извършва анализа автоматично при зареждане на файла.',
       'Nothing to configure. The toolkit performs the analysis automatically when a file is loaded.'],
      ['Разделът Анализ на имейл изброява всички адреси и маркира индикаторите при всеки от тях.',
       'The Analyze email section lists every URL and marks the indicators found on each.'],
      ['Отварянето на адреса, за да се провери, е точно това, което нападателят иска. Дори само зареждането на страницата издава, че съобщението е прочетено.',
       'Opening the URL to check it is exactly what the attacker wants. Merely loading the page already reveals that the message was read.'],
      ['Въведете правило: адресите се проверяват само чрез четене, а самоличността на подателя се потвърждава по друг канал.',
       'Adopt a rule: URLs are checked by reading only, and the identity of the sender is confirmed through a separate channel.'],
      ['Сравнете домейна на адреса с домейна, който познавате от официалната кореспонденция или от договор.',
       'Compare the domain in the URL with the domain you know from official correspondence or a contract.']
    ]),

    T('mfa', ['Многофакторна автентикация (MFA)', 'Multi factor authentication (MFA)'], [
      ['Изискване за втори елемент при вход, освен паролата.',
       'A requirement for a second element at sign in, in addition to the password.'],
      ['Открадната парола сама по себе си вече не стига за достъп до пощата.',
       'A stolen password alone is no longer enough to reach the mailbox.'],
      ['Кодовете от приложение и потвържденията с натискане могат да бъдат заобиколени в реално време от прокси страница или чрез умора от известия.',
       'App codes and push approvals can be bypassed in real time by a proxy page or through notification fatigue.'],
      ['Всички потребители. Приоритетно администратори, финанси, управление и всеки с достъп до плащания.',
       'All users. Administrators, finance, management and anyone with access to payments come first.'],
      ['Администраторът на пощенската или облачната платформа.',
       'The administrator of the mail or cloud platform.'],
      ['Опитайте да влезете от нов браузър. Ако системата иска само парола, MFA не е включено за този профил.',
       'Try to sign in from a new browser. If the system asks only for a password, MFA is not enabled for that account.'],
      ['Загуба на достъп при смяна на телефон, ако няма резервен метод и процедура за възстановяване.',
       'Loss of access when a phone is replaced, if there is no backup method and recovery procedure.'],
      ['Пуснете първо за администраторите, подгответе резервни кодове и писмена процедура за възстановяване, после разширете към всички.',
       'Roll out to administrators first, prepare backup codes and a written recovery procedure, then extend to everyone.'],
      ['Отчетът за покритие в административния панел показва кои профили нямат втори фактор.',
       'The coverage report in the admin panel shows which accounts have no second factor.']
    ]),

    T('mfa-resistant', ['Устойчива на фишинг MFA', 'Phishing resistant MFA'], [
      ['Втори фактор, който е криптографски обвързан с адреса на сайта: хардуерен ключ, вграден в устройството ключ или пасков.',
       'A second factor cryptographically bound to the site address: a hardware key, a key built into the device, or a passkey.'],
      ['Спира атаките с междинна страница, защото ключът просто не се задейства на измамен домейн.',
       'Stops adversary in the middle attacks, because the key simply does not respond on a fraudulent domain.'],
      ['Не помага, ако нападателят вече е в кутията, ако сесията е открадната или ако измамата е чисто човешка, без вход в система.',
       'It does not help if the attacker is already inside the mailbox, if a session was stolen, or if the fraud is purely human with no sign in at all.'],
      ['Приоритетно администратори, финансови роли и всеки, чийто профил би бил използван за плащания.',
       'Administrators, finance roles and anyone whose account would be used for payments come first.'],
      ['Администраторът на платформата, съвместно с човек, отговорен за раздаването на ключовете.',
       'The platform administrator, together with someone responsible for distributing the keys.'],
      ['Проверете дали при вход се появява искане за ключ или за биометрия на устройството, а не код за въвеждане.',
       'Check whether sign in asks for a key or for device biometrics rather than a code you type.'],
      ['Изгубен ключ без резервен блокира достъпа. Не всяко приложение поддържа този метод.',
       'A lost key with no backup blocks access. Not every application supports this method.'],
      ['Раздайте по два ключа на критичните хора, регистрирайте и двата, и чак тогава изисквайте метода задължително.',
       'Give two keys to critical people, register both, and only then require the method.'],
      ['В дневниците за вход методът се вижда като ключ или пасков вместо код.',
       'In the sign in logs the method appears as a key or passkey rather than a code.']
    ]),

    T('fido2', ['FIDO2', 'FIDO2'], [
      ['Съвкупност от две части: браузърният интерфейс WebAuthn и протоколът CTAP2 за връзка с външно устройство.',
       'A combination of two parts: the WebAuthn browser interface and the CTAP2 protocol for talking to an external device.'],
      ['Дава общ стандарт, по който хардуерни ключове работят с различни услуги без отделно приложение за всяка.',
       'Provides a common standard so hardware keys work with many services without a separate application for each.'],
      ['Не е самостоятелен продукт, който се купува и включва. Услугата отсреща също трябва да го поддържа.',
       'It is not a standalone product you buy and switch on. The service on the other side must support it as well.'],
      ['Организации, които въвеждат устойчива на фишинг автентикация.',
       'Organizations introducing phishing resistant authentication.'],
      ['Администраторът на съответната платформа при регистрацията на ключовете.',
       'The platform administrator when the keys are registered.'],
      ['Ако при вход се появи искане да докоснете физически ключ, използва се FIDO2.',
       'If sign in asks you to touch a physical key, FIDO2 is in use.'],
      ['Смесване на понятията с еднократни кодове води до погрешно усещане за защита.',
       'Confusing it with one time codes leads to a false sense of protection.'],
      ['Проверете предварително кои от вашите услуги го поддържат и започнете с пощенската платформа.',
       'Check in advance which of your services support it and start with the mail platform.'],
      ['Регистрирайте ключ на тестов профил и опитайте вход от друго устройство.',
       'Register a key on a test account and try to sign in from another device.']
    ]),

    T('webauthn', ['WebAuthn', 'WebAuthn'], [
      ['Стандарт на W3C, който позволява на уеб сайт да поиска от браузъра криптографски вход вместо парола.',
       'A W3C standard that lets a web site ask the browser for a cryptographic sign in instead of a password.'],
      ['Ключът е обвързан с домейна на сайта, затова не може да бъде използван на друг адрес.',
       'The key is bound to the site domain, so it cannot be used at a different address.'],
      ['Не решава кражбата на активна сесия и не пази, ако устройството на потребителя е компрометирано.',
       'It does not solve theft of an active session and does not protect if the user device itself is compromised.'],
      ['Услуги, които искат да премахнат паролите или да добавят устойчив втори фактор.',
       'Services that want to remove passwords or add a resistant second factor.'],
      ['Разработчикът на услугата. Потребителят само регистрира ключа си.',
       'The service developer. The user only registers a key.'],
      ['Ако браузърът предлага вход с пръстов отпечатък, лице или ключ, услугата използва WebAuthn.',
       'If the browser offers sign in with a fingerprint, face or key, the service uses WebAuthn.'],
      ['Стари браузъри и неподдържани приложения остават на парола и се превръщат в най-слабата точка.',
       'Old browsers and unsupported applications stay on passwords and become the weakest point.'],
      ['Въведете го паралелно с наличния метод и изключете стария едва след като всички са регистрирани.',
       'Introduce it alongside the existing method and disable the old one only after everyone is registered.'],
      ['Опитайте вход на друг компютър и потвърдете, че се иска потвърждение от устройството.',
       'Try signing in on another computer and confirm that device confirmation is requested.']
    ])
  ];

})(window.SPDT);

/* Technical guide, second half. */

(function (SPDT) {
  'use strict';
  var C = SPDT.i18n.content;

  function T(id, title, answers) {
    var topic = { id: id, title: { bg: title[0], en: title[1] } };
    for (var i = 0; i < 9; i++) {
      topic['q' + (i + 1)] = { bg: answers[i][0], en: answers[i][1] };
    }
    return topic;
  }

  C.guide.push(

    T('passkeys', ['Пасков (passkey)', 'Passkeys'], [
      ['Ключ по стандарта WebAuthn, съхраняван в устройството или в мениджър на пароли, който може да замени паролата напълно.',
       'A WebAuthn credential stored on a device or in a password manager, which can replace the password entirely.'],
      ['Премахва паролата, а с нея и възможността тя да бъде открадната чрез фалшива страница за вход.',
       'Removes the password, and with it the possibility of stealing it through a fake sign in page.'],
      ['Синхронизираните паскови са толкова защитени, колкото профилът, който ги синхронизира. Не помагат срещу измама, при която жертвата сама превежда пари.',
       'Synced passkeys are only as protected as the account that syncs them. They do not help against fraud where the victim transfers money themselves.'],
      ['Организации, които искат да намалят зависимостта от пароли, особено при често сменящи се устройства.',
       'Organizations that want to reduce password dependence, especially where devices change often.'],
      ['Администраторът на платформата разрешава метода. Потребителят го регистрира сам.',
       'The platform administrator enables the method. The user registers it themselves.'],
      ['В настройките за сигурност на профила потърсете раздел за паскови или ключове за достъп.',
       'In the account security settings look for a passkeys or access keys section.'],
      ['Служител напуска с пасков в личен профил. Затова е важно паскови за служебни системи да се регистрират по управляем начин.',
       'An employee leaves with a passkey in a personal account. That is why passkeys for work systems should be registered in a manageable way.'],
      ['Започнете с доброволна регистрация, дръжте втори метод, и премахнете паролата чак когато покритието е пълно.',
       'Start with voluntary registration, keep a second method, and remove the password only when coverage is complete.'],
      ['Проверете в дневника за вход, че методът се отчита като пасков, и опитайте вход от чуждо устройство.',
       'Check in the sign in log that the method is recorded as a passkey, and try signing in from another device.']
    ]),

    T('mailfilter', ['Филтриране на поща', 'Email filtering'], [
      ['Услуга или вградена функция, която проверява входящите съобщения и отделя нежеланите и опасните.',
       'A service or built in function that inspects incoming messages and separates unwanted and dangerous ones.'],
      ['Премахва голямата част от масовите атаки, преди изобщо да стигнат до потребителя.',
       'Removes the bulk of mass attacks before they reach the user at all.'],
      ['Целенасочените съобщения без прикачен файл и без връзка, които просто искат превод по нова сметка, преминават през почти всеки филтър.',
       'Targeted messages with no attachment and no link, simply requesting a transfer to a new account, pass almost every filter.'],
      ['Всяка организация. В повечето случаи вече е налично в пощенската платформа.',
       'Every organization. In most cases it is already included in the mail platform.'],
      ['Администраторът на пощенската платформа или външният ИТ доставчик.',
       'The mail platform administrator or the external IT provider.'],
      ['Попитайте дали има карантинна папка и кой я преглежда. Ако никой не знае, вероятно не се следи.',
       'Ask whether a quarantine folder exists and who reviews it. If nobody knows, it is probably not monitored.'],
      ['Прекалено строги правила задържат фактури и запитвания от клиенти. Никой не поглежда карантината и важна поща изчезва тихо.',
       'Overly strict rules hold invoices and customer enquiries. Nobody looks at the quarantine and important mail disappears silently.'],
      ['Първо включете наблюдение, вижте какво би било блокирано, после затегнете. Определете кой преглежда карантината и колко често.',
       'First enable monitoring, see what would be blocked, then tighten. Decide who reviews the quarantine and how often.'],
      ['Проследете няколко седмици колко съобщения са задържани и колко от тях са били легитимни.',
       'Track for several weeks how many messages were held and how many of them were legitimate.']
    ]),

    T('webfilter', ['Филтриране на уеб и DNS', 'Web and DNS filtering'], [
      ['Механизъм, който спира достъпа до известни опасни адреси на ниво разрешаване на имена или през прокси.',
       'A mechanism that blocks access to known dangerous addresses at name resolution level or through a proxy.'],
      ['Дава втори шанс, когато потребителят вече е натиснал връзката.',
       'Provides a second chance after a user has already clicked a link.'],
      ['Домейн, регистриран преди часове, обикновено още не е в никакъв списък. Личните устройства извън мрежата не са покрити.',
       'A domain registered hours ago is usually not in any list yet. Personal devices outside the network are not covered.'],
      ['Организации с офис мрежа, а при работа от разстояние решението трябва да следва устройството.',
       'Organizations with an office network. For remote work the solution must follow the device.'],
      ['Този, който управлява мрежата или устройствата.',
       'Whoever manages the network or the devices.'],
      ['Опитайте да отворите известен тестов адрес за блокиране, предоставен от самата услуга.',
       'Try to open a known test address for blocking, provided by the service itself.'],
      ['Блокиране на нужен за работата сайт без ясен път за изключение. Потребителите започват да заобикалят механизма.',
       'Blocking a site needed for work with no clear exception path. Users then start to bypass the mechanism.'],
      ['Пуснете първо в режим само за наблюдение, вижте кои категории се засягат, и дайте бърз канал за заявка на изключение.',
       'Start in monitoring only mode, see which categories are affected, and provide a fast channel for exception requests.'],
      ['Прегледайте дневника с блокирани заявки и се уверете, че няма постоянно блокиран работен ресурс.',
       'Review the blocked request log and confirm that no work resource is permanently blocked.']
    ]),

    T('reporting', ['Механизъм за докладване', 'Reporting mechanisms'], [
      ['Ясен и лесен начин служителят да съобщи за подозрително съобщение.',
       'A clear and easy way for an employee to report a suspicious message.'],
      ['Превръща всеки служител в сензор и позволява един доклад да предпази останалите.',
       'Turns every employee into a sensor and lets one report protect everyone else.'],
      ['Не помага, ако никой не отговаря на докладите или ако докладвалият бива упрекван.',
       'It does not help if nobody responds to reports or if the person reporting is blamed.'],
      ['Всяка организация, независимо от размера.',
       'Every organization, whatever its size.'],
      ['Управлението определя правилото. ИТ осигурява бутона или адреса.',
       'Management sets the rule. IT provides the button or the address.'],
      ['Попитайте произволен служител къде би съобщил за подозрителен имейл. Ако се колебае, механизмът не работи.',
       'Ask any employee where they would report a suspicious message. If they hesitate, the mechanism does not work.'],
      ['Липса на обратна връзка убива желанието за докладване след няколко седмици.',
       'A lack of feedback kills the willingness to report within a few weeks.'],
      ['Определете един адрес или бутон, обявете срок за отговор и благодарете публично на докладвалите, включително при фалшива тревога.',
       'Define one address or button, announce a response time and thank people publicly for reports, including false alarms.'],
      ['Броят доклади на месец и времето до първи отговор са достатъчни показатели.',
       'The number of reports per month and the time to first response are sufficient indicators.']
    ]),

    T('sessions', ['Прекратяване на сесии', 'Session revocation'], [
      ['Принудително прекратяване на всички активни входове в даден профил.',
       'Forced termination of all active sign ins for an account.'],
      ['Изхвърля нападателя, който вече е влязъл, дори след като паролата е сменена.',
       'Ejects an attacker who is already signed in, even after the password has been changed.'],
      ['Не премахва създадени вече правила за препращане, добавени втори фактори или разрешения за приложения.',
       'It does not remove forwarding rules already created, second factors already added, or application permissions already granted.'],
      ['Всеки профил, за който има съмнение за компрометиране.',
       'Any account suspected of compromise.'],
      ['Администраторът на платформата. Трябва да е известно предварително кой има това право.',
       'The platform administrator. It must be known in advance who has this right.'],
      ['В настройките за сигурност на профила потърсете опция за изход от всички устройства.',
       'In the account security settings look for an option to sign out of all devices.'],
      ['Само смяна на паролата не прекратява активните сесии. Това е най-често пропусканата стъпка.',
       'Changing the password alone does not end active sessions. This is the most commonly missed step.'],
      ['Запишете стъпката в чеклиста за инцидент и се уверете, че поне двама души знаят как се прави.',
       'Write the step into the incident checklist and make sure at least two people know how to do it.'],
      ['След прекратяване всички устройства трябва да поискат нов вход.',
       'After revocation every device should ask for a new sign in.']
    ]),

    T('forwarding', ['Препращане и правила в кутията', 'Mailbox forwarding and inbox rules'], [
      ['Настройки, които автоматично препращат, местят или изтриват съобщения.',
       'Settings that automatically forward, move or delete messages.'],
      ['Проверката им е един от най-бързите начини да се разбере дали кутия е била компрометирана.',
       'Checking them is one of the fastest ways to find out whether a mailbox was compromised.'],
      ['Самата проверка не предотвратява компрометиране. Тя открива следа, оставена след него.',
       'The check itself prevents nothing. It finds a trace left behind afterwards.'],
      ['Всяка организация, приоритетно кутиите, свързани с плащания и договори.',
       'Every organization, with mailboxes tied to payments and contracts first.'],
      ['Администраторът може да провери всички кутии наведнъж. Потребителят вижда само своята.',
       'An administrator can check all mailboxes at once. A user sees only their own.'],
      ['В настройките на пощата потърсете Правила и Препращане и проверете дали има нещо, което не сте създали.',
       'In the mail settings look for Rules and Forwarding and check whether anything is there that you did not create.'],
      ['Правило, което мести отговорите в рядко използвана папка, прави измамата невидима за собственика на кутията седмици наред.',
       'A rule that moves replies into a rarely used folder keeps the fraud invisible to the mailbox owner for weeks.'],
      ['Забранете автоматичното препращане към външни адреси на ниво организация и оставете изключенията да минават през заявка.',
       'Disable automatic forwarding to external addresses at organization level and let exceptions go through a request.'],
      ['Периодичен отчет за всички правила за препращане, поне веднъж на тримесечие.',
       'A periodic report of all forwarding rules, at least quarterly.']
    ]),

    T('ir', ['Реакция при инцидент', 'Incident response'], [
      ['Предварително записана последователност кой какво прави, когато нещо се е случило.',
       'A previously written sequence of who does what when something has happened.'],
      ['Спестява най-скъпото при инцидент: първите тридесет минути на колебание.',
       'Saves the most expensive thing during an incident: the first thirty minutes of hesitation.'],
      ['Не предотвратява инциденти и не замества техническите мерки.',
       'It does not prevent incidents and does not replace technical controls.'],
      ['Всяка организация. Един лист хартия е достатъчен за малка фирма.',
       'Every organization. One sheet of paper is enough for a small company.'],
      ['Управлението, съвместно с ИТ. Списъкът с контакти трябва да е достъпен и извън пощата.',
       'Management, together with IT. The contact list must be reachable outside email as well.'],
      ['Попитайте кой се обажда на банката, ако днес е преведена сума по фалшива фактура. Ако няма отговор, план липсва.',
       'Ask who calls the bank if a payment went out today on a fraudulent invoice. If there is no answer, there is no plan.'],
      ['Планът съществува само в пощата, която е недостъпна точно по време на инцидента.',
       'The plan exists only in the mailbox, which is unavailable exactly during the incident.'],
      ['Запишете имена, телефони и първите пет стъпки. Разиграйте ги веднъж на сухо и коригирайте.',
       'Write down names, phone numbers and the first five steps. Rehearse them once as a dry run and correct them.'],
      ['Кратко учение веднъж годишно показва дали контактите са актуални.',
       'A short exercise once a year shows whether the contacts are still current.']
    ]),

    T('mtasts', ['MTA-STS', 'MTA-STS'], [
      ['Механизъм, с който домейнът обявява, че входящата поща към него трябва да се доставя само по проверена криптирана връзка.',
       'A mechanism with which a domain declares that inbound mail must be delivered only over a verified encrypted connection.'],
      ['Затваря възможността нападател в мрежата да свали връзката до нешифрована и да прочете съобщенията по пътя.',
       'Closes the possibility for a network attacker to downgrade the connection to plaintext and read messages in transit.'],
      ['Не защитава срещу фишинг и не проверява самоличността на подателя. Отнася се само до транспорта.',
       'It does not protect against phishing and does not verify sender identity. It concerns transport only.'],
      ['Организации, за които поверителността на кореспонденцията е важна, най-често при обмен на документи.',
       'Organizations for which the confidentiality of correspondence matters, most often when exchanging documents.'],
      ['Този, който управлява DNS, съвместно с този, който поддържа уеб сървър за домейна.',
       'Whoever manages DNS, together with whoever maintains a web server for the domain.'],
      ['Проверете тук записа _mta-sts. Само записът обаче не е достатъчен.',
       'Check the _mta-sts record here. The record alone is not enough, though.'],
      ['Записът в DNS съществува, но файлът с политиката не се обслужва по HTTPS с валиден сертификат. Тогава защита няма и няма съобщение за грешка.',
       'The DNS record exists but the policy file is not served over HTTPS with a valid certificate. In that case there is no protection and no error message.'],
      ['Публикувайте политиката първо в режим testing, съберете отчети чрез TLS-RPT и минете на enforce едва след като няма грешки.',
       'Publish the policy in testing mode first, collect reports through TLS-RPT and move to enforce only when there are no errors.'],
      ['Отчетите по TLS-RPT показват неуспешните опити за доставка. Липсата на грешки за няколко седмици е добър знак.',
       'The TLS-RPT reports show failed delivery attempts. No errors for several weeks is a good sign.']
    ]),

    T('tlsrpt', ['TLS-RPT', 'TLS-RPT'], [
      ['Запис в DNS, който посочва адрес за получаване на отчети за проблеми при криптирана доставка.',
       'A DNS record naming an address for receiving reports about problems with encrypted delivery.'],
      ['Дава видимост дали някой не успява да ви достави поща по защитена връзка.',
       'Provides visibility into whether someone is failing to deliver mail to you over a secure connection.'],
      ['Не спира нищо. Само съобщава.',
       'It blocks nothing. It only reports.'],
      ['Всеки, който въвежда MTA-STS. Двете вървят заедно.',
       'Anyone introducing MTA-STS. The two go together.'],
      ['Този, който управлява DNS.',
       'Whoever manages DNS.'],
      ['Проверете тук записа _smtp._tls на домейна.',
       'Check the _smtp._tls record of the domain here.'],
      ['Отчетите отиват в кутия, която никой не чете, и проблем остава незабелязан месеци.',
       'The reports go to a mailbox nobody reads and a problem stays unnoticed for months.'],
      ['Публикувайте записа преди или заедно с MTA-STS и определете кой преглежда отчетите.',
       'Publish the record before or together with MTA-STS and decide who reviews the reports.'],
      ['Пристигането на първите отчети потвърждава, че записът работи.',
       'The arrival of the first reports confirms that the record works.']
    ]),

    T('bimi', ['BIMI', 'BIMI'], [
      ['Механизъм, чрез който домейн посочва изображение, което пощенският клиент може да покаже до съобщенията му.',
       'A mechanism through which a domain names an image that a mail client may display next to its messages.'],
      ['Дава видим знак за разпознаваемост на подателя в поддържащите клиенти и стимулира въвеждането на DMARC.',
       'Gives a visible recognition cue in supporting clients and creates an incentive to deploy DMARC.'],
      ['Не е защитна мярка. Липсата на лого не означава измама, а наличието му не гарантира нищо извън това, че DMARC е бил успешен.',
       'It is not a security control. A missing logo does not mean fraud, and a present logo guarantees nothing beyond a successful DMARC evaluation.'],
      ['Организации с разпознаваема марка и вече работеща политика DMARC на ниво quarantine или reject.',
       'Organizations with a recognizable brand and a working DMARC policy already at quarantine or reject.'],
      ['Маркетингът съвместно с този, който управлява DNS.',
       'Marketing together with whoever manages DNS.'],
      ['Проверете тук записа default._bimi. Резултатът е само информационен.',
       'Check the default._bimi record here. The result is informational only.'],
      ['Възприемане на логото като доказателство за автентичност. Освен това някои доставчици изискват платен сертификат за марка.',
       'Treating the logo as proof of authenticity. Additionally some providers require a paid brand certificate.'],
      ['Въвежда се последно, след като DMARC е на quarantine или reject и е стабилен.',
       'Introduce it last, after DMARC is at quarantine or reject and stable.'],
      ['Изпратете съобщение до кутия при поддържащ доставчик и вижте дали логото се показва.',
       'Send a message to a mailbox at a supporting provider and see whether the logo appears.']
    ])
  );

})(window.SPDT);

/* ------------------------------------------------------------------
   Glossary, checklists and decision trees.
   ------------------------------------------------------------------ */

(function (SPDT) {
  'use strict';
  var C = SPDT.i18n.content;

  function G(bgTerm, enTerm, bgDef, enDef) {
    return { term: { bg: bgTerm, en: enTerm }, def: { bg: bgDef, en: enDef } };
  }

  C.glossary = [
    G('Фишинг (phishing)', 'Phishing',
      'Съобщение, което се представя за нещо друго, за да ви накара да разкриете данни, да платите или да стартирате файл.',
      'A message that pretends to be something else in order to make you reveal data, pay, or run a file.'),
    G('Целенасочен фишинг (spear phishing)', 'Spear phishing',
      'Фишинг, подготвен за конкретен човек или организация, с истински имена и контекст.',
      'Phishing prepared for a specific person or organization, using real names and context.'),
    G('Компрометирана бизнес кореспонденция (business email compromise)', 'Business email compromise',
      'Измама, при която нападателят се представя за ръководител, доставчик или клиент и иска превод или смяна на банкова сметка.',
      'Fraud in which an attacker impersonates an executive, supplier or customer and requests a payment or a bank account change.'),
    G('Подправяне на подател (spoofing)', 'Spoofing',
      'Поставяне на чужд адрес в полето на подателя. Технически е лесно, ако домейнът няма защита.',
      'Placing someone else address in the sender field. Technically easy if the domain has no protection.'),
    G('Домейн двойник (lookalike domain)', 'Lookalike domain',
      'Домейн, който наподобява истинския със сменена, добавена или подобна на вид буква.',
      'A domain that resembles the real one through a swapped, added or visually similar letter.'),
    G('Пюникод (punycode)', 'Punycode',
      'Начин имена с небуквени за латиницата знаци да се записват като ASCII. Започва с xn-- и често се използва за домейни двойници.',
      'A way to write names containing non ASCII characters as ASCII. Starts with xn-- and is often used for lookalike domains.'),
    G('Заглавно поле (header field)', 'Header field',
      'Ред в техническата част на съобщението, например From, Subject или Received.',
      'A line in the technical part of a message, for example From, Subject or Received.'),
    G('Плик на съобщението (envelope)', 'Message envelope',
      'Адресите, използвани при самото предаване по SMTP. Те могат да се различават от видимите в клиента.',
      'The addresses used during the SMTP transfer itself. They can differ from the ones visible in the client.'),
    G('Return-Path', 'Return-Path',
      'Адресът, на който се връщат съобщенията при неуспешна доставка. Именно той се проверява от SPF.',
      'The address to which delivery failures return. This is the address SPF checks.'),
    G('Reply-To', 'Reply-To',
      'Адресът, на който отива вашият отговор. Различие с From е класически индикатор, но има и легитимни употреби.',
      'The address your reply goes to. A difference from From is a classic indicator, but there are legitimate uses too.'),
    G('Received', 'Received',
      'Запис, добавян от всеки сървър по пътя. Четат се отдолу нагоре.',
      'An entry added by every server along the path. They are read from the bottom upwards.'),
    G('Authentication-Results', 'Authentication-Results',
      'Поле, в което получаващият сървър записва какви са били резултатите от SPF, DKIM и DMARC.',
      'The field in which the receiving server records the SPF, DKIM and DMARC results.'),
    G('SPF', 'SPF',
      'Списък в DNS с разрешените изпращащи сървъри за домейна.',
      'A DNS list of the servers allowed to send for a domain.'),
    G('DKIM', 'DKIM',
      'Криптографски подпис на съобщението с публичен ключ в DNS.',
      'A cryptographic signature on the message, with a public key in DNS.'),
    G('DMARC', 'DMARC',
      'Политика, която свързва SPF и DKIM с видимия домейн и указва как да се третират несъответствията.',
      'A policy that ties SPF and DKIM to the visible domain and states how mismatches should be treated.'),
    G('Подравняване (alignment)', 'Alignment',
      'Изискването домейнът, доказан от SPF или DKIM, да съвпада с домейна във видимото поле From.',
      'The requirement that the domain proven by SPF or DKIM matches the domain in the visible From field.'),
    G('Селектор (selector)', 'Selector',
      'Име, което посочва кой DKIM ключ да се използва. Вижда се като s= в полето DKIM-Signature.',
      'A name that points to which DKIM key to use. It appears as s= in the DKIM-Signature field.'),
    G('Политика p (policy)', 'Policy tag p',
      'Тагът в DMARC, който казва какво да прави получателят: none, quarantine или reject.',
      'The DMARC tag that tells the recipient what to do: none, quarantine or reject.'),
    G('Тестов режим t (test mode)', 'Test mode tag t',
      'Таг в DMARC по новата спецификация. При t=y политиката се обявява, но не се прилага.',
      'A DMARC tag in the new specification. With t=y the policy is published but not enforced.'),
    G('Обобщени отчети (aggregate reports)', 'Aggregate reports',
      'Ежедневни отчети по DMARC, които показват кой изпраща поща от името на домейна.',
      'Daily DMARC reports showing who sends mail on behalf of the domain.'),
    G('ARC', 'ARC',
      'Верига от подписи, с която посредник запазва резултатите от автентикацията отпреди намесата си.',
      'A chain of signatures with which an intermediary preserves the authentication results from before it intervened.'),
    G('MTA-STS', 'MTA-STS',
      'Изискване входящата поща към домейна да пристига само по проверена криптирана връзка.',
      'A requirement that inbound mail to a domain arrives only over a verified encrypted connection.'),
    G('TLS-RPT', 'TLS-RPT',
      'Адрес за отчети при проблеми с криптираната доставка.',
      'An address for reports about problems with encrypted delivery.'),
    G('BIMI', 'BIMI',
      'Механизъм за показване на лого до съобщенията. Информационен, не защитен механизъм.',
      'A mechanism for showing a logo next to messages. Informational, not a security control.'),
    G('DNS-over-HTTPS (DoH)', 'DNS over HTTPS (DoH)',
      'Начин DNS заявки да се изпращат по защитена уеб връзка. Използва се от онлайн проверката тук.',
      'A way to send DNS queries over a secure web connection. Used by the online lookup here.'),
    G('Многофакторна автентикация (MFA)', 'Multi factor authentication (MFA)',
      'Втори елемент при вход освен паролата.',
      'A second element at sign in besides the password.'),
    G('Устойчива на фишинг MFA', 'Phishing resistant MFA',
      'Втори фактор, обвързан с адреса на сайта, който не се задейства на измамен домейн.',
      'A second factor bound to the site address, which does not respond on a fraudulent domain.'),
    G('Пасков (passkey)', 'Passkey',
      'Ключ по WebAuthn, който може да замени паролата напълно.',
      'A WebAuthn credential that can replace the password entirely.'),
    G('Сесия (session)', 'Session',
      'Активният вход в система. Може да оцелее след смяна на паролата, ако не бъде прекратен изрично.',
      'An active sign in. It can survive a password change unless explicitly revoked.'),
    G('Карантина (quarantine)', 'Quarantine',
      'Място, където филтърът задържа съмнителни съобщения, вместо да ги доставя.',
      'The place where a filter holds suspicious messages instead of delivering them.'),
    G('Индикатор (indicator)', 'Indicator',
      'Отделна техническа находка. Един индикатор не е доказателство. Няколко заедно променят преценката.',
      'A single technical finding. One indicator is not proof. Several together change the assessment.')
  ];

  C.checklists = [
    {
      id: 'setup',
      title: { bg: 'Чеклист за първоначално въвеждане', en: 'Initial setup checklist' },
      intro: { bg: 'Минималният набор, с който започва всяка организация.', en: 'The minimum set every organization starts with.' },
      items: [
        { bg: 'Включена многофакторна автентикация за всички администраторски профили.', en: 'Multi factor authentication enabled for every administrator account.' },
        { bg: 'Включена многофакторна автентикация за всички останали потребители.', en: 'Multi factor authentication enabled for all other users.' },
        { bg: 'Публикуван SPF запис за всеки домейн, който изпраща поща.', en: 'An SPF record published for every domain that sends mail.' },
        { bg: 'Включено подписване с DKIM при пощенския доставчик.', en: 'DKIM signing enabled at the mail provider.' },
        { bg: 'Публикуван DMARC запис с p=none и адрес за обобщени отчети.', en: 'A DMARC record published with p=none and an aggregate report address.' },
        { bg: 'Съставен списък на всички системи, които изпращат поща от името на организацията.', en: 'An inventory of every system that sends mail on behalf of the organization.' },
        { bg: 'Обявен един ясен адрес или бутон за докладване на подозрителни съобщения.', en: 'One clear address or button announced for reporting suspicious messages.' },
        { bg: 'Записани имена и телефони за спешен контакт: ИТ, банка, управление.', en: 'Emergency contact names and phone numbers written down: IT, bank, management.' },
        { bg: 'Правило за потвърждаване на всяка смяна на банкова сметка по телефон на предварително известен номер.', en: 'A rule to confirm every bank account change by phone on a previously known number.' },
        { bg: 'Забранено автоматично препращане към външни адреси или въведена процедура за изключения.', en: 'Automatic forwarding to external addresses disabled, or an exception procedure introduced.' }
      ]
    },
    {
      id: 'review',
      title: { bg: 'Чеклист за периодичен преглед', en: 'Periodic review checklist' },
      intro: { bg: 'Препоръчително веднъж на тримесечие.', en: 'Recommended once a quarter.' },
      items: [
        { bg: 'Покритие на многофакторната автентикация: има ли профил без втори фактор.', en: 'MFA coverage: is there any account without a second factor.' },
        { bg: 'Привилегировани профили: кой има администраторски права и нужни ли са още.', en: 'Privileged accounts: who holds administrator rights and are they still needed.' },
        { bg: 'Правила за препращане в пощенските кутии: има ли непознати.', en: 'Mailbox forwarding rules: are there any that nobody recognizes.' },
        { bg: 'Правила в кутиите, които местят или изтриват съобщения автоматично.', en: 'Inbox rules that move or delete messages automatically.' },
        { bg: 'Работи ли пътят за докладване и колко доклада има за периода.', en: 'Does the reporting path work and how many reports came in during the period.' },
        { bg: 'Актуални ли са контактите за инцидент.', en: 'Are the incident contacts still current.' },
        { bg: 'Състояние на SPF, DKIM и DMARC на всички домейни, включително паркираните.', en: 'The SPF, DKIM and DMARC status of every domain, including parked ones.' },
        { bg: 'Прегледани обобщени отчети от DMARC за нови или проваляли се податели.', en: 'DMARC aggregate reports reviewed for new or failing senders.' },
        { bg: 'Профили на напуснали служители: закрити и сесиите прекратени.', en: 'Accounts of departed employees: closed and sessions revoked.' }
      ]
    },
    {
      id: 'suspicious',
      title: { bg: 'Чеклист при подозрително съобщение', en: 'Suspicious email checklist' },
      intro: { bg: 'За всеки служител. Не изисква технически познания.', en: 'For any employee. No technical knowledge needed.' },
      items: [
        { bg: 'Не натискайте връзки и не отваряйте прикачени файлове.', en: 'Do not click links and do not open attachments.' },
        { bg: 'Не отговаряйте на съобщението и не препращайте на колеги за мнение.', en: 'Do not reply to the message and do not forward it to colleagues for an opinion.' },
        { bg: 'Проверете дали искането е за пари, данни за вход или смяна на банкова сметка.', en: 'Check whether the request concerns money, sign in details or a bank account change.' },
        { bg: 'Потвърдете самоличността на подателя по друг канал, на предварително известен номер.', en: 'Confirm the sender identity through a separate channel, on a previously known number.' },
        { bg: 'Запазете съобщението като файл .eml и го анализирайте тук.', en: 'Save the message as an .eml file and analyze it here.' },
        { bg: 'Съобщете на отговорния ИТ контакт, дори ако не сте сигурни.', en: 'Report to the responsible IT contact, even if you are not sure.' },
        { bg: 'Не изтривайте съобщението, преди някой да го е прегледал.', en: 'Do not delete the message before someone has reviewed it.' }
      ]
    },
    {
      id: 'incident-opened',
      title: { bg: 'Инцидент: съобщението е само отворено', en: 'Incident: the message was only opened' },
      intro: { bg: 'Няма натисната връзка и няма отворен файл.', en: 'No link was clicked and no file was opened.' },
      items: [
        { bg: 'Не се изисква спешно действие. Рискът е нисък.', en: 'No urgent action is required. The risk is low.' },
        { bg: 'Съобщете на ИТ контакта и запазете съобщението.', en: 'Report to the IT contact and keep the message.' },
        { bg: 'Проверете дали други колеги са получили същото съобщение.', en: 'Check whether other colleagues received the same message.' },
        { bg: 'Ако съобщението е показало отдалечени изображения, подателят вече знае, че адресът е активен.', en: 'If the message displayed remote images, the sender already knows the address is active.' }
      ]
    },
    {
      id: 'incident-clicked',
      title: { bg: 'Инцидент: натисната е връзка', en: 'Incident: a link was clicked' },
      intro: { bg: 'Отворена е страница, но не са въвеждани данни.', en: 'A page was opened but no data was entered.' },
      items: [
        { bg: 'Затворете раздела. Не въвеждайте нищо.', en: 'Close the tab. Do not enter anything.' },
        { bg: 'Ако е започнало изтегляне, не отваряйте файла и го изтрийте.', en: 'If a download started, do not open the file and delete it.' },
        { bg: 'Съобщете на ИТ контакта и опишете какво точно се е случило.', en: 'Report to the IT contact and describe exactly what happened.' },
        { bg: 'Проверете дали устройството е с актуални обновления и антивирусна защита.', en: 'Check that the device has current updates and antivirus protection.' },
        { bg: 'Наблюдавайте профила за необичайни известия за вход през следващите дни.', en: 'Watch the account for unusual sign in notifications over the next few days.' }
      ]
    },
    {
      id: 'incident-credentials',
      title: { bg: 'Инцидент: въведени са данни за вход', en: 'Incident: credentials were entered' },
      intro: { bg: 'Действайте веднага и по този ред.', en: 'Act immediately and in this order.' },
      items: [
        { bg: 'Сменете паролата незабавно от друго, чисто устройство.', en: 'Change the password immediately from another, clean device.' },
        { bg: 'Прекратете всички активни сесии на профила.', en: 'Revoke all active sessions for the account.' },
        { bg: 'Проверете правилата за препращане и правилата в кутията за непознати записи.', en: 'Check forwarding rules and inbox rules for entries nobody recognizes.' },
        { bg: 'Проверете регистрираните втори фактори и премахнете непознатите.', en: 'Check the registered second factors and remove any that are unfamiliar.' },
        { bg: 'Проверете разрешенията, дадени на приложения от този профил.', en: 'Review the permissions granted to applications from this account.' },
        { bg: 'Ако същата парола се използва другаде, сменете я и там.', en: 'If the same password is used elsewhere, change it there as well.' },
        { bg: 'Съобщете на управлението и на ИТ контакта.', en: 'Inform management and the IT contact.' },
        { bg: 'Прегледайте изпратената поща за съобщения, които не сте писали.', en: 'Review the sent folder for messages you did not write.' }
      ]
    },
    {
      id: 'incident-mfa',
      title: { bg: 'Инцидент: потвърден е неочакван втори фактор', en: 'Incident: an unexpected second factor was approved' },
      intro: { bg: 'Това означава, че някой вече е имал вашата парола.', en: 'This means someone already had your password.' },
      items: [
        { bg: 'Сменете паролата незабавно.', en: 'Change the password immediately.' },
        { bg: 'Прекратете всички активни сесии.', en: 'Revoke all active sessions.' },
        { bg: 'Проверете кои втори фактори са регистрирани и премахнете непознатите.', en: 'Check which second factors are registered and remove any unfamiliar ones.' },
        { bg: 'Проверете правилата за препращане и правилата в кутията.', en: 'Check forwarding rules and inbox rules.' },
        { bg: 'Съобщете веднага. Потвърденото известие означава активен опит за достъп.', en: 'Report immediately. An approved prompt means an active access attempt.' },
        { bg: 'Обмислете преминаване към устойчива на фишинг MFA за този профил.', en: 'Consider moving this account to phishing resistant MFA.' }
      ]
    },
    {
      id: 'incident-compromise',
      title: { bg: 'Инцидент: съмнение за компрометиран профил', en: 'Incident: account compromise suspected' },
      intro: { bg: 'Има признаци, че някой друг използва профила.', en: 'There are signs that someone else is using the account.' },
      items: [
        { bg: 'Прекратете сесиите и сменете паролата.', en: 'Revoke the sessions and change the password.' },
        { bg: 'Проверете и премахнете непознати правила за препращане и правила в кутията.', en: 'Check and remove unfamiliar forwarding rules and inbox rules.' },
        { bg: 'Прегледайте дневника за вход: от кои места и устройства има достъп.', en: 'Review the sign in log: from which locations and devices access occurred.' },
        { bg: 'Прегледайте изпратената поща и кошчето за съобщения, изпратени от името на потребителя.', en: 'Review the sent folder and the trash for messages sent in the name of the user.' },
        { bg: 'Предупредете контрагентите, ако от кутията са изпращани фактури или искания за плащане.', en: 'Warn counterparties if invoices or payment requests were sent from the mailbox.' },
        { bg: 'Ако има превод, свържете се с банката веднага и поискайте спиране.', en: 'If a payment went out, contact the bank immediately and request a recall.' },
        { bg: 'Запазете доказателствата, преди да чистите: файлове .eml, екранни снимки, дневници.', en: 'Preserve evidence before cleaning up: .eml files, screenshots, logs.' },
        { bg: 'Преценете дали има задължение за уведомяване по приложимото законодателство.', en: 'Assess whether a notification obligation applies under the relevant legislation.' }
      ]
    }
  ];

  /* Decision trees. Each node is a question with options; an option either
     points to another node or ends the flow with an outcome. */
  C.trees = [
    {
      id: 'suspicious',
      title: { bg: 'Подозрително съобщение', en: 'Suspicious email' },
      start: 'q1',
      nodes: {
        q1: {
          q: { bg: 'Съобщението иска ли пари, данни за вход или смяна на банкова сметка?', en: 'Does the message ask for money, sign in details or a bank account change?' },
          options: [
            { label: { bg: 'Да', en: 'Yes' }, next: 'q2' },
            { label: { bg: 'Не', en: 'No' }, next: 'q3' }
          ]
        },
        q2: {
          q: { bg: 'Можете ли да се свържете с подателя на номер, който вече знаете отпреди?', en: 'Can you reach the sender on a number you already knew beforehand?' },
          options: [
            { label: { bg: 'Да', en: 'Yes' }, outcome: 'callback' },
            { label: { bg: 'Не', en: 'No' }, outcome: 'escalate' }
          ]
        },
        q3: {
          q: { bg: 'Има ли връзка или прикачен файл в съобщението?', en: 'Does the message contain a link or an attachment?' },
          options: [
            { label: { bg: 'Да', en: 'Yes' }, outcome: 'analyze' },
            { label: { bg: 'Не', en: 'No' }, outcome: 'lowrisk' }
          ]
        }
      },
      outcomes: {
        callback: {
          title: { bg: 'Потвърдете по телефон, преди да предприемете каквото и да е', en: 'Confirm by phone before you do anything' },
          steps: [
            { bg: 'Обадете се на номера, който знаете отпреди, а не на номер от съобщението.', en: 'Call the number you knew beforehand, not a number from the message.' },
            { bg: 'Не отговаряйте на самото съобщение, докато не потвърдите.', en: 'Do not reply to the message itself until you have confirmed.' },
            { bg: 'Ако потвърждението не стане, третирайте съобщението като измама и докладвайте.', en: 'If confirmation fails, treat the message as fraud and report it.' }
          ]
        },
        escalate: {
          title: { bg: 'Спрете и предайте на отговорния контакт', en: 'Stop and hand it to the responsible contact' },
          steps: [
            { bg: 'Не извършвайте плащане и не променяйте банкова сметка.', en: 'Do not make a payment and do not change a bank account.' },
            { bg: 'Запазете съобщението като .eml и го анализирайте тук.', en: 'Save the message as .eml and analyze it here.' },
            { bg: 'Съобщете на ИТ контакта и на управлението.', en: 'Report to the IT contact and to management.' }
          ]
        },
        analyze: {
          title: { bg: 'Анализирайте, без да отваряте нищо', en: 'Analyze without opening anything' },
          steps: [
            { bg: 'Не натискайте връзката и не отваряйте файла.', en: 'Do not click the link and do not open the file.' },
            { bg: 'Запазете съобщението като .eml и го заредете в раздел Анализ на имейл.', en: 'Save the message as .eml and load it in the Analyze email section.' },
            { bg: 'Ако анализът покаже умерено или високо подозрение, докладвайте.', en: 'If the analysis shows moderate or high suspicion, report it.' }
          ]
        },
        lowrisk: {
          title: { bg: 'Рискът изглежда нисък, но докладвайте', en: 'The risk looks low, but report it anyway' },
          steps: [
            { bg: 'Съобщение без искане, без връзка и без файл рядко води до вреда.', en: 'A message with no request, no link and no file rarely causes harm.' },
            { bg: 'Все пак съобщете, ако подателят е непознат и се представя за колега.', en: 'Still report it if the sender is unknown and claims to be a colleague.' },
            { bg: 'Не отговаряйте, за да проверите. Отговорът потвърждава, че адресът е активен.', en: 'Do not reply in order to check. A reply confirms the address is active.' }
          ]
        }
      }
    },
    {
      id: 'clicked',
      title: { bg: 'Натиснах връзка', en: 'I clicked a link' },
      start: 'q1',
      nodes: {
        q1: {
          q: { bg: 'Въведохте ли данни за вход или друга информация на отворената страница?', en: 'Did you enter credentials or any other information on the page that opened?' },
          options: [
            { label: { bg: 'Да', en: 'Yes' }, outcome: 'credentials' },
            { label: { bg: 'Не', en: 'No' }, next: 'q2' }
          ]
        },
        q2: {
          q: { bg: 'Изтегли ли се файл или поиска ли се инсталация?', en: 'Did a file download or was an installation requested?' },
          options: [
            { label: { bg: 'Да', en: 'Yes' }, outcome: 'download' },
            { label: { bg: 'Не', en: 'No' }, outcome: 'watch' }
          ]
        }
      },
      outcomes: {
        credentials: {
          title: { bg: 'Действайте като при разкрити данни за вход', en: 'Act as if credentials were disclosed' },
          steps: [
            { bg: 'Сменете паролата от друго устройство и прекратете всички сесии.', en: 'Change the password from another device and revoke all sessions.' },
            { bg: 'Проверете правилата за препращане и регистрираните втори фактори.', en: 'Check forwarding rules and registered second factors.' },
            { bg: 'Съобщете веднага. Вижте чеклиста за въведени данни за вход.', en: 'Report immediately. See the checklist for entered credentials.' }
          ]
        },
        download: {
          title: { bg: 'Не отваряйте файла', en: 'Do not open the file' },
          steps: [
            { bg: 'Изтрийте изтегления файл, без да го стартирате.', en: 'Delete the downloaded file without running it.' },
            { bg: 'Ако вече сте го стартирали, разкачете устройството от мрежата и съобщете веднага.', en: 'If you already ran it, disconnect the device from the network and report immediately.' },
            { bg: 'Не използвайте устройството за вход в други системи, докато не бъде проверено.', en: 'Do not use the device to sign in to other systems until it has been checked.' }
          ]
        },
        watch: {
          title: { bg: 'Затворете раздела и наблюдавайте', en: 'Close the tab and watch' },
          steps: [
            { bg: 'Затворете страницата и не се връщайте на нея.', en: 'Close the page and do not go back to it.' },
            { bg: 'Съобщете на ИТ контакта, за да може адресът да бъде блокиран за останалите.', en: 'Report to the IT contact so the address can be blocked for everyone else.' },
            { bg: 'Следете за необичайни известия за вход през следващите дни.', en: 'Watch for unusual sign in notifications over the next few days.' }
          ]
        }
      }
    },
    {
      id: 'credentials',
      title: { bg: 'Въведох данни за вход', en: 'I entered credentials' },
      start: 'q1',
      nodes: {
        q1: {
          q: { bg: 'Имате ли достъп до профила в момента?', en: 'Do you currently have access to the account?' },
          options: [
            { label: { bg: 'Да', en: 'Yes' }, outcome: 'selfservice' },
            { label: { bg: 'Не', en: 'No' }, outcome: 'lockedout' }
          ]
        }
      },
      outcomes: {
        selfservice: {
          title: { bg: 'Сменете паролата и прекратете сесиите сега', en: 'Change the password and revoke sessions now' },
          steps: [
            { bg: 'Сменете паролата от друго, чисто устройство.', en: 'Change the password from another, clean device.' },
            { bg: 'Прекратете всички активни сесии. Само смяната на паролата не изхвърля нападателя.', en: 'Revoke all active sessions. Changing the password alone does not eject an attacker.' },
            { bg: 'Проверете правилата за препращане, правилата в кутията и вторите фактори.', en: 'Check forwarding rules, inbox rules and second factors.' },
            { bg: 'Сменете паролата и там, където е използвана същата.', en: 'Change the password anywhere else the same one was used.' },
            { bg: 'Съобщете на ИТ контакта и на управлението.', en: 'Report to the IT contact and to management.' }
          ]
        },
        lockedout: {
          title: { bg: 'Профилът вероятно вече е превзет', en: 'The account is probably already taken over' },
          steps: [
            { bg: 'Свържете се незабавно с администратора по телефон, не по имейл.', en: 'Contact the administrator immediately by phone, not by email.' },
            { bg: 'Поискайте профилът да бъде спрян и сесиите прекратени.', en: 'Ask for the account to be suspended and the sessions revoked.' },
            { bg: 'Предупредете счетоводството и контрагентите, че от кутията може да се изпращат фалшиви искания.', en: 'Warn accounting and counterparties that fake requests may be sent from the mailbox.' },
            { bg: 'Запазете всички доказателства, преди да се чисти каквото и да е.', en: 'Preserve all evidence before anything is cleaned up.' }
          ]
        }
      }
    },
    {
      id: 'mfa',
      title: { bg: 'Потвърдих неочаквано известие за вход', en: 'I approved an unexpected sign in prompt' },
      start: 'q1',
      nodes: {
        q1: {
          q: { bg: 'Известието дойде ли, без вие да сте се опитвали да влезете?', en: 'Did the prompt arrive without you attempting to sign in?' },
          options: [
            { label: { bg: 'Да', en: 'Yes' }, outcome: 'compromised' },
            { label: { bg: 'Не съм сигурен', en: 'Not sure' }, outcome: 'compromised' },
            { label: { bg: 'Не, аз влизах', en: 'No, I was signing in' }, outcome: 'benign' }
          ]
        }
      },
      outcomes: {
        compromised: {
          title: { bg: 'Приемете, че паролата ви е известна на друг', en: 'Assume your password is known to someone else' },
          steps: [
            { bg: 'Сменете паролата веднага и прекратете всички сесии.', en: 'Change the password at once and revoke all sessions.' },
            { bg: 'Прегледайте регистрираните втори фактори и премахнете непознатите.', en: 'Review the registered second factors and remove unfamiliar ones.' },
            { bg: 'Проверете правилата за препращане и правилата в кутията.', en: 'Check forwarding rules and inbox rules.' },
            { bg: 'Съобщете веднага, дори ако нищо друго не изглежда нередно.', en: 'Report immediately, even if nothing else looks wrong.' },
            { bg: 'Обмислете устойчива на фишинг MFA за този профил.', en: 'Consider phishing resistant MFA for this account.' }
          ]
        },
        benign: {
          title: { bg: 'Вероятно е било вашето собствено влизане', en: 'It was probably your own sign in' },
          steps: [
            { bg: 'Ако сте се опитвали да влезете в същия момент, действие не е нужно.', en: 'If you were signing in at that moment, no action is needed.' },
            { bg: 'При най-малко съмнение прекратете сесиите. Това не струва нищо.', en: 'At the slightest doubt, revoke the sessions. It costs nothing.' },
            { bg: 'Проверете дневника за вход за места, които не разпознавате.', en: 'Check the sign in log for locations you do not recognize.' }
          ]
        }
      }
    },
    {
      id: 'compromise',
      title: { bg: 'Съмнение за превзет профил', en: 'Suspected account compromise' },
      start: 'q1',
      nodes: {
        q1: {
          q: { bg: 'Извършено ли е плащане или е сменена банкова сметка вследствие на съобщението?', en: 'Was a payment made or a bank account changed as a result of the message?' },
          options: [
            { label: { bg: 'Да', en: 'Yes' }, outcome: 'money' },
            { label: { bg: 'Не', en: 'No' }, next: 'q2' }
          ]
        },
        q2: {
          q: { bg: 'Има ли следи в кутията: непознати правила, изпратени съобщения или изтрити писма?', en: 'Are there traces in the mailbox: unfamiliar rules, sent messages or deleted mail?' },
          options: [
            { label: { bg: 'Да', en: 'Yes' }, outcome: 'contain' },
            { label: { bg: 'Не', en: 'No' }, outcome: 'monitor' }
          ]
        }
      },
      outcomes: {
        money: {
          title: { bg: 'Първо банката, после всичко останало', en: 'The bank first, everything else second' },
          steps: [
            { bg: 'Обадете се на банката веднага и поискайте спиране или връщане на превода. Минутите имат значение.', en: 'Call the bank immediately and request that the transfer be stopped or recalled. Minutes matter.' },
            { bg: 'Уведомете управлението.', en: 'Inform management.' },
            { bg: 'Запазете всички съобщения и документи като доказателство.', en: 'Preserve all messages and documents as evidence.' },
            { bg: 'Прекратете сесиите и сменете паролите на засегнатите профили.', en: 'Revoke sessions and change passwords on the affected accounts.' },
            { bg: 'Обмислете сигнал до компетентните органи.', en: 'Consider a report to the competent authorities.' }
          ]
        },
        contain: {
          title: { bg: 'Ограничете достъпа сега', en: 'Contain the access now' },
          steps: [
            { bg: 'Прекратете сесиите и сменете паролата.', en: 'Revoke the sessions and change the password.' },
            { bg: 'Премахнете непознатите правила, но първо ги запишете като доказателство.', en: 'Remove the unfamiliar rules, but record them as evidence first.' },
            { bg: 'Прегледайте изпратената поща и предупредете засегнатите контрагенти.', en: 'Review the sent folder and warn the affected counterparties.' },
            { bg: 'Проверете останалите профили за същите следи.', en: 'Check the remaining accounts for the same traces.' }
          ]
        },
        monitor: {
          title: { bg: 'Наблюдавайте и проверете основното', en: 'Monitor and check the basics' },
          steps: [
            { bg: 'Прегледайте дневника за вход за непознати места и устройства.', en: 'Review the sign in log for unfamiliar locations and devices.' },
            { bg: 'Прекратете сесиите, ако има и най-малко съмнение.', en: 'Revoke sessions if there is any doubt at all.' },
            { bg: 'Уверете се, че многофакторната автентикация е включена за профила.', en: 'Make sure multi factor authentication is enabled for the account.' },
            { bg: 'Съобщете наблюдението, за да бъде проверено и от друг.', en: 'Report the observation so someone else can check it too.' }
          ]
        }
      }
    }
  ];

})(window.SPDT);

/* ------------------------------------------------------------------
   Explanations. Every analyzer indicator and every domain record issue
   has a plain-language meaning and an explicit limitation, so that no
   finding is presented as proof on its own.
   ------------------------------------------------------------------ */

(function (SPDT) {
  'use strict';
  var C = SPDT.i18n.content;

  var indicators = {};
  function I(id, title, detail, limit) {
    indicators[id] = {
      title: { bg: title[0], en: title[1] },
      detail: { bg: detail[0], en: detail[1] },
      limit: { bg: limit[0], en: limit[1] }
    };
  }

  I('dmarc_fail',
    ['DMARC е с резултат fail', 'DMARC result is fail'],
    ['Получаващият сървър е записал, че съобщението не е преминало проверката, която свързва подписа или подателя с видимия домейн.',
     'The receiving server recorded that the message did not pass the check tying the signature or sender to the visible domain.'],
    ['Резултатът е записан от получателя и не се преизчислява тук. Препращане и пощенски списъци понякога чупят проверката и при легитимна поща.',
     'The result was recorded by the recipient and is not recomputed here. Forwarding and mailing lists sometimes break the check for legitimate mail too.']);

  I('spf_fail',
    ['SPF е с резултат fail', 'SPF result is fail'],
    ['Сървърът, изпратил съобщението, не е в списъка на разрешените за домейна в плика.',
     'The server that sent the message is not in the list of servers allowed for the envelope domain.'],
    ['SPF проверява адреса в плика, не видимия подател. Той почти винаги се проваля при препращане.',
     'SPF checks the envelope address, not the visible sender. It almost always fails on forwarded mail.']);

  I('spf_softfail',
    ['SPF е с резултат softfail', 'SPF result is softfail'],
    ['Домейнът обявява, че този сървър вероятно не е негов, но оставя решението на получателя.',
     'The domain states that this server is probably not its own but leaves the decision to the recipient.'],
    ['Много организации остават на softfail за постоянно, така че сам по себе си този резултат е слаб сигнал.',
     'Many organizations stay on softfail permanently, so on its own this result is a weak signal.']);

  I('spf_none',
    ['SPF не дава резултат', 'SPF produced no result'],
    ['Домейнът няма запис или проверката не е могла да бъде извършена.',
     'The domain has no record, or the check could not be completed.'],
    ['Липсата на SPF е слабост на подателя, а не доказателство за измама.',
     'A missing SPF record is a weakness of the sender, not evidence of fraud.']);

  I('dkim_fail',
    ['DKIM е с резултат fail', 'DKIM result is fail'],
    ['Подписът не съответства на съдържанието или ключът не е бил намерен.',
     'The signature does not match the content, or the key could not be found.'],
    ['Защитни шлюзове и пощенски списъци често променят съобщението и развалят валиден подпис.',
     'Security gateways and mailing lists often modify a message and break a valid signature.']);

  I('dkim_absent',
    ['Съобщението не е подписано с DKIM', 'The message carries no DKIM signature'],
    ['Няма криптографски подпис, с който съдържанието да бъде проверено.',
     'There is no cryptographic signature with which the content can be verified.'],
    ['Много малки организации още не подписват изходящата си поща. Това не е индикатор за измама.',
     'Many small organizations still do not sign their outgoing mail. This is not an indicator of fraud.']);

  I('auth_absent',
    ['Липсва поле Authentication-Results', 'No Authentication-Results field'],
    ['Файлът не съдържа записани резултати от проверките на получаващия сървър.',
     'The file contains no recorded results from the checks of the receiving server.'],
    ['Това е нормално за съобщение, запазено от папка Чернови, от изпратени или преди обработка. Не е индикатор за измама.',
     'This is normal for a message saved from drafts, from sent mail, or before processing. It is not an indicator of fraud.']);

  I('auth_malformed',
    ['Полето Authentication-Results не може да бъде разчетено', 'The Authentication-Results field cannot be read'],
    ['Полето съществува, но съдържанието му не следва очаквания формат.',
     'The field exists but its content does not follow the expected format.'],
    ['Причината може да е нестандартен сървър или повреден при запазването файл, а не манипулация.',
     'The cause may be a nonstandard server or a file damaged while saving, rather than manipulation.']);

  I('replyto_mismatch',
    ['Отговорът отива към друг домейн', 'A reply would go to a different domain'],
    ['Полето Reply-To сочи домейн, различен от този на подателя. Отговорът ви няма да стигне до видимия подател.',
     'The Reply-To field points to a domain different from the sender. Your reply would not reach the visible sender.'],
    ['Има легитимни употреби: услуги за поддръжка, бюлетини и системи за билети често задават друг адрес за отговор.',
     'There are legitimate uses: helpdesks, newsletters and ticketing systems often set a different reply address.']);

  I('returnpath_mismatch',
    ['Return-Path е на друг домейн', 'Return-Path is at a different domain'],
    ['Адресът за връщане при неуспешна доставка не съвпада с домейна на подателя.',
     'The address for delivery failures does not match the sender domain.'],
    ['Това е обичайно при масови разпращания и външни доставчици. Тежестта е ниска именно затова.',
     'This is common with bulk mailing and external providers. That is exactly why the weight is low.']);

  I('display_address_mismatch',
    ['Показваното име съдържа друг адрес', 'The display name contains a different address'],
    ['Името, което виждате, съдържа имейл адрес, различен от истинския адрес на подателя.',
     'The name you see contains an email address different from the real sender address.'],
    ['Класически трик, но понякога е следствие от неправилно настроен клиент, който вмъква адрес в името.',
     'A classic trick, though it is occasionally the result of a misconfigured client inserting an address into the name.']);

  I('display_domain_mismatch',
    ['Показваното име сочи чужд домейн', 'The display name names a different domain'],
    ['Името споменава домейн, който не съвпада с домейна на действителния подател.',
     'The name mentions a domain that does not match the domain of the actual sender.'],
    ['Много организации законно изпращат от домейн на доставчик, като запазват марката в името.',
     'Many organizations legitimately send from a provider domain while keeping their brand in the name.']);

  I('from_punycode',
    ['Домейнът на подателя използва пюникод', 'The sender domain uses punycode'],
    ['Домейнът съдържа знаци извън латиницата, записани във вида xn--. Показан е и разчетеният вид.',
     'The domain contains characters outside the Latin alphabet, written in the xn-- form. The readable form is shown as well.'],
    ['Домейните на кирилица са напълно легитимни. Значение има дали разчетеният вид наподобява друга марка.',
     'Cyrillic domain names are entirely legitimate. What matters is whether the readable form imitates another brand.']);

  I('from_mixed_script',
    ['Смесени азбуки в името на подателя', 'Mixed alphabets in the sender name'],
    ['Една и съща дума съдържа едновременно латински и кирилски или гръцки букви, които изглеждат еднакво.',
     'A single word contains both Latin and Cyrillic or Greek letters that look identical.'],
    ['Проверката гледа само в рамките на една част от името. Изцяло кирилско име не се отчита като проблем.',
     'The check looks within a single name part only. A name written entirely in Cyrillic is not treated as a problem.']);

  I('from_multiple',
    ['Полето From съдържа повече от един адрес', 'The From field contains more than one address'],
    ['Съобщението обявява няколко подателя, което е рядкост и затруднява проверката на самоличността.',
     'The message declares several senders, which is rare and makes identity checking harder.'],
    ['Технически това е позволено и се среща при автоматизирани системи.',
     'This is technically permitted and does occur with automated systems.']);

  I('sender_mismatch',
    ['Полето Sender е на друг домейн', 'The Sender field is at a different domain'],
    ['Съобщението е предадено от името на друг подател.',
     'The message was submitted on behalf of a different sender.'],
    ['Това е нормално при асистенти, пощенски списъци и маркетингови платформи.',
     'This is normal with assistants, mailing lists and marketing platforms.']);

  I('url_ip_host',
    ['Адрес с числов IP вместо име', 'A URL with a numeric IP instead of a name'],
    ['Връзката води директно към числов адрес, което заобикаля всякаква проверка на домейн.',
     'The link points directly at a numeric address, which bypasses any domain based check.'],
    ['Някои вътрешни системи и устройства законно използват числови адреси.',
     'Some internal systems and devices legitimately use numeric addresses.']);

  I('url_punycode',
    ['Адрес с пюникод в името на хоста', 'A URL with punycode in the host name'],
    ['Хостът съдържа знаци извън латиницата. Показан е разчетеният вид, за да се види имитацията.',
     'The host contains characters outside the Latin alphabet. The readable form is shown so that any imitation becomes visible.'],
    ['Не всеки такъв адрес е измамен. Сравнете разчетения вид с домейна, който познавате.',
     'Not every such address is fraudulent. Compare the readable form with the domain you know.']);

  I('url_mixed_script',
    ['Смесени азбуки в името на хоста', 'Mixed alphabets in the host name'],
    ['Част от името на хоста комбинира букви от различни азбуки, които изглеждат еднакво.',
     'Part of the host name combines letters from different alphabets that look identical.'],
    ['Проверката е ограничена до латиница, кирилица и гръцки.',
     'The check is limited to Latin, Cyrillic and Greek.']);

  I('url_userinfo',
    ['Адресът съдържа знак @ преди хоста', 'The URL contains an @ before the host'],
    ['Всичко преди знака @ се игнорира от браузъра. Истинската цел е това, което следва след него.',
     'Everything before the @ is ignored by the browser. The real destination is whatever follows it.'],
    ['Рядко се среща при легитимни адреси в имейл.',
     'Rare in legitimate URLs sent by email.']);

  I('url_text_mismatch',
    ['Видимият текст не съвпада с целта', 'The visible text does not match the destination'],
    ['Връзката показва един домейн, а води към друг.',
     'The link shows one domain and leads to another.'],
    ['Системите за проследяване на кликове правят същото при напълно легитимни бюлетини.',
     'Click tracking systems do the same thing in entirely legitimate newsletters.']);

  I('url_shortener',
    ['Скъсен адрес', 'A shortened URL'],
    ['Крайната цел не се вижда, преди връзката да бъде отворена.',
     'The final destination is not visible before the link is opened.'],
    ['Скъсяването е широко разпространено и само по себе си не е признак за измама.',
     'Shortening is widespread and by itself is not a sign of fraud.']);

  I('url_many_subdomains',
    ['Много поддомейни в адреса', 'Many subdomains in the URL'],
    ['Дълга верига от поддомейни често се използва, за да изглежда началото на адреса познато.',
     'A long chain of subdomains is often used to make the beginning of the address look familiar.'],
    ['Големи доставчици на услуги също използват дълбоки имена.',
     'Large service providers also use deep names.']);

  I('url_very_long',
    ['Много дълъг адрес', 'A very long URL'],
    ['Дължината затруднява потребителя да види истинската цел.',
     'The length makes it hard for a user to see the real destination.'],
    ['Дългите адреси са често срещани при системи за проследяване и при облачни услуги.',
     'Long URLs are common in tracking systems and cloud services.']);

  I('url_encoded',
    ['Кодирани знаци в името на хоста', 'Encoded characters in the host name'],
    ['Името на хоста съдържа процентно кодиране, което скрива истинската му стойност.',
     'The host name contains percent encoding, which hides its real value.'],
    ['Кодиране в пътя или параметрите е нормално. Тук се отчита само кодиране в самия хост.',
     'Encoding in the path or the parameters is normal. Only encoding in the host itself is counted here.']);

  I('url_redirect_param',
    ['Друг адрес, вграден като параметър', 'Another address embedded as a parameter'],
    ['Адресът съдържа параметър, който сочи към втори адрес. Така познат домейн може да пренасочи другаде.',
     'The URL contains a parameter pointing at a second address. A familiar domain can redirect elsewhere this way.'],
    ['Пренасочващите параметри се използват законно при входове и при връщане към страница.',
     'Redirect parameters are used legitimately in sign in flows and return to page links.']);

  I('url_odd_port',
    ['Нестандартен порт', 'A nonstandard port'],
    ['Адресът сочи към порт, различен от обичайните за уеб.',
     'The address points to a port other than the usual web ports.'],
    ['Вътрешни и тестови системи често използват други портове.',
     'Internal and test systems often use other ports.']);

  I('url_dangerous_scheme',
    ['Опасна схема на адреса', 'A dangerous URL scheme'],
    ['Адресът използва схема като javascript или data, която не води към уеб страница, а изпълнява съдържание.',
     'The address uses a scheme such as javascript or data, which does not lead to a page but executes content.'],
    ['Такива адреси не се отварят и не се изпълняват от този инструмент.',
     'Such addresses are never opened or executed by this toolkit.']);

  I('html_form',
    ['Съобщението съдържа формуляр за въвеждане', 'The message contains an input form'],
    ['В самия имейл има поле за въвеждане, което изпраща данните към външен адрес.',
     'The message itself contains an input field that submits data to an external address.'],
    ['Повечето съвременни пощенски клиенти не позволяват изпращане от такъв формуляр, но присъствието му е необичайно.',
     'Most modern mail clients do not allow submission from such a form, but its presence is unusual.']);

  I('hidden_chars',
    ['Невидими знаци в текста', 'Invisible characters in the text'],
    ['Текстът съдържа знаци с нулева ширина или знаци за смяна на посоката, които се използват за заобикаляне на филтри.',
     'The text contains zero width or direction changing characters, which are used to evade filters.'],
    ['Такива знаци се появяват и при копиране от други програми.',
     'Such characters also appear when text is copied from other programs.']);

  I('att_executable',
    ['Прикачен изпълним файл', 'An executable attachment'],
    ['Разширението на файла принадлежи на категория, която може да изпълни код при отваряне.',
     'The file extension belongs to a category that can execute code when opened.'],
    ['Преценката е само по името. Файлът не е отварян, разархивиран или анализиран.',
     'The judgement is based on the name alone. The file was not opened, decompressed or analyzed.']);

  I('att_double_ext',
    ['Двойно разширение на файла', 'A double file extension'],
    ['Името завършва с второ разширение след първото, за да изглежда като документ.',
     'The name ends with a second extension after the first, so that it looks like a document.'],
    ['Има редки легитимни случаи, например архив на документ.',
     'There are rare legitimate cases, for example an archive of a document.']);

  I('att_macro',
    ['Документ с разрешени макроси', 'A macro enabled document'],
    ['Форматът позволява вграден код, който се изпълнява при отваряне на документа.',
     'The format allows embedded code that runs when the document is opened.'],
    ['Много счетоводни и складови системи законно използват такива файлове.',
     'Many accounting and inventory systems legitimately use such files.']);

  I('att_html',
    ['Прикачен файл с уеб съдържание', 'An attachment with web content'],
    ['Прикачените страници често съдържат имитация на вход, която се отваря локално и заобикаля проверката на адреса.',
     'Attached pages often contain an imitation sign in form that opens locally and bypasses address checks.'],
    ['Някои системи законно изпращат отчети като приложен файл с уеб съдържание.',
     'Some systems legitimately send reports as an attached web page.']);

  I('att_archive',
    ['Прикачен архив', 'An archived attachment'],
    ['Съдържанието на архива не може да бъде видяно, без той да бъде отворен.',
     'The content of the archive cannot be seen without opening it.'],
    ['Архивите са всекидневен начин за изпращане на документи. Инструментът не ги отваря.',
     'Archives are an everyday way of sending documents. The toolkit does not open them.']);

  I('att_type_mismatch',
    ['Разширението не отговаря на обявения тип', 'The extension does not match the declared type'],
    ['Името на файла обещава един формат, а съобщението обявява друг.',
     'The file name promises one format while the message declares another.'],
    ['Много системи обявяват общ тип за всички прикачени файлове. Отчита се само явно противоречие.',
     'Many systems declare a generic type for every attachment. Only a clear contradiction is counted.']);

  I('received_malformed',
    ['Повреден запис в маршрута', 'A malformed entry in the route'],
    ['Един от записите Received не съдържа нито изпращащ, нито приемащ сървър.',
     'One of the Received entries names neither a sending nor a receiving server.'],
    ['Нестандартни сървъри и вътрешни системи също произвеждат непълни записи.',
     'Nonstandard servers and internal systems also produce incomplete entries.']);

  I('received_many',
    ['Необичайно много междинни сървъри', 'An unusually high number of intermediate servers'],
    ['Съобщението е минало през повече сървъри от обичайното.',
     'The message passed through more servers than usual.'],
    ['Препращане, пощенски списъци и защитни шлюзове добавят записи. Дългият маршрут не означава фишинг.',
     'Forwarding, mailing lists and security gateways add entries. A long route does not mean phishing.']);

  I('date_anomaly',
    ['Датата се разминава с маршрута', 'The date does not match the route'],
    ['Обявената дата на съобщението се различава значително от времето, записано от сървърите.',
     'The declared message date differs significantly from the time recorded by the servers.'],
    ['Грешно настроен часовник при подателя дава същия резултат.',
     'A wrongly set clock at the sender produces the same result.']);

  C.indicators = indicators;

  /* ---- next steps shown with each verdict ---- */
  C.nextSteps = {
    high: [
      { bg: 'Не отваряйте връзките и не стартирайте прикачените файлове.', en: 'Do not open the links and do not run the attachments.' },
      { bg: 'Не отговаряйте на съобщението.', en: 'Do not reply to the message.' },
      { bg: 'Потвърдете подателя по друг канал, на предварително известен номер.', en: 'Confirm the sender through a separate channel, on a previously known number.' },
      { bg: 'Съобщете на отговорния ИТ контакт и запазете файла .eml.', en: 'Report to the responsible IT contact and keep the .eml file.' }
    ],
    moderate: [
      { bg: 'Не взаимодействайте с връзките, преди да проверите подателя.', en: 'Do not interact with the links before you have checked the sender.' },
      { bg: 'Разгледайте техническите подробности по-долу и преценете дали има обяснение.', en: 'Read the technical details below and consider whether there is an explanation.' },
      { bg: 'При съмнение потвърдете по телефон и съобщете.', en: 'If in doubt, confirm by phone and report it.' }
    ],
    low: [
      { bg: 'Не са открити силни технически индикатори, но това не доказва, че съобщението е безопасно.', en: 'No strong technical indicators were found, but that does not prove the message is safe.' },
      { bg: 'Ако съобщението иска пари, данни за вход или смяна на сметка, потвърдете по друг канал.', en: 'If the message asks for money, credentials or an account change, confirm through another channel.' }
    ],
    manual: [
      { bg: 'Няма достатъчно записани резултати, за да се прецени автоматично.', en: 'There are not enough recorded results to judge automatically.' },
      { bg: 'Потвърдете подателя по друг канал, преди да предприемете действие.', en: 'Confirm the sender through another channel before taking action.' },
      { bg: 'Ако е възможно, изтеглете съобщението отново директно от пощенския клиент.', en: 'If possible, download the message again directly from the mail client.' }
    ],
    insufficient: [
      { bg: 'Файлът не съдържа достатъчно технически данни за анализ.', en: 'The file does not contain enough technical data for analysis.' },
      { bg: 'Проверете дали е запазен като необработен източник, а не като чернова или препратено съобщение.', en: 'Check that it was saved as raw source rather than as a draft or a forwarded message.' }
    ]
  };

  /* ---- domain record issues ---- */
  var issues = {};
  function D(id, bg, en) { issues[id] = { bg: bg, en: en }; }

  D('spf_no_version', 'Записът не започва с v=spf1 и няма да бъде разчетен като SPF.', 'The record does not begin with v=spf1 and will not be read as SPF.');
  D('spf_plus_all', 'Записът завършва с +all, което разрешава на всеки сървър да изпраща от името на домейна. Това обезсмисля SPF.', 'The record ends with +all, which allows any server to send for the domain. This defeats the purpose of SPF.');
  D('spf_ptr', 'Механизмът ptr е остарял и не се препоръчва от RFC 7208.', 'The ptr mechanism is deprecated and not recommended by RFC 7208.');
  D('spf_no_all', 'Записът няма завършващ механизъм all, така че поведението при непознат сървър е неопределено.', 'The record has no terminating all mechanism, so the behaviour for an unknown server is undefined.');
  D('spf_all_not_last', 'Механизмът all не е последен. Всичко след него се пренебрегва.', 'The all mechanism is not last. Everything after it is ignored.');
  D('spf_lookup_limit', 'Записът надвишава ограничението от десет DNS заявки. Проверката се проваля изцяло, включително за легитимна поща.', 'The record exceeds the limit of ten DNS lookups. The evaluation fails entirely, including for legitimate mail.');
  D('spf_lookup_close', 'Записът се доближава до ограничението от десет DNS заявки. Добавянето на още един подател може да го счупи.', 'The record is close to the limit of ten DNS lookups. Adding one more sender could break it.');
  D('spf_unknown_mechanism', 'Записът съдържа непознат механизъм.', 'The record contains an unknown mechanism.');
  D('spf_unknown_modifier', 'Записът съдържа непознат модификатор.', 'The record contains an unknown modifier.');
  D('dmarc_no_version', 'Записът не започва с v=DMARC1 и няма да бъде приложен.', 'The record does not begin with v=DMARC1 and will not be applied.');
  D('dmarc_no_policy', 'Липсва тагът p. При наличие на валиден адрес за отчети получателите третират записа като p=none.', 'The p tag is missing. When a valid report address is present, receivers treat the record as p=none.');
  D('dmarc_bad_policy', 'Стойност на политика извън none, quarantine и reject.', 'A policy value outside none, quarantine and reject.');
  D('dmarc_bad_tag', 'Частта не е във вид таг=стойност.', 'A part is not in tag=value form.');
  D('dmarc_unknown_tag', 'Записът съдържа таг извън спецификацията.', 'The record contains a tag outside the specification.');
  D('dmarc_bad_uri', 'Адресът за отчети не започва с mailto: и ще бъде пренебрегнат.', 'The report address does not begin with mailto: and will be ignored.');
  D('dmarc_no_rua', 'Няма адрес за обобщени отчети, така че не получавате данни кой изпраща от името на домейна.', 'There is no aggregate report address, so you receive no data about who sends for the domain.');
  D('dmarc_deprecated_tags', 'Записът съдържа тагове, отпаднали в RFC 9989: pct, rf или ri. Те се пренебрегват от новите получатели.', 'The record contains tags removed in RFC 9989: pct, rf or ri. New receivers ignore them.');
  D('dkim_bad_version', 'Записът не обявява v=DKIM1.', 'The record does not declare v=DKIM1.');
  D('dkim_revoked', 'Тагът p е празен, което означава отменен ключ. Подписите с този селектор няма да бъдат приети.', 'The p tag is empty, which means a revoked key. Signatures with this selector will not be accepted.');
  D('dkim_no_key', 'Записът не съдържа таг p с публичен ключ.', 'The record contains no p tag with a public key.');
  D('dkim_short_key', 'Ключът изглежда по-къс от 1024 бита, което вече не се смята за достатъчно.', 'The key appears shorter than 1024 bits, which is no longer considered sufficient.');
  D('mtasts_no_version', 'Записът не обявява v=STSv1.', 'The record does not declare v=STSv1.');
  D('mtasts_no_id', 'Липсва таг id, който е задължителен.', 'The mandatory id tag is missing.');
  D('tlsrpt_no_version', 'Записът не обявява v=TLSRPTv1.', 'The record does not declare v=TLSRPTv1.');
  D('tlsrpt_no_rua', 'Няма адрес, на който да пристигат отчетите.', 'There is no address for the reports to arrive at.');
  D('bimi_no_version', 'Записът не обявява v=BIMI1.', 'The record does not declare v=BIMI1.');

  C.domainIssues = issues;

  C.domainNotes = {
    spfMissing: { bg: 'Няма SPF запис. Всеки сървър може да изпраща поща с вашия домейн в плика. Започнете с ~all, след като съставите списък на подателите.',
                  en: 'There is no SPF record. Any server can send mail with your domain in the envelope. Start with ~all after you have inventoried your senders.' },
    spfSoft: { bg: 'Записът завършва с ~all. Това е разумно междинно състояние. Минете към -all само след като сте сигурни, че списъкът с податели е пълен.',
               en: 'The record ends with ~all. This is a sensible intermediate state. Move to -all only once you are confident the sender inventory is complete.' },
    spfHard: { bg: 'Записът завършва с -all. Всеки нов подател, който не бъде добавен, ще спре да достига получателите.',
               en: 'The record ends with -all. Any new sender that is not added will stop reaching recipients.' },
    dmarcMissing: { bg: 'Няма DMARC запис. Започнете с p=none и адрес за обобщени отчети, а не директно с прилагане на политика.',
                    en: 'There is no DMARC record. Start with p=none and an aggregate report address rather than going straight to enforcement.' },
    dmarcNone: { bg: 'Политиката е p=none. Наблюдението работи, но нищо не се прилага. Затягайте едва след като отчетите показват само разпознати податели.',
                 en: 'The policy is p=none. Monitoring works but nothing is enforced. Tighten only once the reports show recognized senders only.' },
    dmarcTest: { bg: 'Тагът t=y изключва прилагането на политиката. Обявеното p не действа, докато този таг присъства.',
                 en: 'The t=y tag disables enforcement. The published p has no effect while this tag is present.' },
    dmarcQuarantine: { bg: 'Политиката е quarantine. Подправените съобщения отиват в спам. Преминете към reject само след устойчив период без провали на легитимни податели.',
                       en: 'The policy is quarantine. Spoofed messages go to spam. Move to reject only after a sustained period with no legitimate senders failing.' },
    dmarcReject: { bg: 'Политиката е reject. Проверявайте и паркираните домейни, от които не изпращате поща.',
                   en: 'The policy is reject. Check parked domains that you never send from as well.' },
    dmarcExternal: { bg: 'Адресът за отчети е на друг домейн. Този домейн трябва да публикува разрешаващ запис, иначе отчетите няма да пристигат.',
                     en: 'The report address is at another domain. That domain must publish an authorization record, otherwise the reports will not arrive.' },
    dkimUnknown: { bg: 'Не е предоставен селектор, затова DKIM не е проверяван. Липсата на резултат тук не означава, че DKIM липсва.',
                   en: 'No selector was provided, so DKIM was not checked. The absence of a result here does not mean DKIM is missing.' },
    dkimNotFound: { bg: 'Този селектор не е намерен. Възможно е домейнът да използва друг селектор.',
                    en: 'This selector was not found. The domain may use a different selector.' },
    mtastsPolicy: { bg: 'Открит е само DNS записът. Файлът с политиката се обслужва по HTTPS и умишлено не се изтегля от този инструмент, затова реалното състояние не е потвърдено.',
                    en: 'Only the DNS record was found. The policy file is served over HTTPS and is deliberately not fetched by this toolkit, so the real state is unconfirmed.' },
    bimiInfo: { bg: 'BIMI е механизъм за показване на лого, а не защитна мярка. Резултатът тук е само информационен и не влиза в оценката.',
                en: 'BIMI is a logo display mechanism, not a security control. The result here is informational and does not count towards the assessment.' },
    multipleSpf: { bg: 'Открити са няколко SPF записа. Това прави проверката невалидна. Трябва да остане само един.',
                   en: 'Several SPF records were found. This makes the evaluation invalid. Only one should remain.' },
    spfChain: { bg: 'Проследяване на включванията: показаният брой заявки включва вложените записи.',
                en: 'Include following: the shown lookup count includes nested records.' }
  };

  /* What each queried DNS name is for, in plain words. */
  C.queryPurpose = {
    mx: { bg: 'MX: кои сървъри приемат поща за домейна. Показва при кой доставчик стои пощата.',
          en: 'MX: which servers accept mail for the domain. Shows which provider hosts the mailboxes.' },
    spf: { bg: 'SPF: списъкът със сървъри, на които е разрешено да изпращат поща от името на домейна.',
           en: 'SPF: the list of servers allowed to send mail on behalf of the domain.' },
    dmarc: { bg: 'DMARC: какво да прави получателят, когато писмото не мине проверките, и къде да праща отчети.',
             en: 'DMARC: what a receiver should do when a message fails the checks, and where to send reports.' },
    mtasts: { bg: 'MTA-STS: изисква ли домейнът шифрована връзка при доставка на поща.',
              en: 'MTA-STS: whether the domain requires an encrypted connection for mail delivery.' },
    tlsrpt: { bg: 'TLS-RPT: адрес, на който други сървъри съобщават за неуспешно шифроване.',
              en: 'TLS-RPT: an address where other servers report failed encryption.' },
    bimi: { bg: 'BIMI: показване на лого в пощенския клиент. Информативно, не е защитна мярка.',
            en: 'BIMI: logo display in the mail client. Informational, not a security control.' },
    dkim: { bg: 'DKIM: публичният ключ за този селектор, с който се проверява подписът на писмата.',
            en: 'DKIM: the public key for this selector, used to verify the signature on messages.' }
  };

})(window.SPDT);
