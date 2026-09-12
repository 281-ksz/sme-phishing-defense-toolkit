# Security

## Reporting a problem in this toolkit

If you find a security problem in the toolkit itself, please report it privately
first through the repository's security advisory feature rather than opening a
public issue, and allow reasonable time for a fix before disclosing.

Please include what you did, what happened, and what you expected. A synthetic
`.eml` file or a record string that reproduces the problem is the most useful
thing you can attach.

**Never attach a real message from a real mailbox.** It will contain addresses
and content belonging to people who did not consent to the disclosure. Build a
synthetic fixture that reproduces the behaviour instead. See `docs/TESTING.md`
for the fixture format.

## What counts as a security problem here

The threat model of this toolkit is unusual, because the input is deliberately
hostile. The following are security problems and are treated as such:

- any path by which content inside an `.eml` file executes in the page;
- any path by which loading a message produces a network request, including image loading, stylesheet fetching, or a URL being contacted;
- any data derived from a message, a pasted record or a questionnaire answer being written to persistent storage;
- any network request that happens without the consent dialog being shown and accepted;
- any request sending data beyond a domain name and a record type to a resolver;
- a parsing input that hangs the page or exhausts memory;
- an incorrect claim of safety, for example reporting a domain as protected when its DMARC record carries `t=y` and enforces nothing.

The last one is worth stating explicitly. In a tool like this, a wrong
reassurance is a security defect, not merely an inaccuracy. A user who is told
their domain is protected when it is not will make decisions on that basis.

## What is not a vulnerability in this toolkit

- **A message that scores low but is in fact phishing.** The toolkit reports technical indicators and states repeatedly that indicators cannot prove intent. A targeted message with no links, no attachments and correct authentication will score low, because there is genuinely nothing technical to find. This is a documented limitation, not a bug.
- **A message that scores high but is legitimate.** Every indicator ships with a written limitation for this reason.
- **A disagreement with a weight.** The weights are a judgement and are published in `docs/METHODOLOGY.md` precisely so they can be argued with. Open an issue with reasoning.

Both of the first two are still worth reporting as accuracy issues if you have a
synthetic fixture that shows the analysis is reasoning wrongly rather than
merely reaching an unwelcome conclusion.

## Scope

In scope: the contents of this repository.

Out of scope: the DNS resolvers the toolkit can query, the mail providers whose
export procedures are documented, and any site reached with the optional command
line helper.

## If you are dealing with an active incident

This file is about defects in the software. If you are in the middle of a real
incident, do not start here. Open the toolkit, go to Checklists or Decision
trees, and follow the flow for what has actually happened. If money has moved,
call your bank first.
