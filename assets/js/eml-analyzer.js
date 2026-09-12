/* eml-analyzer.js
   Local parsing and passive analysis of an RFC 5322 message.

   Nothing in this file opens a URL, resolves a name, executes an attachment
   or contacts any remote service. The only input is a byte buffer that the
   user selected, and the only output is a plain object.

   Defines window.SPDT.eml */

window.SPDT = window.SPDT || {};

(function (SPDT) {
  'use strict';

  /* =================================================================
     1. Byte and character handling
     ================================================================= */

  /* A message is parsed as a byte string: one character per byte. This keeps
     boundaries, base64 and quoted-printable intact regardless of the charset
     declared by any individual part. Text is decoded later, per part. */
  function bytesToByteString(bytes) {
    var out = '';
    var chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) {
      out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return out;
  }

  function byteStringToBytes(str) {
    var bytes = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i) & 0xff;
    }
    return bytes;
  }

  /* Charset aliases seen in real mail. windows-1251 matters for Bulgarian. */
  var CHARSET_ALIAS = {
    'utf8': 'utf-8',
    'utf-8': 'utf-8',
    'us-ascii': 'utf-8',
    'ascii': 'utf-8',
    'ansi_x3.4-1968': 'utf-8',
    'iso-8859-1': 'windows-1252',
    'latin1': 'windows-1252',
    'cp1251': 'windows-1251',
    'windows-1251': 'windows-1251',
    'koi8-r': 'koi8-r',
    'windows-1252': 'windows-1252',
    'iso-8859-5': 'iso-8859-5'
  };

  function decodeText(byteString, charset) {
    var cs = String(charset || 'utf-8').toLowerCase().replace(/["']/g, '').trim();
    cs = CHARSET_ALIAS[cs] || cs;
    if (typeof TextDecoder === 'undefined') {
      return byteString;
    }
    /* A true byte string holds one byte per character. If any character is
       above 255 the input has already been decoded, so decoding again would
       corrupt it. */
    for (var i = 0; i < byteString.length; i++) {
      if (byteString.charCodeAt(i) > 255) { return byteString; }
    }
    try {
      return new TextDecoder(cs, { fatal: false }).decode(byteStringToBytes(byteString));
    } catch (e) {
      try {
        return new TextDecoder('utf-8', { fatal: false }).decode(byteStringToBytes(byteString));
      } catch (e2) {
        return byteString;
      }
    }
  }

  /* =================================================================
     2. Punycode decoding (RFC 3492)
     Used only to show a human readable form of an xn-- host so a
     lookalike name becomes visible. Nothing is resolved.
     ================================================================= */

  function basicToDigit(cp) {
    if (cp - 48 < 10) { return cp - 22; }
    if (cp - 65 < 26) { return cp - 65; }
    if (cp - 97 < 26) { return cp - 97; }
    return 36;
  }

  function adaptBias(delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? Math.floor(delta / 700) : delta >> 1;
    delta += Math.floor(delta / numPoints);
    for (; delta > 455; k += 36) {
      delta = Math.floor(delta / 35);
    }
    return k + Math.floor(36 * delta / (delta + 38));
  }

  function punyDecodeLabel(input) {
    var base = 36, tmin = 1, tmax = 26, initialBias = 72, initialN = 128;
    var output = [], i = 0, n = initialN, bias = initialBias;
    var basic = input.lastIndexOf('-');
    var j, index, oldi, w, k, digit, t, outLen;

    if (basic < 0) { basic = 0; }
    for (j = 0; j < basic; ++j) {
      if (input.charCodeAt(j) >= 0x80) { throw new Error('not basic'); }
      output.push(input.charCodeAt(j));
    }
    for (index = basic > 0 ? basic + 1 : 0; index < input.length;) {
      oldi = i;
      w = 1;
      for (k = base; ; k += base) {
        if (index >= input.length) { throw new Error('truncated'); }
        digit = basicToDigit(input.charCodeAt(index++));
        if (digit >= base) { throw new Error('bad digit'); }
        i += digit * w;
        t = k <= bias ? tmin : (k >= bias + tmax ? tmax : k - bias);
        if (digit < t) { break; }
        w *= (base - t);
      }
      outLen = output.length + 1;
      bias = adaptBias(i - oldi, outLen, oldi === 0);
      n += Math.floor(i / outLen);
      i %= outLen;
      output.splice(i++, 0, n);
    }
    var s = '';
    for (j = 0; j < output.length; j++) {
      s += output[j] > 0xffff
        ? String.fromCharCode(0xd800 + ((output[j] - 0x10000) >> 10), 0xdc00 + ((output[j] - 0x10000) & 0x3ff))
        : String.fromCharCode(output[j]);
    }
    return s;
  }

  function punyDecodeHost(host) {
    if (!host || host.indexOf('xn--') === -1) { return null; }
    var parts = String(host).split('.');
    var changed = false;
    var decoded = parts.map(function (label) {
      if (label.toLowerCase().indexOf('xn--') === 0) {
        try {
          var d = punyDecodeLabel(label.slice(4));
          changed = true;
          return d;
        } catch (e) {
          return label;
        }
      }
      return label;
    });
    return changed ? decoded.join('.') : null;
  }

  function digitToBasic(digit) {
    return String.fromCharCode(digit + 22 + (digit < 26 ? 75 : 0));
  }

  function toCodePoints(str) {
    var points = [];
    for (var i = 0; i < str.length; i++) {
      var value = str.charCodeAt(i);
      if (value >= 0xd800 && value <= 0xdbff && i + 1 < str.length) {
        var extra = str.charCodeAt(i + 1);
        if ((extra & 0xfc00) === 0xdc00) {
          points.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
          i++;
          continue;
        }
      }
      points.push(value);
    }
    return points;
  }

  function punyEncodeLabel(input) {
    var base = 36, tmin = 1, tmax = 26, initialBias = 72, initialN = 128;
    var codePoints = toCodePoints(input);
    var output = [], n = initialN, delta = 0, bias = initialBias;
    var basicLength = 0, handled, m, q, k, t;

    codePoints.forEach(function (cp) {
      if (cp < 0x80) { output.push(String.fromCharCode(cp)); basicLength++; }
    });
    handled = basicLength;
    if (basicLength) { output.push('-'); }

    while (handled < codePoints.length) {
      m = Infinity;
      codePoints.forEach(function (cp) { if (cp >= n && cp < m) { m = cp; } });
      delta += (m - n) * (handled + 1);
      n = m;
      codePoints.forEach(function (cp) {
        if (cp < n) { delta++; }
        if (cp === n) {
          q = delta;
          for (k = base; ; k += base) {
            t = k <= bias ? tmin : (k >= bias + tmax ? tmax : k - bias);
            if (q < t) { break; }
            output.push(digitToBasic(t + (q - t) % (base - t)));
            q = Math.floor((q - t) / (base - t));
          }
          output.push(digitToBasic(q));
          bias = adaptBias(delta, handled + 1, handled === basicLength);
          delta = 0;
          handled++;
        }
      });
      delta++;
      n++;
    }
    return output.join('');
  }

  /* Converts a name that may contain non-ASCII labels into the ASCII form
     used for DNS queries. A name that is already ASCII is returned unchanged. */
  function punyEncodeHost(host) {
    if (!host) { return ''; }
    return String(host).split('.').map(function (label) {
      /* eslint-disable-next-line no-control-regex */
      if (!/[^\u0000-\u007F]/.test(label)) { return label; }
      return 'xn--' + punyEncodeLabel(label.toLowerCase());
    }).join('.');
  }

  /* =================================================================
     3. Script mixing
     A single label combining Latin with Cyrillic or Greek is the classic
     homoglyph pattern. A label written entirely in one script is not
     suspicious by itself: Cyrillic domain names are legitimate.
     ================================================================= */

  var RE_LATIN = /[A-Za-z]/;
  var RE_CYRILLIC = /[\u0400-\u04FF]/;
  var RE_GREEK = /[\u0370-\u03FF]/;

  function mixedScriptLabels(name) {
    if (!name) { return []; }
    return String(name).split('.').filter(function (label) {
      var scripts = 0;
      if (RE_LATIN.test(label)) { scripts++; }
      if (RE_CYRILLIC.test(label)) { scripts++; }
      if (RE_GREEK.test(label)) { scripts++; }
      return scripts > 1;
    });
  }

  /* =================================================================
     4. Header parsing
     ================================================================= */

  function splitMessage(raw) {
    var norm = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var idx = norm.indexOf('\n\n');
    if (idx === -1) {
      return { headerBlock: norm, body: '' };
    }
    return { headerBlock: norm.slice(0, idx), body: norm.slice(idx + 2) };
  }

  /* Unfold continuation lines (RFC 5322 section 2.2.3) and split name/value. */
  function parseHeaderBlock(block) {
    var lines = block.split('\n');
    var headers = [];
    var current = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line === '') { continue; }
      if (/^[ \t]/.test(line) && current) {
        current.raw += ' ' + line.replace(/^[ \t]+/, '');
        continue;
      }
      var m = line.match(/^([!-9;-~]+)[ \t]*:(.*)$/);
      if (m) {
        current = { name: m[1], lower: m[1].toLowerCase(), raw: m[2].replace(/^[ \t]+/, '') };
        headers.push(current);
      } else if (current) {
        current.raw += ' ' + line.trim();
      }
    }
    return headers;
  }

  function headerValue(headers, name) {
    var lower = name.toLowerCase();
    for (var i = 0; i < headers.length; i++) {
      if (headers[i].lower === lower) { return headers[i].raw; }
    }
    return null;
  }

  function headerAll(headers, name) {
    var lower = name.toLowerCase();
    return headers.filter(function (h) { return h.lower === lower; })
      .map(function (h) { return h.raw; });
  }

  /* =================================================================
     5. Encoded words (RFC 2047)
     ================================================================= */

  function decodeQuotedPrintable(str, forHeader) {
    var s = String(str);
    if (forHeader) { s = s.replace(/_/g, ' '); }
    s = s.replace(/=\n/g, '');
    return s.replace(/=([0-9A-Fa-f]{2})/g, function (all, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });
  }

  function decodeBase64ToByteString(str) {
    var clean = String(str).replace(/[^A-Za-z0-9+/=]/g, '');
    if (!clean) { return ''; }
    try {
      if (typeof atob === 'function') { return atob(clean.replace(/=+$/, '') + padding(clean)); }
    } catch (e) { /* fall through */ }
    return manualBase64(clean);
  }

  function padding(s) {
    var stripped = s.replace(/=+$/, '');
    var rem = stripped.length % 4;
    return rem === 2 ? '==' : rem === 3 ? '=' : '';
  }

  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function manualBase64(clean) {
    var out = '', buffer = 0, bits = 0;
    for (var i = 0; i < clean.length; i++) {
      var c = clean.charAt(i);
      if (c === '=') { break; }
      var v = B64.indexOf(c);
      if (v < 0) { continue; }
      buffer = (buffer << 6) | v;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        out += String.fromCharCode((buffer >> bits) & 0xff);
      }
    }
    return out;
  }

  function decodeEncodedWords(value) {
    if (!value || value.indexOf('=?') === -1) { return value || ''; }
    /* Adjacent encoded words separated only by whitespace are joined. */
    var joined = String(value).replace(/(\?=)[ \t]+(=\?)/g, '$1$2');
    return joined.replace(/=\?([^?]+)\?([BbQq])\?([^?]*)\?=/g, function (all, charset, enc, text) {
      try {
        var byteStr = enc.toUpperCase() === 'B'
          ? decodeBase64ToByteString(text)
          : decodeQuotedPrintable(text, true);
        return decodeText(byteStr, charset);
      } catch (e) {
        return all;
      }
    });
  }

  /* =================================================================
     6. Structured header values
     ================================================================= */

  function parseParameters(value) {
    var result = { value: '', params: {} };
    if (!value) { return result; }
    var parts = splitOutsideQuotes(String(value), ';');
    result.value = (parts.shift() || '').trim().toLowerCase();
    parts.forEach(function (p) {
      var eq = p.indexOf('=');
      if (eq === -1) { return; }
      var key = p.slice(0, eq).trim().toLowerCase();
      var val = p.slice(eq + 1).trim().replace(/^"(.*)"$/, '$1');
      /* RFC 2231 continuations: name*0, name*1, and name* with charset */
      var starIdx = key.indexOf('*');
      if (starIdx > -1) {
        var base = key.slice(0, starIdx);
        var enc = val.match(/^([^']*)'([^']*)'(.*)$/);
        if (enc) {
          val = decodeText(decodeQuotedPrintable(enc[3].replace(/%/g, '='), false), enc[1]);
        }
        result.params[base] = (result.params[base] || '') + val;
        return;
      }
      result.params[key] = val;
    });
    return result;
  }

  function splitOutsideQuotes(str, sep) {
    var out = [], buf = '', inQuote = false;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i);
      if (ch === '"' && str.charAt(i - 1) !== '\\') { inQuote = !inQuote; }
      if (ch === sep && !inQuote) { out.push(buf); buf = ''; continue; }
      buf += ch;
    }
    out.push(buf);
    return out;
  }

  function findAngleAddr(raw) {
    var inQuote = false, start = -1, end = -1;
    for (var i = 0; i < raw.length; i++) {
      var ch = raw.charAt(i);
      if (ch === '"' && raw.charAt(i - 1) !== '\\') { inQuote = !inQuote; continue; }
      if (inQuote) { continue; }
      if (ch === '<') { start = i; end = -1; }
      else if (ch === '>' && start > -1 && end === -1) { end = i; }
    }
    return (start > -1 && end > start) ? { start: start, end: end } : null;
  }

  /* Address list parsing. Tolerant on purpose: hostile mail is often malformed. */
  function parseAddressList(value) {
    if (!value) { return []; }
    return splitOutsideQuotes(String(value), ',').map(function (chunk) {
      var raw = chunk.trim();
      if (!raw) { return null; }
      var address = '', display = '';
      /* The real address is the last angle addr-spec that is not inside a
         quoted string. A display name may itself contain an address in angle
         brackets, which is a common impersonation trick. */
      var angle = findAngleAddr(raw);
      if (angle) {
        address = raw.slice(angle.start + 1, angle.end).trim();
        display = raw.slice(0, angle.start).trim();
      } else {
        address = raw;
      }
      display = display.replace(/^"(.*)"$/, '$1').trim();
      display = decodeEncodedWords(display);
      address = address.replace(/^"(.*)"$/, '$1').replace(/\s+/g, '');
      var at = address.lastIndexOf('@');
      return {
        raw: raw,
        display: display,
        address: address,
        local: at > -1 ? address.slice(0, at) : address,
        domain: at > -1 ? address.slice(at + 1).toLowerCase().replace(/[>\s.]+$/, '') : ''
      };
    }).filter(Boolean);
  }

  /* =================================================================
     7. Transfer encoding and MIME tree
     ================================================================= */

  function decodeTransferEncoding(body, encoding) {
    var enc = String(encoding || '7bit').toLowerCase().trim();
    if (enc === 'base64') { return decodeBase64ToByteString(body); }
    if (enc === 'quoted-printable') { return decodeQuotedPrintable(body, false); }
    return body;
  }

  function parseEntity(headerBlock, body, depth) {
    var headers = parseHeaderBlock(headerBlock);
    var ctRaw = headerValue(headers, 'content-type') || 'text/plain';
    var ct = parseParameters(decodeEncodedWords(ctRaw));
    var cteRaw = headerValue(headers, 'content-transfer-encoding') || '7bit';
    var cdRaw = headerValue(headers, 'content-disposition') || '';
    var cd = parseParameters(decodeEncodedWords(cdRaw));

    var entity = {
      headers: headers,
      contentType: ct.value || 'text/plain',
      params: ct.params,
      charset: ct.params.charset || 'utf-8',
      encoding: String(cteRaw).toLowerCase().trim(),
      disposition: cd.value || '',
      filename: cd.params.filename || ct.params.name || '',
      contentId: (headerValue(headers, 'content-id') || '').replace(/[<>]/g, ''),
      children: [],
      rawSize: body.length
    };
    entity.filename = decodeEncodedWords(entity.filename);

    var isMultipart = entity.contentType.indexOf('multipart/') === 0;
    if (isMultipart && ct.params.boundary && depth < 12) {
      entity.children = splitMultipart(body, ct.params.boundary, depth + 1);
      return entity;
    }

    if (entity.contentType === 'message/rfc822' && depth < 12) {
      var inner = splitMessage(body);
      entity.children = [parseEntity(inner.headerBlock, inner.body, depth + 1)];
      return entity;
    }

    entity.decoded = decodeTransferEncoding(body, entity.encoding);
    entity.decodedSize = entity.decoded.length;
    if (entity.contentType.indexOf('text/') === 0) {
      entity.text = decodeText(entity.decoded, entity.charset);
    }
    return entity;
  }

  function splitMultipart(body, boundary, depth) {
    var marker = '--' + boundary;
    var lines = body.split('\n');
    var parts = [];
    var current = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.replace(/[\s]+$/, '');
      if (trimmed === marker) {
        if (current !== null) { parts.push(current.join('\n')); }
        current = [];
        continue;
      }
      if (trimmed === marker + '--') {
        if (current !== null) { parts.push(current.join('\n')); }
        current = null;
        break;
      }
      if (current !== null) { current.push(line); }
    }
    if (current !== null && current.length) { parts.push(current.join('\n')); }

    return parts.map(function (chunk) {
      var split = splitMessage(chunk);
      return parseEntity(split.headerBlock, split.body, depth);
    });
  }

  function walkParts(entity, visit) {
    visit(entity);
    for (var i = 0; i < entity.children.length; i++) {
      walkParts(entity.children[i], visit);
    }
  }

  /* =================================================================
     8. Top level parse
     ================================================================= */

  function parse(byteString) {
    var split = splitMessage(byteString);
    var headers = parseHeaderBlock(split.headerBlock);

    if (!headers.length) { throw new Error('no-headers'); }
    var looksLikeMail = headers.some(function (h) {
      return ['from', 'received', 'subject', 'to', 'date', 'message-id', 'return-path'].indexOf(h.lower) > -1;
    });
    if (!looksLikeMail) { throw new Error('not-a-message'); }

    var root = parseEntity(split.headerBlock, split.body, 0);

    var msg = {
      headers: headers,
      root: root,
      raw: byteString,
      get: function (name) { return headerValue(headers, name); },
      all: function (name) { return headerAll(headers, name); }
    };

    /* Flatten useful collections once. */
    msg.textParts = [];
    msg.htmlParts = [];
    msg.attachments = [];
    msg.partList = [];

    walkParts(root, function (part) {
      msg.partList.push(part);
      var isAttachment = part.disposition === 'attachment' ||
        (part.filename && part.contentType.indexOf('multipart/') !== 0);
      if (part.contentType === 'text/plain' && !isAttachment) {
        msg.textParts.push(part);
      } else if (part.contentType === 'text/html' && !isAttachment) {
        msg.htmlParts.push(part);
      } else if (isAttachment) {
        msg.attachments.push(part);
      }
    });

    return msg;
  }

  SPDT.eml = {
    parse: parse,
    fromBytes: function (bytes) { return parse(bytesToByteString(bytes)); },
    bytesToByteString: bytesToByteString,
    decodeEncodedWords: decodeEncodedWords,
    parseAddressList: parseAddressList,
    parseParameters: parseParameters,
    punyDecodeHost: punyDecodeHost,
    punyEncodeHost: punyEncodeHost,
    mixedScriptLabels: mixedScriptLabels,
    decodeText: decodeText
  };

})(window.SPDT);

