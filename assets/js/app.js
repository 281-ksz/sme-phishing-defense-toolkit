/* app.js
   Rendering and interaction.

   All values that originate from a message, a DNS record or a form field are
   inserted with textContent. No message derived string is ever assigned to
   innerHTML, so nothing inside a suspicious email can execute here.

   State lives in a single object in memory. There is no persistence of any
   kind: no localStorage, no sessionStorage, no cookies, no IndexedDB. */

window.SPDT = window.SPDT || {};

(function (SPDT) {
  'use strict';

  var i18n = SPDT.i18n;
  var t = i18n.t;
  var pick = i18n.pick;

  /* =================================================================
     State
     ================================================================= */

  var state = {
    view: 'home',
    message: null,
    analysis: null,
    fileName: '',
    profile: null,
    answers: { roles: [] },
    domainResult: null,
    treeState: {},
    busy: false
  };

  /* =================================================================
     DOM helpers
     ================================================================= */

  function el(tag, opts, children) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.cls) { node.className = opts.cls; }
    if (opts.text !== undefined && opts.text !== null) { node.textContent = String(opts.text); }
    if (opts.attrs) {
      Object.keys(opts.attrs).forEach(function (key) {
        if (opts.attrs[key] !== null && opts.attrs[key] !== undefined && opts.attrs[key] !== false) {
          node.setAttribute(key, opts.attrs[key]);
        }
      });
    }
    if (opts.on) {
      Object.keys(opts.on).forEach(function (evt) { node.addEventListener(evt, opts.on[evt]); });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) { return; }
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) { node.removeChild(node.firstChild); }
    return node;
  }

  function $(selector) { return document.querySelector(selector); }
  function $$(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }

  function paragraphs(list) {
    return (list || []).map(function (p) { return el('p', { text: pick(p) }); });
  }

  function bulletList(list, cls) {
    return el('ul', { cls: cls || null }, (list || []).map(function (item) {
      return el('li', { text: pick(item) });
    }));
  }

  /* =================================================================
     Language
     ================================================================= */

  function applyStrings() {
    document.documentElement.lang = i18n.lang;
    $$('[data-i18n]').forEach(function (node) {
      node.textContent = t(node.getAttribute('data-i18n'));
    });
    $$('.lang-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === i18n.lang ? 'true' : 'false');
    });
    document.title = 'SME Phishing Defense Toolkit';
  }

  function setLanguage(next) {
    i18n.setLang(next);
    applyStrings();
    renderAll();
  }

  /* =================================================================
     Navigation
     ================================================================= */

  var VIEWS = ['home', 'analyze', 'domain', 'assess', 'plan', 'checklists', 'trees', 'guide', 'glossary', 'privacy', 'sources'];

  function show(view) {
    if (VIEWS.indexOf(view) === -1) { view = 'home'; }
    state.view = view;
    VIEWS.forEach(function (name) {
      var section = document.getElementById('view-' + name);
      if (section) { section.hidden = name !== view; }
    });
    $$('.rail-list a').forEach(function (link) {
      link.classList.toggle('is-current', link.getAttribute('data-nav') === view);
      if (link.getAttribute('data-nav') === view) { link.setAttribute('aria-current', 'page'); }
      else { link.removeAttribute('aria-current'); }
    });
    buildRailSub(view);
    var rail = $('#rail');
    if (rail) { rail.classList.remove('is-open'); }
    var toggle = $('#menu-toggle');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); }
    var main = $('#main');
    if (main) { main.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }

  /* Quick links to the headings of the open tab, nested under its rail entry. */
  function buildRailSub(view) {
    $$('.rail-sub').forEach(function (node) { node.parentNode.removeChild(node); });
    var link = $('.rail-list a[data-nav="' + view + '"]');
    var section = document.getElementById('view-' + view);
    if (!link || !section) { return; }

    var targets = $$('#view-' + view + ' h2, #view-' + view + ' .guide-topic > summary')
      .filter(function (node) { return (node.textContent || '').trim(); });
    if (targets.length < 2) { return; }

    var list = el('ul', { cls: 'rail-sub' });
    targets.forEach(function (node, index) {
      if (!node.id) { node.id = 'sec-' + view + '-' + index; }
      list.appendChild(el('li', {}, [el('a', {
        text: node.textContent.trim(),
        attrs: { href: '#' + view },
        on: {
          click: function (event) {
            event.preventDefault();
            var box = node.closest ? node.closest('details') : null;
            if (box) { box.open = true; }
            node.scrollIntoView({ block: 'start' });
            var rail = $('#rail');
            if (rail) { rail.classList.remove('is-open'); }
          }
        }
      })]));
    });
    link.parentNode.appendChild(list);
  }

  function readHash() {
    return String(window.location.hash || '').replace('#', '') || 'home';
  }

  /* =================================================================
     Network state indicator
     ================================================================= */

  function setNetworkState(active, label) {
    var box = $('#netstate');
    var text = $('#netstate-text');
    if (!box || !text) { return; }
    box.classList.toggle('is-online', !!active);
    text.textContent = label || (active ? t('net.online') : t('net.local'));
  }

  /* =================================================================
     Static content sections
     ================================================================= */

  function renderHome() {
    var host = clear($('#home-body'));
    i18n.content.home.forEach(function (block) {
      var card = el('div', { cls: 'card' }, [el('h2', { text: pick(block.h) })]);
      paragraphs(block.p).forEach(function (p) { card.appendChild(p); });
      if (block.list) { card.appendChild(bulletList(block.list)); }
      host.appendChild(card);
    });
  }

  function renderEmlHelp() {
    var host = clear($('#eml-help-body'));
    var help = i18n.content.emlHelp;
    paragraphs(help.intro).forEach(function (p) { host.appendChild(p); });

    help.clients.forEach(function (client) {
      host.appendChild(el('h3', { text: pick(client.name) }));
      host.appendChild(el('ol', {}, client.steps.map(function (step) {
        return el('li', { text: pick(step) });
      })));
      if (client.note) {
        host.appendChild(el('p', { cls: 'note', text: pick(client.note) }));
      }
    });
    host.appendChild(el('p', { cls: 'note note-warn', text: pick(help.outro) }));
  }

  function renderPrivacy() {
    var host = clear($('#privacy-body'));
    i18n.content.privacy.forEach(function (block) {
      var card = el('div', { cls: 'card' }, [el('h2', { text: pick(block.h) })]);
      paragraphs(block.p).forEach(function (p) { card.appendChild(p); });
      if (block.list) { card.appendChild(bulletList(block.list)); }
      host.appendChild(card);
    });
  }

  function renderSources() {
    var host = clear($('#sources-body'));
    var table = el('table', {}, [
      el('thead', {}, [el('tr', {}, [
        el('th', { text: i18n.lang === 'bg' ? 'Източник' : 'Source' }),
        el('th', { text: i18n.lang === 'bg' ? 'Организация' : 'Organization' }),
        el('th', { text: i18n.lang === 'bg' ? 'За какво се използва' : 'What it supports' })
      ])])
    ]);
    var body = el('tbody');
    i18n.content.sources.forEach(function (source) {
      body.appendChild(el('tr', {}, [
        el('td', {}, [el('a', {
          text: source.title,
          attrs: { href: source.url, rel: 'noreferrer noopener', target: '_blank' }
        })]),
        el('td', { text: source.org }),
        el('td', { text: pick(source.use) })
      ]));
    });
    table.appendChild(body);
    host.appendChild(el('div', { cls: 'table-wrap' }, [table]));
  }

  function renderGuide() {
    var host = clear($('#guide-body'));
    var questions = ['guide.q1', 'guide.q2', 'guide.q3', 'guide.q4', 'guide.q5', 'guide.q6', 'guide.q7', 'guide.q8', 'guide.q9'];
    i18n.content.guide.forEach(function (topic) {
      var body = el('div', { cls: 'guide-body' });
      questions.forEach(function (key, index) {
        body.appendChild(el('h5', { text: t(key) }));
        body.appendChild(el('p', { text: pick(topic['q' + (index + 1)]) }));
      });
      host.appendChild(el('details', { cls: 'guide-topic', attrs: { id: 'guide-' + topic.id } }, [
        el('summary', { text: pick(topic.title) }),
        body
      ]));
    });
  }

  function renderGlossary() {
    var host = clear($('#glossary-body'));
    var filterValue = ($('#glossary-filter') && $('#glossary-filter').value || '').toLowerCase().trim();
    var shown = 0;
    i18n.content.glossary.forEach(function (entry) {
      var term = pick(entry.term);
      var definition = pick(entry.def);
      if (filterValue && (term + ' ' + definition).toLowerCase().indexOf(filterValue) === -1) { return; }
      shown++;
      host.appendChild(el('div', { cls: 'glossary-item' }, [
        el('p', { cls: 'glossary-term', text: term }),
        el('p', { cls: 'glossary-def', text: definition })
      ]));
    });
    if (!shown) { host.appendChild(el('p', { text: t('glossary.empty') })); }
  }

  function renderChecklists() {
    var host = clear($('#checklists-body'));
    i18n.content.checklists.forEach(function (list) {
      var counter = el('p', { cls: 'field-note' });
      var items = el('ul', { cls: 'checklist' });

      function updateCount() {
        var boxes = Array.prototype.slice.call(items.querySelectorAll('input'));
        var done = boxes.filter(function (b) { return b.checked; }).length;
        counter.textContent = t('checklists.progress') + ': ' + done + ' / ' + boxes.length;
      }

      list.items.forEach(function (item, index) {
        var id = 'chk-' + list.id + '-' + index;
        items.appendChild(el('li', {}, [
          el('input', { attrs: { type: 'checkbox', id: id }, on: { change: updateCount } }),
          el('label', { text: pick(item), attrs: { for: id } })
        ]));
      });

      var card = el('section', { cls: 'card', attrs: { id: 'checklist-' + list.id } }, [
        el('h2', { text: pick(list.title) }),
        el('p', { text: pick(list.intro) }),
        items,
        counter
      ]);
      host.appendChild(card);
      updateCount();
    });
  }

  function renderTrees() {
    var host = clear($('#trees-body'));
    var picker = el('div', { cls: 'picker', attrs: { role: 'tablist' } });
    var stage = el('div');
    var buttons = [];

    function open(index) {
      buttons.forEach(function (b, i) {
        b.classList.toggle('is-current', i === index);
        b.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      clear(stage).appendChild(renderTree(i18n.content.trees[index]));
      state.treeIndex = index;
    }

    i18n.content.trees.forEach(function (tree, index) {
      var button = el('button', {
        cls: 'picker-btn', text: pick(tree.title),
        attrs: { type: 'button', role: 'tab' },
        on: { click: function () { open(index); } }
      });
      buttons.push(button);
      picker.appendChild(button);
    });

    host.appendChild(el('p', { cls: 'field-note', text: t('trees.pick') }));
    host.appendChild(picker);
    host.appendChild(stage);
    open(Math.min(state.treeIndex || 0, i18n.content.trees.length - 1));
  }

  function renderTree(tree) {
    var container = el('section', { cls: 'card' }, [el('h2', { text: pick(tree.title) })]);
    var stage = el('div', { cls: 'tree-step' });
    container.appendChild(stage);

    function draw(nodeId, history) {
      clear(stage);
      if (history.length) {
        stage.appendChild(el('p', { cls: 'tree-path', text: history.map(function (h) { return pick(h); }).join('  >  ') }));
      }
      var node = tree.nodes[nodeId];
      stage.appendChild(el('p', { cls: 'tree-q', text: pick(node.q) }));
      var actions = el('div', { cls: 'tree-actions' });
      node.options.forEach(function (option) {
        actions.appendChild(el('button', {
          cls: 'btn',
          text: pick(option.label),
          attrs: { type: 'button' },
          on: {
            click: function () {
              var nextHistory = history.concat([option.label]);
              if (option.outcome) { drawOutcome(option.outcome, nextHistory); }
              else { draw(option.next, nextHistory); }
            }
          }
        }));
      });
      stage.appendChild(actions);
      if (history.length) {
        stage.appendChild(el('p', {}, [el('button', {
          cls: 'btn btn-quiet btn-small', text: t('trees.restart'), attrs: { type: 'button' },
          on: { click: function () { draw(tree.start, []); } }
        })]));
      }
    }

    function drawOutcome(outcomeId, history) {
      clear(stage);
      var outcome = tree.outcomes[outcomeId];
      stage.appendChild(el('p', { cls: 'tree-path', text: history.map(function (h) { return pick(h); }).join('  >  ') }));
      var box = el('div', { cls: 'tree-outcome' }, [
        el('h3', { text: pick(outcome.title) }),
        el('ol', {}, outcome.steps.map(function (step) { return el('li', { text: pick(step) }); }))
      ]);
      stage.appendChild(box);
      stage.appendChild(el('p', {}, [el('button', {
        cls: 'btn', text: t('trees.restart'), attrs: { type: 'button' },
        on: { click: function () { draw(tree.start, []); } }
      })]));
    }

    draw(tree.start, []);
    return container;
  }

  SPDT.app = {
    state: state,
    buildRailSub: buildRailSub,
    el: el,
    clear: clear,
    $: $,
    $$: $$,
    paragraphs: paragraphs,
    bulletList: bulletList,
    show: show,
    readHash: readHash,
    setLanguage: setLanguage,
    applyStrings: applyStrings,
    setNetworkState: setNetworkState,
    renderStatic: function () {
      renderHome();
      renderEmlHelp();
      renderPrivacy();
      renderSources();
      renderGuide();
      renderGlossary();
      renderChecklists();
      renderTrees();
    },
    renderGlossary: renderGlossary,
    VIEWS: VIEWS
  };

  /* renderAll is completed in the second half of this file. */
  function renderAll() {
    if (SPDT.app.renderDynamic) { SPDT.app.renderDynamic(); }
    SPDT.app.renderStatic();
    buildRailSub(state.view);
  }
  SPDT.app.renderAll = renderAll;

})(window.SPDT);

