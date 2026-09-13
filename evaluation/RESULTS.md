# Записани резултати от изпитателната среда

Файлът съдържа пълния изход от петте скрипта в тази директория. Той се прилага,
за да могат резултатите да бъдат прочетени без инсталиране на каквото и да е.
Изходът не замества самостоятелното изпълнение. Скриптовете произвеждат същите
числа при всяко пускане, а `run_eml.js` завършва с код 1 при разминаване, така
че проверката може да се повтори и да се сравни с написаното тук.

## Условия на изпълнение

| Параметър | Стойност |
| --- | --- |
| Дата на изпълнение | 13 септември 2026 г. |
| Node.js | v22.22.2 |
| Операционна система | Ubuntu 24.04 |
| Външни зависимости | няма |
| Състояние на кода на приложението | немодифициран |

Модулите `eml-analyzer.js`, `domain-check.js` и `rules.js` се зареждат от
`assets/js` без промяна, в изолиран контекст на Node.js. Заместващият обект
предоставя единствено пространството от имена, което модулите очакват.

## Обобщение

| Проверка | Резултат |
| --- | --- |
| Документирани тестови случаи | 13 от 13 съвпадат, нула разминавания |
| Покритие само с документирания корпус | 19 от 38 индикатора, 50,0 на сто |
| Покритие с разширения корпус | 37 от 38 индикатора, 97,4 на сто |
| Недостигнат индикатор | `from_mixed_script` |
| Организационни сценарии | 6 изпълнени |
| Вариации при анализа на чувствителността | 41, от които 19 променят набора препоръки |
| Средна мярка на Jaccard между шестте сценария | 0,493 |

---

## 1. Документирани тестови случаи

`node run_eml.js`

Изпълнява тринадесетте случая от `docs/TESTING.md` и сравнява установените
индикатори, изчислената сума и определената категория с документираните.

```
Модули на toolkit-а: assets/js
Фикстъри            : evaluation/fixtures-documented
Node.js             : v22.22.2

┌─────────┬──────────────────────────┬─────────┬─────────────────────────────┬────────┐
│ (index) │ file                     │ score   │ verdict                     │ ok     │
├─────────┼──────────────────────────┼─────────┼─────────────────────────────┼────────┤
│ 0       │ 'c01_clean.eml'          │ '0/0'   │ 'low/low'                   │ 'PASS' │
│ 1       │ 'c02_dmarc_fail.eml'     │ '7/7'   │ 'high/high'                 │ 'PASS' │
│ 2       │ 'c03_replyto.eml'        │ '3/3'   │ 'moderate/moderate'         │ 'PASS' │
│ 3       │ 'c04_returnpath.eml'     │ '1/1'   │ 'low/low'                   │ 'PASS' │
│ 4       │ 'c05_urls.eml'           │ '7/7'   │ 'high/high'                 │ 'PASS' │
│ 5       │ 'c06_html.eml'           │ '9/9'   │ 'high/high'                 │ 'PASS' │
│ 6       │ 'c07_userinfo.eml'       │ '3/3'   │ 'moderate/moderate'         │ 'PASS' │
│ 7       │ 'c08_malformed_auth.eml' │ '1/1'   │ 'low/low'                   │ 'PASS' │
│ 8       │ 'c09_minimal.eml'        │ '1/1'   │ 'insufficient/insufficient' │ 'PASS' │
│ 9       │ 'c10_manyhops.eml'       │ '1/1'   │ 'low/low'                   │ 'PASS' │
│ 10      │ 'c11_attachments.eml'    │ '11/11' │ 'high/high'                 │ 'PASS' │
│ 11      │ 'c12_displayname.eml'    │ '4/4'   │ 'moderate/moderate'         │ 'PASS' │
│ 12      │ 'c13_cp1251.eml'         │ '1/1'   │ 'low/low'                   │ 'PASS' │
└─────────┴──────────────────────────┴─────────┴─────────────────────────────┴────────┘

PASS 13 FAIL 0
```

---

## 2. Разширен корпус и покритие на индикаторите

`node run_extended.js`

Изпълнява двата набора и установява кои от индикаторите в таблицата с тегла се
задействат поне веднъж.

