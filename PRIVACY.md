# Privacy

This document describes the exact data flow. It is not a policy written to be
agreed to; it is a description of what the code does, and it can be checked
against the code in an afternoon.

The whole product is five JavaScript files, one stylesheet and one HTML file.
There is no server component.

---

## Data that never leaves the device

The following are read into the memory of the page and stay there:

- the content of the `.eml` file you load;
- all header fields of the message;
- the body text used during parsing;
- every URL extracted from the message;
- attachment names, declared types and sizes;
- your answers to the organizational questionnaire;
- every calculated result, profile and recommendation;
- anything you paste into the privacy mode fields of the domain check.

None of this is transmitted, uploaded, logged or written to disk. The file you
select is read with the browser File API into memory and is never re-uploaded
anywhere.

---

## Data that can leave the device

There are exactly two features that can produce a network request, and neither
runs on its own.

### 1. The optional DNS lookup

Found in Check domain, under Online DNS lookup. It is off by default; the
privacy mode is selected when the page opens.

**What is sent:** a domain name and a DNS record type, to one resolver that you
choose from a list.

**What is not sent:** no email file, no header field, no message body, no
recipient address, no attachment, no questionnaire answer, and nothing derived
from any of them.

**Who can see it:** the resolver you selected. It can see which names you asked
about and the network address the request came from. That is inherent to making
a DNS query and cannot be avoided while still asking the question. Both
supported resolvers publish their own retention statements, and the interface
links to them directly inside the consent dialog.

**Before it runs**, a dialog shows the complete list of names that will be
queried, in full, along with what is sent, what is not sent, and which resolver
will receive it. The run button stays disabled until you tick the box.

For the domain `example.com` with the selector `selector1`, the complete list is:

```
example.com                             MX
example.com                             TXT
_dmarc.example.com                      TXT
_mta-sts.example.com                    TXT
_smtp._tls.example.com                  TXT
default._bimi.example.com               TXT
selector1._domainkey.example.com        TXT
```

If you additionally tick the SPF include following option, the domains named in
the `include` and `redirect` mechanisms of the SPF record are queried as well.
This is stated in the dialog before you consent, because it means names beyond
the one you typed will be sent.

The requests are made over DNS over HTTPS with credentials omitted, no referrer
and no caching.

**A local alternative exists.** Privacy mode does the entire analysis on records
you paste yourself, with no network request of any kind. You can obtain the
records from your IT provider, your DNS panel, or any DNS tool you already
trust, and the analysis is identical.

### 2. The optional command line helper

`tools/local-url-helper.py` contacts a URL directly. It is a separate program.
The web interface never calls it, never can call it, and the toolkit is fully
usable without it.

**What is sent:** an HTTP HEAD request to the address you give it, from your
machine.

**Who can see it:** whoever controls that address. They learn your public IP
address, that the message reached a live reader, and roughly when.

This is a genuinely different exposure from a DNS lookup. A DNS query tells one
resolver you chose that you are interested in a domain. Contacting a URL tells
the attacker. During an incident it can also disturb evidence. The helper
requires explicit confirmation before every run and explains this first.

The helper refuses every scheme other than `http` and `https`, blocks loopback,
private, link local and reserved addresses on every hop of the redirect chain,
uses a short timeout and a small redirect limit, sends no cookies, executes no
JavaScript, downloads no page bodies and opens nothing in a browser.

---

## What is never used

- telemetry of any kind
- analytics, including page view counting
- advertising trackers
- remote AI models, remote scoring or any remote classification
- cloud databases
- user accounts, sign in or identity of any kind
- cloud sync
- external font services
- external icon services
- content delivery networks
- third party JavaScript libraries
- error reporting services

The page loads no resource from any domain other than the one serving it. Icons
are inline SVG. Fonts are the ones already installed on your device.

---

## Storage

Nothing is stored persistently. Specifically, the toolkit does not use:

- `localStorage`
- `sessionStorage`
- cookies
- IndexedDB
- the Cache API
- any automatic browser persistence

All state lives in one JavaScript object in the memory of the page. It is gone
when you reload, close the tab, or press Reset everything in the footer.

This includes the checklist ticks and your language choice. They reset on
reload. That is a deliberate trade: remembering them would mean writing
something to the device, and this tool is often used on a machine that may
already be compromised.

---

## Safety of the analysis itself

Analyzing a hostile message must not itself become the attack. The analyzer:

- never executes scripts contained in a message;
- never loads remote images, so tracking pixels never fire and the sender never learns the message was opened;
- never fetches remote stylesheets;
- never opens or requests any extracted URL;
- never executes, opens or decompresses an attachment;
- never sends a hash, a file or any content to a reputation service;
- never renders message HTML, showing only sanitized text.

Every value derived from a message is inserted into the page as text, never as
markup. There is no path by which content inside an `.eml` file can execute in
the page.

---

## Visible state indicator

The header carries an indicator that shows whether the toolkit is in local only
operation or performing an optional network request. It changes only while a
lookup you started is running.

There is no hidden network activity. If the indicator says local, nothing is
being sent.

---

## Hosting

If you use a copy hosted on GitHub Pages, or on any other web host, that host
sees the ordinary web server request for the page itself, as it would for any
page. It does not see anything you do afterwards, because everything afterwards
happens in your browser.

If this matters to you, download the repository and open `index.html` from your
own disk. Everything except the optional DNS lookup works with no network
connection at all.

---

## Verifying these claims

You do not have to take this document on trust.

1. Open the browser developer tools, go to the network tab, and load a message. There will be no requests.
2. Go to the application or storage tab and look at local storage, session storage, cookies and IndexedDB. All empty.
3. Disconnect from the network entirely and use the toolkit. Everything except the online lookup works.
4. Search the source for `fetch`. It appears once, in `assets/js/domain-check.js`, in the DNS lookup function.
5. Search the source for `localStorage`, `sessionStorage`, `document.cookie` and `indexedDB`. They do not appear.
6. Search the source for `innerHTML`. It does not appear.
