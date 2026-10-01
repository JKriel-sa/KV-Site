/* ==========================================================================
   Proposal generator — engine
   Reads window.PG_CONFIG (set by the per-service pg-<slug>.js) and drives the
   whole thing: intake → review → estimate → submit.

   Division of labour, and it matters: the *shared pricing skeleton* lives here
   and nowhere else. Each service config returns its own line items and the few
   multipliers only it can know (licence, rush base, volume). This file then
   does volume → rush → travel → licence → discount → tax → total → tiers, once,
   for all four. That mirrors _shared/00-global-spec.md §4, and it means a change
   to the skeleton is a change to one function rather than four.

   Two constraints shape the code:
   1. The CSP forbids inline styles and inline script. Nothing here writes a
      style attribute — state that CSS needs is carried on classes, and the
      progress bar is a real <progress> because it can't be a div with a width.
   2. Netlify's form detection reads the *static* HTML at deploy time. So the
      fields it stores are a fixed set declared in the page (see make-pages.py),
      and the variable part of the intake travels inside `summary`.
   ========================================================================== */
(function () {
  'use strict';

  var cfg   = window.PG_CONFIG;
  var mount = document.getElementById('pg-app');
  if (!cfg || !mount) return;

  var form = document.getElementById('pg-form');

  /* --- State ------------------------------------------------------------- */
  var state = {};
  var step  = 0;                 /* index into cfg.sections */
  var view  = 'form';            /* form | review | estimate | done */
  var est   = null;
  var mail  = null;

  var sections = cfg.sections;
  var TOTAL_STEPS = sections.length + 2;   /* + review + estimate */

  /* --- Small helpers ----------------------------------------------------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function money(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  /* "1 days" and "1 images" read as bugs even when the number is right, and an
     estimate that looks sloppy gets trusted less than one that doesn't. */
  function qty(n, unit) {
    if (n == null) return '—';
    if (!unit) return String(n);
    var one = (parseFloat(n) === 1);
    return n + ' ' + (one ? unit.replace(/s$/, '') : unit);
  }

  var toNum = function (v) {
    var n = parseFloat(v);
    return isFinite(n) ? n : null;
  };

  /* Accessors handed to each service's calc(), so a config never touches the
     raw state shape and "not sure" is impossible to mistake for a number. */
  var h = {
    val: function (id, d) {
      var v = state[id];
      return (v === undefined || v === '' || v === 'not_sure') ? (d !== undefined ? d : '') : v;
    },
    num: function (id, d) {
      var n = toNum(state[id]);
      return n === null ? (d !== undefined ? d : 0) : n;
    },
    bool: function (id) { return state[id] === true; },
    is:   function (id, v) { return state[id] === v; },
    has:  function (id, v) {
      var a = state[id];
      return Array.isArray(a) && a.indexOf(v) !== -1;
    },
    any:  function (id, list) {
      for (var i = 0; i < list.length; i++) if (h.has(id, list[i])) return true;
      return false;
    },
    unsure: function (id) {
      var v = state[id];
      return v === 'not_sure' || v === undefined || v === '';
    },
    pick: function (id, map, d) {
      var v = state[id];
      return (v !== undefined && map[v] !== undefined) ? map[v] : d;
    },
    ceil: Math.ceil,
    clamp: function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  };

  /* --- Field visibility -------------------------------------------------- */
  function shown(f) { return !f.when || f.when(state, h); }

  function fieldsOf(sec) {
    return sec.fields.filter(shown);
  }

  /* ======================================================================
     Rendering — fields
     ====================================================================== */
  function labelFor(f, id) {
    var lab = el('label', 'pgf__label');
    lab.setAttribute('for', id);
    lab.appendChild(document.createTextNode(f.label));
    if (!f.req) lab.appendChild(el('span', 'pgf__opt', 'optional'));
    return lab;
  }

  function renderField(f) {
    var wrap = el('div', 'pgf' + (f.half ? ' pgf--half' : '') + (f.type === 'bool' ? ' pgf--bool' : ''));
    wrap.dataset.field = f.id;
    var id = 'f_' + f.id;

    /* A lone boolean is its own label — a second one above it reads as a
       heading for a single checkbox, which screen readers announce twice. */
    if (f.type !== 'bool') wrap.appendChild(labelFor(f, id));
    if (f.help) wrap.appendChild(el('p', 'pgf__help', f.help));

    var node;

    if (f.type === 'select') {
      node = el('select', 'pgf__select');
      node.id = id;
      node.appendChild(new Option(f.placeholder || 'Choose…', ''));
      f.opts.forEach(function (o) {
        node.appendChild(new Option(o[1], o[0]));
      });
      if (f.unsure) node.appendChild(new Option("I'm not sure yet", 'not_sure'));
      node.value = state[f.id] || '';
      node.addEventListener('change', function () {
        state[f.id] = node.value;
        rerenderStep();          /* a select can gate other fields */
      });

    } else if (f.type === 'multi') {
      node = el('div', 'pgf__choices' + (f.opts.length > 3 ? ' pgf__choices--grid' : ''));
      node.id = id;
      node.setAttribute('role', 'group');
      node.setAttribute('aria-label', f.label);
      f.opts.forEach(function (o) {
        var lab = el('label', 'pgc');
        var box = document.createElement('input');
        box.type = 'checkbox';
        box.value = o[0];
        box.checked = h.has(f.id, o[0]);
        box.addEventListener('change', function () {
          var arr = Array.isArray(state[f.id]) ? state[f.id].slice() : [];
          var at = arr.indexOf(o[0]);
          if (box.checked && at === -1) arr.push(o[0]);
          if (!box.checked && at !== -1) arr.splice(at, 1);
          state[f.id] = arr;
          rerenderStep();
        });
        lab.appendChild(box);
        lab.appendChild(document.createTextNode(o[1]));
        node.appendChild(lab);
      });

    } else if (f.type === 'bool') {
      node = el('div', 'pgf__choices');
      var blab = el('label', 'pgc');
      var bbox = document.createElement('input');
      bbox.type = 'checkbox';
      bbox.id = id;
      bbox.checked = state[f.id] === true;
      bbox.addEventListener('change', function () {
        state[f.id] = bbox.checked;
        rerenderStep();
      });
      blab.appendChild(bbox);
      blab.appendChild(document.createTextNode(f.label));
      node.appendChild(blab);

    } else if (f.type === 'textarea') {
      node = el('textarea', 'pgf__textarea');
      node.id = id;
      node.rows = f.rows || 4;
      if (f.placeholder) node.placeholder = f.placeholder;
      node.value = state[f.id] || '';
      node.addEventListener('input', function () { state[f.id] = node.value; });

    } else {
      node = document.createElement('input');
      node.className = 'pgf__input';
      node.id = id;
      node.type = f.type === 'number' ? 'number' : f.type;
      if (f.type === 'number') { node.inputMode = 'numeric'; node.min = f.min != null ? f.min : 0; }
      if (f.max != null) node.max = f.max;
      if (f.placeholder) node.placeholder = f.placeholder;
      if (f.autocomplete) node.autocomplete = f.autocomplete;
      node.value = (state[f.id] === 'not_sure') ? '' : (state[f.id] || '');
      node.addEventListener('input', function () { state[f.id] = node.value; });
    }

    wrap.appendChild(node);

    /* "Not sure" on a number is a real answer, not a blank: it's what widens
       the estimate into a preliminary band rather than silently assuming. */
    if (f.unsure && f.type === 'number') {
      var box = el('div', 'pgf__choices');
      var ul = el('label', 'pgc');
      var uc = document.createElement('input');
      uc.type = 'checkbox';
      uc.checked = state[f.id] === 'not_sure';
      uc.addEventListener('change', function () {
        state[f.id] = uc.checked ? 'not_sure' : '';
        rerenderStep();
      });
      ul.appendChild(uc);
      ul.appendChild(document.createTextNode("I'm not sure — estimate this for me"));
      box.appendChild(ul);
      wrap.appendChild(box);
      if (state[f.id] === 'not_sure') node.disabled = true;
    }

    return wrap;
  }

  /* ======================================================================
     Validation
     ====================================================================== */
  function validate(sec) {
    var bad = [];
    fieldsOf(sec).forEach(function (f) {
      if (!f.req) return;
      var v = state[f.id];
      var empty = v === undefined || v === '' || v === null ||
                  (Array.isArray(v) && v.length === 0);
      if (empty) { bad.push({ f: f, msg: 'This one is needed to price the job.' }); return; }
      if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        bad.push({ f: f, msg: 'That address looks incomplete.' });
      }
      if (f.type === 'number' && v !== 'not_sure' && toNum(v) === null) {
        bad.push({ f: f, msg: 'Please enter a number.' });
      }
    });
    return bad;
  }

  function showErrors(bad) {
    var host = document.getElementById('pg-step');
    if (!host) return;
    host.querySelectorAll('.pgf--error').forEach(function (n) { n.classList.remove('pgf--error'); });
    host.querySelectorAll('.pgf__error').forEach(function (n) { n.remove(); });

    bad.forEach(function (b) {
      var w = host.querySelector('[data-field="' + b.f.id + '"]');
      if (!w) return;
      w.classList.add('pgf--error');
      w.appendChild(el('p', 'pgf__error', b.msg));
    });

    if (bad.length) {
      var first = host.querySelector('.pgf--error');
      if (first) {
        var input = first.querySelector('input, select, textarea');
        if (input) input.focus();
        first.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }

  /* ======================================================================
     The shared pricing skeleton  (_shared/00-global-spec.md §4–§7)
     ====================================================================== */
  function rushFromRatio(r) {
    if (r >= 1)    return { m: 1.00, flag: null };
    if (r >= 0.75) return { m: 1.15, flag: null };
    if (r >= 0.50) return { m: 1.30, flag: null };
    if (r >= 0.25) return { m: 1.50, flag: null };
    return { m: 1.75, flag: 'lead_time_infeasible' };
  }

  function leadRatio() {
    var d = cfg.leadDate ? cfg.leadDate(state, h) : state.target_completion_date;
    if (!d) return 1;
    var days = (new Date(d + 'T00:00:00') - new Date()) / 86400000;
    if (!isFinite(days)) return 1;
    return Math.max(0, days) / cfg.standardLeadDays;
  }

  /* Count of scoping answers genuinely left open.

     Only fields that carry `unsure` count — the ones where we explicitly offer
     "I'm not sure, estimate it for me". Those are precisely the questions with
     no safe default, where not answering really does widen the estimate.

     An ordinary optional field left blank is an answer, not a gap: no
     translations, one camera, no drone. Counting those was making
     well-specified projects come back marked "preliminary" purely for declining
     things they didn't want, which devalues the label on the briefs that
     actually are vague. Section 0 is the universal intake and never counts. */
  function unknowns() {
    var n = 0;
    sections.slice(1).forEach(function (sec) {
      fieldsOf(sec).forEach(function (f) {
        if (!f.unsure) return;
        if (h.unsure(f.id)) n++;
      });
    });
    return n;
  }

  var DISCOUNTS = {
    returning:  { pct: 0.10, why: 'Returning client' },
    non_profit: { pct: 0.15, why: 'Registered non-profit' },
    bundle:     { pct: 0.12, why: 'Multi-service project' }
  };

  function compute() {
    var r = cfg.calc(state, h);

    var subtotal = r.base + r.addOns;
    var volumeFactor = r.volumeFactor || 1;
    var volumeAdj = subtotal * (volumeFactor - 1);

    var ratio = leadRatio();
    var rush = rushFromRatio(ratio);
    var rushableBase = (r.rushableBase != null) ? r.rushableBase : subtotal;
    var rushFee = rushableBase * (rush.m - 1);

    var licBase = (r.licensableBase != null) ? r.licensableBase : subtotal;
    var licMult = r.licenseMultiplier || 1;
    var licenseFee = licBase * (licMult - 1);

    var travel = (r.travel || 0) + (r.lodging || 0);

    var disc = DISCOUNTS[state.client_status] || null;
    var discountPct = disc ? disc.pct : 0;
    var discount = subtotal * discountPct;

    var preTax = subtotal + volumeAdj + rushFee + travel + licenseFee - discount;
    var taxRate = cfg.taxRate || 0;
    var tax = preTax * taxRate;
    var total = preTax + tax;

    var flags = (r.flags || []).slice();
    if (rush.flag) flags.push(rush.flag);

    /* Two, not three. Now that only genuine unknowns count, the bar has to come
       down or it stops firing where it matters most: web design has just two
       such questions (page count and layout count), and a brief missing both is
       the vaguest brief there is. */
    var confidence = unknowns() >= 2 ? 'preliminary' : 'firm';
    var band = confidence === 'preliminary' ? 0.20 : 0;

    function tier(key, mult) {
      var amt = total * mult;
      return {
        name: key,
        amount: amt,
        low: amt * (1 - band),
        high: amt * (1 + band),
        changes: (r.tiers && r.tiers[key]) || []
      };
    }

    var sched = r.paymentSchedule || [{ milestone: 'On signature', pct: 0.5 },
                                      { milestone: 'On delivery',  pct: 0.5 }];

    return {
      phases: r.phases || [],
      base: r.base, addOns: r.addOns, subtotal: subtotal,
      volumeFactor: volumeFactor, volumeAdj: volumeAdj,
      rushMultiplier: rush.m, rushFee: rushFee, leadRatio: ratio,
      travel: travel,
      licenseMultiplier: licMult, licenseFee: licenseFee,
      discountPct: discountPct, discountWhy: disc ? disc.why : null, discount: discount,
      preTax: preTax, tax: tax, total: total,
      tiers: { good: tier('good', 0.85), standard: tier('standard', 1), premium: tier('premium', 1.30) },
      confidence: confidence, band: band,
      payment: sched.map(function (s) { return { milestone: s.milestone, pct: s.pct, amount: total * s.pct }; }),
      recurring: r.recurring || null,
      deferred: r.deferred || [],
      excludes: r.excludes || [],
      timeline: r.timeline || [],
      flags: flags
    };
  }

  /* ======================================================================
     Rendering — views
     ====================================================================== */
  function progress(nth, label) {
    var box = el('div', 'pg__progress');
    var row = el('div', 'pg__steplabel');
    var left = el('span');
    left.appendChild(el('b', null, 'Step ' + nth));
    left.appendChild(document.createTextNode(' of ' + TOTAL_STEPS));
    row.appendChild(left);
    row.appendChild(el('span', null, label));
    box.appendChild(row);

    var bar = document.createElement('progress');
    bar.className = 'pg__bar';
    bar.max = TOTAL_STEPS;
    bar.value = nth;
    box.appendChild(bar);
    return box;
  }

  function actions(backLabel, goLabel, onBack, onGo) {
    var row = el('div', 'pg__actions');
    if (onBack) {
      var b = el('button', 'pg__btn pg__btn--back', backLabel);
      b.type = 'button';
      b.addEventListener('click', onBack);
      row.appendChild(b);
    }
    var g = el('button', 'pg__btn pg__btn--go' + (onBack ? ' pg__btn--spacer' : ''), goLabel);
    g.type = 'button';
    g.addEventListener('click', onGo);
    row.appendChild(g);
    return row;
  }

  function renderStep() {
    var sec = sections[step];
    var host = el('div', null);
    host.id = 'pg-step';

    host.appendChild(progress(step + 1, sec.short || sec.title));

    var head = el('h3', 'pg__steptitle', sec.title);
    head.tabIndex = -1;
    head.id = 'pg-heading';
    host.appendChild(head);
    if (sec.note) host.appendChild(el('p', 'pg__stepnote', sec.note));

    var fields = el('div', 'pg__fields');
    fieldsOf(sec).forEach(function (f) { fields.appendChild(renderField(f)); });
    host.appendChild(fields);

    host.appendChild(actions(
      'Back',
      step === sections.length - 1 ? 'Review answers' : 'Continue',
      step > 0 ? function () { step--; view = 'form'; paint(); } : null,
      function () {
        var bad = validate(sec);
        if (bad.length) { showErrors(bad); return; }
        if (step === sections.length - 1) { view = 'review'; } else { step++; }
        paint();
      }
    ));

    rerenderStep.sig = visibleSignature();
    return host;
  }

  function visibleSignature() {
    return fieldsOf(sections[step]).map(function (f) { return f.id; }).join('|');
  }

  /* Re-render the current step in place, so a select that reveals other fields
     updates immediately. Focus is restored by field id, or a conditional field
     appearing would throw the caret out of the form mid-answer.

     Rebuilds only when the answer actually changed *which* fields are on screen.
     Ticking one box in a ten-item usage list must not tear down and rebuild the
     whole step: it's wasteful, it fights the scroll position, and it invalidates
     every node reference held mid-interaction. The checked state is already
     drawn by CSS, so an unchanged field set needs no DOM work at all. */
  function rerenderStep() {
    if (view !== 'form') return;

    var sig = visibleSignature();
    if (sig === rerenderStep.sig) return;
    rerenderStep.sig = sig;

    var active = document.activeElement;
    var keep = active && active.id ? active.id : null;
    var pos = (active && active.selectionStart != null) ? active.selectionStart : null;

    var host = document.getElementById('pg-step');
    if (!host) return;
    host.replaceWith(renderStep());

    if (keep) {
      var again = document.getElementById(keep);
      if (again) {
        again.focus();
        if (pos != null && again.setSelectionRange) {
          try { again.setSelectionRange(pos, pos); } catch (e) { /* type has no range */ }
        }
      }
    }
  }

  function renderReview() {
    var host = el('div', null);
    host.id = 'pg-step';
    host.appendChild(progress(sections.length + 1, 'Review'));

    var head = el('h3', 'pg__steptitle', 'Check this over');
    head.tabIndex = -1;
    head.id = 'pg-heading';
    host.appendChild(head);
    host.appendChild(el('p', 'pg__stepnote',
      'This is what the estimate will be built from. Anything wrong here makes ' +
      'the number wrong — go back and fix it rather than letting it slide.'));

    var box = el('div', 'pg__review');
    sections.forEach(function (sec, i) {
      var visible = fieldsOf(sec).filter(function (f) {
        var v = state[f.id];
        return !(v === undefined || v === '' || (Array.isArray(v) && !v.length) || v === false);
      });
      if (!visible.length) return;

      var g = el('div', 'pg__group');
      g.appendChild(el('p', 'pg__grouphead', (i + 1) + ' · ' + sec.title));
      var dl = el('dl', 'pg__dl');
      visible.forEach(function (f) {
        var row = el('div', 'pg__row');
        row.appendChild(el('dt', null, f.label));
        row.appendChild(el('dd', null, display(f)));
        dl.appendChild(row);
      });
      g.appendChild(dl);
      box.appendChild(g);
    });
    host.appendChild(box);

    host.appendChild(actions('Back', 'Build my estimate',
      function () { view = 'form'; step = sections.length - 1; paint(); },
      function () { est = compute(); mail = cfg.email(state, est, h); view = 'estimate'; paint(); }
    ));
    return host;
  }

  function display(f) {
    var v = state[f.id];
    if (v === 'not_sure') return "Not sure yet — we'll estimate it";
    if (v === true) return 'Yes';
    if (f.type === 'multi') {
      return v.map(function (k) { return optLabel(f, k); }).join(', ');
    }
    if (f.type === 'select') return optLabel(f, v);
    return String(v);
  }

  function optLabel(f, k) {
    var hit = (f.opts || []).filter(function (o) { return o[0] === k; })[0];
    return hit ? hit[1] : k;
  }

  function renderEstimate() {
    var host = el('div', null);
    host.id = 'pg-step';
    host.appendChild(progress(TOTAL_STEPS, 'Your estimate'));

    var head = el('h3', 'pg__steptitle', 'Your estimate');
    head.tabIndex = -1;
    head.id = 'pg-heading';
    host.appendChild(head);

    if (est.confidence === 'preliminary') {
      host.appendChild(el('p', 'pg__banner',
        'Preliminary — subject to a discovery call. Several answers were left ' +
        'open, so every figure below is shown as a band rather than a number. ' +
        'A short conversation usually narrows it, most often by pulling the top ' +
        'end down.'));
    }

    /* Tiers */
    var tiers = el('div', 'pg__tiers');
    [['good', 'Good'], ['standard', 'Standard'], ['premium', 'Premium']].forEach(function (t) {
      var d = est.tiers[t[0]];
      var card = el('div', 'pgt' + (t[0] === 'standard' ? ' pgt--pick' : ''));
      card.appendChild(el('p', 'pgt__name', t[1] + (t[0] === 'standard' ? ' · recommended' : '')));
      card.appendChild(el('p', 'pgt__fig',
        est.band ? money(d.low) + ' – ' + money(d.high) : money(d.amount)));
      card.appendChild(el('p', 'pgt__band',
        t[0] === 'standard' ? 'Exactly as you scoped it' :
        t[0] === 'good' ? 'Reduced scope' : 'Expanded scope'));
      if (d.changes.length) {
        var ul = el('ul', 'pgt__changes');
        d.changes.forEach(function (c) { ul.appendChild(el('li', null, c)); });
        card.appendChild(ul);
      }
      tiers.appendChild(card);
    });
    host.appendChild(tiers);

    /* Line items, grouped by phase */
    var g = el('div', 'pg__group');
    g.appendChild(el('p', 'pg__grouphead', 'How that is made up'));
    var wrap = el('div', 'pg__tablewrap');
    var tbl = el('table', 'pg__table');
    var thead = el('thead');
    var hr = el('tr');
    ['Item', 'Qty', 'Amount'].forEach(function (t, i) {
      var th = el('th', i === 2 ? 'pg__num' : null, t);
      th.scope = 'col';
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    tbl.appendChild(thead);

    var tb = el('tbody');
    est.phases.forEach(function (p) {
      if (!p.items.length) return;
      var ph = el('tr');
      var pth = el('th', null, p.name);
      pth.colSpan = 3;
      pth.scope = 'colgroup';
      ph.appendChild(pth);
      tb.appendChild(ph);

      var sum = 0;
      p.items.forEach(function (it) {
        sum += it.amount;
        var tr = el('tr');
        tr.appendChild(el('td', null, it.label));
        tr.appendChild(el('td', null, qty(it.qty, it.unit)));
        tr.appendChild(el('td', 'pg__num', money(it.amount)));
        tb.appendChild(tr);
      });
      var st = el('tr', 'pg__sum');
      st.appendChild(el('td', null, p.name + ' subtotal'));
      st.appendChild(el('td', null, ''));
      st.appendChild(el('td', 'pg__num', money(sum)));
      tb.appendChild(st);
    });

    function adj(label, amount) {
      if (!amount) return;
      var tr = el('tr');
      tr.appendChild(el('td', null, label));
      tr.appendChild(el('td', null, ''));
      tr.appendChild(el('td', 'pg__num', money(amount)));
      tb.appendChild(tr);
    }
    adj('Series volume adjustment', est.volumeAdj);
    adj('Expedited schedule (×' + est.rushMultiplier.toFixed(2) + ' on production)', est.rushFee);
    adj('Travel & logistics', est.travel);
    adj('Licensing / usage (×' + est.licenseMultiplier.toFixed(2) + ')', est.licenseFee);
    if (est.discount) adj(est.discountWhy + ' discount', -est.discount);
    if (est.tax) adj('Tax', est.tax);

    var tot = el('tr', 'pg__tot');
    tot.appendChild(el('td', null, 'Standard total'));
    tot.appendChild(el('td', null, ''));
    tot.appendChild(el('td', 'pg__num', money(est.total)));
    tb.appendChild(tot);

    tbl.appendChild(tb);
    wrap.appendChild(tbl);
    g.appendChild(wrap);
    host.appendChild(g);

    /* Recurring work is quoted per unit, never rolled into a one-off total. */
    if (est.recurring && est.recurring.applies) {
      var rec = el('div', 'pg__group');
      rec.appendChild(el('p', 'pg__grouphead', 'Per ' + est.recurring.unit));
      rec.appendChild(el('p', 'pgt__fig',
        money(est.total / est.recurring.unitCount) + ' per ' + est.recurring.unit));
      rec.appendChild(el('p', 'pgt__band',
        est.recurring.unitCount + ' ' + est.recurring.unit + 's · ' + money(est.total) + ' in total'));
      host.appendChild(rec);
    }

    /* Payment schedule */
    var pay = el('div', 'pg__group');
    pay.appendChild(el('p', 'pg__grouphead', 'Payment'));
    var pl = el('ul', 'pg__list');
    est.payment.forEach(function (p) {
      pl.appendChild(el('li', null, p.milestone + ' — ' + money(p.amount) +
        ' (' + Math.round(p.pct * 100) + '%)'));
    });
    pay.appendChild(pl);
    host.appendChild(pay);

    /* Flags and deferred costs: the things a human has to price, shown rather
       than quietly counted as zero. */
    if (est.deferred.length || est.flags.length) {
      var n = el('div', 'pg__notes');
      est.deferred.forEach(function (d) {
        var p = el('p', 'pg__note');
        p.appendChild(el('b', null, d.label + ' — not included. '));
        p.appendChild(document.createTextNode(d.reason));
        n.appendChild(p);
      });
      (cfg.flagNotes ? est.flags.map(function (f) { return cfg.flagNotes[f]; }) : [])
        .filter(Boolean)
        .forEach(function (t) { n.appendChild(el('p', 'pg__note', t)); });
      host.appendChild(n);
    }

    /* Exclusions */
    if (est.excludes.length) {
      var ex = el('div', 'pg__group');
      ex.appendChild(el('p', 'pg__grouphead', 'Not included'));
      var xl = el('ul', 'pg__list');
      est.excludes.forEach(function (t) { xl.appendChild(el('li', null, t)); });
      ex.appendChild(xl);
      host.appendChild(ex);
    }

    /* Timeline */
    if (est.timeline.length) {
      var tl = el('div', 'pg__group');
      tl.appendChild(el('p', 'pg__grouphead', 'How it runs'));
      var ll = el('ul', 'pg__list');
      est.timeline.forEach(function (t) { ll.appendChild(el('li', null, t)); });
      tl.appendChild(ll);
      host.appendChild(tl);
    }

    host.appendChild(el('p', 'pg__stepnote',
      'This is an estimate generated from your answers, not a fixed quote or a ' +
      'contract. Send it over and a producer will confirm availability and come ' +
      'back within one business day.'));

    var errBox = el('div');
    errBox.id = 'pg-submit-error';
    host.appendChild(errBox);

    host.appendChild(actions('Back', 'Send this to Kriel Ventures',
      function () { view = 'review'; paint(); },
      submit
    ));
    return host;
  }

  function renderDone() {
    var host = el('div', null);
    host.id = 'pg-step';

    var head = el('p', 'pg__donemark', 'Thank you — that\'s with us.');
    head.tabIndex = -1;
    head.id = 'pg-heading';
    host.appendChild(head);

    host.appendChild(el('p', 'pg__donenote',
      'Your brief and the estimate have been sent to the studio. You\'ll hear ' +
      'back within one business day. If it\'s urgent, email josh@kriel.us directly.'));

    var g = el('div', 'pg__group');
    g.appendChild(el('p', 'pg__grouphead', 'The note heading your way'));
    g.appendChild(el('p', 'pg__stepnote',
      'A producer reviews and sends this — nothing goes out automatically.'));
    g.appendChild(el('pre', 'pg__mail', 'Subject: ' + mail.subject + '\n\n' + mail.body));
    host.appendChild(g);

    var row = el('div', 'pg__actions');
    var back = el('a', 'pg__btn pg__btn--back', '← Back to Kriel Ventures');
    back.href = '../';
    row.appendChild(back);
    var again = el('button', 'pg__btn pg__btn--back', 'Start another estimate');
    again.type = 'button';
    again.addEventListener('click', function () {
      state = {}; step = 0; view = 'form'; est = null; mail = null; paint();
    });
    row.appendChild(again);
    host.appendChild(row);
    return host;
  }

  /* ======================================================================
     Submission
     ====================================================================== */
  function summaryText() {
    var out = ['SERVICE: ' + cfg.service, ''];
    sections.forEach(function (sec) {
      out.push('== ' + sec.title + ' ==');
      fieldsOf(sec).forEach(function (f) {
        var v = state[f.id];
        if (v === undefined || v === '' || (Array.isArray(v) && !v.length) || v === false) return;
        out.push('  ' + f.label + ': ' + display(f));
      });
      out.push('');
    });

    out.push('== ESTIMATE (' + est.confidence + ') ==');
    est.phases.forEach(function (p) {
      if (!p.items.length) return;
      out.push('  -- ' + p.name);
      p.items.forEach(function (it) {
        out.push('     ' + it.label + (it.qty != null ? '  [' + it.qty + ' ' + (it.unit || '') + ']' : '') +
                 '  ' + money(it.amount));
      });
    });
    out.push('  Subtotal        ' + money(est.subtotal));
    if (est.volumeAdj)  out.push('  Volume adj      ' + money(est.volumeAdj));
    if (est.rushFee)    out.push('  Rush (x' + est.rushMultiplier.toFixed(2) + ')    ' + money(est.rushFee));
    if (est.travel)     out.push('  Travel          ' + money(est.travel));
    if (est.licenseFee) out.push('  Licence (x' + est.licenseMultiplier.toFixed(2) + ') ' + money(est.licenseFee));
    if (est.discount)   out.push('  Discount        -' + money(est.discount));
    out.push('  TOTAL           ' + money(est.total));
    out.push('  Good / Standard / Premium: ' + money(est.tiers.good.amount) + ' / ' +
             money(est.tiers.standard.amount) + ' / ' + money(est.tiers.premium.amount));
    if (est.recurring && est.recurring.applies) {
      out.push('  Per ' + est.recurring.unit + ': ' + money(est.total / est.recurring.unitCount));
    }
    if (est.flags.length)    out.push('  FLAGS: ' + est.flags.join(', '));
    if (est.deferred.length) out.push('  DEFERRED: ' + est.deferred.map(function (d) { return d.label; }).join(', '));
    out.push('', 'Lead ratio: ' + est.leadRatio.toFixed(2) + ' of ' + cfg.standardLeadDays + ' standard days');
    return out.join('\n');
  }

  function fill(name, value) {
    if (!form) return;
    var n = form.elements[name];
    if (n) n.value = value == null ? '' : String(value);
  }

  function submit(e) {
    var btn = e.currentTarget;
    var errBox = document.getElementById('pg-submit-error');
    errBox.textContent = '';

    if (!form) { finish(); return; }

    fill('service', cfg.service);
    fill('client_name', state.client_name);
    fill('client_email', state.client_email);
    fill('client_phone', state.client_phone);
    fill('client_company', state.client_company);
    fill('project_name', state.project_name);
    fill('target_date', state.target_completion_date);
    fill('template', optLabelById('template_choice'));
    fill('estimate_low', Math.round(est.tiers.good.low || est.tiers.good.amount));
    fill('estimate_high', Math.round(est.tiers.premium.high || est.tiers.premium.amount));
    fill('confidence', est.confidence);
    fill('summary', summaryText());
    fill('thankyou_email', 'Subject: ' + mail.subject + '\n\n' + mail.body);

    btn.disabled = true;
    btn.textContent = 'Sending…';

    var body = new URLSearchParams(new FormData(form)).toString();

    fetch(form.getAttribute('action') || window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      finish();
    }).catch(function () {
      /* Local preview has no form handler, and a network can simply fail. The
         brief is finished either way — don't strand it behind our plumbing. */
      btn.disabled = false;
      btn.textContent = 'Send this to Kriel Ventures';
      errBox.innerHTML = '';
      var p = el('p', 'pg__alert');
      p.appendChild(document.createTextNode(
        'That didn\'t send — the form service may be unavailable. Your answers ' +
        'are still here. Try again, or '));
      var a = el('a', null, 'email it to josh@kriel.us');
      a.href = mailtoHref();
      p.appendChild(a);
      p.appendChild(document.createTextNode('.'));
      errBox.appendChild(p);
    });
  }

  function optLabelById(id) {
    var f = null;
    sections.forEach(function (s) {
      s.fields.forEach(function (x) { if (x.id === id) f = x; });
    });
    return f ? optLabel(f, state[id]) : (state[id] || '');
  }

  function mailtoHref() {
    return 'mailto:josh@kriel.us' +
      '?subject=' + encodeURIComponent(cfg.service + ' enquiry — ' + (state.project_name || '')) +
      '&body=' + encodeURIComponent(summaryText());
  }

  function finish() {
    view = 'done';
    paint();
  }

  /* ======================================================================
     Paint
     ====================================================================== */
  function paint() {
    mount.textContent = '';
    var node = view === 'form'   ? renderStep()
             : view === 'review' ? renderReview()
             : view === 'estimate' ? renderEstimate()
             : renderDone();
    mount.appendChild(node);

    /* On every step *after* the first, move focus to the new heading so a
       keyboard or screen-reader user lands at the top of the step rather than
       wherever the old button used to be, and pull the card into view.

       Not on the first paint, though: the generator sits at the foot of a
       holding page nobody arrived here to fill in. Focusing it on load would
       yank the page down past the content they came for, and leave a focus
       ring drawn round a heading they never touched. */
    if (paint.started) {
      var head = document.getElementById('pg-heading');
      if (head) {
        try { head.focus({ preventScroll: true }); } catch (err) { head.focus(); }
      }
      var top = mount.getBoundingClientRect().top + window.pageYOffset - 24;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
    paint.started = true;
  }

  paint();
})();