```
Модули на toolkit-а: assets/js
Node.js            : v22.22.2
Индикатори в таблицата с тегла: 38

┌─────────┬──────────────────────────┬──────────────────────────────┬──────┬────────────────┬────────────────────────────────────────────────────┐
│ (index) │ набор                    │ файл                         │ сума │ категория      │ индикатори                                         │
├─────────┼──────────────────────────┼──────────────────────────────┼──────┼────────────────┼────────────────────────────────────────────────────┤
│ 0       │ 'документирани (A1-A13)' │ 'c01_clean.eml'              │ 0    │ 'low'          │ '(няма)'                                           │
│ 1       │ 'документирани (A1-A13)' │ 'c02_dmarc_fail.eml'         │ 7    │ 'high'         │ 'dmarc_fail, spf_fail'                             │
│ 2       │ 'документирани (A1-A13)' │ 'c03_replyto.eml'            │ 3    │ 'moderate'     │ 'replyto_mismatch'                                 │
│ 3       │ 'документирани (A1-A13)' │ 'c04_returnpath.eml'         │ 1    │ 'low'          │ 'returnpath_mismatch'                              │
│ 4       │ 'документирани (A1-A13)' │ 'c05_urls.eml'               │ 7    │ 'high'         │ 'url_ip_host, url_punycode, url_shortener'         │
│ 5       │ 'документирани (A1-A13)' │ 'c06_html.eml'               │ 9    │ 'high'         │ 'html_form, url_redirect_param, url_text_mismatch' │
│ 6       │ 'документирани (A1-A13)' │ 'c07_userinfo.eml'           │ 3    │ 'moderate'     │ 'url_userinfo'                                     │
│ 7       │ 'документирани (A1-A13)' │ 'c08_malformed_auth.eml'     │ 1    │ 'low'          │ 'auth_malformed'                                   │
│ 8       │ 'документирани (A1-A13)' │ 'c09_minimal.eml'            │ 1    │ 'insufficient' │ 'auth_absent'                                      │
│ 9       │ 'документирани (A1-A13)' │ 'c10_manyhops.eml'           │ 1    │ 'low'          │ 'received_many'                                    │
│ 10      │ 'документирани (A1-A13)' │ 'c11_attachments.eml'        │ 11   │ 'high'         │ 'att_double_ext, att_executable, att_macro'        │
│ 11      │ 'документирани (A1-A13)' │ 'c12_displayname.eml'        │ 4    │ 'moderate'     │ 'display_address_mismatch, dkim_absent'            │
│ 12      │ 'документирани (A1-A13)' │ 'c13_cp1251.eml'             │ 1    │ 'low'          │ 'auth_absent'                                      │
│ 13      │ 'разширени (Б1-Б18)'     │ 'e14_spf_softfail.eml'       │ 2    │ 'low'          │ 'spf_softfail'                                     │
│ 14      │ 'разширени (Б1-Б18)'     │ 'e15_spf_none.eml'           │ 1    │ 'low'          │ 'spf_none'                                         │
│ 15      │ 'разширени (Б1-Б18)'     │ 'e16_dkim_fail.eml'          │ 3    │ 'moderate'     │ 'dkim_fail'                                        │
│ 16      │ 'разширени (Б1-Б18)'     │ 'e17_from_punycode.eml'      │ 3    │ 'moderate'     │ 'from_punycode'                                    │
│ 17      │ 'разширени (Б1-Б18)'     │ 'e18_from_multiple.eml'      │ 2    │ 'low'          │ 'from_multiple'                                    │
│ 18      │ 'разширени (Б1-Б18)'     │ 'e19_sender_mismatch.eml'    │ 1    │ 'low'          │ 'sender_mismatch'                                  │
│ 19      │ 'разширени (Б1-Б18)'     │ 'e20_display_domain.eml'     │ 2    │ 'low'          │ 'display_domain_mismatch'                          │
│ 20      │ 'разширени (Б1-Б18)'     │ 'e21_url_mixed_script.eml'   │ 3    │ 'moderate'     │ 'url_mixed_script'                                 │
│ 21      │ 'разширени (Б1-Б18)'     │ 'e22_url_encoded.eml'        │ 2    │ 'low'          │ 'url_encoded'                                      │
│ 22      │ 'разширени (Б1-Б18)'     │ 'e23_url_shape.eml'          │ 3    │ 'moderate'     │ 'url_many_subdomains, url_odd_port, url_very_long' │
│ 23      │ 'разширени (Б1-Б18)'     │ 'e24_hidden_chars.eml'       │ 2    │ 'low'          │ 'hidden_chars'                                     │
│ 24      │ 'разширени (Б1-Б18)'     │ 'e25_att_archive.eml'        │ 1    │ 'low'          │ 'att_archive'                                      │
│ 25      │ 'разширени (Б1-Б18)'     │ 'e26_att_html.eml'           │ 3    │ 'moderate'     │ 'att_html'                                         │
│ 26      │ 'разширени (Б1-Б18)'     │ 'e27_att_mismatch.eml'       │ 2    │ 'low'          │ 'att_type_mismatch'                                │
│ 27      │ 'разширени (Б1-Б18)'     │ 'e28_received_malformed.eml' │ 1    │ 'low'          │ 'received_malformed'                               │
│ 28      │ 'разширени (Б1-Б18)'     │ 'e29_date_anomaly.eml'       │ 1    │ 'low'          │ 'date_anomaly'                                     │
│ 29      │ 'разширени (Б1-Б18)'     │ 'e30_from_mixed_script.eml'  │ 0    │ 'low'          │ '(няма)'                                           │
│ 30      │ 'разширени (Б1-Б18)'     │ 'e31_raw_utf8_header.eml'    │ 1    │ 'low'          │ 'auth_absent'                                      │
└─────────┴──────────────────────────┴──────────────────────────────┴──────┴────────────────┴────────────────────────────────────────────────────┘

Покритие на индикаторите
====================================================
  само документираните : 19/38 50.0 %
  с разширения корпус  : 37/38 97.4 %
  недостигнати         : from_mixed_script

Бележка за from_mixed_script (случай Б17, e30_from_mixed_script.eml):
  Заглавни полета със сурово 8-битово UTF-8 съдържание (RFC 6531) не се
  декодират до Unicode; декодира се само пътят през RFC 2047. Засегнати са
  показваното изписвано име, темата и този индикатор. Тялото на съобщението
  НЕ е засегнато. Виж e31_raw_utf8_header.eml.
```