/* ------------------------------------------------------------------
   Passive analysis. Every indicator carries an explicit weight, and the
   same weights are written out in docs/METHODOLOGY.md.
   ------------------------------------------------------------------ */

(function (SPDT) {
  'use strict';

  var eml = SPDT.eml;

  /* Each indicator can contribute its weight at most once per message,
     however many times it is observed. Evidence still lists every instance,
     so a message with forty lookalike links does not inflate the score. */
  var WEIGHTS = {
    dmarc_fail: 4,
    spf_fail: 3,
    spf_softfail: 2,
    spf_none: 1,
    dkim_fail: 3,
    dkim_absent: 1,
    auth_absent: 1,
    auth_malformed: 1,
    replyto_mismatch: 3,
    returnpath_mismatch: 1,
    display_address_mismatch: 3,
    display_domain_mismatch: 2,
    from_punycode: 3,
    from_mixed_script: 3,
    from_multiple: 2,
    sender_mismatch: 1,
    url_ip_host: 3,
    url_punycode: 3,
    url_mixed_script: 3,
    url_userinfo: 3,
    url_text_mismatch: 3,
    url_shortener: 1,
    url_many_subdomains: 1,
    url_very_long: 1,
    url_encoded: 2,
    url_redirect_param: 2,
    url_odd_port: 1,
    html_form: 4,
    hidden_chars: 2,
    att_executable: 4,
    att_double_ext: 4,
    att_macro: 3,
    att_html: 3,
    att_archive: 1,
    att_type_mismatch: 2,
    received_malformed: 1,
    received_many: 1,
    date_anomaly: 1
  };

  var THRESHOLDS = { high: 7, moderate: 3, low: 1 };

  /* Approximate organizational domain. This is a short heuristic list and
     deliberately not a Public Suffix List implementation, so every comparison
     built on it is presented as approximate. */
  var MULTI_SUFFIX = [
    'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'me.uk', 'net.uk', 'sch.uk', 'ltd.uk', 'plc.uk',
    'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au', 'co.nz', 'org.nz', 'net.nz',
    'com.br', 'com.mx', 'com.ar', 'com.co', 'com.pe', 'com.ve',
    'co.jp', 'ne.jp', 'or.jp', 'ac.jp', 'go.jp', 'co.kr', 'or.kr',
    'com.cn', 'net.cn', 'org.cn', 'gov.cn', 'com.hk', 'com.tw', 'com.sg', 'com.my',
    'co.in', 'net.in', 'org.in', 'co.za', 'org.za', 'com.tr', 'com.ua', 'com.pl',
    'com.ru', 'com.gr', 'com.cy', 'com.mt', 'co.il', 'com.eg', 'com.sa',
    'gov.bg', 'edu.bg', 'org.bg'
  ];

  function organizationalDomain(host) {
    if (!host) { return ''; }
    var h = String(host).toLowerCase().replace(/\.$/, '');
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) { return h; }
    var labels = h.split('.');
    if (labels.length <= 2) { return h; }
    var lastTwo = labels.slice(-2).join('.');
    if (MULTI_SUFFIX.indexOf(lastTwo) > -1) { return labels.slice(-3).join('.'); }
    return lastTwo;
  }

  /* ---------------- URL handling ---------------- */

  var SHORTENERS = [
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'rebrand.ly',
    'cutt.ly', 'shorturl.at', 'rb.gy', 't.ly', 'lnkd.in', 'tiny.cc', 'bl.ink', 's.id',
    'clck.ru', 'vk.cc', 'surl.li', 'shrtco.de', 'v.gd', 'qr.ae', 'trib.al'
  ];

  var RE_URL_TEXT = /\b((?:https?|ftp):\/\/[^\s<>"'`\]\[)]+|www\.[^\s<>"'`\]\[)]+)/gi;
  var RE_ANCHOR = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  var RE_HREF = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
  var RE_HIDDEN = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/;

  function stripHtmlEntities(str) {
    return String(str)
      .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"').replace(/&#39;/g, "'").replace(/&nbsp;/gi, ' ')
      .replace(/&#(\d+);/g, function (all, num) {
        var n = parseInt(num, 10);
        return n > 0 && n < 0x10000 ? String.fromCharCode(n) : all;
      });
  }

  function stripTags(html) {
    return stripHtmlEntities(
      String(html)
        .replace(/<script\b[\s\S]*?<\/script\s*>/gi, ' ')
        .replace(/<style\b[\s\S]*?<\/style\s*>/gi, ' ')
        .replace(/<head\b[\s\S]*?<\/head\s*>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|tr|li|h[1-6])\s*>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
    ).replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  }

  /* Parsing is done by hand rather than with the URL constructor so that the
     same result is produced everywhere and malformed input never throws. */
  function dissectUrl(input) {
    var url = String(input).trim().replace(/[.,;:!?)\]]+$/, '');
    var result = {
      url: url, scheme: '', userinfo: '', host: '', port: '',
      path: '', query: '', fragment: '', valid: false
    };
    var work = url;
    var schemeMatch = work.match(/^([A-Za-z][A-Za-z0-9+.-]*):\/\//);
    if (schemeMatch) {
      result.scheme = schemeMatch[1].toLowerCase();
      work = work.slice(schemeMatch[0].length);
    } else if (/^www\./i.test(work)) {
      result.scheme = 'http';
      result.schemeImplied = true;
    } else {
      var bare = work.match(/^([A-Za-z][A-Za-z0-9+.-]*):(.*)$/);
      if (bare) {
        result.scheme = bare[1].toLowerCase();
        result.path = bare[2];
        return result;
      }
      return result;
    }

    var hash = work.indexOf('#');
    if (hash > -1) { result.fragment = work.slice(hash + 1); work = work.slice(0, hash); }
    var q = work.indexOf('?');
    if (q > -1) { result.query = work.slice(q + 1); work = work.slice(0, q); }
    var slash = work.indexOf('/');
    var authority = slash > -1 ? work.slice(0, slash) : work;
    result.path = slash > -1 ? work.slice(slash) : '';

    var at = authority.lastIndexOf('@');
    if (at > -1) {
      result.userinfo = authority.slice(0, at);
      authority = authority.slice(at + 1);
    }
    var portMatch = authority.match(/^(\[[^\]]*\]|[^:]*)(?::(\d+))?$/);
    if (portMatch) {
      result.host = portMatch[1].toLowerCase();
      result.port = portMatch[2] || '';
    } else {
      result.host = authority.toLowerCase();
    }
    result.valid = !!result.host;
    result.organizational = organizationalDomain(result.host);
    return result;
  }

  function analyzeUrl(input, linkText) {
    var u = dissectUrl(input);
    u.flags = [];
    u.text = linkText || '';

    if (!u.valid) {
      if (u.scheme && ['javascript', 'data', 'file', 'vbscript'].indexOf(u.scheme) > -1) {
        u.flags.push('url_dangerous_scheme');
      }
      return u;
    }

    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(u.host) || /^\[[0-9a-f:]+\]$/i.test(u.host)) {
      u.flags.push('url_ip_host');
    }
    if (u.host.indexOf('xn--') > -1) {
      u.flags.push('url_punycode');
      u.decodedHost = eml.punyDecodeHost(u.host);
    }
    if (eml.mixedScriptLabels(u.host).length) { u.flags.push('url_mixed_script'); }
    if (u.userinfo) { u.flags.push('url_userinfo'); }
    if (SHORTENERS.indexOf(u.organizational) > -1) { u.flags.push('url_shortener'); }
    if (u.host.split('.').length > 5) { u.flags.push('url_many_subdomains'); }
    if (u.url.length > 250) { u.flags.push('url_very_long'); }
    if (/%25|%2[fF]|%3[aA]|&#x?\d/.test(u.host) || /%[0-9a-f]{2}/i.test(u.host)) { u.flags.push('url_encoded'); }
    if (u.port && u.port !== '80' && u.port !== '443') { u.flags.push('url_odd_port'); }
    if (/(?:^|[?&])(?:url|redirect|redir|next|target|dest|destination|continue|return|r|u|goto)=(https?(?::|%3[aA]))/i.test(u.query)) {
      u.flags.push('url_redirect_param');
    }

    /* Visible text that itself names a host, pointing somewhere else. */
    if (u.text) {
      var textUrl = String(u.text).trim().match(/^(?:https?:\/\/)?((?:[a-z0-9\u00a1-\uffff-]+\.)+[a-z\u00a1-\uffff]{2,})(?:[/?#]|$)/i);
      if (textUrl) {
        var textOrg = organizationalDomain(textUrl[1]);
        if (textOrg && u.organizational && textOrg !== u.organizational) {
          u.flags.push('url_text_mismatch');
          u.textHost = textUrl[1].toLowerCase();
        }
      }
    }
    return u;
  }

  function collectUrls(msg) {
    var found = [];
    var seen = {};

    function add(raw, text, source) {
      var trimmed = String(raw).trim();
      if (!trimmed) { return; }
      var key = trimmed + '|' + (text || '');
      if (seen[key]) { return; }
      seen[key] = true;
      var analysis = analyzeUrl(trimmed, text);
      analysis.source = source;
      found.push(analysis);
    }

    msg.textParts.forEach(function (part) {
      var text = part.text || '';
      var m;
      RE_URL_TEXT.lastIndex = 0;
      while ((m = RE_URL_TEXT.exec(text)) !== null) { add(m[1], '', 'text'); }
    });

    msg.htmlParts.forEach(function (part) {
      var html = part.text || '';
      var m;
      RE_ANCHOR.lastIndex = 0;
      while ((m = RE_ANCHOR.exec(html)) !== null) {
        var attrs = m[1] || '';
        var href = attrs.match(RE_HREF);
        if (!href) { continue; }
        var target = stripHtmlEntities(href[1] || href[2] || href[3] || '');
        if (/^(mailto|tel|sms):/i.test(target) || target.indexOf('#') === 0 || !target) { continue; }
        add(target, stripTags(m[2] || ''), 'html');
      }
      /* Bare addresses written out in the HTML but not wrapped in a link. */
      var stripped = stripTags(html);
      RE_URL_TEXT.lastIndex = 0;
      var t;
      while ((t = RE_URL_TEXT.exec(stripped)) !== null) { add(t[1], '', 'html-text'); }
    });

    return found;
  }

  /* ---------------- Authentication-Results ---------------- */

  function parseAuthResults(values) {
    var out = { present: values.length > 0, entries: [], spf: null, dkim: null, dmarc: null, arc: null, servers: [] };
    values.forEach(function (value) {
      var parts = value.split(';');
      var server = (parts.shift() || '').trim().split(/\s+/)[0];
      if (server) { out.servers.push(server); }
      parts.forEach(function (chunk) {
        var m = chunk.trim().match(/^(spf|dkim|dmarc|arc|auth|iprev|dkim-adsp)\s*=\s*([a-z]+)(.*)$/i);
        if (!m) { return; }
        var entry = {
          method: m[1].toLowerCase(),
          result: m[2].toLowerCase(),
          detail: (m[3] || '').trim(),
          server: server
        };
        var dm = entry.detail.match(/header\.(?:from|d|i)\s*=\s*@?([^\s;()]+)/i);
        if (dm) { entry.domain = dm[1].toLowerCase().replace(/[">]+$/, ''); }
        var sm = entry.detail.match(/smtp\.(?:mailfrom|helo)\s*=\s*([^\s;()]+)/i);
        if (sm) { entry.smtp = sm[1].toLowerCase(); }
        out.entries.push(entry);
        if (!out[entry.method]) { out[entry.method] = entry; }
      });
    });
    return out;
  }

  function parseReceivedSpf(values) {
    if (!values.length) { return null; }
    var m = String(values[0]).trim().match(/^([a-z]+)/i);
    return m ? { result: m[1].toLowerCase(), raw: values[0] } : null;
  }

  /* ---------------- Received chain ---------------- */

  function parseReceivedChain(values) {
    return values.map(function (raw, index) {
      var entry = { index: index, raw: raw, from: '', by: '', date: null, malformed: false };
      var fromMatch = raw.match(/\bfrom\s+([^\s;]+)/i);
      var byMatch = raw.match(/\bby\s+([^\s;]+)/i);
      entry.from = fromMatch ? fromMatch[1] : '';
      entry.by = byMatch ? byMatch[1] : '';
      var semi = raw.lastIndexOf(';');
      if (semi > -1) {
        var parsed = Date.parse(raw.slice(semi + 1).trim());
        if (!isNaN(parsed)) { entry.date = new Date(parsed); }
      }
      entry.malformed = !entry.from && !entry.by;
      var ip = raw.match(/\[?((?:\d{1,3}\.){3}\d{1,3})\]?/);
      if (ip) {
        entry.ip = ip[1];
        entry.privateIp = /^(10\.|127\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip[1]);
      }
      return entry;
    });
  }

  /* ---------------- Attachments ---------------- */

  var EXT_EXECUTABLE = ['exe', 'scr', 'com', 'pif', 'bat', 'cmd', 'js', 'jse', 'vbs', 'vbe',
    'wsf', 'wsh', 'hta', 'msi', 'msp', 'cpl', 'jar', 'ps1', 'psm1', 'lnk', 'reg', 'chm',
    'application', 'gadget', 'msc', 'dll', 'apk', 'scf', 'inf', 'iso', 'img', 'vhd', 'vhdx'];
  var EXT_MACRO = ['docm', 'xlsm', 'pptm', 'dotm', 'xltm', 'xlam', 'ppam', 'potm', 'ppsm', 'xlsb'];
  var EXT_ARCHIVE = ['zip', 'rar', '7z', 'gz', 'tgz', 'bz2', 'cab', 'ace', 'arj', 'lzh'];
  var EXT_HTML = ['html', 'htm', 'shtml', 'xhtml', 'mht', 'mhtml', 'svg'];
  var EXT_DOC_SAFE = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', txt: 'text/plain' };

  function analyzeAttachment(part) {
    var name = part.filename || '';
    var lower = name.toLowerCase();
    var segments = lower.split('.');
    var ext = segments.length > 1 ? segments[segments.length - 1] : '';
    var info = {
      name: name,
      extension: ext,
      contentType: part.contentType,
      size: part.encoding === 'base64' ? Math.floor(part.rawSize * 0.75) : part.decodedSize || part.rawSize,
      flags: []
    };

    if (EXT_EXECUTABLE.indexOf(ext) > -1) { info.flags.push('att_executable'); }
    if (EXT_MACRO.indexOf(ext) > -1) { info.flags.push('att_macro'); }
    if (EXT_ARCHIVE.indexOf(ext) > -1) { info.flags.push('att_archive'); }
    if (EXT_HTML.indexOf(ext) > -1) { info.flags.push('att_html'); }

    /* A second extension before the last one, where the inner extension looks
       like a document and the outer one does not. */
    if (segments.length > 2) {
      var inner = segments[segments.length - 2];
      var innerLooksLikeDoc = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'csv', 'zip'].indexOf(inner) > -1;
      if (innerLooksLikeDoc && ext !== inner) { info.flags.push('att_double_ext'); }
    }

    /* Only flag a mismatch when both sides are specific. A generic
       application/octet-stream is far too common to treat as a signal. */
    var declared = String(part.contentType || '').toLowerCase();
    if (EXT_DOC_SAFE[ext] && declared && declared !== 'application/octet-stream' && declared !== EXT_DOC_SAFE[ext]) {
      if (declared.indexOf('image/') !== 0 || EXT_DOC_SAFE[ext].indexOf('image/') !== 0) {
        info.flags.push('att_type_mismatch');
        info.expectedType = EXT_DOC_SAFE[ext];
      }
    }
    return info;
  }

  /* ---------------- Main analysis ---------------- */

  function analyze(msg) {
    var indicators = [];
    var counted = {};

    function flag(id, evidence) {
      var existing = null;
      for (var i = 0; i < indicators.length; i++) {
        if (indicators[i].id === id) { existing = indicators[i]; break; }
      }
      if (existing) {
        if (evidence) { existing.evidence.push(evidence); }
        return;
      }
      indicators.push({
        id: id,
        weight: WEIGHTS[id] || 0,
        counted: !counted[id],
        evidence: evidence ? [evidence] : []
      });
      counted[id] = true;
    }

    var fromList = eml.parseAddressList(msg.get('From'));
    var from = fromList[0] || null;
    var fromDomain = from ? from.domain : '';
    var fromOrg = organizationalDomain(fromDomain);

    var replyTo = eml.parseAddressList(msg.get('Reply-To'));
    var sender = eml.parseAddressList(msg.get('Sender'));
    var returnPath = eml.parseAddressList((msg.get('Return-Path') || '').replace(/[<>]/g, ''));

    /* --- sender identity --- */
    if (fromList.length > 1) {
      flag('from_multiple', fromList.map(function (a) { return a.address; }).join(', '));
    }
    if (fromDomain && fromDomain.indexOf('xn--') > -1) {
      var decoded = eml.punyDecodeHost(fromDomain);
      flag('from_punycode', fromDomain + (decoded ? ' = ' + decoded : ''));
    }
    if (from && eml.mixedScriptLabels(fromDomain).length) {
      flag('from_mixed_script', fromDomain);
    }
    if (from && from.display) {
      var embedded = from.display.match(/[\w.+-]+@[\w.-]+\.[a-z\u0400-\u04ff]{2,}/i);
      if (embedded && embedded[0].toLowerCase() !== from.address.toLowerCase()) {
        flag('display_address_mismatch', from.display + '  ->  ' + from.address);
      } else if (!embedded) {
        var domainish = from.display.match(/\b((?:[a-z0-9-]+\.)+(?:com|net|org|bg|eu|de|fr|uk|io|co|info|biz|ru|it|es|nl|pl|gr|ro|tr))\b/i);
        if (domainish && fromOrg && organizationalDomain(domainish[1]) !== fromOrg) {
          flag('display_domain_mismatch', from.display + '  ->  ' + fromDomain);
        }
      }
      if (window.SPDT.eml.mixedScriptLabels(from.display.replace(/\s+/g, '.')).length) {
        flag('from_mixed_script', from.display);
      }
    }
    if (replyTo.length && fromOrg) {
      var rtOrg = organizationalDomain(replyTo[0].domain);
      if (rtOrg && rtOrg !== fromOrg) {
        flag('replyto_mismatch', 'From: ' + fromDomain + '   Reply-To: ' + replyTo[0].domain);
      }
    }
    if (returnPath.length && fromOrg) {
      var rpOrg = organizationalDomain(returnPath[0].domain);
      if (rpOrg && rpOrg !== fromOrg) {
        flag('returnpath_mismatch', 'From: ' + fromDomain + '   Return-Path: ' + returnPath[0].domain);
      }
    }
    if (sender.length && fromOrg && organizationalDomain(sender[0].domain) !== fromOrg) {
      flag('sender_mismatch', 'From: ' + fromDomain + '   Sender: ' + sender[0].domain);
    }

    /* --- authentication --- */
    var auth = parseAuthResults(msg.all('Authentication-Results'));
    var receivedSpf = parseReceivedSpf(msg.all('Received-SPF'));
    var dkimSignatures = msg.all('DKIM-Signature').map(function (raw) {
      var params = {};
      raw.split(';').forEach(function (chunk) {
        var m = chunk.trim().match(/^([a-z]+)\s*=\s*([\s\S]*)$/i);
        if (m) { params[m[1].toLowerCase()] = m[2].trim(); }
      });
      return { raw: raw, domain: (params.d || '').toLowerCase(), selector: params.s || '', algorithm: params.a || '' };
    });
    var arcSeals = msg.all('ARC-Seal');

    if (!auth.present) {
      flag('auth_absent', null);
    } else if (!auth.entries.length) {
      /* The field exists but nothing in it could be read. */
      flag('auth_malformed', msg.all('Authentication-Results')[0].slice(0, 140));
    } else {
      if (auth.dmarc && auth.dmarc.result === 'fail') { flag('dmarc_fail', 'dmarc=' + auth.dmarc.result + (auth.dmarc.domain ? ' header.from=' + auth.dmarc.domain : '')); }
      if (auth.spf) {
        if (auth.spf.result === 'fail') { flag('spf_fail', 'spf=fail' + (auth.spf.smtp ? ' smtp.mailfrom=' + auth.spf.smtp : '')); }
        else if (auth.spf.result === 'softfail') { flag('spf_softfail', 'spf=softfail'); }
        else if (['none', 'neutral', 'permerror', 'temperror'].indexOf(auth.spf.result) > -1) { flag('spf_none', 'spf=' + auth.spf.result); }
      }
      if (auth.dkim) {
        if (auth.dkim.result === 'fail') { flag('dkim_fail', 'dkim=fail' + (auth.dkim.domain ? ' header.d=' + auth.dkim.domain : '')); }
        else if (auth.dkim.result === 'none' && !dkimSignatures.length) { flag('dkim_absent', 'dkim=none'); }
      }
    }

    /* --- routing --- */
    var received = parseReceivedChain(msg.all('Received'));
    if (received.length > 12) { flag('received_many', String(received.length)); }
    received.forEach(function (hop) {
      if (hop.malformed) { flag('received_malformed', hop.raw.slice(0, 120)); }
    });

    var dateHeader = msg.get('Date');
    if (dateHeader) {
      var dateValue = Date.parse(dateHeader);
      var newest = null;
      received.forEach(function (hop) {
        if (hop.date && (!newest || hop.date.getTime() > newest)) { newest = hop.date.getTime(); }
      });
      if (!isNaN(dateValue) && newest) {
        var driftHours = Math.abs(dateValue - newest) / 3600000;
        if (driftHours > 48) {
          flag('date_anomaly', 'Date: ' + dateHeader + '   (' + Math.round(driftHours) + ' h)');
        }
      }
    }

    /* --- urls --- */
    var urls = collectUrls(msg);
    urls.forEach(function (u) {
      u.flags.forEach(function (f) {
        if (WEIGHTS[f] === undefined && f !== 'url_dangerous_scheme') { return; }
        var evidence = u.url.length > 160 ? u.url.slice(0, 157) + '...' : u.url;
        if (f === 'url_text_mismatch') { evidence = u.textHost + '  ->  ' + u.host; }
        if (f === 'url_punycode' && u.decodedHost) { evidence = u.host + ' = ' + u.decodedHost; }
        flag(f, evidence);
      });
    });

    /* --- html specific --- */
    var htmlSource = msg.htmlParts.map(function (p) { return p.text || ''; }).join('\n');
    if (htmlSource) {
      var formMatch = htmlSource.match(/<form\b[^>]*>/i);
      if (formMatch) {
        var action = formMatch[0].match(/\baction\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        flag('html_form', action ? 'action=' + stripHtmlEntities(action[1] || action[2] || action[3]) : formMatch[0].slice(0, 80));
      }
    }
    var visibleText = msg.textParts.map(function (p) { return p.text || ''; }).join('\n') + '\n' + stripTags(htmlSource);
    if (RE_HIDDEN.test(visibleText)) {
      flag('hidden_chars', null);
    }

    /* --- attachments --- */
    var attachments = msg.attachments.map(analyzeAttachment);
    attachments.forEach(function (a) {
      a.flags.forEach(function (f) { flag(f, a.name + ' (' + a.contentType + ')'); });
    });

    /* --- scoring --- */
    var score = indicators.reduce(function (sum, ind) { return sum + ind.weight; }, 0);

    var evidenceAvailable = auth.present || urls.length > 0 || attachments.length > 0 || received.length > 0;
    var verdict;
    if (!evidenceAvailable) {
      verdict = 'insufficient';
    } else if (score >= THRESHOLDS.high) {
      verdict = 'high';
    } else if (score >= THRESHOLDS.moderate) {
      verdict = 'moderate';
    } else if (score >= THRESHOLDS.low) {
      verdict = 'low';
    } else if (!auth.present) {
      verdict = 'manual';
    } else {
      verdict = 'low';
    }

    indicators.sort(function (a, b) { return b.weight - a.weight; });

    return {
      verdict: verdict,
      score: score,
      thresholds: THRESHOLDS,
      weights: WEIGHTS,
      indicators: indicators,
      from: from,
      fromList: fromList,
      fromDomain: fromDomain,
      fromOrganizational: fromOrg,
      replyTo: replyTo,
      sender: sender,
      returnPath: returnPath,
      to: eml.parseAddressList(msg.get('To')),
      subject: eml.decodeEncodedWords(msg.get('Subject') || ''),
      date: dateHeader || '',
      messageId: msg.get('Message-ID') || '',
      auth: auth,
      receivedSpf: receivedSpf,
      dkimSignatures: dkimSignatures,
      arcPresent: arcSeals.length > 0,
      arcCount: arcSeals.length,
      received: received,
      urls: urls,
      attachments: attachments,
      bodyText: visibleText.replace(/\n{3,}/g, '\n\n').trim(),
      hasHtml: msg.htmlParts.length > 0,
      hasText: msg.textParts.length > 0,
      parts: msg.partList.map(function (p) {
        return {
          contentType: p.contentType,
          encoding: p.encoding,
          disposition: p.disposition,
          filename: p.filename,
          size: p.decodedSize || p.rawSize
        };
      })
    };
  }

  eml.analyze = analyze;
  eml.analyzeUrl = analyzeUrl;
  eml.dissectUrl = dissectUrl;
  eml.organizationalDomain = organizationalDomain;
  eml.stripTags = stripTags;
  eml.WEIGHTS = WEIGHTS;
  eml.THRESHOLDS = THRESHOLDS;
  eml.SHORTENERS = SHORTENERS;

})(window.SPDT);
