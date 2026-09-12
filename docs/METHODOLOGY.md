# Methodology

Everything the toolkit decides is written down here. A competent reader should
be able to reproduce every result by hand from this document.

There are three independent decision systems. They do not feed into each other:
the email analyzer never looks at your organizational profile, and the domain
check never looks at a loaded message unless you explicitly ask it to reuse a
domain.

---

## 1. Email analyzer

### 1.1 What the analyzer actually knows

The analyzer reads one file. It does not resolve a name, open a URL, contact a
reputation service or execute anything. This bounds what it can say.

In particular, the toolkit does **not** cryptographically revalidate SPF, DKIM
or DMARC. Doing so would require live DNS queries and signature verification
against the message body. Instead it reads the results that the receiving mail
infrastructure already recorded in the `Authentication-Results` field and
explains them. That distinction matters:

- if the file was saved before the receiving server processed it, there are no results to read;
- if the field was written by a server you do not trust, the results are worth nothing;
- a forged `Authentication-Results` field is possible if it was added before your first trusted hop.

The interface states this limitation next to every authentication result.

### 1.2 Indicator model

Each check produces at most one indicator. An indicator carries a weight, the
evidence that triggered it and a written limitation.

**An indicator contributes its weight at most once per message, however many
times it is observed.** A message with forty punycode links scores the same
three points as a message with one. The evidence list still shows every
instance. This exists so that a bulk newsletter with many tracking links cannot
be pushed into a high verdict by volume alone.

The score is the sum of the weights of the distinct indicators found.

### Authentication results

| Indicator | Weight | Limitation |
| --- | --- | --- |
| DMARC result is fail | 4 | The result was recorded by the recipient and is not recomputed here. Forwarding and mailing lists sometimes break the check for legitimate mail too. |
| SPF result is fail | 3 | SPF checks the envelope address, not the visible sender. It almost always fails on forwarded mail. |
| SPF result is softfail | 2 | Many organizations stay on softfail permanently, so on its own this result is a weak signal. |
| SPF produced no result | 1 | A missing SPF record is a weakness of the sender, not evidence of fraud. |
| DKIM result is fail | 3 | Security gateways and mailing lists often modify a message and break a valid signature. |
| The message carries no DKIM signature | 1 | Many small organizations still do not sign their outgoing mail. This is not an indicator of fraud. |
| No Authentication-Results field | 1 | This is normal for a message saved from drafts, from sent mail, or before processing. It is not an indicator of fraud. |
| The Authentication-Results field cannot be read | 1 | The cause may be a nonstandard server or a file damaged while saving, rather than manipulation. |

### Sender identity

| Indicator | Weight | Limitation |
| --- | --- | --- |
| The display name contains a different address | 3 | A classic trick, though it is occasionally the result of a misconfigured client inserting an address into the name. |
| A reply would go to a different domain | 3 | There are legitimate uses: helpdesks, newsletters and ticketing systems often set a different reply address. |
| The sender domain uses punycode | 3 | Cyrillic domain names are entirely legitimate. What matters is whether the readable form imitates another brand. |
| Mixed alphabets in the sender name | 3 | The check looks within a single name part only. A name written entirely in Cyrillic is not treated as a problem. |
| The display name names a different domain | 2 | Many organizations legitimately send from a provider domain while keeping their brand in the name. |
| The From field contains more than one address | 2 | This is technically permitted and does occur with automated systems. |
| Return-Path is at a different domain | 1 | This is common with bulk mailing and external providers. That is exactly why the weight is low. |
| The Sender field is at a different domain | 1 | This is normal with assistants, mailing lists and marketing platforms. |

### URLs

| Indicator | Weight | Limitation |
| --- | --- | --- |
| A URL with a numeric IP instead of a name | 3 | Some internal systems and devices legitimately use numeric addresses. |
| A URL with punycode in the host name | 3 | Not every such address is fraudulent. Compare the readable form with the domain you know. |
| Mixed alphabets in the host name | 3 | The check is limited to Latin, Cyrillic and Greek. |
| The URL contains an @ before the host | 3 | Rare in legitimate URLs sent by email. |
| The visible text does not match the destination | 3 | Click tracking systems do the same thing in entirely legitimate newsletters. |
| Encoded characters in the host name | 2 | Encoding in the path or the parameters is normal. Only encoding in the host itself is counted here. |
| Another address embedded as a parameter | 2 | Redirect parameters are used legitimately in sign in flows and return to page links. |
| A shortened URL | 1 | Shortening is widespread and by itself is not a sign of fraud. |
| Many subdomains in the URL | 1 | Large service providers also use deep names. |
| A very long URL | 1 | Long URLs are common in tracking systems and cloud services. |
| A nonstandard port | 1 | Internal and test systems often use other ports. |

