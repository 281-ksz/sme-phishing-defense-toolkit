# User guide

This guide is written for someone who does not work in cybersecurity. You do not
need to know what DNS is in order to use the toolkit.

It mirrors `USER-GUIDE-BG.md`. Both describe the same functionality.

---

## What the toolkit is

You open one page in your browser and get four things:

1. a check on a suspicious email;
2. a check on how well an email domain is protected;
3. a short questionnaire about your organization and a plan of what to do;
4. checklists and steps for when something has already happened.

No registration. No payment. No internet connection needed for most of it.

**Important:** the toolkit does not say "this is fraud". No tool can prove that
from technical traces. It shows you what the message contains and explains what
each finding means, so that you can decide.

---

## First: emergencies

If something is happening right now, stop reading and act.

- **Money has been sent on a fraudulent invoice:** call the bank immediately and ask for the transfer to be stopped. Minutes matter. Then inform management.
- **You entered a password on a page you now doubt:** change the password from a different device and revoke all active sessions. Changing the password alone is not enough.
- **You approved a sign in prompt you did not start:** someone already has your password. Change it and revoke the sessions.

Open **Checklists** or **Decision trees** in the toolkit. The steps are in order
there.

---

## Opening it

Two ways.

**From a web address.** Open the address your IT provider gave you.

**From a file on your computer.** Download the folder, find `index.html` and
open it with a double click. It opens in your browser like an ordinary page and
works without an internet connection.

The **BG** and **EN** buttons at the top right change the language.

---

## Checking a suspicious email

### Step 1: get an .eml file

This is the least familiar part, and it takes about thirty seconds.

An email has two parts: what you see, and a technical part carrying traces of
the route it travelled. An `.eml` file contains both. If you simply forward the
message, the technical part is lost and the check becomes nearly useless.

Inside the toolkit, in **Analyze email**, there is a section
**How do I get an .eml file?** with the exact steps for the most common
programs. In short:

- **Gmail in a browser:** open the message, click the three dot menu inside it, choose **Download message**. This does not exist in the mobile apps, so use a computer.
- **New Outlook or Outlook on the web:** open the message, click the three dot button, choose **Save as**, then the **EML** format.
- **Classic Outlook for Windows:** this program has no such option. Open the same mailbox in a browser and save it from there. If you cannot, forward the message **as an attachment** to yourself and save the attachment.
- **Apple Mail:** select the message, **File**, then **Save As**, and choose the **Raw Message Source** format. You can also just drag the message onto the desktop.
- **Thunderbird:** right click the message and choose **Save As**.

If none of this works, ask your IT contact rather than spending time on it.

### Step 2: load the file

Open **Analyze email** and either drag the file into the outlined area or press
**Choose file**.

The file is not uploaded anywhere. It stays on your device. That is why the
badge above the area says "Processed locally on this device".

### Step 3: read the result

A verdict appears at the top. There are five possible answers:

| Result | What it means |
| --- | --- |
| **Low technical suspicion** | No strong traces found. This does not mean the message is safe. |
| **Moderate technical suspicion** | Several things deserve attention. |
| **High technical suspicion** | Serious traces found. Do not interact with the message. |
| **Manual verification recommended** | There is not enough data to judge automatically. |
| **Insufficient evidence** | The file does not contain the technical part. It was probably not saved correctly. |

Below the verdict is a list of **Main reasons**. Each is written in plain
language and ends with a **Limitation**: one sentence explaining when the same
finding can be entirely innocent.

Read the limitations too. They are there precisely because a single finding
proves nothing on its own.

### Step 4: follow the recommended step

Below the reasons is a short list of what to do. It usually comes down to the
same thing: do not click anything, confirm the sender by phone on a number you
already knew, and report it.

**Never confirm using a phone number written in the message itself.**

### If you want more detail

Further down are collapsible sections with the technical detail: header fields,
authentication results, routing, URLs, attachments. You do not need to open
them. They are for the moment your IT provider asks you something specific.

URLs in the list are **never opened** by the toolkit. They are shown for reading
only.

---

## Checking a domain

Here you check how well an email domain is protected, meaning the part after the
`@` sign. It is most useful for your own domain.

There are two modes.