---

## 3. Проверка на домейн

`node run_domain.js`

Разчитане на SPF, DMARC, DKIM, MTA-STS, TLS-RPT и BIMI, оценка на състоянието и
план на заявките.

```
=== SPF ===
 1. present=false valid=false term=null lookups=0 issues=[] mechs=  << not present / missing
 2. present=true valid=true term=~ lookups=1 issues=[] mechs=_spf.google.com  << valid, ~, 1 lookup
 3. present=true valid=true term=- lookups=0 issues=[] mechs=  << valid, -, 0 lookups
 4. present=true valid=true term=+ lookups=0 issues=[spf_plus_all] mechs=  << valid, issue spf_plus_all
 5. present=true valid=true term=null lookups=3 issues=[spf_ptr,spf_no_all] mechs=  << 3 lookups, spf_ptr + spf_no_all
 6. present=true valid=true term=~ lookups=11 issues=[spf_lookup_limit] mechs=s0.example.com|s1.example.com|s2.example.com|s3.example.com|s4.example.com|s5.example.com|s6.example.com|s7.example.com|s8.example.com|s9.example.com|s10.example.com  << 11 lookups, spf_lookup_limit
 7. present=true valid=false term=null lookups=0 issues=[spf_no_version] mechs=  << invalid, spf_no_version
 8. present=true valid=true term=- lookups=1 issues=[] mechs=_spf.example.com  << valid, -, 1 lookup (joined)

=== DMARC ===
 1. present=false valid=false p=null eff=null sp=null np=null t=false adkim=r aspf=r rua=0 issues=[] deprecated=[]
 2. present=true valid=true p=none eff=none sp=null np=null t=false adkim=r aspf=r rua=1 issues=[] deprecated=[]
 3. present=true valid=true p=quarantine eff=quarantine sp=null np=null t=false adkim=s aspf=s rua=1 issues=[] deprecated=[]
 4. present=true valid=true p=reject eff=reject sp=reject np=reject t=false adkim=r aspf=r rua=1 issues=[] deprecated=[]
 5. present=true valid=true p=reject eff=reject sp=null np=null t=true adkim=r aspf=r rua=1 issues=[] deprecated=[]
 6. present=true valid=true p=quarantine eff=quarantine sp=null np=null t=false adkim=r aspf=r rua=1 issues=[dmarc_deprecated_tags] deprecated=[pct,rf,ri]
 7. present=true valid=true p=null eff=none sp=null np=null t=false adkim=r aspf=r rua=1 issues=[dmarc_no_policy] deprecated=[]
 8. present=true valid=true p=reject eff=reject sp=null np=null t=false adkim=r aspf=r rua=0 issues=[dmarc_bad_uri,dmarc_no_rua] deprecated=[]
 9. present=true valid=false p=null eff=null sp=null np=null t=false adkim=r aspf=r rua=0 issues=[dmarc_no_version] deprecated=[]

=== DKIM / MTA-STS / TLS-RPT / BIMI ===
 dkim valid: {"present":true,"raw":"v=DKIM1; k=rsa; p=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
 dkim revoked: {"present":true,"raw":"v=DKIM1; k=rsa; p=","valid":false,"tags":{"v":"DKIM1","k":"rsa","p":""},"issues":["dkim_revoked"],"keyPresent":false,"keyType":"rsa","revoked":true}
 dkim empty: {"present":false,"raw":"","valid":false,"tags":{},"issues":[],"keyPresent":false,"keyType":null,"revoked":false}
 mtasts: {"present":true,"raw":"v=STSv1; id=20260101T000000Z","valid":true,"id":"20260101T000000Z","issues":[],"policyNotFetched":true}
 tlsrpt: {"present":true,"raw":"v=TLSRPTv1; rua=mailto:tls@example.com","valid":true,"rua":["mailto:tls@example.com"],"issues":[]}
 bimi: {"present":true,"raw":"v=BIMI1; l=https://example.com/logo.svg","valid":true,"logo":"https://example.com/logo.svg","authority":null,"issues":[]}

=== Posture scoring ===
 nothing configured: 0/10 ratio=0.00 enforcing=false posture=basic states={"spf":"missing","dmarc":"missing","dkim":"notchecked","mtasts":"missing","tlsrpt":"missing","bimi":"notchecked"}
 SPF ~all only: 2/10 ratio=0.20 enforcing=false posture=basic states={"spf":"configured","dmarc":"missing","dkim":"notchecked","mtasts":"missing","tlsrpt":"missing","bimi":"notchecked"}
 SPF ~all + DMARC p=none + rua: 5/10 ratio=0.50 enforcing=false posture=intermediate states={"spf":"configured","dmarc":"configured","dkim":"notchecked","mtasts":"missing","tlsrpt":"missing","bimi":"notchecked"}
 full strong: 12/12 ratio=1.00 enforcing=true posture=strong states={"spf":"configured","dmarc":"configured","dkim":"configured","mtasts":"configured","tlsrpt":"configured","bimi":"notchecked"}
 same with t=y: 11/12 ratio=0.92 enforcing=false posture=intermediate states={"spf":"configured","dmarc":"configured","dkim":"configured","mtasts":"configured","tlsrpt":"configured","bimi":"notchecked"}

=== Query plan for пример.бг ===
[
 {
  "name": "xn--e1afmkfd.xn--90ae",
  "type": "MX",
  "purpose": "mx"
 },
 {
  "name": "xn--e1afmkfd.xn--90ae",
  "type": "TXT",
  "purpose": "spf"
 },
 {
  "name": "_dmarc.xn--e1afmkfd.xn--90ae",
  "type": "TXT",
  "purpose": "dmarc"
 },
 {
  "name": "_mta-sts.xn--e1afmkfd.xn--90ae",
  "type": "TXT",
  "purpose": "mtasts"
 },
 {
  "name": "_smtp._tls.xn--e1afmkfd.xn--90ae",
  "type": "TXT",
  "purpose": "tlsrpt"
 },
 {
  "name": "default._bimi.xn--e1afmkfd.xn--90ae",
  "type": "TXT",
  "purpose": "bimi"
 },
 {
  "name": "selector1._domainkey.xn--e1afmkfd.xn--90ae",
  "type": "TXT",
  "purpose": "dkim",
  "selector": "selector1"
 },
 {
  "name": "google._domainkey.xn--e1afmkfd.xn--90ae",
  "type": "TXT",
  "purpose": "dkim",
  "selector": "google"
 }
]

 invalid input "not a domain": []
```