### Message body

| Indicator | Weight | Limitation |
| --- | --- | --- |
| The message contains an input form | 4 | Most modern mail clients do not allow submission from such a form, but its presence is unusual. |
| Invisible characters in the text | 2 | Such characters also appear when text is copied from other programs. |

### Attachments

| Indicator | Weight | Limitation |
| --- | --- | --- |
| An executable attachment | 4 | The judgement is based on the name alone. The file was not opened, decompressed or analyzed. |
| A double file extension | 4 | There are rare legitimate cases, for example an archive of a document. |
| A macro enabled document | 3 | Many accounting and inventory systems legitimately use such files. |
| An attachment with web content | 3 | Some systems legitimately send reports as an attached web page. |
| The extension does not match the declared type | 2 | Many systems declare a generic type for every attachment. Only a clear contradiction is counted. |
| An archived attachment | 1 | Archives are an everyday way of sending documents. The toolkit does not open them. |

### Routing

| Indicator | Weight | Limitation |
| --- | --- | --- |
| A malformed entry in the route | 1 | Nonstandard servers and internal systems also produce incomplete entries. |
| An unusually high number of intermediate servers | 1 | Forwarding, mailing lists and security gateways add entries. A long route does not mean phishing. |
| The date does not match the route | 1 | A wrongly set clock at the sender produces the same result. |

### 1.3 Weight rationale

Weights are grouped into four bands.

- **4 points.** The finding is hard to explain innocently and directly indicates deception or code execution: a recorded DMARC failure, an executable attachment, a double extension, or an input form inside the message.
- **3 points.** The finding is a well known deception technique but has documented legitimate uses: a reply address at another domain, a link whose visible text names a different host, punycode, a userinfo trick, a numeric host, an SPF failure.
- **2 points.** The finding is suspicious in aggregate but weak alone: encoded characters inside a host name, an embedded redirect parameter, invisible characters, an extension that contradicts the declared type.
- **1 point.** The finding is common in legitimate mail and is included for completeness rather than for its discriminating power: a differing `Return-Path`, a missing DKIM signature, a shortened link, a long route, a date that does not match the route.

The bands are the judgement in this toolkit that is most open to disagreement.
They are visible, per indicator, in the interface for exactly that reason.

### 1.4 Verdict thresholds

Let `score` be the sum defined above. Let `evidenceAvailable` be true when the
message contains at least one of: an `Authentication-Results` field, an
extracted URL, an attachment, or a `Received` entry.

| Condition, evaluated in order | Verdict |
| --- | --- |
| `evidenceAvailable` is false | Insufficient evidence |
| `score >= 7` | High technical suspicion |
| `score >= 3` | Moderate technical suspicion |
| `score >= 1` | Low technical suspicion |
| `score == 0` and no `Authentication-Results` field | Manual verification recommended |
| otherwise | Low technical suspicion |

Two of these deserve explanation.

**Insufficient evidence** is not a mild version of low suspicion. It means the
file does not contain enough to analyze at all, which usually indicates a draft,
a sent message, or a message copied by hand rather than exported.

**Manual verification recommended** covers the case where nothing was found and
there is also no authentication data to rely on. The absence of findings is not
reassuring when there was nothing to check.

The toolkit never emits the string "this email is phishing" in any language,
under any score.

### 1.5 Approximate organizational domain

Comparisons between domains (`From` against `Reply-To`, link text against link
destination) operate on an approximate organizational domain rather than the
full host name, so that `mail.example.com` and `example.com` are treated as the
same organization.

This is a short heuristic list of multi label public suffixes plus a
"last two labels" default. **It is not a Public Suffix List implementation.**
Shipping and maintaining the real list is out of scope for a dependency free
static page, and a stale copy would be worse than an honest approximation.

The consequence is real: for an unusual suffix the toolkit may treat two
different organizations as one, or one organization as two. Where a comparison
depends on this, the interface presents it as an indicator with a stated
limitation rather than as a fact.

### 1.6 Mixed script detection

A homoglyph attack writes a name using letters from another alphabet that look
identical, for example a Cyrillic `а` inside a Latin word.

