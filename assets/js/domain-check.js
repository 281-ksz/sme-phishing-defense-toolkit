/* domain-check.js
   Email Domain Security Posture.

   Two modes:
     privacy  parsing of records the user pasted, no network at all;
     online   DNS over HTTPS lookups that only start after explicit consent.

   Record parsing is pure and has no dependency on the network layer, so the
   same code produces the same result in both modes.

   Defines window.SPDT.domain */

window.SPDT = window.SPDT || {};

(function (SPDT) {
  'use strict';

  /* =================================================================
     1. Small helpers
     ================================================================= */

  var RE_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

  function normalizeDomain(input) {
    var raw = String(input || '').trim().toLowerCase();
    raw = raw.replace(/^[a-z]+:\/\//, '').replace(/\/.*$/, '').replace(/^@/, '').replace(/\.$/, '');
    if (raw.indexOf('@') > -1) { raw = raw.slice(raw.lastIndexOf('@') + 1); }
    if (!raw) { return { valid: false, ascii: '', display: '' }; }
    var ascii = SPDT.eml && SPDT.eml.punyEncodeHost ? SPDT.eml.punyEncodeHost(raw) : raw;
    var labels = ascii.split('.');
    var valid = labels.length >= 2 && labels.every(function (l) { return RE_LABEL.test(l); });
    return { valid: valid, ascii: ascii, display: raw };
  }

  /* DoH JSON returns TXT data as quoted strings. A long record arrives as
     several strings that must be joined without a separator. */
  function normalizeTxt(data) {
    var s = String(data == null ? '' : data);
    var quoted = s.match(/"(?:[^"\\]|\\.)*"/g);
    if (quoted) {
      return quoted.map(function (q) {
        return q.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }).join('');
    }
    return s.trim();
  }

  function tokenize(record) {
    return String(record || '').trim().split(/\s+/).filter(Boolean);
  }

  /* =================================================================
     2. SPF
     ================================================================= */

  var SPF_QUALIFIERS = { '+': 'pass', '-': 'fail', '~': 'softfail', '?': 'neutral' };
  var SPF_LOOKUP_TERMS = ['include', 'a', 'mx', 'ptr', 'exists', 'redirect'];

  function parseSpf(record) {
    var result = {
      present: false, raw: '', valid: false, terms: [], includes: [], redirect: null,
      terminal: null, terminalQualifier: null, lookupTerms: 0, issues: [], version: null
    };
    var text = normalizeTxt(record).trim();
    if (!text) { return result; }
    result.present = true;
    result.raw = text;

    var tokens = tokenize(text);
    if (!/^v=spf1$/i.test(tokens[0] || '')) {
      result.issues.push('spf_no_version');
      return result;
    }
    result.version = 'spf1';
    result.valid = true;

    for (var i = 1; i < tokens.length; i++) {
      var token = tokens[i];
      var modifier = token.match(/^([a-z][a-z0-9_.-]*)=(.*)$/i);
      if (modifier) {
        var name = modifier[1].toLowerCase();
        result.terms.push({ kind: 'modifier', name: name, value: modifier[2] });
        if (name === 'redirect') {
          result.redirect = modifier[2];
          result.lookupTerms++;
        } else if (name !== 'exp') {
          result.issues.push('spf_unknown_modifier');
        }
        continue;
      }

      var qualifier = '+';
      var body = token;
      if (SPF_QUALIFIERS[token.charAt(0)]) {
        qualifier = token.charAt(0);
        body = token.slice(1);
      }
      var split = body.split(':');
      var mech = split[0].toLowerCase().split('/')[0];
      var value = split.slice(1).join(':');

      result.terms.push({ kind: 'mechanism', name: mech, qualifier: qualifier, value: value });

      if (mech === 'all') {
        result.terminal = mech;
        result.terminalQualifier = qualifier;
        if (i !== tokens.length - 1) { result.issues.push('spf_all_not_last'); }
        if (qualifier === '+') { result.issues.push('spf_plus_all'); }
        continue;
      }
      if (SPF_LOOKUP_TERMS.indexOf(mech) > -1) { result.lookupTerms++; }
      if (mech === 'include') { result.includes.push(value); }
      if (mech === 'ptr') { result.issues.push('spf_ptr'); }
      if (['include', 'a', 'mx', 'ip4', 'ip6', 'exists', 'ptr', 'all'].indexOf(mech) === -1) {
        result.issues.push('spf_unknown_mechanism');
      }
    }

    if (!result.terminal && !result.redirect) { result.issues.push('spf_no_all'); }
    if (result.lookupTerms > 10) { result.issues.push('spf_lookup_limit'); }
    else if (result.lookupTerms > 7) { result.issues.push('spf_lookup_close'); }
    return result;
  }

  /* =================================================================
     3. DMARC, following RFC 9989
     ================================================================= */

  var DMARC_KNOWN = ['v', 'p', 'sp', 'np', 'rua', 'ruf', 'adkim', 'aspf', 'fo', 't', 'psd'];
  var DMARC_DEPRECATED = ['pct', 'rf', 'ri'];
  var DMARC_POLICIES = ['none', 'quarantine', 'reject'];

  function parseDmarc(record) {
    var result = {
      present: false, raw: '', valid: false, tags: {}, issues: [],
      policy: null, effectivePolicy: null, subdomainPolicy: null, nonExistentPolicy: null,
      testMode: false, rua: [], ruf: [], adkim: 'r', aspf: 'r', deprecated: []
    };
    var text = normalizeTxt(record).trim();
    if (!text) { return result; }
    result.present = true;
    result.raw = text;

    text.split(';').forEach(function (chunk) {
      var part = chunk.trim();
      if (!part) { return; }
      var eq = part.indexOf('=');
      if (eq === -1) { result.issues.push('dmarc_bad_tag'); return; }
      var key = part.slice(0, eq).trim().toLowerCase();
      var value = part.slice(eq + 1).trim();
      result.tags[key] = value;
      if (DMARC_DEPRECATED.indexOf(key) > -1) { result.deprecated.push(key); }
      else if (DMARC_KNOWN.indexOf(key) === -1) { result.issues.push('dmarc_unknown_tag'); }
    });

    if (!result.tags.v || result.tags.v.toLowerCase() !== 'dmarc1') {
      result.issues.push('dmarc_no_version');
      return result;
    }
    result.valid = true;

    if (result.tags.p === undefined) {
      /* RFC 9989: a record without a valid p tag is treated as p=none when a
         syntactically valid rua is present, and is otherwise not applied. */
      result.issues.push('dmarc_no_policy');
      result.policy = null;
    } else if (DMARC_POLICIES.indexOf(result.tags.p.toLowerCase()) === -1) {
      result.issues.push('dmarc_bad_policy');
    } else {
      result.policy = result.tags.p.toLowerCase();
    }

    ['sp', 'np'].forEach(function (tag) {
      if (result.tags[tag] !== undefined && DMARC_POLICIES.indexOf(result.tags[tag].toLowerCase()) === -1) {
        result.issues.push('dmarc_bad_policy');
      }
    });
    result.subdomainPolicy = result.tags.sp ? result.tags.sp.toLowerCase() : null;
    result.nonExistentPolicy = result.tags.np ? result.tags.np.toLowerCase() : null;

    ['rua', 'ruf'].forEach(function (tag) {
      if (!result.tags[tag]) { return; }
      result.tags[tag].split(',').forEach(function (uri) {
        var clean = uri.trim();
        if (!clean) { return; }
        if (!/^mailto:/i.test(clean)) { result.issues.push('dmarc_bad_uri'); return; }
        result[tag].push(clean.replace(/^mailto:/i, '').split('!')[0]);
      });
    });

    if (result.tags.adkim) { result.adkim = result.tags.adkim.toLowerCase(); }
    if (result.tags.aspf) { result.aspf = result.tags.aspf.toLowerCase(); }
    result.testMode = String(result.tags.t || 'n').toLowerCase() === 'y';

    if (!result.rua.length) { result.issues.push('dmarc_no_rua'); }
    if (result.deprecated.length) { result.issues.push('dmarc_deprecated_tags'); }
    if (result.policy === null && result.rua.length) { result.effectivePolicy = 'none'; }
    else { result.effectivePolicy = result.policy; }

    /* A reporting address at another domain requires that domain to publish an
       authorization record. This cannot be confirmed from the record alone. */
    result.externalReporting = result.rua.concat(result.ruf).some(function (addr) {
      return addr.indexOf('@') > -1;
    });
    return result;
  }

  /* =================================================================
     4. DKIM, MTA-STS, TLS-RPT, BIMI
     ================================================================= */

  function parseDkim(record) {
    var result = { present: false, raw: '', valid: false, tags: {}, issues: [], keyPresent: false, keyType: null, revoked: false };
    var text = normalizeTxt(record).trim();
    if (!text) { return result; }
    result.present = true;
    result.raw = text;

    text.split(';').forEach(function (chunk) {
      var part = chunk.trim();
      if (!part) { return; }
      var eq = part.indexOf('=');
      if (eq === -1) { return; }
      result.tags[part.slice(0, eq).trim().toLowerCase()] = part.slice(eq + 1).trim();
    });

    if (result.tags.v && result.tags.v.toLowerCase() !== 'dkim1') { result.issues.push('dkim_bad_version'); }
    result.keyType = (result.tags.k || 'rsa').toLowerCase();
    if (result.tags.p !== undefined) {
      result.keyPresent = result.tags.p.length > 0;
      if (!result.keyPresent) { result.revoked = true; result.issues.push('dkim_revoked'); }
    } else {
      result.issues.push('dkim_no_key');
    }
    result.valid = result.keyPresent;
    if (result.keyPresent && result.keyType === 'rsa') {
      /* A base64 key shorter than this cannot hold a 1024 bit RSA key. */
      if (result.tags.p.replace(/\s/g, '').length < 200) { result.issues.push('dkim_short_key'); }
    }
    return result;
  }

  function parseMtaSts(record) {
    var result = { present: false, raw: '', valid: false, id: null, issues: [] };
    var text = normalizeTxt(record).trim();
    if (!text) { return result; }
    result.present = true;
    result.raw = text;
    var tags = {};
    text.split(';').forEach(function (chunk) {
      var eq = chunk.indexOf('=');
      if (eq === -1) { return; }
      tags[chunk.slice(0, eq).trim().toLowerCase()] = chunk.slice(eq + 1).trim();
    });
    if (!tags.v || tags.v.toLowerCase() !== 'stsv1') { result.issues.push('mtasts_no_version'); return result; }
    result.id = tags.id || null;
    if (!result.id) { result.issues.push('mtasts_no_id'); }
    result.valid = !!result.id;
    /* The record only advertises a policy. The policy file itself is served
       over HTTPS and is deliberately not fetched by this toolkit. */
    result.policyNotFetched = true;
    return result;
  }

  function parseTlsRpt(record) {
    var result = { present: false, raw: '', valid: false, rua: [], issues: [] };
    var text = normalizeTxt(record).trim();
    if (!text) { return result; }
    result.present = true;
    result.raw = text;
    var tags = {};
    text.split(';').forEach(function (chunk) {
      var eq = chunk.indexOf('=');
      if (eq === -1) { return; }
      tags[chunk.slice(0, eq).trim().toLowerCase()] = chunk.slice(eq + 1).trim();
    });
    if (!tags.v || tags.v.toLowerCase() !== 'tlsrptv1') { result.issues.push('tlsrpt_no_version'); return result; }
    if (tags.rua) {
      tags.rua.split(',').forEach(function (uri) {
        var clean = uri.trim();
        if (clean) { result.rua.push(clean); }
      });
    }
    if (!result.rua.length) { result.issues.push('tlsrpt_no_rua'); }
    result.valid = result.rua.length > 0;
    return result;
  }

  function parseBimi(record) {
    var result = { present: false, raw: '', valid: false, logo: null, authority: null, issues: [] };
    var text = normalizeTxt(record).trim();
    if (!text) { return result; }
    result.present = true;
    result.raw = text;
    var tags = {};
    text.split(';').forEach(function (chunk) {
      var eq = chunk.indexOf('=');
      if (eq === -1) { return; }
      tags[chunk.slice(0, eq).trim().toLowerCase()] = chunk.slice(eq + 1).trim();
    });
    if (!tags.v || tags.v.toLowerCase() !== 'bimi1') { result.issues.push('bimi_no_version'); return result; }
    result.logo = tags.l || null;
    result.authority = tags.a || null;
    result.valid = !!result.logo;
    return result;
  }

  /* =================================================================
     5. Posture assessment
     Points are shown to the user together with the maximum that was
     actually available, so an unchecked control never counts against
     the domain. The same table appears in docs/METHODOLOGY.md.
     ================================================================= */

  var POSTURE = {
    spf: { max: 3 },
    dmarc: { max: 5 },
    dkim: { max: 2 },
    mtasts: { max: 1 },
    tlsrpt: { max: 1 }
  };

  function controlState(name, parsed, checked) {
    if (!checked) { return 'notchecked'; }
    if (!parsed || !parsed.present) { return name === 'dkim' ? 'unknown' : 'missing'; }
    if (!parsed.valid) { return 'invalid'; }
    if (parsed.issues && parsed.issues.length) { return 'partial'; }
    return 'configured';
  }

  function assess(input) {
    var checked = input.checked || {};
    var spf = input.spf || parseSpf('');
    var dmarc = input.dmarc || parseDmarc('');
    var dkim = input.dkim || parseDkim('');
    var mtasts = input.mtasts || parseMtaSts('');
    var tlsrpt = input.tlsrpt || parseTlsRpt('');
    var bimi = input.bimi || parseBimi('');

    var points = 0;
    var max = 0;
    var breakdown = [];

    function record(name, earned, available, note) {
      points += earned;
      max += available;
      breakdown.push({ control: name, earned: earned, available: available, note: note });
    }

    /* SPF */
    if (checked.spf) {
      var spfPoints = 0, spfNote = 'missing';
      if (spf.present && spf.valid) {
        if (spf.terminalQualifier === '-') { spfPoints = 3; spfNote = 'fail_all'; }
        else if (spf.terminalQualifier === '~') { spfPoints = 2; spfNote = 'softfail_all'; }
        else if (spf.terminal || spf.redirect) { spfPoints = 1; spfNote = 'weak_all'; }
        else { spfPoints = 1; spfNote = 'no_all'; }
        if (spf.issues.indexOf('spf_lookup_limit') > -1) { spfPoints = Math.max(0, spfPoints - 1); spfNote = 'lookup_limit'; }
      } else if (spf.present) {
        spfNote = 'invalid';
      }
      record('spf', spfPoints, POSTURE.spf.max, spfNote);
    }

    /* DMARC */
    if (checked.dmarc) {
      var dmarcPoints = 0, dmarcNote = 'missing';
      if (dmarc.present && dmarc.valid) {
        var policy = dmarc.effectivePolicy;
        if (policy === 'reject') { dmarcPoints = 4; dmarcNote = 'reject'; }
        else if (policy === 'quarantine') { dmarcPoints = 3; dmarcNote = 'quarantine'; }
        else if (policy === 'none') { dmarcPoints = 2; dmarcNote = 'none'; }
        else { dmarcPoints = 1; dmarcNote = 'no_policy'; }
        if (dmarc.testMode && dmarcPoints > 1) { dmarcPoints -= 1; dmarcNote = 'test_mode'; }
        if (dmarc.rua.length) { dmarcPoints = Math.min(POSTURE.dmarc.max, dmarcPoints + 1); }
      } else if (dmarc.present) {
        dmarcNote = 'invalid';
      }
      record('dmarc', dmarcPoints, POSTURE.dmarc.max, dmarcNote);
    }

    /* DKIM only counts when a selector was actually supplied. */
    if (checked.dkim) {
      var dkimPoints = dkim.present && dkim.valid ? 2 : 0;
      record('dkim', dkimPoints, POSTURE.dkim.max, dkim.present ? (dkim.valid ? 'found' : 'invalid') : 'not_found');
    }

    if (checked.mtasts) { record('mtasts', mtasts.present && mtasts.valid ? 1 : 0, POSTURE.mtasts.max, mtasts.present ? 'present' : 'missing'); }
    if (checked.tlsrpt) { record('tlsrpt', tlsrpt.present && tlsrpt.valid ? 1 : 0, POSTURE.tlsrpt.max, tlsrpt.present ? 'present' : 'missing'); }

    var ratio = max > 0 ? points / max : 0;
    var enforcing = dmarc.present && dmarc.valid && !dmarc.testMode &&
      (dmarc.effectivePolicy === 'quarantine' || dmarc.effectivePolicy === 'reject');

    var posture;
    if (max === 0) { posture = 'unknown'; }
    else if (ratio >= 0.75 && enforcing && spf.present && spf.valid) { posture = 'strong'; }
    else if (ratio >= 0.40) { posture = 'intermediate'; }
    else { posture = 'basic'; }

    return {
      domain: input.domain || '',
      mode: input.mode || 'privacy',
      resolver: input.resolver || null,
      posture: posture,
      points: points,
      max: max,
      ratio: ratio,
      enforcing: enforcing,
      breakdown: breakdown,
      states: {
        spf: controlState('spf', spf, checked.spf),
        dmarc: controlState('dmarc', dmarc, checked.dmarc),
        dkim: controlState('dkim', dkim, checked.dkim),
        mtasts: controlState('mtasts', mtasts, checked.mtasts),
        tlsrpt: controlState('tlsrpt', tlsrpt, checked.tlsrpt),
        bimi: checked.bimi ? (bimi.present ? (bimi.valid ? 'configured' : 'invalid') : 'missing') : 'notchecked'
      },
      records: { spf: spf, dmarc: dmarc, dkim: dkim, mtasts: mtasts, tlsrpt: tlsrpt, bimi: bimi },
      mx: input.mx || null,
      spfChain: input.spfChain || null,
      selectors: input.selectors || []
    };
  }

  /* =================================================================
     6. Optional network layer, DNS over HTTPS
     Nothing here runs unless the user starts it.
     ================================================================= */

  var RESOLVERS = {
    cloudflare: {
      id: 'cloudflare',
      label: 'Cloudflare (cloudflare-dns.com)',
      url: 'https://cloudflare-dns.com/dns-query',
      accept: 'application/dns-json',
      privacy: 'https://developers.cloudflare.com/1.1.1.1/privacy/public-dns-resolver/'
    },
    google: {
      id: 'google',
      label: 'Google (dns.google)',
      url: 'https://dns.google/resolve',
      accept: 'application/json',
      privacy: 'https://developers.google.com/speed/public-dns/privacy'
    }
  };

  function queryPlan(domain, selectors) {
    var d = normalizeDomain(domain);
    if (!d.valid) { return []; }
    var plan = [
      { name: d.ascii, type: 'MX', purpose: 'mx' },
      { name: d.ascii, type: 'TXT', purpose: 'spf' },
      { name: '_dmarc.' + d.ascii, type: 'TXT', purpose: 'dmarc' },
      { name: '_mta-sts.' + d.ascii, type: 'TXT', purpose: 'mtasts' },
      { name: '_smtp._tls.' + d.ascii, type: 'TXT', purpose: 'tlsrpt' },
      { name: 'default._bimi.' + d.ascii, type: 'TXT', purpose: 'bimi' }
    ];
    (selectors || []).forEach(function (sel) {
      var clean = String(sel).trim().toLowerCase();
      if (clean) { plan.push({ name: clean + '._domainkey.' + d.ascii, type: 'TXT', purpose: 'dkim', selector: clean }); }
    });
    return plan;
  }

  function lookup(name, type, resolverId, onQuery) {
    var resolver = RESOLVERS[resolverId] || RESOLVERS.cloudflare;
    var url = resolver.url + '?name=' + encodeURIComponent(name) + '&type=' + encodeURIComponent(type);
    if (typeof onQuery === 'function') { onQuery(name, type); }

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 8000) : null;

    return fetch(url, {
      method: 'GET',
      headers: { accept: resolver.accept },
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      credentials: 'omit',
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (timer) { clearTimeout(timer); }
      if (!response.ok) { throw new Error('http-' + response.status); }
      return response.json();
    }).then(function (json) {
      var answers = (json.Answer || []).filter(function (a) {
        return type === 'MX' ? a.type === 15 : a.type === 16;
      });
      return {
        name: name, type: type, status: json.Status,
        nxdomain: json.Status === 3,
        records: answers.map(function (a) { return normalizeTxt(a.data); })
      };
    }).catch(function (error) {
      if (timer) { clearTimeout(timer); }
      return { name: name, type: type, error: error.message || 'failed', records: [] };
    });
  }

  /* Recursive expansion of include and redirect, used only when the user
     explicitly asks for it. Counts lookups the way RFC 7208 counts them. */
  function expandSpf(domain, resolverId, onQuery, seen, depth, budget) {
    seen = seen || {};
    depth = depth || 0;
    budget = budget || { queries: 0, limit: 25 };
    var d = normalizeDomain(domain);
    if (!d.valid || seen[d.ascii] || depth > 5 || budget.queries >= budget.limit) {
      return Promise.resolve({ domain: d.ascii, lookups: 0, children: [], truncated: true });
    }
    seen[d.ascii] = true;
    budget.queries++;

    return lookup(d.ascii, 'TXT', resolverId, onQuery).then(function (response) {
      var record = response.records.filter(function (r) { return /^v=spf1(\s|$)/i.test(r.trim()); })[0] || '';
      var parsed = parseSpf(record);
      var own = parsed.lookupTerms;
      var targets = parsed.includes.slice();
      if (parsed.redirect) { targets.push(parsed.redirect); }
      targets = targets.filter(function (t) { return t && t.indexOf('%') === -1; });

      return Promise.all(targets.map(function (target) {
        return expandSpf(target, resolverId, onQuery, seen, depth + 1, budget);
      })).then(function (children) {
        var total = own + children.reduce(function (sum, c) { return sum + c.lookups; }, 0);
        return {
          domain: d.ascii, record: record, ownLookups: own, lookups: total,
          children: children, truncated: children.some(function (c) { return c.truncated; })
        };
      });
    });
  }

  function runOnline(options) {
    var d = normalizeDomain(options.domain);
    if (!d.valid) { return Promise.reject(new Error('invalid-domain')); }
    var selectors = (options.selectors || []).filter(Boolean);
    var plan = queryPlan(options.domain, selectors);
    var onQuery = options.onQuery;

    return Promise.all(plan.map(function (item) {
      return lookup(item.name, item.type, options.resolver, onQuery).then(function (response) {
        response.purpose = item.purpose;
        response.selector = item.selector;
        return response;
      });
    })).then(function (responses) {
      var byPurpose = {};
      responses.forEach(function (r) {
        if (!byPurpose[r.purpose]) { byPurpose[r.purpose] = []; }
        byPurpose[r.purpose].push(r);
      });

      function pick(purpose, matcher) {
        var group = byPurpose[purpose] || [];
        var all = [];
        group.forEach(function (r) { all = all.concat(r.records); });
        var matching = matcher ? all.filter(matcher) : all;
        return { value: matching[0] || '', count: matching.length, all: all, errors: group.filter(function (r) { return r.error; }) };
      }

      var spfPick = pick('spf', function (r) { return /^v=spf1(\s|$)/i.test(r.trim()); });
      var dmarcPick = pick('dmarc', function (r) { return /^v=DMARC1\s*;/i.test(r.trim()); });
      var mtaPick = pick('mtasts', function (r) { return /^v=STSv1/i.test(r.trim()); });
      var tlsPick = pick('tlsrpt', function (r) { return /^v=TLSRPTv1/i.test(r.trim()); });
      var bimiPick = pick('bimi', function (r) { return /^v=BIMI1/i.test(r.trim()); });

      var dkimResults = (byPurpose.dkim || []).map(function (r) {
        return { selector: r.selector, record: r.records[0] || '', found: r.records.length > 0, error: r.error };
      });
      var firstDkim = dkimResults.filter(function (r) { return r.found; })[0];

      var mxResponse = (byPurpose.mx || [])[0] || { records: [] };

      var result = assess({
        domain: d.display,
        mode: 'online',
        resolver: options.resolver,
        checked: {
          spf: true, dmarc: true, mtasts: true, tlsrpt: true, bimi: true,
          dkim: selectors.length > 0
        },
        spf: parseSpf(spfPick.value),
        dmarc: parseDmarc(dmarcPick.value),
        dkim: parseDkim(firstDkim ? firstDkim.record : ''),
        mtasts: parseMtaSts(mtaPick.value),
        tlsrpt: parseTlsRpt(tlsPick.value),
        bimi: parseBimi(bimiPick.value),
        mx: mxResponse.records,
        selectors: dkimResults
      });

      result.multipleSpf = spfPick.count > 1;
      result.multipleDmarc = dmarcPick.count > 1;
      result.errors = responses.filter(function (r) { return r.error; }).map(function (r) { return r.name + ' ' + r.type; });
      result.queriedNames = plan.map(function (p) { return p.name + ' ' + p.type; });
      result.queryPlan = plan;

      if (!options.expandSpf || !spfPick.value) { return result; }
      return expandSpf(d.ascii, options.resolver, onQuery).then(function (chain) {
        result.spfChain = chain;
        return result;
      });
    });
  }

  SPDT.domain = {
    normalizeDomain: normalizeDomain,
    normalizeTxt: normalizeTxt,
    parseSpf: parseSpf,
    parseDmarc: parseDmarc,
    parseDkim: parseDkim,
    parseMtaSts: parseMtaSts,
    parseTlsRpt: parseTlsRpt,
    parseBimi: parseBimi,
    assess: assess,
    queryPlan: queryPlan,
    lookup: lookup,
    expandSpf: expandSpf,
    runOnline: runOnline,
    RESOLVERS: RESOLVERS,
    POSTURE: POSTURE
  };

})(window.SPDT);