---

## 4. Организационни сценарии

`node run_org.js`

Шестте сценария, профилите и произтичащите планове с мерки.

```
### S1 Small internal organization
  exposure= low  maturity= initial (0/16) criticality= low  capacity= H0  finance= F0  level= P1
  first  : mfa-admins, mfa-all, reporting-path, incident-contacts, forwarding-audit, spf-publish, dmarc-monitor
  next   : dkim-enable, sender-inventory, quarantine-owner, rule-review, session-procedure, training-short
  extra  : 
  deferred: 
  total recommendations: 13

### S2 Accounting firm
  exposure= medium  maturity= developing (5/16) criticality= high  capacity= H1  finance= F1  level= P3
  first  : mfa-admins, mfa-all, payment-callback, reporting-path, incident-contacts, forwarding-audit, dmarc-monitor
  next   : dkim-enable, sender-inventory, quarantine-owner, rule-review, session-procedure, training-short, attachment-workflow, mfa-resistant-critical
  extra  : mtasts, web-filtering
  deferred: mfa-resistant-all(), external-support()
  total recommendations: 17

### S3 Outsourcing company
  exposure= high  maturity= established (12/16) criticality= medium  capacity= H2  finance= F2  level= P3
  first  : payment-callback, incident-contacts, forwarding-audit
  next   : sender-inventory, dmarc-quarantine, rule-review, session-procedure, training-short, attachment-workflow, mfa-resistant-critical
  extra  : dmarc-reject, spf-hardfail, mtasts, web-filtering, mfa-resistant-all
  deferred: 
  total recommendations: 15

### S4 Recruitment agency
  exposure= high  maturity= developing (5/16) criticality= medium  capacity= H1  finance= F1  level= P3
  first  : mfa-admins, mfa-all, payment-callback, reporting-path, incident-contacts, forwarding-audit, dmarc-monitor
  next   : dkim-enable, sender-inventory, quarantine-owner, rule-review, session-procedure, training-short, attachment-workflow, mfa-resistant-critical
  extra  : mtasts, web-filtering
  deferred: mfa-resistant-all(), external-support()
  total recommendations: 17

### S5 E-commerce company
  exposure= high  maturity= established (14/16) criticality= high  capacity= H2  finance= F2  level= P3
  first  : payment-callback, forwarding-audit
  next   : rule-review, session-procedure, training-short, attachment-workflow, mfa-resistant-critical
  extra  : dmarc-reject, spf-hardfail, mtasts, web-filtering, mfa-resistant-all, bimi
  deferred: 
  total recommendations: 13

### S6 Small technology company
  exposure= medium  maturity= established (16/16) criticality= medium  capacity= H3  finance= F3  level= P2
  first  : payment-callback, forwarding-audit
  next   : rule-review, session-procedure
  extra  : dmarc-reject, spf-hardfail, mtasts, web-filtering, bimi
  deferred: 
  total recommendations: 9

┌─────────┬──────────────────────────────────┬──────────┬─────────────────────┬─────────────┬──────┬──────┬───────┬───────┬──────┬───────┬──────────┐
│ (index) │ name                             │ exposure │ maturity            │ criticality │ cap  │ fin  │ level │ first │ next │ extra │ deferred │
├─────────┼──────────────────────────────────┼──────────┼─────────────────────┼─────────────┼──────┼──────┼───────┼───────┼──────┼───────┼──────────┤
│ 0       │ 'S1 Small internal organization' │ 'low'    │ 'initial 0/16'      │ 'low'       │ 'H0' │ 'F0' │ 'P1'  │ 7     │ 6    │ 0     │ 0        │
│ 1       │ 'S2 Accounting firm'             │ 'medium' │ 'developing 5/16'   │ 'high'      │ 'H1' │ 'F1' │ 'P3'  │ 7     │ 8    │ 2     │ 2        │
│ 2       │ 'S3 Outsourcing company'         │ 'high'   │ 'established 12/16' │ 'medium'    │ 'H2' │ 'F2' │ 'P3'  │ 3     │ 7    │ 5     │ 0        │
│ 3       │ 'S4 Recruitment agency'          │ 'high'   │ 'developing 5/16'   │ 'medium'    │ 'H1' │ 'F1' │ 'P3'  │ 7     │ 8    │ 2     │ 2        │
│ 4       │ 'S5 E-commerce company'          │ 'high'   │ 'established 14/16' │ 'high'      │ 'H2' │ 'F2' │ 'P3'  │ 2     │ 5    │ 6     │ 0        │
│ 5       │ 'S6 Small technology company'    │ 'medium' │ 'established 16/16' │ 'medium'    │ 'H3' │ 'F3' │ 'P2'  │ 2     │ 2    │ 5     │ 0        │
└─────────┴──────────────────────────────────┴──────────┴─────────────────────┴─────────────┴──────┴──────┴───────┴───────┴──────┴───────┴──────────┘
```