The check flags a name only when **a single label mixes** Latin with Cyrillic or
Greek. A label written entirely in one alphabet is never flagged. This matters
in a Bulgarian context: a domain written wholly in Cyrillic is legitimate and
common, and flagging it would be both wrong and insulting.

Punycode names are decoded and both forms are shown, so that
`xn--pypal-4ve.com` is displayed next to its readable form and the substitution
becomes visible to a nontechnical reader.

### 1.7 Passive URL analysis, and what "passive" means

Every URL is dissected by hand rather than by a browser API, so that malformed
input never throws and the result is identical in every environment.

Passive means: the string is examined. Nothing is resolved, requested, opened,
previewed or expanded. A shortened link is reported as shortened; the toolkit
does not follow it to find out where it goes, because following it would tell
the attacker that the message was read.

The optional command line helper in `tools/` is the only component that can
contact a URL, it is never invoked by the interface, and it explains the
consequence before it runs. See section 5.

### 1.8 Attachment handling

Attachments are inspected by metadata only: file name, extension, declared MIME
type and approximate size, where the size of a base64 part is estimated as three
quarters of the encoded length.

Nothing is opened, decompressed, hashed or uploaded. An archive is therefore
reported as an archive whose contents cannot be seen, which is the honest
statement, rather than being scanned.

A type mismatch is flagged only when both sides are specific. A declared
`application/octet-stream` is far too common to be treated as a signal and is
ignored.

---

## 2. Domain posture

### 2.1 Points per control

| Control | Condition | Points | Maximum |
| --- | --- | --- | --- |
| SPF | record ends with `-all` | 3 | 3 |
| SPF | record ends with `~all` | 2 | 3 |
| SPF | record present but ends with `+all` or `?all`, or has no terminal | 1 | 3 |
| SPF | exceeds ten DNS lookups | minus 1 from the above, floor 0 | 3 |
| SPF | missing or invalid | 0 | 3 |
| DMARC | `p=reject` | 4 | 5 |
| DMARC | `p=quarantine` | 3 | 5 |
| DMARC | `p=none` | 2 | 5 |
| DMARC | valid record with no usable policy | 1 | 5 |
| DMARC | `t=y` present | minus 1 from the above, when above 1 | 5 |
| DMARC | a valid `rua` address is published | plus 1, capped at 5 | 5 |
| DMARC | missing or invalid | 0 | 5 |
| DKIM | a record was found for a supplied selector | 2 | 2 |
| DKIM | selector supplied but no record found | 0 | 2 |
| DKIM | **no selector supplied** | not counted | not counted |
| MTA-STS | valid record present | 1 | 1 |
| TLS-RPT | valid record present | 1 | 1 |
| BIMI | always | 0 | 0 |

### 2.2 Overall posture

Let `ratio = points / maximumAvailable`, where `maximumAvailable` sums only the
controls that were actually checked.

Let `enforcing` be true when a valid DMARC record has an effective policy of
`quarantine` or `reject` **and** does not carry `t=y`.

| Condition | Posture |
| --- | --- |
| `ratio >= 0.75` and `enforcing` and a valid SPF record exists | Strong |
| `ratio >= 0.40` | Intermediate |
| otherwise | Basic |

A domain at `p=reject` with `t=y` therefore lands at Intermediate rather than
Strong, because `t=y` means the published policy is not applied. This is the
single most commonly missed detail in the current specification and the scoring
reflects it deliberately.

### 2.3 Why a control returns Unknown

The states are: configured, partially configured, missing, invalid or
suspicious, unknown, and not checked. The last two are distinct and neither
reduces the score.

**Unknown** means the toolkit cannot determine the answer, not that the control
is absent. The main case is DKIM. A domain can publish keys under any selector
name, and there is no way to enumerate selectors from outside. Reporting
"DKIM missing" because a guessed selector returned nothing would be a false
statement, so a missing selector yields Unknown and an explanation of where to
find the real one, namely the `s=` field of a `DKIM-Signature` on a real message
from that domain.

MTA-STS carries a related honesty problem. The DNS record only advertises that a
policy exists. The policy itself is served over HTTPS at a well known path, and
the toolkit deliberately does not fetch it. A present record is therefore
reported as present, with an explicit note that the policy file behind it was
not verified and that a broken policy host means no protection and no error
message.

**Not checked** means the control was outside the scope of the run.

