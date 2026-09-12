# Sources

Every technical claim in this toolkit traces back to one of the documents below.
Each entry gives the title, the publishing organization, the URL, what it
supports in the product, and the date it was last checked.

All entries were verified on **2026-09-08**.

Specifications move. Before publishing a fork, re-check at least the DMARC
entries and the mail client export instructions, which change with product
updates. Do not carry a status forward without confirming it.

---

## Message format and MIME

| Source | Organization | Last checked |
| --- | --- | --- |
| [RFC 5322: Internet Message Format](https://www.rfc-editor.org/info/rfc5322) | IETF | 2026-09-08 |

Supports: the structure of header fields, the unfolding of continuation lines,
and the separation of the header block from the body.

| Source | Organization | Last checked |
| --- | --- | --- |
| [RFC 2045: MIME Part One, Format of Internet Message Bodies](https://www.rfc-editor.org/info/rfc2045) | IETF | 2026-09-08 |
| [RFC 2046: MIME Part Two, Media Types](https://www.rfc-editor.org/info/rfc2046) | IETF | 2026-09-08 |
| [RFC 2047: MIME Part Three, Message Header Extensions for Non-ASCII Text](https://www.rfc-editor.org/info/rfc2047) | IETF | 2026-09-08 |

Supports: multipart boundary handling, the `base64` and `quoted-printable`
transfer encodings, and the decoding of encoded words in `Subject` and in
sender display names. The encoded word handling is what allows a Bulgarian
subject line to be read correctly.

| Source | Organization | Last checked |
| --- | --- | --- |
| [RFC 2231: MIME Parameter Value and Encoded Word Extensions](https://www.rfc-editor.org/info/rfc2231) | IETF | 2026-09-08 |

Supports: continued and character set tagged parameters, used when reading
attachment file names that are split across several parameter lines.

---

## Email authentication

| Source | Organization | Status | Last checked |
| --- | --- | --- | --- |
| [RFC 7208: Sender Policy Framework (SPF) version 1](https://www.rfc-editor.org/info/rfc7208) | IETF | Proposed Standard | 2026-09-08 |

Supports: SPF mechanisms and modifiers, the qualifiers `+`, `-`, `~` and `?`,
the deprecation of `ptr`, and the limit of ten DNS querying terms above which
evaluation fails permanently.

| Source | Organization | Status | Last checked |
| --- | --- | --- | --- |
| [RFC 6376: DomainKeys Identified Mail (DKIM) Signatures](https://www.rfc-editor.org/info/rfc6376) | IETF | Internet Standard | 2026-09-08 |

Supports: the fields of a `DKIM-Signature`, the role of the `s=` selector, the
`selector._domainkey.domain` record location, and the meaning of an empty `p=`
tag as a revoked key.

| Source | Organization | Status | Last checked |
| --- | --- | --- | --- |
| [RFC 9989: Domain-Based Message Authentication, Reporting, and Conformance (DMARC)](https://www.rfc-editor.org/info/rfc9989) | IETF | Proposed Standard | 2026-09-08 |
| [RFC 9990: DMARC Aggregate Reporting](https://www.rfc-editor.org/info/rfc9990) | IETF | Proposed Standard | 2026-09-08 |
| [RFC 9991: DMARC Failure Reporting](https://www.rfc-editor.org/info/rfc9991) | IETF | Proposed Standard | 2026-09-08 |

Supports: all DMARC parsing and every DMARC recommendation.

These three documents were published in May 2026 and replaced RFC 7489, the
Informational specification from 2015, moving DMARC onto the standards track.
The toolkit implements the current model: the `np`, `psd` and `t` tags are
recognized, `pct`, `rf` and `ri` are reported as removed, a valid record whose
`p` tag is unusable is treated as `p=none` when a valid `rua` is present, and
`t=y` is treated as disabling enforcement. Records still begin with `v=DMARC1`
and existing records remain valid.

**RFC 7489 is obsolete and is not used as a reference anywhere in this
repository.** If you find a claim here that only makes sense under RFC 7489,
that is a bug worth reporting.

| Source | Organization | Status | Last checked |
| --- | --- | --- | --- |
| [RFC 8601: Message Header Field for Indicating Message Authentication Status](https://www.rfc-editor.org/info/rfc8601) | IETF | Proposed Standard | 2026-09-08 |

Supports: reading the `Authentication-Results` field, including the
`authserv-id`, the per method results, and the `header.from`, `header.d` and
`smtp.mailfrom` properties.

| Source | Organization | Status | Last checked |
| --- | --- | --- | --- |
| [RFC 8617: The Authenticated Received Chain (ARC) Protocol](https://www.rfc-editor.org/info/rfc8617) | IETF | Experimental | 2026-09-08 |

Supports: the detection of `ARC-Seal` and `ARC-Authentication-Results`.

Note the status. ARC is Experimental, not standards track, and the toolkit
describes it that way rather than presenting it as a settled standard.

---

## Transport security

| Source | Organization | Status | Last checked |
| --- | --- | --- | --- |
| [RFC 8461: SMTP MTA Strict Transport Security (MTA-STS)](https://www.rfc-editor.org/info/rfc8461) | IETF | Proposed Standard | 2026-09-08 |

Supports: the `_mta-sts` TXT record, the requirement that the policy itself be
served over HTTPS at a well known path, and the `testing`, `enforce` and `none`
modes. This is the source for the statement that a DNS record alone does not
prove the policy is served correctly.

| Source | Organization | Status | Last checked |
| --- | --- | --- | --- |
| [RFC 8460: SMTP TLS Reporting](https://www.rfc-editor.org/info/rfc8460) | IETF | Proposed Standard | 2026-09-08 |

Supports: the `_smtp._tls` TXT record and its role as the reporting channel for
MTA-STS failures.

---

## Names and addresses

| Source | Organization | Last checked |
| --- | --- | --- |
| [RFC 3492: Punycode](https://www.rfc-editor.org/info/rfc3492) | IETF | 2026-09-08 |
| [RFC 5890: Internationalized Domain Names for Applications (IDNA), Definitions and Document Framework](https://www.rfc-editor.org/info/rfc5890) | IETF | 2026-09-08 |

Supports: the punycode decoder that turns an `xn--` label back into readable
form so a lookalike host becomes visible, and the encoder that converts a domain
typed in Cyrillic into the ASCII form needed for a DNS query.

| Source | Organization | Last checked |
| --- | --- | --- |
| [RFC 3986: Uniform Resource Identifier (URI), Generic Syntax](https://www.rfc-editor.org/info/rfc3986) | IETF | 2026-09-08 |

Supports: the URL dissection into scheme, userinfo, host, port, path, query and
fragment, and the fact that everything before an `@` in the authority is
userinfo rather than the host.

| Source | Organization | Last checked |
| --- | --- | --- |
| [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/info/rfc1918) | IETF | 2026-09-08 |

Supports: the private range detection in the `Received` chain analysis and the
address blocking in the optional command line helper.

---

## DNS transport

| Source | Organization | Last checked |
| --- | --- | --- |
| [RFC 8484: DNS Queries over HTTPS (DoH)](https://www.rfc-editor.org/info/rfc8484) | IETF | 2026-09-08 |

Supports: the mechanism used by the optional online lookup.

| Source | Organization | Last checked |
| --- | --- | --- |
| [Cloudflare public DNS resolver privacy policy](https://developers.cloudflare.com/1.1.1.1/privacy/public-dns-resolver/) | Cloudflare | 2026-09-08 |
| [Google Public DNS privacy policy](https://developers.google.com/speed/public-dns/privacy) | Google | 2026-09-08 |

Supports: the consent dialog. Both are linked directly from the interface so
that the resolver's own statement about what it retains is one click away
before a query is sent.

---

## Exporting a message as `.eml`

These are the entries most likely to go stale, because vendors change menus.
Re-verify before publishing a fork.

| Source | Organization | Last checked |
| --- | --- | --- |
| [Trace an email with its full header](https://support.google.com/mail/answer/29436) | Google | 2026-09-08 |

Supports: the Gmail instructions. The three dot menu inside an open message
offers Download message, which saves an `.eml` file directly. Show original
followed by Download original produces the same file. Neither is available in
the Gmail mobile applications.

| Source | Organization | Last checked |
| --- | --- | --- |
| [Save an Outlook message as a .eml file, a PDF file, or as a draft](https://support.microsoft.com/en-us/outlook/mail/save-an-outlook-message-as-a-eml-file-a-pdf-file-or-as-a-draft) | Microsoft | 2026-09-08 |

Supports: the Outlook instructions. In new Outlook for Windows and in Outlook on
the web, More actions followed by Save as offers EML.

This source is also why the toolkit tells classic Outlook users to do something
different. **Classic Outlook for Windows has no save as `.eml` option**; its
Save as produces `.msg`, which this toolkit does not read. The documented
alternatives are to open the same mailbox in Outlook on the web or new Outlook,
or to forward the message as an attachment so the original header fields
survive.

| Source | Organization | Last checked |
| --- | --- | --- |
| [Save emails as files or PDFs in Mail on Mac](https://support.apple.com/en-euro/guide/mail/mlhlp1044/mac) | Apple | 2026-09-08 |

Supports: the Apple Mail instructions. File followed by Save As with the format
set to Raw Message Source writes an `.eml` file. Dragging a message to the
desktop produces the same result, and dragging a conversation saves each message
as a separate file.

| Source | Organization | Last checked |
| --- | --- | --- |
| [Thunderbird support: saving a message to a file](https://support.mozilla.org/en-US/questions/1113778) | Mozilla | 2026-09-08 |

Supports: the Thunderbird instructions. Right clicking a message and choosing
Save As, or File followed by Save As and then File, writes an `.eml` file
directly.

This is a community support thread on Mozilla's official support site rather
than a formal knowledge base article, because Mozilla does not currently publish
a dedicated article for this action. The behaviour is long standing and
consistent across versions, but it is the weakest citation in this list and is
flagged as such.

---

## Guidance and frameworks

The organizational recommendations follow the general shape of published
guidance from the bodies below. No claim here is attributed to a specific
document from them, because the toolkit's recommendations are its own and should
be judged on the reasoning given in `METHODOLOGY.md` rather than borrowed
authority.

| Organization | URL |
| --- | --- |
| NIST | [https://www.nist.gov/cybersecurity](https://www.nist.gov/cybersecurity) |
| CISA | [https://www.cisa.gov/](https://www.cisa.gov/) |
| ENISA | [https://www.enisa.europa.eu/](https://www.enisa.europa.eu/) |
| CERT-EU | [https://cert.europa.eu/](https://cert.europa.eu/) |
| NCSC | [https://www.ncsc.gov.uk/](https://www.ncsc.gov.uk/) |
| MITRE ATT&CK | [https://attack.mitre.org/](https://attack.mitre.org/) |
| FIDO Alliance | [https://fidoalliance.org/](https://fidoalliance.org/) |
| W3C WebAuthn | [https://www.w3.org/TR/webauthn-3/](https://www.w3.org/TR/webauthn-3/) |

---

## Deliberately not cited

No statistic about the prevalence, cost or growth rate of phishing appears
anywhere in this repository. Such figures are usually vendor produced, rarely
reproducible, and age badly. The toolkit makes its case from mechanisms rather
than from numbers it cannot stand behind.

No commercial product is recommended. Vendor documentation is cited only where
it documents an export procedure for that vendor's own product.
