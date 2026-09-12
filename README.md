# SME Phishing Defense Toolkit

A single local tool for small and medium organizations that need to deal with
phishing without a security team.

It does four things in one interface:

1. analyzes a suspicious message from an `.eml` file, entirely in your browser;
2. assesses the email security posture of a domain;
3. profiles your organization and turns that into a prioritized action plan;
4. provides checklists, decision trees and technical explanations for use during an incident.

There is no account, no API key, no artificial intelligence and no server.
Open `index.html` and it works.

## Who this is for

- owners and managers of small and medium enterprises
- IT generalists who do not specialize in cybersecurity
- system administrators
- external IT providers and managed service providers
- employees who have just received a suspicious message and need a next step

The interface is available in Bulgarian and English.

## What it does not do

It does not tell you that a message is phishing. No tool can prove intent from
technical indicators, and one that claims to will eventually be wrong in an
expensive way. What it does is show you what the file actually contains, explain
what each finding means, and state the limitation of every check.

It is also not a security audit, a mail filter, a phishing simulation platform
or a mailbox integration. See the Scope section below.

## Running it

### Locally

Download or clone the repository and open `index.html` in a browser. That is
the whole installation. No build step, no package manager, no dependencies.

```
git clone https://github.com/<your-account>/sme-phishing-defense-toolkit.git
cd sme-phishing-defense-toolkit
```

Then open `index.html`. Everything except the optional DNS lookup works with no
network connection at all, including from a USB stick on a machine that has
never been online.

### On GitHub Pages

1. Push the repository to GitHub.
2. Open Settings, then Pages.
3. Under Source choose Deploy from a branch, pick your default branch and the root folder.
4. Save. The site appears at `https://<your-account>.github.io/sme-phishing-defense-toolkit/`.

The `.nojekyll` file in the repository root is required so that Pages serves
every file as it is.

Hosting on Pages does not change the privacy properties. The page is static, it
loads no third party resource, and the only request that can ever leave the
browser is the DNS lookup you start yourself.

## Privacy in one paragraph

Email content, header fields, extracted URLs and questionnaire answers stay in
the memory of the page. There is no telemetry, no analytics, no tracker, no
cloud database, no account, no sync, no external font and no content delivery
network. Nothing is written to `localStorage`, `sessionStorage`, cookies or
IndexedDB. Reloading or closing the tab erases everything. The full data flow is
described in [PRIVACY.md](PRIVACY.md).

One feature can send something outward: the optional DNS lookup in the Check
domain section. It sends a domain name and a record type to a resolver you
choose, over DNS over HTTPS, after you confirm a dialog that lists the exact
names that will be queried. No message content is ever part of that request.

## The three technical parts

### Analyze email

Load an `.eml` file. The toolkit parses it locally and reports:

- sender identity: `From`, `Sender`, `Reply-To`, `Return-Path`, display name deception, lookalike and punycode domains, mixed alphabets within one name;
- authentication: the SPF, DKIM, DMARC and ARC results recorded by the receiving server, read rather than recomputed;
- routing: the `Received` chain, malformed entries, private relays, timing anomalies;
- URLs: extracted from both the text and the HTML parts, then analyzed passively for numeric hosts, punycode, userinfo tricks, redirect parameters, shorteners and visible text that does not match the destination;
- attachments: name, declared type, approximate size, risky categories, double extensions and type mismatches.

Attachments are never opened, decompressed or executed. URLs are never opened
or requested. HTML is never rendered; only sanitized text is shown.

The result is a category plus the evidence behind it, never a bare number:
low, moderate or high technical suspicion, manual verification recommended, or
insufficient evidence. Every indicator shows its weight, the evidence that
triggered it and its limitation. The full weight table is in
[docs/METHODOLOGY.md](docs/METHODOLOGY.md).

### Check domain

Two modes:

- **Privacy mode** makes no network request. You paste the DNS records and the analysis runs locally.
- **Online DNS lookup** is opt in. Before anything is sent you see the exact list of names that will be queried and which resolver will see them.

It analyzes SPF, DMARC, DKIM, MTA-STS, TLS-RPT and MX, and reports BIMI as
informational only. DMARC parsing follows RFC 9989, which replaced RFC 7489 in
May 2026: the `np`, `psd` and `t` tags are understood, and `pct`, `rf` and `ri`
are reported as removed from the specification.