### 2.4 DMARC and the current specification

DMARC parsing follows RFC 9989, which together with RFC 9990 and RFC 9991
replaced RFC 7489 in May 2026 and moved DMARC onto the standards track.

Consequences implemented here:

- `np` (policy for non existent subdomains), `psd` and `t` (test mode) are recognized tags;
- `pct`, `rf` and `ri` are reported as removed from the specification, with a note that receivers ignore them rather than reject the record;
- a syntactically valid record with no usable `p` tag but a valid `rua` is treated as `p=none`, which is what a conforming receiver does;
- `t=y` is treated as disabling enforcement, and is reported prominently because a record can otherwise look strict while doing nothing.

Records still begin with `v=DMARC1` and existing records remain valid, so the
toolkit does not tell anyone to rewrite a working record.

### 2.5 SPF lookup counting

The count includes every DNS querying term in the record: `include`, `a`, `mx`,
`ptr`, `exists` and `redirect`. Terms that require no lookup, namely `ip4`,
`ip6` and `all`, are not counted.

Counting a single record is not the whole answer, because each `include` can
bring its own terms. In privacy mode the toolkit reports the count for the
record in front of it and says so. In online mode, and only when you tick the
box, it follows `include` and `redirect` recursively to a depth of five with a
budget of twenty five queries and reports the total, marking the result as
truncated if either limit was reached.

The ten lookup limit matters because exceeding it does not degrade SPF
gracefully. It causes a permanent error, and legitimate mail fails along with
everything else.

---

## 3. Organizational assessment

### 3.1 Communication exposure

Points, summed:

| Answer | Points |
| --- | --- |
| Communication profile is outsourcing | 3 |
| Communication profile is client facing | 2 |
| Communication profile is known partners | 1 |
| Mail from unknown senders arrives daily | 3 |
| Mail from unknown senders arrives weekly | 1 |
| Opening external attachments is a core activity | 2 |
| Opening external attachments is regular | 1 |
| A recruitment function exists | 1 |
| A sales or support function exists | 1 |

`>= 6` is High, `>= 3` is Medium, otherwise Low.

**High exposure changes the advice rather than raising the risk score.** For a
recruitment agency, an accounting office in filing season or a support desk, an
unknown sender with an attachment is the business, not an anomaly. Advice built
on "be suspicious of unknown senders" is useless there and quietly trains people
to ignore it. So for high exposure organizations the toolkit states explicitly
that an unknown sender is not an indicator for them, and recommends a separate
handling workflow for external files instead of vigilance.

### 3.2 Security maturity

Points out of 16, summed across multi factor authentication (0 to 4), domain
authentication (0 to 4), filtering (0 to 2), reporting path (0 to 2), incident
plan (0 to 2) and training (0 to 2).

`>= 11` is Established, `>= 5` is Developing, otherwise Initial.

Maturity describes where the organization currently stands. It does not affect
the recommended protection level, which is a function of exposure and
criticality only. An immature organization does not need less protection; it
needs a longer path to reach it.

### 3.3 Operational criticality

| Answer | Points |
| --- | --- |
| A mailbox takeover would stop the business | 4 |
| A mailbox takeover would cause serious delays | 2 |
| Payments move over email regularly | 2 |
| Payments move over email sometimes | 1 |
| An accounting function exists | 1 |
| A role with payment authority exists | 1 |

`>= 6` is High, `>= 3` is Medium, otherwise Low.

### 3.4 IT capacity, H0 to H3

Self declared, and used only to withhold recommendations that would not survive
contact with the available capacity.

| | |
| --- | --- |
| H0 | no internal IT resource |
| H1 | an external provider or one IT generalist |
| H2 | a small internal IT team |
| H3 | dedicated security capacity |

### 3.5 Financial capability, F0 to F3

Also self declared. **F0 to F3 are not budget brackets and carry no monetary
value.** They describe what this organization is willing and able to allocate,
which is a different question from what it could theoretically afford. A
profitable company that has decided not to spend on this is F0, and the
recommendations it receives should reflect that rather than a market average.

| | |
| --- | --- |
| F0 | existing and free capabilities only |
| F1 | a limited additional license or a one time purchase |
| F2 | additional licenses or hardware are possible |
| F3 | an external specialized service is possible |

No threshold anywhere in this toolkit is expressed in currency.

### 3.6 Recommended protection level

