/* rules.js
   Organizational self assessment and the recommendation catalog.

   The questionnaire never asks for a company name, a person, a domain, an
   address or any other identifier. Answers stay in memory and are used only
   to order the recommendations.

   Defines window.SPDT.rules */

window.SPDT = window.SPDT || {};

(function (SPDT) {
  'use strict';

  function L(bg, en) { return { bg: bg, en: en }; }

  /* =================================================================
     1. Questionnaire
     ================================================================= */

  var QUESTIONS = [
    {
      id: 'size',
      title: L('Колко души работят в организацията?', 'How many people work in the organization?'),
      options: [
        { value: 'micro', label: L('До 5', 'Up to 5') },
        { value: 'small', label: L('6 до 20', '6 to 20') },
        { value: 'medium', label: L('21 до 50', '21 to 50') },
        { value: 'large', label: L('Над 50', 'More than 50') }
      ]
    },
    {
      id: 'model',
      title: L('Как работят хората?', 'How do people work?'),
      options: [
        { value: 'onsite', label: L('Основно в офис', 'Mainly on site') },
        { value: 'hybrid', label: L('Смесено', 'Hybrid') },
        { value: 'remote', label: L('Основно от разстояние', 'Mainly remote') }
      ]
    },
    {
      id: 'profile',
      title: L('Какъв е комуникационният профил?', 'What is the communication profile?'),
      help: L('Това определя кое е нормално за вас, а не кое е подозрително.',
              'This defines what is normal for you rather than what is suspicious.'),
      options: [
        { value: 'internal', label: L('Основно вътрешна комуникация', 'Mainly internal communication') },
        { value: 'partners', label: L('С познати партньори и доставчици', 'With known partners and suppliers') },
        { value: 'clients', label: L('Директно с клиенти', 'Directly with clients') },
        { value: 'outsourcing', label: L('Аутсорсинг или работа по чужди проекти', 'Outsourcing or work on client projects') }
      ]
    },
    {
      id: 'unknown',
      title: L('Колко често получавате писма от напълно непознати податели?', 'How often do you receive mail from completely unknown senders?'),
      options: [
        { value: 'rare', label: L('Рядко', 'Rarely') },
        { value: 'weekly', label: L('Всяка седмица', 'Every week') },
        { value: 'daily', label: L('Всеки ден, това е част от работата', 'Every day, it is part of the job') }
      ]
    },
    {
      id: 'attachments',
      title: L('Колко често отваряте прикачени файлове от външни податели?', 'How often do you open attachments from external senders?'),
      options: [
        { value: 'rare', label: L('Рядко', 'Rarely') },
        { value: 'regular', label: L('Редовно', 'Regularly') },
        { value: 'core', label: L('Постоянно, това е основна дейност', 'Constantly, it is a core activity') }
      ]
    },
    {
      id: 'payments',
      title: L('Извършват ли се плащания или смени на банкови сметки по имейл?', 'Are payments or bank account changes handled over email?'),
      options: [
        { value: 'no', label: L('Не', 'No') },
        { value: 'sometimes', label: L('Понякога', 'Sometimes') },
        { value: 'often', label: L('Редовно', 'Regularly') }
      ]
    },
    {
      id: 'roles',
      type: 'multi',
      title: L('Кои роли съществуват в организацията?', 'Which roles exist in the organization?'),
      help: L('Отбележете всички, които се отнасят за вас.', 'Tick every one that applies to you.'),
      options: [
        { value: 'finance', label: L('Счетоводство или финанси', 'Accounting or finance') },
        { value: 'management', label: L('Управление с право на плащания', 'Management with payment authority') },
        { value: 'hr', label: L('Човешки ресурси или подбор', 'Human resources or recruitment') },
        { value: 'itadmin', label: L('Администратор на системи', 'System administrator') },
        { value: 'sales', label: L('Продажби или поддръжка на клиенти', 'Sales or customer support') }
      ]
    },
    {
      id: 'criticality',
      title: L('Какво би станало, ако пощата на ключов човек е недостъпна или превзета за седмица?',
               'What would happen if a key person mailbox were unavailable or taken over for a week?'),
      options: [
        { value: 'low', label: L('Неудобство, но работата продължава', 'Inconvenient, but work continues') },
        { value: 'medium', label: L('Сериозни забавяния и загуба на клиенти', 'Serious delays and lost clients') },
        { value: 'high', label: L('Спиране на дейността или значителна финансова щета', 'Business stoppage or significant financial damage') }
      ]
    },
    {
      id: 'mfa',
      title: L('Каква е ситуацията с многофакторната автентикация?', 'What is the state of multi factor authentication?'),
      options: [
        { value: 'none', label: L('Няма или не знам', 'None, or I do not know') },
        { value: 'some', label: L('Само за някои профили', 'Only for some accounts') },
        { value: 'all', label: L('За всички профили', 'For all accounts') },
        { value: 'resistant', label: L('За всички, а за критичните роли с ключове или паскови', 'For all, and with keys or passkeys for critical roles') }
      ]
    },
    {
      id: 'domainauth',
      title: L('Каква е защитата на домейна при изпращане?', 'What is the sending protection of your domain?'),
      options: [
        { value: 'unknown', label: L('Не знам', 'I do not know') },
        { value: 'spf', label: L('Има SPF', 'SPF exists') },
        { value: 'spfdkim', label: L('Има SPF и DKIM', 'SPF and DKIM exist') },
        { value: 'monitor', label: L('Има и DMARC в режим на наблюдение', 'DMARC in monitoring mode as well') },
        { value: 'enforce', label: L('DMARC е на quarantine или reject', 'DMARC is at quarantine or reject') }
      ]
    },
    {
      id: 'filtering',
      title: L('Как е настроено филтрирането на входящата поща?', 'How is inbound mail filtering set up?'),
      options: [
        { value: 'none', label: L('Няма или не знам', 'None, or I do not know') },
        { value: 'default', label: L('Каквото идва по подразбиране с пощата', 'Whatever comes by default with the mail service') },
        { value: 'managed', label: L('Настроено и някой преглежда карантината', 'Configured, and someone reviews the quarantine') }
      ]
    },
    {
      id: 'reporting',
      title: L('Как служителите съобщават за подозрителни съобщения?', 'How do employees report suspicious messages?'),
      options: [
        { value: 'none', label: L('Няма установен начин', 'There is no established way') },
        { value: 'informal', label: L('Питат когото намерят', 'They ask whoever is around') },
        { value: 'defined', label: L('Има обявен адрес или бутон', 'There is an announced address or button') }
      ]
    },
    {
      id: 'incident',
      title: L('Има ли план за действие при инцидент?', 'Is there an incident response plan?'),
      options: [
        { value: 'none', label: L('Няма', 'No') },
        { value: 'informal', label: L('Знаем горе-долу какво да правим', 'We roughly know what to do') },
        { value: 'written', label: L('Има записан план с контакти', 'There is a written plan with contacts') }
      ]
    },
    {
      id: 'training',
      title: L('Има ли обучение или напомняния за служителите?', 'Is there training or are there reminders for employees?'),
      options: [
        { value: 'none', label: L('Няма', 'No') },
        { value: 'adhoc', label: L('Понякога, при повод', 'Occasionally, when something happens') },
        { value: 'regular', label: L('Редовно', 'Regularly') }
      ]
    },
    {
      id: 'capacity',
      title: L('Какъв ИТ капацитет е налице?', 'What IT capacity is available?'),
      options: [
        { value: 'H0', label: L('H0: няма вътрешен ИТ ресурс', 'H0: no internal IT resource') },
        { value: 'H1', label: L('H1: външен доставчик или един ИТ човек с общ профил', 'H1: external provider or one IT generalist') },
        { value: 'H2', label: L('H2: малък вътрешен ИТ екип', 'H2: small internal IT team') },
        { value: 'H3', label: L('H3: отделен капацитет за сигурност', 'H3: dedicated security capacity') }
      ]
    },
    {
      id: 'finance',
      title: L('Какво сте готови и в състояние да отделите?', 'What are you willing and able to allocate?'),
      help: L('Това е самооценка, не пазарна категория. F0 до F3 не означават нисък, среден или висок бюджет в статистически смисъл.',
              'This is a self assessment, not a market category. F0 to F3 do not mean low, medium or high budget in a statistical sense.'),
      options: [
        { value: 'F0', label: L('F0: само наличното и безплатното', 'F0: only what already exists, and free options') },
        { value: 'F1', label: L('F1: ограничен допълнителен лиценз или еднократна покупка', 'F1: a limited additional license or a one time purchase') },
        { value: 'F2', label: L('F2: възможни са допълнителни лицензи или техника', 'F2: additional licenses or hardware are possible') },
        { value: 'F3', label: L('F3: възможна е външна специализирана услуга', 'F3: an external specialized service is possible') }
      ]
    }
  ];

  /* =================================================================
     2. Profile calculation
     ================================================================= */

  function scoreExposure(a) {
    var points = 0;
    if (a.profile === 'clients') { points += 2; }
    else if (a.profile === 'outsourcing') { points += 3; }
    else if (a.profile === 'partners') { points += 1; }
    if (a.unknown === 'weekly') { points += 1; }
    else if (a.unknown === 'daily') { points += 3; }
    if (a.attachments === 'regular') { points += 1; }
    else if (a.attachments === 'core') { points += 2; }
    if ((a.roles || []).indexOf('hr') > -1) { points += 1; }
    if ((a.roles || []).indexOf('sales') > -1) { points += 1; }
    return points >= 6 ? 'high' : points >= 3 ? 'medium' : 'low';
  }

  function scoreMaturity(a) {
    var points = 0;
    if (a.mfa === 'some') { points += 1; }
    else if (a.mfa === 'all') { points += 3; }
    else if (a.mfa === 'resistant') { points += 4; }
    if (a.domainauth === 'spf') { points += 1; }
    else if (a.domainauth === 'spfdkim') { points += 2; }
    else if (a.domainauth === 'monitor') { points += 3; }
    else if (a.domainauth === 'enforce') { points += 4; }
    if (a.filtering === 'default') { points += 1; }
    else if (a.filtering === 'managed') { points += 2; }
    if (a.reporting === 'informal') { points += 1; }
    else if (a.reporting === 'defined') { points += 2; }
    if (a.incident === 'informal') { points += 1; }
    else if (a.incident === 'written') { points += 2; }
    if (a.training === 'adhoc') { points += 1; }
    else if (a.training === 'regular') { points += 2; }
    return { points: points, max: 16, level: points >= 11 ? 'established' : points >= 5 ? 'developing' : 'initial' };
  }

  function scoreCriticality(a) {
    var points = 0;
    if (a.criticality === 'medium') { points += 2; }
    else if (a.criticality === 'high') { points += 4; }
    if (a.payments === 'sometimes') { points += 1; }
    else if (a.payments === 'often') { points += 2; }
    var roles = a.roles || [];
    if (roles.indexOf('finance') > -1) { points += 1; }
    if (roles.indexOf('management') > -1) { points += 1; }
    return points >= 6 ? 'high' : points >= 3 ? 'medium' : 'low';
  }

  var ORDER = { low: 0, medium: 1, high: 2 };

  function protectionLevel(exposure, criticality) {
    var combined = ORDER[exposure] + ORDER[criticality];
    if (combined >= 3) { return 'P3'; }
    if (combined >= 1) { return 'P2'; }
    return 'P1';
  }

  var LABELS = {
    exposure: {
      low: L('Ниска', 'Low'),
      medium: L('Средна', 'Medium'),
      high: L('Висока', 'High')
    },
    maturity: {
      initial: L('Начална', 'Initial'),
      developing: L('Развиваща се', 'Developing'),
      established: L('Установена', 'Established')
    },
    criticality: {
      low: L('Ниска', 'Low'),
      medium: L('Средна', 'Medium'),
      high: L('Висока', 'High')
    },
    capacity: {
      H0: L('H0: няма вътрешен ИТ ресурс', 'H0: no internal IT resource'),
      H1: L('H1: външен доставчик или един ИТ човек', 'H1: external provider or one IT person'),
      H2: L('H2: малък вътрешен ИТ екип', 'H2: small internal IT team'),
      H3: L('H3: отделен капацитет за сигурност', 'H3: dedicated security capacity')
    },
    finance: {
      F0: L('F0: само наличното и безплатното', 'F0: existing and free capabilities only'),
      F1: L('F1: ограничен лиценз или еднократна покупка', 'F1: limited license or one time purchase'),
      F2: L('F2: допълнителни лицензи или техника', 'F2: additional licenses or hardware'),
      F3: L('F3: възможна е външна услуга', 'F3: an external service is possible')
    },
    level: {
      P1: L('P1: основна защита', 'P1: baseline protection'),
      P2: L('P2: засилена защита', 'P2: reinforced protection'),
      P3: L('P3: приоритетна защита', 'P3: priority protection')
    }
  };

  function explainExposure(a, value) {
    var reasons = [];
    if (a.profile === 'outsourcing') { reasons.push(L('работите по чужди проекти', 'you work on client projects')); }
    if (a.profile === 'clients') { reasons.push(L('комуникирате директно с клиенти', 'you communicate directly with clients')); }
    if (a.profile === 'internal') { reasons.push(L('комуникацията е основно вътрешна', 'communication is mainly internal')); }
    if (a.unknown === 'daily') { reasons.push(L('всеки ден пристигат писма от непознати', 'mail from unknown senders arrives every day')); }
    if (a.attachments === 'core') { reasons.push(L('отварянето на външни файлове е основна дейност', 'opening external files is a core activity')); }
    if ((a.roles || []).indexOf('hr') > -1) { reasons.push(L('има подбор на персонал', 'recruitment happens here')); }
    if (value === 'high') {
      reasons.push(L('затова непознат подател сам по себе си не е индикатор за вас',
                     'so an unknown sender by itself is not an indicator for you'));
    }
    return reasons;
  }

  function explainCriticality(a) {
    var reasons = [];
    if (a.criticality === 'high') { reasons.push(L('превземането на кутия би спряло дейността', 'a mailbox takeover would stop operations')); }
    else if (a.criticality === 'medium') { reasons.push(L('превземането на кутия би причинило сериозни забавяния', 'a mailbox takeover would cause serious delays')); }
    if (a.payments === 'often') { reasons.push(L('плащания се движат редовно по имейл', 'payments move over email regularly')); }
    else if (a.payments === 'sometimes') { reasons.push(L('понякога плащания се движат по имейл', 'payments sometimes move over email')); }
    if ((a.roles || []).indexOf('finance') > -1) { reasons.push(L('има счетоводна функция', 'there is an accounting function')); }
    if ((a.roles || []).indexOf('management') > -1) { reasons.push(L('има роля с право на плащания', 'there is a role with payment authority')); }
    return reasons;
  }

  function explainMaturity(a) {
    var reasons = [];
    if (a.mfa === 'none') { reasons.push(L('липсва многофакторна автентикация', 'multi factor authentication is missing')); }
    else if (a.mfa === 'resistant') { reasons.push(L('критичните роли имат устойчива на фишинг автентикация', 'critical roles use phishing resistant authentication')); }
    if (a.domainauth === 'unknown') { reasons.push(L('състоянието на домейна е непознато', 'the state of the domain is unknown')); }
    else if (a.domainauth === 'enforce') { reasons.push(L('DMARC вече прилага политика', 'DMARC already enforces a policy')); }
    if (a.reporting === 'none') { reasons.push(L('няма установен път за докладване', 'there is no established reporting path')); }
    if (a.incident === 'none') { reasons.push(L('няма план за инцидент', 'there is no incident plan')); }
    if (a.training === 'none') { reasons.push(L('няма обучение', 'there is no training')); }
    return reasons;
  }

  function buildProfile(answers) {
    var exposure = scoreExposure(answers);
    var maturity = scoreMaturity(answers);
    var criticality = scoreCriticality(answers);
    var capacity = answers.capacity || 'H0';
    var finance = answers.finance || 'F0';
    var level = protectionLevel(exposure, criticality);

    return {
      answers: answers,
      exposure: exposure,
      maturity: maturity.level,
      maturityPoints: maturity.points,
      maturityMax: maturity.max,
      criticality: criticality,
      capacity: capacity,
      finance: finance,
      level: level,
      labels: LABELS,
      reasons: {
        exposure: explainExposure(answers, exposure),
        maturity: explainMaturity(answers),
        criticality: explainCriticality(answers)
      }
    };
  }

  /* =================================================================
     3. Recommendation catalog
     Each entry states why it applies, what it costs and what it can break.
     `when` decides whether the entry is shown for a given profile.
     ================================================================= */

  var C = { low: 'complexity.low', medium: 'complexity.medium', high: 'complexity.high' };
  var R = {
    config: 'resource.config', dns: 'resource.dns', license: 'resource.license',
    time: 'resource.time', external: 'resource.external'
  };

  var CATALOG = [
    {
      id: 'mfa-admins', horizon: 'first', order: 1,
      title: L('Многофакторна автентикация за администраторските профили', 'Multi factor authentication for administrator accounts'),
      why: L('Администраторският профил отваря всички останали кутии.', 'An administrator account opens every other mailbox.'),
      benefit: L('Открадната администраторска парола престава да е достатъчна.', 'A stolen administrator password stops being sufficient.'),
      complexity: C.low, resource: R.config,
      prereq: L('Достъп до административния панел на пощенската платформа.', 'Access to the admin panel of the mail platform.'),
      breaks: L('Заключване извън профила, ако няма резервен метод. Подгответе резервни кодове предварително.', 'Lockout if there is no backup method. Prepare backup codes in advance.'),
      verify: L('Опитайте вход от нов браузър. Трябва да се поиска втори фактор.', 'Try signing in from a new browser. A second factor should be requested.'),
      when: function (p) { return p.answers.mfa !== 'all' && p.answers.mfa !== 'resistant'; }
    },
    {
      id: 'mfa-all', horizon: 'first', order: 2,
      title: L('Многофакторна автентикация за всички потребители', 'Multi factor authentication for all users'),
      why: L('Всяка кутия може да послужи за измама спрямо контрагент.', 'Any mailbox can be used to defraud a counterparty.'),
      benefit: L('Най-голямото намаляване на риска на единица усилие.', 'The largest risk reduction per unit of effort.'),
      complexity: C.low, resource: R.config,
      prereq: L('Въведена MFA за администраторите и подготвена процедура за възстановяване.', 'MFA for administrators in place and a recovery procedure prepared.'),
      breaks: L('Служители без служебен телефон се нуждаят от алтернативен метод.', 'Employees without a work phone need an alternative method.'),
      verify: L('Отчетът за покритие показва нула профили без втори фактор.', 'The coverage report shows zero accounts without a second factor.'),
      when: function (p) { return p.answers.mfa === 'none' || p.answers.mfa === 'some'; }
    },
    {
      id: 'payment-callback', horizon: 'first', order: 3,
      title: L('Правило за потвърждаване на плащания по телефон', 'Phone confirmation rule for payments'),
      why: L('Измамата с фактури не изисква технически пробив и минава през всеки филтър.', 'Invoice fraud requires no technical breach and passes every filter.'),
      benefit: L('Спира най-скъпия вид измама с една организационна мярка.', 'Stops the most expensive kind of fraud with a single organizational measure.'),
      complexity: C.low, resource: R.time,
      prereq: L('Списък с предварително известни телефонни номера на контрагентите.', 'A list of previously known phone numbers for counterparties.'),
      breaks: L('Забавяне на плащанията с един ден. Определете кой има право да потвърждава.', 'Payments are delayed by a day. Decide who is allowed to confirm.'),
      verify: L('Разиграйте един случай със сменена сметка и вижте дали правилото сработва.', 'Rehearse one case with a changed account and see whether the rule holds.'),
      when: function (p) { return p.answers.payments !== 'no'; }
    },
    {
      id: 'reporting-path', horizon: 'first', order: 4,
      title: L('Един обявен път за докладване', 'One announced reporting path'),
      why: L('Без ясен адрес хората просто изтриват съобщението и никой не научава.', 'Without a clear address people simply delete the message and nobody finds out.'),
      benefit: L('Един доклад предпазва всички останали.', 'One report protects everyone else.'),
      complexity: C.low, resource: R.config,
      prereq: L('Решение кой отговаря на докладите.', 'A decision on who answers the reports.'),
      breaks: L('Ако никой не отговаря, докладите спират след няколко седмици.', 'If nobody answers, reports stop within a few weeks.'),
      verify: L('Попитайте случаен служител къде би съобщил.', 'Ask a random employee where they would report.'),
      when: function (p) { return p.answers.reporting !== 'defined'; }
    },
    {
      id: 'incident-contacts', horizon: 'first', order: 5,
      title: L('Записани контакти за инцидент извън пощата', 'Incident contacts written down outside email'),
      why: L('По време на инцидент пощата може да е точно това, което не работи.', 'During an incident the mailbox may be exactly what is unavailable.'),
      benefit: L('Спестява първите тридесет минути колебание.', 'Saves the first thirty minutes of hesitation.'),
      complexity: C.low, resource: R.time,
      prereq: L('Няма.', 'None.'),
      breaks: L('Нищо. Рискът е само списъкът да остарее.', 'Nothing. The only risk is the list going stale.'),
      verify: L('Попитайте кой се обажда на банката днес и вижте дали има отговор.', 'Ask who calls the bank today and see whether there is an answer.'),
      when: function (p) { return p.answers.incident !== 'written'; }
    },
    {
      id: 'forwarding-audit', horizon: 'first', order: 6,
      title: L('Проверка на правилата за препращане', 'Audit of forwarding rules'),
      why: L('Автоматичното препращане е най-честата следа от вече превзета кутия.', 'Automatic forwarding is the most common trace of an already compromised mailbox.'),
      benefit: L('Открива компрометиране, което иначе остава невидимо месеци.', 'Finds a compromise that otherwise stays invisible for months.'),
      complexity: C.low, resource: R.config,
      prereq: L('Административен достъп или преглед по кутии.', 'Administrative access, or a mailbox by mailbox review.'),
      breaks: L('Забраната на препращането може да засегне легитимни работни потоци. Дайте път за изключения.', 'Blocking forwarding can affect legitimate workflows. Provide an exception path.'),
      verify: L('Отчет за всички правила за препращане към външни адреси.', 'A report of all forwarding rules to external addresses.'),
      when: function () { return true; }
    },
    {
      id: 'spf-publish', horizon: 'first', order: 7,
      title: L('Публикуване на SPF запис', 'Publish an SPF record'),
      why: L('Без SPF всеки сървър може да изпраща поща с вашия домейн в плика.', 'Without SPF any server can send mail with your domain in the envelope.'),
      benefit: L('Първата стъпка, без която DMARC не може да работи.', 'The first step, without which DMARC cannot work.'),
      complexity: C.low, resource: R.dns,
      prereq: L('Списък на всичко, което изпраща поща от ваше име.', 'An inventory of everything that sends mail on your behalf.'),
      breaks: L('Пропуснат подател означава маркирана или отхвърлена легитимна поща. Започнете с ~all.', 'A missed sender means legitimate mail is marked or rejected. Start with ~all.'),
      verify: L('Проверете домейна в раздел Проверка на домейн.', 'Check the domain in the Check domain section.'),
      when: function (p) { return p.answers.domainauth === 'unknown'; }
    },
    {
      id: 'dmarc-monitor', horizon: 'first', order: 8,
      title: L('DMARC в режим на наблюдение с обобщени отчети', 'DMARC in monitoring mode with aggregate reports'),
      why: L('Отчетите показват кой в момента изпраща поща от името на домейна ви.', 'The reports show who currently sends mail on behalf of your domain.'),
      benefit: L('Дава данните, без които затягането на политиката е налучкване.', 'Provides the data without which tightening the policy is guesswork.'),
      complexity: C.low, resource: R.dns,
      prereq: L('Публикуван SPF и адрес, на който да пристигат отчетите.', 'A published SPF record and an address to receive the reports.'),
      breaks: L('Нищо. p=none не променя доставката. Отчетите идват ежедневно и са обемни.', 'Nothing. p=none does not change delivery. The reports arrive daily and are bulky.'),
      verify: L('Първите отчети трябва да пристигнат до няколко дни.', 'The first reports should arrive within a few days.'),
      when: function (p) { return ['unknown', 'spf', 'spfdkim'].indexOf(p.answers.domainauth) > -1; }
    },
    {
      id: 'dkim-enable', horizon: 'next', order: 10,
      title: L('Включване на подписване с DKIM', 'Enable DKIM signing'),
      why: L('DKIM оцелява при препращане, за разлика от SPF.', 'DKIM survives forwarding, unlike SPF.'),
      benefit: L('Прави DMARC надежден и намалява фалшивите провали.', 'Makes DMARC dependable and reduces false failures.'),
      complexity: C.medium, resource: R.dns,
      prereq: L('Поддръжка от пощенския доставчик и достъп до DNS.', 'Support from the mail provider and DNS access.'),
      breaks: L('Забравен селектор при смяна на доставчик разваля подписа.', 'A forgotten selector after a provider change breaks the signature.'),
      verify: L('Изпратете писмо навън и потърсете dkim=pass в Authentication-Results.', 'Send a message outward and look for dkim=pass in Authentication-Results.'),
      when: function (p) { return ['unknown', 'spf'].indexOf(p.answers.domainauth) > -1; }
    },
    {
      id: 'sender-inventory', horizon: 'next', order: 11,
      title: L('Пълен списък на изпращащите системи', 'A complete inventory of sending systems'),
      why: L('Без него всяко затягане на SPF или DMARC е риск за легитимна поща.', 'Without it every tightening of SPF or DMARC risks legitimate mail.'),
      benefit: L('Превръща затягането на политиката от риск в рутинна стъпка.', 'Turns policy tightening from a risk into a routine step.'),
      complexity: C.medium, resource: R.time,
      prereq: L('Няколко седмици обобщени отчети от DMARC.', 'Several weeks of DMARC aggregate reports.'),
      breaks: L('Нищо. Това е документиране.', 'Nothing. This is documentation.'),
      verify: L('Всеки подател в отчетите трябва да е разпознат и обяснен.', 'Every sender in the reports should be recognized and explained.'),
      when: function (p) { return p.answers.domainauth !== 'enforce'; }
    },
    {
      id: 'quarantine-owner', horizon: 'next', order: 12,
      title: L('Определен човек, който преглежда карантината', 'A named person who reviews the quarantine'),
      why: L('Задържана фактура, която никой не поглежда, е скъпа тишина.', 'A held invoice that nobody looks at is expensive silence.'),
      benefit: L('Позволява по-строги филтри без загуба на важна поща.', 'Allows stricter filters without losing important mail.'),
      complexity: C.low, resource: R.time,
      prereq: L('Работещ филтър с карантина.', 'A working filter with a quarantine.'),
      breaks: L('Нищо, ако прегледът е ежедневен и кратък.', 'Nothing, as long as the review is daily and short.'),
      verify: L('Брой прегледани и освободени съобщения за месец.', 'The number of messages reviewed and released per month.'),
      when: function (p) { return p.answers.filtering !== 'managed'; }
    },
    {
      id: 'dmarc-quarantine', horizon: 'next', order: 13,
      title: L('Преминаване на DMARC към quarantine', 'Move DMARC to quarantine'),
      why: L('Наблюдението само по себе си не спира нищо.', 'Monitoring by itself stops nothing.'),
      benefit: L('Подправените съобщения с вашия домейн отиват в спам вместо във входящата поща.', 'Spoofed messages using your domain go to spam instead of the inbox.'),
      complexity: C.medium, resource: R.dns,
      prereq: L('Пълен списък на подателите и няколко седмици чисти отчети.', 'A complete sender inventory and several weeks of clean reports.'),
      breaks: L('Непокрит легитимен подател отива в спам. Не минавайте директно на reject.', 'An uncovered legitimate sender lands in spam. Do not jump straight to reject.'),
      verify: L('Наблюдавайте отчетите две седмици след промяната.', 'Watch the reports for two weeks after the change.'),
      when: function (p) { return p.answers.domainauth === 'monitor'; }
    },
    {
      id: 'rule-review', horizon: 'next', order: 14,
      title: L('Периодичен преглед на правилата в кутиите', 'Periodic review of inbox rules'),
      why: L('Правило, което крие отговорите, поддържа измамата невидима седмици.', 'A rule that hides replies keeps fraud invisible for weeks.'),
      benefit: L('Съкращава времето до откриване от месеци до седмици.', 'Shortens time to detection from months to weeks.'),
      complexity: C.low, resource: R.time,
      prereq: L('Административен достъп до пощенската платформа.', 'Administrative access to the mail platform.'),
      breaks: L('Нищо.', 'Nothing.'),
      verify: L('Тримесечен отчет с всички правила.', 'A quarterly report of all rules.'),
      when: function () { return true; }
    },
    {
      id: 'session-procedure', horizon: 'next', order: 15,
      title: L('Записана процедура за прекратяване на сесии', 'A written session revocation procedure'),
      why: L('Смяната на паролата не изхвърля нападател с активна сесия.', 'Changing the password does not eject an attacker with an active session.'),
      benefit: L('Затваря най-често пропусканата стъпка при реакция.', 'Closes the most commonly missed step in a response.'),
      complexity: C.low, resource: R.time,
      prereq: L('Поне двама души да знаят как се прави.', 'At least two people who know how to do it.'),
      breaks: L('Всички потребители трябва да влязат отново.', 'Every user has to sign in again.'),
      verify: L('Опитайте върху тестов профил и потвърдете, че устройствата искат нов вход.', 'Try it on a test account and confirm that devices ask for a new sign in.'),
      when: function () { return true; }
    },
    {
      id: 'training-short', horizon: 'next', order: 16,
      title: L('Кратки редовни напомняния вместо дълго обучение', 'Short regular reminders instead of long training'),
      why: L('Дългите обучения се забравят, а кратките напомняния се помнят.', 'Long training is forgotten, short reminders are remembered.'),
      benefit: L('Поддържа пътя за докладване жив.', 'Keeps the reporting path alive.'),
      complexity: C.low, resource: R.time,
      prereq: L('Обявен път за докладване.', 'An announced reporting path.'),
      breaks: L('Нищо. Избягвайте обвинителен тон, той спира докладите.', 'Nothing. Avoid a blaming tone, it stops reports.'),
      verify: L('Броят доклади на месец не спада.', 'The number of reports per month does not fall.'),
      when: function (p) { return p.answers.training !== 'regular'; }
    },
    {
      id: 'attachment-workflow', horizon: 'next', order: 17,
      title: L('Отделен ред за работа с външни файлове', 'A separate workflow for external files'),
      why: L('При подбор и поддръжка непознат подател с файл е нормалното състояние, не изключение.', 'In recruitment and support an unknown sender with a file is the normal state, not an exception.'),
      benefit: L('Премества защитата от бдителност на процес, който издържа при натоварване.', 'Moves protection from vigilance to a process that holds under load.'),
      complexity: C.medium, resource: R.config,
      prereq: L('Съгласие кои формати се приемат и по какъв канал.', 'Agreement on which formats are accepted and through which channel.'),
      breaks: L('Кандидати и клиенти може да изпращат в неподдържан формат. Обявете правилата публично.', 'Applicants and clients may send unsupported formats. Publish the rules openly.'),
      verify: L('Проверете дали месец по-късно правилото още се спазва.', 'Check whether the rule is still followed a month later.'),
      when: function (p) { return p.exposure === 'high' || p.answers.attachments === 'core'; }
    },
    {
      id: 'mfa-resistant-critical', horizon: 'next', order: 18,
      title: L('Устойчива на фишинг автентикация за критичните роли', 'Phishing resistant authentication for critical roles'),
      why: L('Кодовете и потвържденията с натискане се заобикалят от междинна страница в реално време.', 'Codes and push approvals are bypassed by a real time intermediary page.'),
      benefit: L('Ключът не се задейства на измамен домейн, така че атаката се проваля.', 'The key does not respond on a fraudulent domain, so the attack fails.'),
      complexity: C.medium, resource: R.license,
      prereq: L('Поддръжка от платформата и по два ключа на човек.', 'Platform support and two keys per person.'),
      breaks: L('Изгубен ключ без резервен блокира достъпа.', 'A lost key with no backup blocks access.'),
      verify: L('Дневникът за вход показва ключ или пасков вместо код.', 'The sign in log shows a key or passkey instead of a code.'),
      when: function (p) {
        return p.answers.mfa !== 'resistant' &&
          (p.criticality !== 'low' || (p.answers.roles || []).indexOf('itadmin') > -1);
      },
      minFinance: 1
    },
    {
      id: 'dmarc-reject', horizon: 'extra', order: 20,
      title: L('Преминаване на DMARC към reject', 'Move DMARC to reject'),
      why: L('Само reject спира доставката на подправени съобщения с вашия домейн.', 'Only reject stops delivery of spoofed messages using your domain.'),
      benefit: L('Пълна защита на видимия домейн при поддържащите получатели.', 'Full protection of the visible domain at receivers that support it.'),
      complexity: C.medium, resource: R.dns,
      prereq: L('Продължителен период на quarantine без провали на легитимни податели.', 'A sustained period at quarantine with no legitimate senders failing.'),
      breaks: L('Всеки забравен подател спира да пристига изобщо. Проверете и паркираните домейни.', 'Any forgotten sender stops arriving at all. Check parked domains as well.'),
      verify: L('Отчетите показват само разпознати податели с pass.', 'The reports show only recognized senders passing.'),
      when: function (p) { return p.answers.domainauth === 'monitor' || p.answers.domainauth === 'enforce'; }
    },
    {
      id: 'spf-hardfail', horizon: 'extra', order: 21,
      title: L('Затягане на SPF от ~all към -all', 'Tighten SPF from ~all to -all'),
      why: L('Мекият провал оставя решението изцяло на получателя.', 'A soft fail leaves the decision entirely to the recipient.'),
      benefit: L('По-ясен сигнал към получаващите сървъри.', 'A clearer signal to receiving servers.'),
      complexity: C.medium, resource: R.dns,
      prereq: L('Пълен и проверен списък на подателите и под десет DNS заявки в записа.', 'A complete, verified sender inventory and fewer than ten DNS lookups in the record.'),
      breaks: L('Надвишаването на десетте заявки проваля целия SPF, включително за легитимна поща.', 'Exceeding ten lookups fails the whole SPF evaluation, including for legitimate mail.'),
      verify: L('Проверете броя заявки в раздел Проверка на домейн.', 'Check the lookup count in the Check domain section.'),
      when: function (p) { return p.answers.domainauth === 'monitor' || p.answers.domainauth === 'enforce'; }
    },
    {
      id: 'mtasts', horizon: 'extra', order: 22,
      title: L('MTA-STS и TLS-RPT', 'MTA-STS and TLS-RPT'),
      why: L('Защитава поверителността на входящата кореспонденция при пренос.', 'Protects the confidentiality of inbound correspondence in transit.'),
      benefit: L('Затваря възможността за сваляне на връзката до нешифрована.', 'Closes the option of downgrading the connection to plaintext.'),
      complexity: C.high, resource: R.dns,
      prereq: L('Уеб сървър с валиден сертификат на поддомейн mta-sts и достъп до DNS.', 'A web server with a valid certificate on the mta-sts subdomain and DNS access.'),
      breaks: L('Изтекъл сертификат на политиката спира входящата поща в режим enforce.', 'An expired policy certificate stops inbound mail in enforce mode.'),
      verify: L('Започнете в режим testing и наблюдавайте отчетите по TLS-RPT.', 'Start in testing mode and watch the TLS-RPT reports.'),
      when: function (p) { return p.criticality !== 'low'; },
      minCapacity: 1
    },
    {
      id: 'web-filtering', horizon: 'extra', order: 23,
      title: L('Филтриране на уеб и DNS на устройствата', 'Web and DNS filtering on devices'),
      why: L('Дава втори шанс, след като връзката вече е натисната.', 'Provides a second chance after a link has already been clicked.'),
      benefit: L('Блокира известните измамни адреси преди зареждането им.', 'Blocks known fraudulent addresses before they load.'),
      complexity: C.medium, resource: R.license,
      prereq: L('Решението трябва да следва устройството, ако се работи от разстояние.', 'The solution must follow the device if people work remotely.'),
      breaks: L('Блокиране на работен ресурс без път за изключение води до заобикаляне.', 'Blocking a work resource with no exception path leads to users bypassing it.'),
      verify: L('Прегледайте дневника с блокирани заявки за фалшиви попадения.', 'Review the blocked request log for false positives.'),
      when: function (p) { return p.exposure !== 'low'; },
      minFinance: 1
    },
    {
      id: 'mfa-resistant-all', horizon: 'extra', order: 24,
      title: L('Устойчива на фишинг автентикация за всички', 'Phishing resistant authentication for everyone'),
      why: L('Докато част от профилите са на кодове, атаката просто избира тях.', 'While some accounts remain on codes, an attack simply targets those.'),
      benefit: L('Премахва цял клас атаки върху входа.', 'Removes an entire class of sign in attacks.'),
      complexity: C.high, resource: R.license,
      prereq: L('Ключове или паскови за всички и работеща процедура при загуба.', 'Keys or passkeys for everyone and a working loss procedure.'),
      breaks: L('Неподдържащи приложения остават на парола и стават най-слабата точка.', 'Applications without support stay on passwords and become the weakest point.'),
      verify: L('Отчет за използваните методи за вход по потребител.', 'A report of sign in methods used per user.'),
      when: function (p) { return p.level === 'P3'; },
      minFinance: 2
    },
    {
      id: 'external-support', horizon: 'extra', order: 25,
      title: L('Външна помощ за реакция при инцидент', 'External incident response support'),
      why: L('При H0 и H1 вътрешният капацитет свършва точно когато е най-нужен.', 'At H0 and H1 internal capacity runs out exactly when it is most needed.'),
      benefit: L('Осигурява кой да поеме техническата част в първите часове.', 'Provides someone to take the technical part in the first hours.'),
      complexity: C.low, resource: R.external,
      prereq: L('Договорка с ИТ доставчика какво покрива и в какъв срок.', 'An agreement with the IT provider on scope and response time.'),
      breaks: L('Нищо, но неясният обхват прави услугата безполезна в реален момент.', 'Nothing, but an unclear scope makes the service useless when it is needed.'),
      verify: L('Запишете срока за отговор и го проверете веднъж.', 'Write down the response time and test it once.'),
      when: function (p) { return (p.capacity === 'H0' || p.capacity === 'H1') && p.criticality !== 'low'; },
      minFinance: 3
    },
    {
      id: 'bimi', horizon: 'extra', order: 26,
      title: L('BIMI, само след устойчив DMARC', 'BIMI, only after stable DMARC'),
      why: L('Показва логото на организацията в поддържащите клиенти.', 'Shows the organization logo in supporting clients.'),
      benefit: L('Разпознаваемост. Това не е защитна мярка.', 'Recognizability. This is not a security control.'),
      complexity: C.medium, resource: R.license,
      prereq: L('DMARC на quarantine или reject, устойчив във времето.', 'DMARC at quarantine or reject, stable over time.'),
      breaks: L('Нищо технически. Рискът е логото да се приеме за доказателство за автентичност.', 'Nothing technically. The risk is the logo being taken as proof of authenticity.'),
      verify: L('Изпратете съобщение до кутия при поддържащ доставчик.', 'Send a message to a mailbox at a supporting provider.'),
      when: function (p) { return p.answers.domainauth === 'enforce'; },
      minFinance: 2
    }
  ];

  var CAPACITY_INDEX = { H0: 0, H1: 1, H2: 2, H3: 3 };
  var FINANCE_INDEX = { F0: 0, F1: 1, F2: 2, F3: 3 };

  function buildPlan(profile) {
    var plan = { first: [], next: [], extra: [], deferred: [] };
    var capacity = CAPACITY_INDEX[profile ? profile.capacity : 'H0'] || 0;
    var finance = FINANCE_INDEX[profile ? profile.finance : 'F0'] || 0;

    CATALOG.forEach(function (item) {
      var applies = profile ? item.when(profile) : true;
      if (!applies) { return; }
      var entry = {
        id: item.id, horizon: item.horizon, order: item.order, title: item.title,
        why: item.why, benefit: item.benefit, complexity: item.complexity,
        resource: item.resource, prereq: item.prereq, breaks: item.breaks, verify: item.verify
      };
      if (profile && item.minFinance !== undefined && finance < item.minFinance) {
        entry.deferredReason = 'finance';
        entry.requires = 'F' + item.minFinance;
        plan.deferred.push(entry);
        return;
      }
      if (profile && item.minCapacity !== undefined && capacity < item.minCapacity) {
        entry.deferredReason = 'capacity';
        entry.requires = 'H' + item.minCapacity;
        plan.deferred.push(entry);
        return;
      }
      plan[item.horizon].push(entry);
    });

    ['first', 'next', 'extra', 'deferred'].forEach(function (key) {
      plan[key].sort(function (a, b) { return a.order - b.order; });
    });
    return plan;
  }

  function validate(answers) {
    var missing = [];
    QUESTIONS.forEach(function (q) {
      if (q.type === 'multi') { return; }
      if (!answers[q.id]) { missing.push(q.id); }
    });
    return missing;
  }

  SPDT.rules = {
    QUESTIONS: QUESTIONS,
    CATALOG: CATALOG,
    LABELS: LABELS,
    buildProfile: buildProfile,
    buildPlan: buildPlan,
    validate: validate,
    protectionLevel: protectionLevel
  };

})(window.SPDT);