---

## 5. Анализ на чувствителността

`node sensitivity.js`

Всяка възможна стойност на всеки въпрос се подава поотделно спрямо базовия
набор. Отчита се промяната в профила и в набора препоръки.

```
BASELINE: exposure=medium maturity=developing(6) criticality=medium level=P2 n=16

┌─────────┬───────────────┬───────────────┬─────────────────────────────────────────┬───────┬─────────┬────┬──────────┬───────┐
│ (index) │ question      │ answer        │ dims                                    │ added │ removed │ n  │ deferred │ delta │
├─────────┼───────────────┼───────────────┼─────────────────────────────────────────┼───────┼─────────┼────┼──────────┼───────┤
│ 0       │ 'size'        │ 'micro'       │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 1       │ 'size'        │ 'medium'      │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 2       │ 'size'        │ 'large'       │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 3       │ 'model'       │ 'hybrid'      │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 4       │ 'model'       │ 'remote'      │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 5       │ 'profile'     │ 'internal'    │ 'exposure:medium->low'                  │ 0     │ 1       │ 15 │ 1        │ 1     │
│ 6       │ 'profile'     │ 'clients'     │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 7       │ 'profile'     │ 'outsourcing' │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 8       │ 'unknown'     │ 'rare'        │ 'exposure:medium->low'                  │ 0     │ 1       │ 15 │ 1        │ 1     │
│ 9       │ 'unknown'     │ 'daily'       │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 10      │ 'attachments' │ 'rare'        │ 'exposure:medium->low'                  │ 0     │ 1       │ 15 │ 1        │ 1     │
│ 11      │ 'attachments' │ 'core'        │ ''                                      │ 1     │ 0       │ 17 │ 1        │ 1     │
│ 12      │ 'payments'    │ 'no'          │ ''                                      │ 0     │ 1       │ 15 │ 1        │ 1     │
│ 13      │ 'payments'    │ 'often'       │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 14      │ 'roles'       │ 'management'  │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 15      │ 'roles'       │ 'hr'          │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 16      │ 'roles'       │ 'itadmin'     │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 17      │ 'roles'       │ 'sales'       │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 18      │ 'criticality' │ 'low'         │ 'criticality:medium->low'               │ 0     │ 2       │ 14 │ 0        │ 2     │
│ 19      │ 'criticality' │ 'high'        │ 'criticality:medium->high level:P2->P3' │ 0     │ 0       │ 16 │ 2        │ 0     │
│ 20      │ 'mfa'         │ 'none'        │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 21      │ 'mfa'         │ 'all'         │ ''                                      │ 0     │ 2       │ 14 │ 1        │ 2     │
│ 22      │ 'mfa'         │ 'resistant'   │ ''                                      │ 0     │ 3       │ 13 │ 1        │ 3     │
│ 23      │ 'domainauth'  │ 'unknown'     │ ''                                      │ 1     │ 0       │ 17 │ 1        │ 1     │
│ 24      │ 'domainauth'  │ 'spfdkim'     │ ''                                      │ 0     │ 1       │ 15 │ 1        │ 1     │
│ 25      │ 'domainauth'  │ 'monitor'     │ ''                                      │ 3     │ 2       │ 17 │ 1        │ 5     │
│ 26      │ 'domainauth'  │ 'enforce'     │ ''                                      │ 2     │ 3       │ 15 │ 2        │ 5     │
│ 27      │ 'filtering'   │ 'none'        │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 28      │ 'filtering'   │ 'managed'     │ ''                                      │ 0     │ 1       │ 15 │ 1        │ 1     │
│ 29      │ 'reporting'   │ 'none'        │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 30      │ 'reporting'   │ 'defined'     │ ''                                      │ 0     │ 1       │ 15 │ 1        │ 1     │
│ 31      │ 'incident'    │ 'none'        │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 32      │ 'incident'    │ 'written'     │ ''                                      │ 0     │ 1       │ 15 │ 1        │ 1     │
│ 33      │ 'training'    │ 'none'        │ ''                                      │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 34      │ 'training'    │ 'regular'     │ ''                                      │ 0     │ 1       │ 15 │ 1        │ 1     │
│ 35      │ 'capacity'    │ 'H0'          │ 'capacity:H1->H0'                       │ 0     │ 1       │ 15 │ 2        │ 1     │
│ 36      │ 'capacity'    │ 'H2'          │ 'capacity:H1->H2'                       │ 0     │ 0       │ 16 │ 0        │ 0     │
│ 37      │ 'capacity'    │ 'H3'          │ 'capacity:H1->H3'                       │ 0     │ 0       │ 16 │ 0        │ 0     │
│ 38      │ 'finance'     │ 'F0'          │ 'finance:F1->F0'                        │ 0     │ 2       │ 14 │ 3        │ 2     │
│ 39      │ 'finance'     │ 'F2'          │ 'finance:F1->F2'                        │ 0     │ 0       │ 16 │ 1        │ 0     │
│ 40      │ 'finance'     │ 'F3'          │ 'finance:F1->F3'                        │ 1     │ 0       │ 17 │ 0        │ 1     │
└─────────┴───────────────┴───────────────┴─────────────────────────────────────────┴───────┴─────────┴────┴──────────┴───────┘
answer variations tested: 41 | variations changing the recommendation set: 19 (46%) | variations changing at least one profile dimension: 11
```