/* ------------------------------------------------------------------
   Interactive sections: email analysis, domain check, assessment, plan.
   ------------------------------------------------------------------ */

(function (SPDT) {
  'use strict';

  var i18n = SPDT.i18n;
  var t = i18n.t;
  var pick = i18n.pick;
  var app = SPDT.app;
  var state = app.state;
  var el = app.el;
  var clear = app.clear;
  var $ = app.$;
  var $$ = app.$$;

  var MAX_BYTES = 25 * 1024 * 1024;

  function pillFor(weight) {
    if (weight >= 4) { return 'pill pill-alert'; }
    if (weight >= 2) { return 'pill pill-warn'; }
    return 'pill pill-neutral';
  }

  function formatSize(bytes) {
    if (!bytes && bytes !== 0) { return '-'; }
    if (bytes < 1024) { return bytes + ' B'; }
    if (bytes < 1024 * 1024) { return (bytes / 1024).toFixed(1) + ' KB'; }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function kvRow(term, value) {
    return el('div', {}, [
      el('dt', { text: term }),
      el('dd', { text: value === null || value === undefined || value === '' ? t('detail.notfound') : String(value) })
    ]);
  }

  function detailsBlock(title, content, open) {
    return el('details', { cls: 'panel disclosure', attrs: open ? { open: 'open' } : {} }, [
      el('summary', { text: title }),
      el('div', { cls: 'disclosure-body' }, content)
    ]);
  }

  /* =================================================================
     Email analysis rendering
     ================================================================= */

  function renderAnalysis() {
    var host = clear($('#eml-result'));
    if (!state.analysis) { return; }
    var a = state.analysis;

    /* --- verdict --- */
    var verdict = el('section', { cls: 'verdict is-' + a.verdict }, [
      el('p', { cls: 'verdict-label', text: t('verdict.label') }),
      el('h2', { cls: 'verdict-title', text: t('verdict.' + a.verdict) }),
      el('p', { cls: 'verdict-caveat', text: t('verdict.caveat') }),
      el('p', { cls: 'field-note', text: t('verdict.score') + ': ' + a.score })
    ]);
    host.appendChild(verdict);

    /* --- reasons --- */
    var reasons = el('ul', { cls: 'reasons' });
    if (!a.indicators.length) {
      reasons.appendChild(el('li', {}, [
        el('span', { cls: 'pill pill-ok', text: '0' }),
        el('div', { cls: 'reason-text' }, [el('span', { cls: 'reason-title', text: t('verdict.noreasons') })])
      ]));
    }
    a.indicators.forEach(function (indicator) {
      var info = i18n.content.indicators[indicator.id];
      var text = el('div', { cls: 'reason-text' }, [
        el('span', { cls: 'reason-title', text: info ? pick(info.title) : indicator.id }),
        el('p', { cls: 'reason-detail', text: info ? pick(info.detail) : '' })
      ]);
      indicator.evidence.slice(0, 6).forEach(function (item) {
        text.appendChild(el('code', { cls: 'reason-evidence', text: item }));
      });
      if (indicator.evidence.length > 6) {
        text.appendChild(el('p', { cls: 'reason-limit', text: '+ ' + (indicator.evidence.length - 6) }));
      }
      if (info) {
        text.appendChild(el('p', { cls: 'reason-limit', text: t('limitation') + ': ' + pick(info.limit) }));
      }
      reasons.appendChild(el('li', {}, [
        el('span', { cls: pillFor(indicator.weight), text: '+' + indicator.weight }),
        text
      ]));
    });
    host.appendChild(el('section', {}, [el('h3', { text: t('verdict.reasons') }), reasons]));

    /* --- next steps --- */
    var steps = i18n.content.nextSteps[a.verdict] || [];
    host.appendChild(el('section', { cls: 'next-steps' }, [
      el('h3', { text: t('verdict.next') }),
      el('ul', {}, steps.map(function (step) { return el('li', { text: pick(step) }); }))
    ]));

    /* --- headers --- */
    var headerList = el('dl', { cls: 'kv' }, [
      kvRow('From', a.from ? (a.from.display ? a.from.display + ' <' + a.from.address + '>' : a.from.address) : ''),
      kvRow('Sender', a.sender.length ? a.sender[0].address : ''),
      kvRow('Reply-To', a.replyTo.length ? a.replyTo[0].address : ''),
      kvRow('Return-Path', a.returnPath.length ? a.returnPath[0].address : ''),
      kvRow('To', a.to.map(function (x) { return x.address; }).join(', ')),
      kvRow('Subject', a.subject),
      kvRow('Date', a.date),
      kvRow('Message-ID', a.messageId)
    ]);
    host.appendChild(detailsBlock(t('detail.headers'), [headerList], true));

    /* --- authentication --- */
    var authContent = [];
    if (!a.auth.present) {
      authContent.push(el('p', { cls: 'note', text: t('auth.none') }));
    } else {
      var authList = el('dl', { cls: 'kv' });
      ['spf', 'dkim', 'dmarc', 'arc'].forEach(function (method) {
        var entry = a.auth[method];
        authList.appendChild(kvRow(method.toUpperCase(),
          entry ? entry.result + (entry.domain ? '  (' + entry.domain + ')' : '') + (entry.smtp ? '  (' + entry.smtp + ')' : '') : t('detail.notfound')));
      });
      if (a.auth.servers.length) { authList.appendChild(kvRow('authserv-id', a.auth.servers.join(', '))); }
      authContent.push(authList);
      authContent.push(el('p', { cls: 'note', text: t('auth.trust') }));
    }
    if (a.receivedSpf) { authContent.push(el('p', { cls: 'field-note', text: 'Received-SPF: ' + a.receivedSpf.result })); }
    if (a.dkimSignatures.length) {
      authContent.push(el('p', { cls: 'field-note', text: 'DKIM-Signature: ' + a.dkimSignatures.map(function (s) {
        return 'd=' + (s.domain || '?') + ' s=' + (s.selector || '?');
      }).join('   ') }));
    }
    if (a.arcPresent) { authContent.push(el('p', { cls: 'field-note', text: 'ARC-Seal: ' + a.arcCount })); }
    host.appendChild(detailsBlock(t('detail.auth'), authContent, true));

    /* --- routing --- */
    var routingRows = a.received.map(function (hop, index) {
      return el('tr', {}, [
        el('td', { text: String(a.received.length - index) }),
        el('td', { cls: 'mono', text: hop.from || '-' }),
        el('td', { cls: 'mono', text: hop.by || '-' }),
        el('td', { cls: 'mono', text: hop.ip ? hop.ip + (hop.privateIp ? ' (private)' : '') : '-' }),
        el('td', { text: hop.date ? hop.date.toISOString().replace('T', ' ').slice(0, 19) : '-' })
      ]);
    });
    host.appendChild(detailsBlock(t('detail.routing'), [
      el('p', { cls: 'field-note', text: t('routing.hops') + ': ' + a.received.length }),
      a.received.length ? el('div', { cls: 'table-wrap' }, [
        el('table', {}, [
          el('thead', {}, [el('tr', {}, ['#', 'from', 'by', 'ip', 'date'].map(function (h) { return el('th', { text: h }); }))]),
          el('tbody', {}, routingRows)
        ])
      ]) : el('p', { text: t('detail.none') }),
      el('p', { cls: 'note', text: t('routing.note') })
    ]));

    /* --- urls --- */
    var urlRows = a.urls.map(function (u) {
      var flags = el('td');
      u.flags.forEach(function (f) {
        var info = i18n.content.indicators[f];
        flags.appendChild(el('span', { cls: 'pill pill-warn', text: info ? pick(info.title) : f }));
        flags.appendChild(document.createTextNode(' '));
      });
      if (!u.flags.length) { flags.textContent = '-'; }
      return el('tr', {}, [
        el('td', { cls: 'mono', text: u.url }),
        el('td', { cls: 'mono', text: (u.host || '-') + (u.decodedHost ? '  = ' + u.decodedHost : '') }),
        flags
      ]);
    });
    host.appendChild(detailsBlock(t('detail.urls') + ' (' + a.urls.length + ')', [
      el('p', { cls: 'note note-warn', text: t('urls.noopen') }),
      a.urls.length ? el('div', { cls: 'table-wrap' }, [
        el('table', {}, [
          el('thead', {}, [el('tr', {}, [
            el('th', { text: t('urls.col.url') }),
            el('th', { text: t('urls.col.host') }),
            el('th', { text: t('urls.col.flags') })
          ])]),
          el('tbody', {}, urlRows)
        ])
      ]) : el('p', { text: t('detail.none') })
    ]));

    /* --- attachments --- */
    var attRows = a.attachments.map(function (att) {
      var flags = el('td');
      att.flags.forEach(function (f) {
        var info = i18n.content.indicators[f];
        flags.appendChild(el('span', { cls: 'pill pill-alert', text: info ? pick(info.title) : f }));
        flags.appendChild(document.createTextNode(' '));
      });
      if (!att.flags.length) { flags.textContent = '-'; }
      return el('tr', {}, [
        el('td', { cls: 'mono', text: att.name || '-' }),
        el('td', { cls: 'mono', text: att.contentType }),
        el('td', { text: formatSize(att.size) }),
        flags
      ]);
    });
    host.appendChild(detailsBlock(t('detail.attachments') + ' (' + a.attachments.length + ')', [
      el('p', { cls: 'note note-warn', text: t('att.noopen') }),
      a.attachments.length ? el('div', { cls: 'table-wrap' }, [
        el('table', {}, [
          el('thead', {}, [el('tr', {}, [
            el('th', { text: t('att.col.name') }),
            el('th', { text: t('att.col.type') }),
            el('th', { text: t('att.col.size') }),
            el('th', { text: t('att.col.flags') })
          ])]),
          el('tbody', {}, attRows)
        ])
      ]) : el('p', { text: t('detail.none') })
    ]));

    /* --- mime structure --- */
    host.appendChild(detailsBlock(t('detail.mime'), [
      el('div', { cls: 'table-wrap' }, [
        el('table', {}, [
          el('thead', {}, [el('tr', {}, ['content-type', 'encoding', 'disposition', 'filename', 'size'].map(function (h) {
            return el('th', { text: h });
          }))]),
          el('tbody', {}, a.parts.map(function (part) {
            return el('tr', {}, [
              el('td', { cls: 'mono', text: part.contentType }),
              el('td', { cls: 'mono', text: part.encoding }),
              el('td', { cls: 'mono', text: part.disposition || '-' }),
              el('td', { cls: 'mono', text: part.filename || '-' }),
              el('td', { text: formatSize(part.size) })
            ]);
          }))
        ])
      ])
    ]));

    /* --- sanitized body --- */
    host.appendChild(detailsBlock(t('detail.body'), [
      el('pre', { cls: 'reason-evidence', text: a.bodyText.slice(0, 8000) || t('detail.none') })
    ]));

    /* --- raw headers --- */
    host.appendChild(detailsBlock(t('detail.raw'), [
      el('pre', { cls: 'reason-evidence', text: state.message.headers.map(function (h) {
        return h.name + ': ' + h.raw;
      }).join('\n') })
    ]));

    /* --- actions --- */
    host.appendChild(el('div', { cls: 'form-actions' }, [
      el('button', {
        cls: 'btn', text: t('analyze.print'), attrs: { type: 'button' },
        on: { click: function () { window.print(); } }
      }),
      el('button', {
        cls: 'btn btn-quiet', text: t('analyze.clear'), attrs: { type: 'button' },
        on: {
          click: function () {
            state.message = null; state.analysis = null; state.fileName = '';
            clear($('#eml-result'));
            renderDomainFromEml();
          }
        }
      })
    ]));
  }

  /* =================================================================
     File handling
     ================================================================= */

  function showFileError(key) {
    var box = $('#eml-error');
    box.textContent = t(key);
    box.hidden = false;
  }

  function clearFileError() {
    var box = $('#eml-error');
    box.textContent = '';
    box.hidden = true;
  }

  function handleFile(file) {
    clearFileError();
    if (!file) { return; }
    if (!/\.eml$/i.test(file.name)) { showFileError('analyze.err.ext'); return; }
    if (file.size > MAX_BYTES) { showFileError('analyze.err.size'); return; }

    var reader = new FileReader();
    reader.onerror = function () { showFileError('analyze.err.read'); };
    reader.onload = function () {
      try {
        var bytes = new Uint8Array(reader.result);
        state.message = SPDT.eml.fromBytes(bytes);
        state.analysis = SPDT.eml.analyze(state.message);
        state.fileName = file.name;
        renderAnalysis();
        renderDomainFromEml();
      } catch (error) {
        state.message = null;
        state.analysis = null;
        clear($('#eml-result'));
        showFileError('analyze.err.parse');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function bindFileInputs() {
    var zone = $('#drop-zone');
    var input = $('#eml-input');
    if (!zone || !input) { return; }

    $('#eml-pick').addEventListener('click', function (event) {
      event.stopPropagation();
      input.click();
    });
    zone.addEventListener('click', function () { input.click(); });
    zone.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); input.click(); }
    });
    input.addEventListener('change', function () {
      handleFile(input.files && input.files[0]);
      input.value = '';
    });

    ['dragenter', 'dragover'].forEach(function (name) {
      zone.addEventListener(name, function (event) {
        event.preventDefault();
        zone.classList.add('is-over');
      });
    });
    ['dragleave', 'drop'].forEach(function (name) {
      zone.addEventListener(name, function (event) {
        event.preventDefault();
        zone.classList.remove('is-over');
      });
    });
    zone.addEventListener('drop', function (event) {
      var files = event.dataTransfer && event.dataTransfer.files;
      handleFile(files && files[0]);
    });
  }

  /* =================================================================
     Domain check
     ================================================================= */

  function renderDomainFromEml() {
    var panel = $('#domain-privacy-panel');
    var existing = document.getElementById('domain-from-eml');
    if (existing) { existing.parentNode.removeChild(existing); }
    if (!state.analysis || !state.analysis.fromDomain) { return; }

    var domain = state.analysis.fromDomain;
    var selector = state.analysis.dkimSignatures.length ? state.analysis.dkimSignatures[0].selector : '';

    var card = el('div', { cls: 'panel', attrs: { id: 'domain-from-eml' } }, [
      el('h2', { cls: 'panel-title', text: t('domain.fromeml.title') }),
      el('p', {}, [el('code', { cls: 'mono', text: domain })]),
      selector ? el('p', { cls: 'field-note', text: 'DKIM selector: ' + selector }) : null,
      el('p', { cls: 'note', text: t('domain.fromeml.note') }),
      el('button', {
        cls: 'btn', text: t('domain.fromeml.use'), attrs: { type: 'button' },
        on: {
          click: function () {
            $('#online-domain').value = domain;
            if (selector) { $('#online-selectors').value = selector; }
            var radio = document.querySelector('input[name="domain-mode"][value="online"]');
            radio.checked = true;
            switchDomainMode('online');
            updateConsentPreview();
            $('#online-domain').focus();
          }
        }
      })
    ]);
    panel.parentNode.insertBefore(card, panel);
  }

  function switchDomainMode(mode) {
    $('#domain-privacy-panel').hidden = mode !== 'privacy';
    $('#domain-online-panel').hidden = mode !== 'online';
  }

  function readSelectors() {
    return String($('#online-selectors').value || '').split(',').map(function (s) {
      return s.trim().toLowerCase();
    }).filter(Boolean);
  }

  /* One query per row: the DNS name, then in smaller type what it checks. */
  function queryList(plan) {
    return el('ul', { cls: 'query-list' }, plan.map(function (p) {
      var note = i18n.content.queryPurpose[p.purpose];
      return el('li', {}, [
        el('span', { cls: 'query-name', text: p.name + '  ' + p.type }),
        note ? el('span', { cls: 'query-why', text: pick(note) }) : null
      ]);
    }));
  }

  function updateConsentPreview() {
    var box = clear($('#consent-queries'));
    var plan = SPDT.domain.queryPlan($('#online-domain').value, readSelectors());
    if (plan.length) { box.appendChild(queryList(plan)); }
    else { box.textContent = t('domain.err.domain'); }

    var consentBody = clear($('#consent-body'));
    var resolverId = $('#online-resolver').value;
    var resolver = SPDT.domain.RESOLVERS[resolverId];
    var lines = i18n.lang === 'bg' ? [
      'Изпраща се само име на домейн и тип DNS запис.',
      'Не се изпраща съдържание на имейл, заглавни полета, адреси на получатели или отговори от въпросника.',
      'Заявките отиват към ' + resolver.label + ', който вижда заявените имена и мрежовия адрес, от който идва заявката.',
      'Заявките се изпращат по DNS-over-HTTPS. Не се използва друга услуга.'
    ] : [
      'Only a domain name and a DNS record type are sent.',
      'No email content, header fields, recipient addresses or questionnaire answers are sent.',
      'The queries go to ' + resolver.label + ', which can see the queried names and the network address the request comes from.',
      'The queries are sent over DNS over HTTPS. No other service is used.'
    ];
    if ($('#online-expand').checked) {
      lines.push(i18n.lang === 'bg'
        ? 'Проследяването на включванията изпраща и имената на домейните, посочени в механизмите include и redirect.'
        : 'Include following additionally sends the domain names named in the include and redirect mechanisms.');
    }
    consentBody.appendChild(el('ul', {}, lines.map(function (line) { return el('li', { text: line }); })));
    consentBody.appendChild(el('p', { cls: 'field-note' }, [
      el('a', { text: resolver.privacy, attrs: { href: resolver.privacy, rel: 'noreferrer noopener', target: '_blank' } })
    ]));
  }

  function showDomainError(key) {
    var box = $('#domain-error');
    box.textContent = t(key);
    box.hidden = false;
  }

  function runManual() {
    var box = $('#domain-error');
    if (box) { box.hidden = true; }
    var values = {
      spf: $('#manual-spf').value.trim(),
      dmarc: $('#manual-dmarc').value.trim(),
      dkim: $('#manual-dkim').value.trim(),
      mtasts: $('#manual-mtasts').value.trim(),
      tlsrpt: $('#manual-tlsrpt').value.trim(),
      bimi: $('#manual-bimi').value.trim()
    };
    var any = Object.keys(values).some(function (k) { return values[k]; });
    if (!any) {
      var host = clear($('#domain-result'));
      host.appendChild(el('p', { cls: 'form-error', text: t('domain.err.empty') }));
      return;
    }
    var D = SPDT.domain;
    state.domainResult = D.assess({
      domain: $('#manual-domain').value.trim(),
      mode: 'privacy',
      checked: { spf: true, dmarc: true, mtasts: true, tlsrpt: true, bimi: true, dkim: !!values.dkim },
      spf: D.parseSpf(values.spf),
      dmarc: D.parseDmarc(values.dmarc),
      dkim: D.parseDkim(values.dkim),
      mtasts: D.parseMtaSts(values.mtasts),
      tlsrpt: D.parseTlsRpt(values.tlsrpt),
      bimi: D.parseBimi(values.bimi)
    });
    renderDomainResult();
  }

  function runOnline() {
    if (state.busy) { return; }
    var domain = $('#online-domain').value.trim();
    var normalized = SPDT.domain.normalizeDomain(domain);
    if (!normalized.valid) { showDomainError('domain.err.domain'); return; }
    $('#domain-error').hidden = true;

    state.busy = true;
    $('#online-run').disabled = true;
    var host = clear($('#domain-result'));
    var progress = el('p', { cls: 'spinner-note', text: t('domain.online.running') });
    host.appendChild(progress);
    app.setNetworkState(true);

    SPDT.domain.runOnline({
      domain: domain,
      selectors: readSelectors(),
      resolver: $('#online-resolver').value,
      expandSpf: $('#online-expand').checked,
      onQuery: function (name, type) { progress.textContent = t('domain.online.running') + '  ' + name + ' ' + type; }
    }).then(function (result) {
      state.domainResult = result;
      renderDomainResult();
    }).catch(function () {
      clear($('#domain-result'));
      showDomainError('domain.err.network');
    }).then(function () {
      state.busy = false;
      $('#online-run').disabled = !$('#consent-check').checked;
      app.setNetworkState(false, t('net.done'));
    });
  }

  var STATE_PILL = {
    configured: 'pill pill-ok', partial: 'pill pill-warn', missing: 'pill pill-alert',
    invalid: 'pill pill-alert', unknown: 'pill pill-neutral', notchecked: 'pill pill-neutral'
  };

  function controlRow(name, label, result) {
    var stateKey = result.states[name];
    var record = result.records[name];
    var findings = el('td');
    if (record && record.issues && record.issues.length) {
      record.issues.forEach(function (issue) {
        var text = i18n.content.domainIssues[issue];
        findings.appendChild(el('p', { cls: 'reason-detail', text: text ? pick(text) : issue }));
      });
    }
    if (name === 'dkim' && stateKey === 'unknown') {
      findings.appendChild(el('p', { cls: 'reason-detail', text: pick(i18n.content.domainNotes.dkimUnknown) }));
    }
    if (name === 'mtasts' && record && record.present) {
      findings.appendChild(el('p', { cls: 'reason-detail', text: pick(i18n.content.domainNotes.mtastsPolicy) }));
    }
    if (name === 'bimi') {
      findings.appendChild(el('p', { cls: 'reason-detail', text: pick(i18n.content.domainNotes.bimiInfo) }));
    }
    if (!findings.childNodes.length) { findings.textContent = '-'; }

    return el('tr', {}, [
      el('td', { text: label }),
      el('td', {}, [el('span', { cls: STATE_PILL[stateKey] || 'pill pill-neutral', text: t('state.' + stateKey) })]),
      el('td', { cls: 'mono', text: record && record.raw ? record.raw : '-' }),
      findings
    ]);
  }

  function renderDomainResult() {
    var host = clear($('#domain-result'));
    var result = state.domainResult;
    if (!result) { return; }
    var notes = i18n.content.domainNotes;

    var postureClass = result.posture === 'strong' ? 'is-low' : result.posture === 'intermediate' ? 'is-moderate' : 'is-high';
    host.appendChild(el('section', { cls: 'verdict ' + postureClass }, [
      el('p', { cls: 'verdict-label', text: t('domain.subtitle') + (result.domain ? ': ' + result.domain : '') }),
      el('h2', { cls: 'verdict-title', text: result.posture === 'unknown' ? t('state.unknown') : t('domain.posture.' + result.posture) }),
      el('p', { cls: 'verdict-caveat', text: result.points + ' ' + t('domain.posture.points') + ' ' + result.max })
    ]));

    var rows = [
      controlRow('spf', 'SPF', result),
      controlRow('dmarc', 'DMARC', result),
      controlRow('dkim', 'DKIM', result),
      controlRow('mtasts', 'MTA-STS', result),
      controlRow('tlsrpt', 'TLS-RPT', result),
      controlRow('bimi', 'BIMI', result)
    ];
    host.appendChild(el('div', { cls: 'table-wrap' }, [
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [
          el('th', { text: t('domain.result.control') }),
          el('th', { text: t('domain.result.state') }),
          el('th', { text: t('domain.result.record') }),
          el('th', { text: t('domain.result.finding') })
        ])]),
        el('tbody', {}, rows)
      ])
    ]));

    /* --- targeted recommendations --- */
    var advice = [];
    var spf = result.records.spf;
    var dmarc = result.records.dmarc;
    if (!spf.present) { advice.push(notes.spfMissing); }
    else if (spf.terminalQualifier === '~') { advice.push(notes.spfSoft); }
    else if (spf.terminalQualifier === '-') { advice.push(notes.spfHard); }
    if (!dmarc.present) { advice.push(notes.dmarcMissing); }
    else {
      if (dmarc.testMode) { advice.push(notes.dmarcTest); }
      if (dmarc.effectivePolicy === 'none') { advice.push(notes.dmarcNone); }
      else if (dmarc.effectivePolicy === 'quarantine') { advice.push(notes.dmarcQuarantine); }
      else if (dmarc.effectivePolicy === 'reject') { advice.push(notes.dmarcReject); }
      if (dmarc.externalReporting) { advice.push(notes.dmarcExternal); }
    }
    if (result.multipleSpf) { advice.push(notes.multipleSpf); }
    if (result.states.dkim === 'unknown') { advice.push(notes.dkimUnknown); }

    host.appendChild(el('section', { cls: 'next-steps' }, [
      el('h3', { text: t('domain.recommend') }),
      el('ul', {}, advice.map(function (item) { return el('li', { text: pick(item) }); }))
    ]));

    /* --- SPF include chain --- */
    if (result.spfChain) {
      var chainLines = [];
      (function walk(node, depth) {
        chainLines.push(new Array(depth + 1).join('    ') + node.domain + '  (' + node.ownLookups + ')');
        (node.children || []).forEach(function (child) { walk(child, depth + 1); });
      })(result.spfChain, 0);
      host.appendChild(detailsBlock('SPF include chain: ' + result.spfChain.lookups, [
        el('p', { cls: 'field-note', text: pick(notes.spfChain) }),
        el('pre', { cls: 'reason-evidence', text: chainLines.join('\n') })
      ]));
    }

    /* --- transparency of the calculation --- */
    host.appendChild(detailsBlock(t('domain.posture.method'), [
      el('div', { cls: 'table-wrap' }, [
        el('table', {}, [
          el('thead', {}, [el('tr', {}, ['control', 'points', 'available', 'note'].map(function (h) { return el('th', { text: h }); }))]),
          el('tbody', {}, result.breakdown.map(function (row) {
            return el('tr', {}, [
              el('td', { text: row.control }),
              el('td', { text: String(row.earned) }),
              el('td', { text: String(row.available) }),
              el('td', { cls: 'mono', text: row.note })
            ]);
          }))
        ])
      ]),
      el('p', { cls: 'field-note', text: 'ratio ' + result.ratio.toFixed(2) + ', enforcing ' + (result.enforcing ? 'yes' : 'no') }),
      el('p', { cls: 'field-note', text: i18n.lang === 'bg'
        ? 'Пълната таблица с точките е в docs/METHODOLOGY.md.'
        : 'The full point table is in docs/METHODOLOGY.md.' })
    ]));

    if (result.mx && result.mx.length) {
      host.appendChild(detailsBlock('MX', [el('pre', { cls: 'reason-evidence', text: result.mx.join('\n') })]));
    }
    if (result.queryPlan) {
      host.appendChild(detailsBlock(t('domain.consent.willquery'), [
        el('p', { cls: 'field-note', text: t('domain.consent.whatfor') }),
        queryList(result.queryPlan)
      ]));
    }
  }

  /* =================================================================
     Organizational assessment
     ================================================================= */

  function renderQuestions() {
    var host = clear($('#assess-questions'));
    SPDT.rules.QUESTIONS.forEach(function (question) {
      var options = el('div', { cls: 'options' });
      question.options.forEach(function (option) {
        var id = 'q-' + question.id + '-' + option.value;
        var isMulti = question.type === 'multi';
        var input = el('input', {
          attrs: {
            type: isMulti ? 'checkbox' : 'radio',
            name: question.id,
            value: option.value,
            id: id
          },
          on: {
            change: function (event) {
              if (isMulti) {
                var current = state.answers[question.id] || [];
                if (event.target.checked) { current = current.concat([option.value]); }
                else { current = current.filter(function (v) { return v !== option.value; }); }
                state.answers[question.id] = current;
              } else {
                state.answers[question.id] = option.value;
              }
            }
          }
        });
        if (isMulti) {
          if ((state.answers[question.id] || []).indexOf(option.value) > -1) { input.checked = true; }
        } else if (state.answers[question.id] === option.value) {
          input.checked = true;
        }
        options.appendChild(el('label', { cls: 'option', attrs: { for: id } }, [
          input, el('span', { text: pick(option.label) })
        ]));
      });

      var fieldset = el('fieldset', {}, [
        el('legend', { cls: 'q-title', text: pick(question.title) }),
        question.help ? el('p', { cls: 'q-help', text: pick(question.help) }) : null,
        options
      ]);
      host.appendChild(el('div', { cls: 'question' }, [fieldset]));
    });
  }

  /* green / amber / red per dimension; higher risk or lower maturity = redder */
  var PROFILE_TONE = {
    exposure: { low: 'is-ok', medium: 'is-warn', high: 'is-alert' },
    maturity: { established: 'is-ok', developing: 'is-warn', initial: 'is-alert' },
    criticality: { low: 'is-ok', medium: 'is-warn', high: 'is-alert' },
    level: { P1: 'is-ok', P2: 'is-warn', P3: 'is-alert' }
  };

  function toneFor(dimension, key) {
    var map = PROFILE_TONE[dimension];
    return map && map[key] ? ' ' + map[key] : '';
  }

  function profileCell(titleKey, value, reasons, tone) {
    return el('div', { cls: 'profile-cell' + (tone || '') }, [
      el('h4', { text: t(titleKey) }),
      el('p', { cls: 'profile-value', text: value }),
      reasons && reasons.length
        ? el('p', { cls: 'profile-why', text: t('assess.result.because') + ': ' + reasons.map(function (r) { return pick(r); }).join('; ') })
        : null
    ]);
  }

  function renderProfile() {
    var host = clear($('#assess-result'));
    var profile = state.profile;
    if (!profile) { return; }
    var labels = SPDT.rules.LABELS;

    host.appendChild(el('h2', { text: t('assess.result.title') }));
    host.appendChild(el('div', { cls: 'profile-grid' }, [
      profileCell('assess.dim.exposure', pick(labels.exposure[profile.exposure]), profile.reasons.exposure, toneFor('exposure', profile.exposure)),
      profileCell('assess.dim.maturity', pick(labels.maturity[profile.maturity]) + ' (' + profile.maturityPoints + '/' + profile.maturityMax + ')', profile.reasons.maturity, toneFor('maturity', profile.maturity)),
      profileCell('assess.dim.criticality', pick(labels.criticality[profile.criticality]), profile.reasons.criticality, toneFor('criticality', profile.criticality)),
      profileCell('assess.dim.capacity', pick(labels.capacity[profile.capacity]), null),
      profileCell('assess.dim.finance', pick(labels.finance[profile.finance]), null),
      profileCell('assess.dim.level', pick(labels.level[profile.level]), null, toneFor('level', profile.level))
    ]));
    host.appendChild(el('p', {}, [
      el('a', { cls: 'btn btn-primary', text: t('assess.result.toplan'), attrs: { href: '#plan' } })
    ]));
  }

  /* =================================================================
     Action plan
     ================================================================= */

  function renderRecommendation(item) {
    var meta = el('div', { cls: 'rec-meta' }, [
      el('span', { cls: 'pill pill-info', text: t('plan.complexity') + ': ' + t(item.complexity) }),
      el('span', { cls: 'pill pill-neutral', text: t('plan.resource') + ': ' + t(item.resource) })
    ]);
    if (item.requires) {
      meta.appendChild(el('span', { cls: 'pill pill-warn', text: item.requires }));
    }
    return el('article', { cls: 'rec' }, [
      el('div', { cls: 'rec-head' }, [el('h4', { text: pick(item.title) })]),
      meta,
      el('dl', {}, [
        el('div', {}, [el('dt', { text: t('plan.why') }), el('dd', { text: pick(item.why) })]),
        el('div', {}, [el('dt', { text: t('plan.benefit') }), el('dd', { text: pick(item.benefit) })]),
        el('div', {}, [el('dt', { text: t('plan.prereq') }), el('dd', { text: pick(item.prereq) })]),
        el('div', {}, [el('dt', { text: t('plan.breaks') }), el('dd', { text: pick(item.breaks) })]),
        el('div', {}, [el('dt', { text: t('plan.verify') }), el('dd', { text: pick(item.verify) })])
      ])
    ]);
  }

  function renderPlan() {
    var host = clear($('#plan-body'));
    var plan = SPDT.rules.buildPlan(state.profile);

    host.appendChild(el('p', {
      cls: state.profile ? 'note' : 'note note-warn',
      text: state.profile ? t('plan.tailored') : t('plan.generic')
    }));

    [['first', 'plan.first'], ['next', 'plan.next'], ['extra', 'plan.extra']].forEach(function (pair) {
      if (!plan[pair[0]].length) { return; }
      host.appendChild(el('h2', { text: t(pair[1]) }));
      plan[pair[0]].forEach(function (item) { host.appendChild(renderRecommendation(item)); });
    });

    if (plan.deferred.length) {
      host.appendChild(el('h2', {
        text: i18n.lang === 'bg' ? 'Извън заявените възможности засега' : 'Outside the declared capacity for now'
      }));
      host.appendChild(el('p', {
        cls: 'note',
        text: i18n.lang === 'bg'
          ? 'Тези мерки изискват повече ресурс от посочения в оценката. Оставени са тук, за да се знае какво следва, ако възможностите се променят.'
          : 'These measures require more resource than the assessment declared. They are listed so that you know what comes next if your capacity changes.'
      }));
      plan.deferred.forEach(function (item) { host.appendChild(renderRecommendation(item)); });
    }
  }

  /* =================================================================
     Reset
     ================================================================= */

  function resetAll() {
    state.message = null;
    state.analysis = null;
    state.fileName = '';
    state.profile = null;
    state.answers = { roles: [] };
    state.domainResult = null;

    clear($('#eml-result'));
    clear($('#domain-result'));
    clear($('#assess-result'));
    var fromEml = document.getElementById('domain-from-eml');
    if (fromEml) { fromEml.parentNode.removeChild(fromEml); }

    ['manual-domain', 'manual-spf', 'manual-dmarc', 'manual-dkim', 'manual-mtasts', 'manual-tlsrpt',
      'manual-bimi', 'online-domain', 'online-selectors', 'glossary-filter'].forEach(function (id) {
      var node = document.getElementById(id);
      if (node) { node.value = ''; }
    });
    $('#online-expand').checked = false;
    $('#consent-check').checked = false;
    $('#online-run').disabled = true;
    $$('#assess-form input').forEach(function (input) { input.checked = false; });
    clearFileError();
    $('#domain-error').hidden = true;
    updateConsentPreview();
    renderPlan();
    app.renderStatic();
    app.setNetworkState(false, t('footer.reset.done'));
    window.setTimeout(function () { app.setNetworkState(false); }, 2500);
  }

  /* =================================================================
     Wiring
     ================================================================= */

  function renderDynamic() {
    renderQuestions();
    renderAnalysis();
    renderDomainResult();
    renderProfile();
    renderPlan();
    renderDomainFromEml();
    updateConsentPreview();
    var note = $('#selector-note');
    if (note) { note.textContent = t('domain.selector.note'); }
  }
  app.renderDynamic = renderDynamic;

  function init() {
    i18n.detect();
    app.applyStrings();
    app.renderStatic();
    renderDynamic();

    $$('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { app.setLanguage(btn.getAttribute('data-lang')); });
    });

    $('#menu-toggle').addEventListener('click', function () {
      var rail = $('#rail');
      var open = rail.classList.toggle('is-open');
      $('#menu-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    bindFileInputs();

    $$('input[name="domain-mode"]').forEach(function (radio) {
      radio.addEventListener('change', function () { switchDomainMode(radio.value); });
    });
    $('#manual-run').addEventListener('click', runManual);
    ['online-domain', 'online-selectors'].forEach(function (id) {
      $('#' + id).addEventListener('input', updateConsentPreview);
    });
    $('#online-resolver').addEventListener('change', updateConsentPreview);
    $('#online-expand').addEventListener('change', updateConsentPreview);
    $('#consent-check').addEventListener('change', function () {
      $('#online-run').disabled = !$('#consent-check').checked || state.busy;
    });
    $('#online-run').addEventListener('click', runOnline);

    $('#assess-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var missing = SPDT.rules.validate(state.answers);
      var errorBox = $('#assess-error');
      if (missing.length) {
        errorBox.textContent = t('assess.err.incomplete');
        errorBox.hidden = false;
        var first = document.querySelector('input[name="' + missing[0] + '"]');
        if (first) { first.focus(); }
        return;
      }
      errorBox.hidden = true;
      state.profile = SPDT.rules.buildProfile(state.answers);
      renderProfile();
      renderPlan();
      var resultBox = $('#assess-result');
      if (resultBox && typeof resultBox.scrollIntoView === 'function') {
        resultBox.scrollIntoView({ block: 'start' });
      }
    });
    $('#assess-reset').addEventListener('click', function () {
      state.answers = { roles: [] };
      state.profile = null;
      $$('#assess-form input').forEach(function (input) { input.checked = false; });
      clear($('#assess-result'));
      $('#assess-error').hidden = true;
      renderPlan();
    });

    $('#glossary-filter').addEventListener('input', app.renderGlossary);
    $('#global-reset').addEventListener('click', resetAll);

    window.addEventListener('hashchange', function () { app.show(app.readHash()); });
    app.show(app.readHash());
    app.setNetworkState(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window.SPDT);