Every control is reported separately as configured, partially configured,
missing, invalid, unknown or not checked. A control that was not checked never
counts against the domain. Where the toolkit cannot know something, it says so
rather than guessing: DKIM without a selector is reported as unknown, not as
missing, and an MTA-STS DNS record is not treated as proof that the policy file
behind it is actually served.

### Assess organization

Sixteen questions about size, work model, communication exposure, critical
roles, existing controls, incident readiness, IT capacity and financial
capability. It asks for no company name, no personal name, no email address, no
domain, no IP address and no customer name.

The result is a profile across six dimensions rather than a single score:
communication exposure, security maturity, IT capacity (H0 to H3), financial
capability (F0 to F3), operational criticality and a recommended protection
level. Each dimension states which answers produced it.

High external communication is handled deliberately. For a recruitment agency
or a support desk, mail from unknown senders carrying attachments is the normal
state of the business, so the toolkit does not treat "unknown sender" as a
strong signal for those organizations and recommends process controls instead.

`F0` to `F3` describe what an organization is willing and able to allocate. They
are self declared and are not budget brackets in any statistical sense.

## Repository layout

```
sme-phishing-defense-toolkit/
├── index.html                  the entire application shell
├── README.md
├── LICENSE
├── PRIVACY.md                  exact data flow
├── SECURITY.md                 how to report a problem in this toolkit
├── .nojekyll                   required for GitHub Pages
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── i18n.js             all interface text and long form content, both languages
│       ├── rules.js            questionnaire, profile logic, recommendation catalog
│       ├── eml-analyzer.js     RFC 5322 and MIME parsing, passive analysis
│       ├── domain-check.js     record parsing, posture scoring, optional DoH lookups
│       └── app.js              rendering and interaction
├── docs/
│   ├── METHODOLOGY.md          every weight, threshold and decision rule
│   ├── SOURCES.md              verified sources with the date each was checked
│   ├── USER-GUIDE-BG.md
│   ├── USER-GUIDE-EN.md
│   └── TESTING.md              test cases with expected outcomes
├── tools/
│   └── local-url-helper.py     optional, advanced, not required
└── evaluation/                 synthetic test corpus and the Node.js harness
```

## The optional command line helper

`tools/local-url-helper.py` sends a HEAD request to a URL from your own machine
and reports the redirect chain, the final status and TLS certificate metadata.
It requires Python 3.8 and no third party packages.

It is genuinely optional. The web interface never calls it, and the core product
does not depend on it.

Understand the trade before using it. Contacting a suspicious address reveals
your public IP address to whoever controls it, confirms that the message was
read, and can disturb evidence during an incident. Passive analysis in the
browser is the default for a reason.

The helper refuses every scheme other than `http` and `https`, blocks loopback,
private, link local and reserved addresses on every hop of the redirect chain,
uses a short timeout and a small redirect limit, sends no cookies, executes no
JavaScript, downloads no page bodies and opens nothing in a browser.

```
python3 tools/local-url-helper.py https://example.com/path
python3 tools/local-url-helper.py --json https://example.com/path
```

## Scope

Deliberately not built: a SIEM, a security operations dashboard, a phishing
simulation platform, mailbox login integration, Microsoft Graph or Gmail API
integration, automatic mailbox remediation, a cloud upload service, an
attachment sandbox, a malware execution environment, a multi tenant platform, a
machine learning classifier, or a browser extension.

The goal is one complete, useful toolkit rather than a security platform.

## Accuracy and sources

Every technical claim is backed by a real, current, authoritative source listed
in [docs/SOURCES.md](docs/SOURCES.md) together with the date it was last
checked. Specifications move: DMARC became a standards track protocol in May
2026 and BIMI is still an Internet Draft rather than a standard. If you fork
this repository, re-verify the sources before publishing, especially the mail
client export instructions, which change with product updates.

## Contributing

Useful contributions, in rough order of value:

1. corrections where a technical claim is wrong or has gone out of date;
2. `.eml` parsing edge cases, submitted as synthetic fixtures rather than real mail;
3. improvements to the Bulgarian and English wording, particularly for nontechnical readers;
4. additional mail client export instructions, with a link to the vendor documentation.

Never attach a real message from a real mailbox to an issue. Build a synthetic
fixture that reproduces the problem instead.

## License

MIT. See [LICENSE](LICENSE).