---

## 6. Различие между сценариите по мярката на Jaccard

`node run_jaccard.js`

За всяка двойка сценарии се дели броят на общите мерки на броя на всички
различни мерки в двата набора. Произвежда числото, посочено в раздел 3.11.

```
Модули на toolkit-а: assets/js
Node.js            : v22.22.2
Сценарии           : 6

Брой мерки по сценарий
==================================
  S1  13 мерки
  S2  17 мерки
  S3  15 мерки
  S4  17 мерки
  S5  13 мерки
  S6  9 мерки

┌─────────┬───────────┬──────┬────────┬─────────┐
│ (index) │ двойка    │ общи │ всички │ Jaccard │
├─────────┼───────────┼──────┼────────┼─────────┤
│ 0       │ 'S1 / S2' │ 12   │ 18     │ 0.667   │
│ 1       │ 'S1 / S3' │ 6    │ 22     │ 0.273   │
│ 2       │ 'S1 / S4' │ 12   │ 18     │ 0.667   │
│ 3       │ 'S1 / S5' │ 4    │ 22     │ 0.182   │
│ 4       │ 'S1 / S6' │ 3    │ 19     │ 0.158   │
│ 5       │ 'S2 / S3' │ 11   │ 21     │ 0.524   │
│ 6       │ 'S2 / S4' │ 17   │ 17     │ 1       │
│ 7       │ 'S2 / S5' │ 9    │ 21     │ 0.429   │
│ 8       │ 'S2 / S6' │ 6    │ 20     │ 0.3     │
│ 9       │ 'S3 / S4' │ 11   │ 21     │ 0.524   │
│ 10      │ 'S3 / S5' │ 12   │ 16     │ 0.75    │
│ 11      │ 'S3 / S6' │ 8    │ 16     │ 0.5     │
│ 12      │ 'S4 / S5' │ 9    │ 21     │ 0.429   │
│ 13      │ 'S4 / S6' │ 6    │ 20     │ 0.3     │
│ 14      │ 'S5 / S6' │ 9    │ 13     │ 0.692   │
└─────────┴───────────┴──────┴────────┴─────────┘

Обобщение
==================================
  двойки сценарии    : 15
  средна стойност    : 0.4929 (закръглено 0.493)
  най-малка стойност : 0.158
  най-голяма стойност: 1.000

Средната стойност под 0,5 означава, че по-малко от половината мерки
са общи за произволна двойка сценарии. Наборите препоръки се различават
съществено, тоест профилирането води до различен резултат, а не до един
и същ списък с разместен ред.
```

Двойката С2 и С4 показва пълно съвпадение. Това е отрицателният резултат,
описан в раздел 3.11 на тезата. Причината е, че счетоводната кантора
удовлетворява условието за основна дейност с външни файлове, с което се изравнява
с агенцията за подбор въпреки различната изложеност.

## Повторно изпълнение

Изисква Node.js 22 или по-нова версия.

    cd evaluation
    node run_eml.js
    node run_extended.js
    node run_domain.js
    node run_org.js
    node sensitivity.js
    node run_jaccard.js

Пътят към `assets/js` се намира автоматично. При нестандартно разположение се
задава изрично чрез `SPDT_JS`.

Числата се отнасят към версията на хранилището, посочена в release v1.0.
Промяна в таблицата с тегла, в праговете или в каталога с мерки ще ги измени.