**Privacy mode.** Nothing leaves the device. You paste the records yourself. If
you do not know where to get them, ask your IT provider or use the other mode.

**Online DNS lookup.** The toolkit asks the internet on your behalf. Before it
does, you see the exact list of what will be sent. Only domain names are sent.
**Email content is never sent.** You must tick a consent box for the check to
start.

### How to read the result

At the top is an overall assessment: **Basic**, **Intermediate** or **Strong**.
Below is a table of the individual controls with a state for each: configured,
partially configured, missing, invalid, unknown or not checked.

**Unknown does not mean missing.** DKIM, for example, cannot be checked without
an extra piece of information called a selector. The toolkit prefers to say it
does not know rather than mislead you.

Below the table are recommendations in plain language.

### One warning

If you decide to change something on your domain, do it through your IT provider
and **in stages**. Tightening these settings in a hurry can stop genuine
invoices and customer enquiries from arriving. Every recommendation in the
toolkit states explicitly what can break.

---

## Assessing your organization

Sixteen questions. About five minutes.

The questionnaire **does not ask** for a company name, your name, an email
address, a domain or any customer. The answers stay in the memory of the page.

The result is not a single score but a profile across six dimensions. Each one
explains which of your answers produced it.

Two deserve explanation:

**IT capacity (H0 to H3)** describes the technical resource available to you,
from none at all to a dedicated security person.

**Financial capability (F0 to F3)** describes what you are willing and able to
allocate. **These are not budget brackets and do not mean low or high budget.**
A profitable company that has decided not to spend on this is F0, and the
recommendations will respect that rather than some market average.

If you deal with many unknown senders, for example because you recruit staff or
support customers, the toolkit takes that into account. For you an unknown
sender with an attachment is the normal state of business rather than an alarm,
and the recommendations change accordingly.

---

## Action plan

The plan is split into three parts: **Do first**, **Next stage** and
**Additional protection**.

Each measure states why it is recommended, the expected benefit, its complexity,
the resource it needs, what must be in place beforehand, **what can break if it
is done wrong**, and how to verify that it works.

The "what can break" field is not a formality. Read it before asking your IT
provider to do something.

If you have not filled in the questionnaire you see the general plan. After you
fill it in, the plan is ordered according to your situation.

---

## Checklists and decision trees

**Checklists** come in four kinds: initial setup, periodic review, a suspicious
message, and an incident that has already happened. Ticks disappear when the
page reloads, because nothing is saved.

**Decision trees** ask one question at a time and lead you to concrete steps
based on your answers. They are built to be used under pressure, when there is
no time to read.

---

## Technical guide and Glossary

The **Technical guide** explains twenty topics the same way each time: what it
is, what problem it solves, **what it does not solve**, who needs it, who
configures it, how a nontechnical person can check whether it exists, what can
go wrong, how to introduce it safely, and how to verify that it works.

If your IT provider proposes something, look it up here before agreeing.

The **Glossary** gives short definitions of the terms.

---

## Privacy in short

- Email content does not leave your device.
- Questionnaire answers do not leave your device.
- No accounts, no tracking, no advertising, no artificial intelligence.
- Nothing is saved. Close the page and everything is gone.
- The only thing that can go outward is a domain name during the online check, and only after you explicitly consent.

The full description is in `PRIVACY.md`.

---

## Common questions

**The toolkit said low suspicion. Does that mean the message is safe?**
No. It means no technical traces were found. The most expensive frauds have no
technical traces at all: an ordinary message from a familiar address asking for
a transfer to a new account. That is why the phone confirmation rule matters
more than any technical control.

**Can I check a message from my phone?**
The page works on a phone, but mobile mail apps generally cannot save an `.eml`
file. You will need a computer to obtain the file.

**Is it safe to load a genuinely malicious message?**
Yes. The toolkit does not open attachments, execute anything from the message,
load images from the internet or open any URL. It shows text only.

**I deleted the message. Can it be recovered?**
Look in your own trash folder. Do not go into someone else's mailbox to look for
it. Contact your IT contact.

**Who is responsible if I follow a recommendation and something breaks?**
You are. That is why every recommendation states what can break and advises that
changes go through the person responsible for your systems. The toolkit is an
aid, not a replacement for that person.