Let `exposure` and `criticality` each map to 0 for Low, 1 for Medium and 2 for
High, and let `combined` be their sum.

| `combined` | Level |
| --- | --- |
| `>= 3` | P3, priority protection |
| `>= 1` | P2, reinforced protection |
| `0` | P1, baseline protection |

### 3.7 How recommendations are prioritized

Each catalog entry declares the horizon it belongs to, an order within that
horizon, a condition deciding whether it applies at all, and optionally a
minimum capacity or financial capability.

1. Entries whose condition is false for this profile are omitted entirely. An organization that already enforces DMARC is not told to publish an SPF record.
2. Entries requiring more capacity or financial capability than declared are moved to a separate deferred section rather than being hidden, so the organization can see what comes next if its situation changes.
3. The rest are sorted by their declared order inside three horizons: do first, next stage, additional protection.

The ordering principle is risk reduction per unit of effort, not technical
sophistication. Multi factor authentication and a phone callback rule for
payment changes come before DMARC enforcement, because they prevent more loss
for less work and require no DNS access at all.

Every recommendation states why it is recommended, its expected benefit, its
complexity, the type of resource it needs, its prerequisites, **what can break
if it is done wrong**, and how to verify it afterwards. The "what can break"
field is not decoration. Most of the damage this class of tool causes comes from
confidently recommending strict settings to someone who then blocks their own
invoices.

---

## 4. Staged deployment logic

The toolkit never recommends an enforcing setting as a first step.

**SPF.** Inventory every sending system first: mail provider, accounting
software, web shop, newsletter tool, invoicing system, booking system, ticketing
system. Publish with `~all`. Move to `-all` only when the inventory is complete
and verified and the record stays under ten DNS lookups. A missed sender under
`-all` does not degrade; the mail stops arriving.

**DMARC.** Publish `p=none` with a `rua` address first. Read the aggregate
reports for at least several weeks. Fix the senders that fail. Move to
`quarantine`. Only after a sustained period with no legitimate sender failing,
move to `reject`. Check parked domains too, since a domain that never sends mail
is the easiest one to abuse and the easiest one to set to `reject` safely.

Under the current specification, staging uses `t=y` rather than the removed
`pct` tag.

**MTA-STS.** Publish in `testing` mode, collect TLS-RPT reports, and move to
`enforce` only when there are no failures. An expired certificate on the policy
host stops inbound mail in `enforce` mode.

**Filtering.** Enable monitoring, observe what would have been blocked, then
tighten, and name the person who reviews the quarantine before making it
stricter.

---

## 5. Passive and active inspection

**Passive** is the default everywhere and means that only data already in your
possession is examined: the `.eml` file, or a DNS record you pasted. It creates
no observable event anywhere.

**Active** means a request leaves your machine. There are exactly two active
capabilities, both opt in:

1. **The online DNS lookup.** Sends a domain name and a record type to a resolver you pick, over DNS over HTTPS. The consent dialog lists the exact names first. The resolver learns which domain you are investigating and the network address you asked from. It does not learn anything about the message. If you tick include following, the domains named in `include` and `redirect` are queried as well, which is stated in the dialog.

2. **The command line helper.** Contacts the URL itself. This is qualitatively different from a DNS lookup: the operator of a suspicious site learns their message reached a live reader, roughly where that reader is, and when. During an incident it can also disturb evidence. The helper requires an explicit confirmation, blocks internal address ranges on every hop, and downloads no content.

The privacy trade is simple to state. A DNS lookup exposes your interest to one
resolver you chose. An active URL request exposes your interest to the
attacker.

---

## 6. Known limitations, stated plainly

- Authentication results are read, not recomputed. A forged field added before your first trusted hop would be believed.
- The organizational domain heuristic is not a Public Suffix List and can be wrong for unusual suffixes.
- Mixed script detection covers Latin, Cyrillic and Greek only.
- Attachments are judged by name and declared type. A renamed executable with a matching declared type will not be caught, and a legitimate file with an alarming name will be.
- A present MTA-STS record does not prove that the policy file is served correctly.
- DKIM cannot be checked without a selector, and selectors cannot be enumerated.
- Lexical content, such as urgency wording or a request for payment, is not scored at all. It varies too much across languages and legitimate business contexts to carry a defensible weight, and scoring it would produce confident results for the wrong reasons.
- The weights themselves are a judgement, not a measurement. They are exposed per indicator so that a reader can disagree with a specific number rather than with the tool as a whole.
