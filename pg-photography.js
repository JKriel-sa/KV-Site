/* ==========================================================================
   Proposal generator — Photography
   Implements proposal-generators/01-photography/. Rate constants below are the
   single place to edit a price; the formulas underneath read them.

   Built for speed of filling in. Durations and image counts are one-click
   bands rather than typed numbers, and the eight separate add-on questions
   (stylist, hair & makeup, models, set, album, BTS, cutouts, second shooter)
   are one tick-list. Where a tick needs a quantity we assume a sensible one
   and say so on the estimate rather than asking.
   ========================================================================== */
(function () {
  'use strict';

  var R = {
    PHOTOG_HOUR: 250, HALF_DAY: 900, FULL_DAY: 1600, OVERTIME_HOUR: 275,
    SECOND_SHOOTER_HR: 125,
    EDIT_IMAGE: 12, EDIT_ADVANCED: 28, EDIT_BEAUTY: 65, CLIPPING_PATH: 8,
    STYLIST_DAY: 650, MODEL_DAY: 500, HMU_DAY: 450,
    SET_SIMPLE: 400, LOCATION_MOVE: 150, STUDIO_DAY: 500,
    MILEAGE: 0.85, PER_DIEM: 90,
    ALBUM_20: 600, BTS: 400
  };

  var EVENT = ['wedding', 'event_corporate', 'event_social'];
  var COMMERCIAL = ['product', 'food_beverage', 'fashion_lookbook', 'brand_lifestyle'];
  var PORTRAIT = ['headshots', 'portrait_family'];

  function isEvent(s) { return EVENT.indexOf(s.shoot_type) !== -1; }

  window.PG_CONFIG = {
    service: 'Photography',
    standardLeadDays: 21,
    taxRate: 0,

    /* A wedding date is not a preference. Where the date is fixed by the world,
       rush is measured from it, not from when they'd like the files. */
    leadDate: function (s) {
      return (isEvent(s) && s.event_date) ? s.event_date : s.target_completion_date;
    },

    sections: [
      window.PG_INTAKE,

      { title: 'The shoot', short: 'Shoot',
        note: 'What we are photographing, for how long, and where.',
        fields: [
          { id: 'shoot_type', label: 'What kind of shoot?', type: 'select', req: 1,
            opts: [
              ['wedding', 'Wedding'],
              ['event_corporate', 'Corporate event or conference'],
              ['event_social', 'Party, launch or social event'],
              ['product', 'Product / e-commerce'],
              ['food_beverage', 'Food & drink'],
              ['fashion_lookbook', 'Fashion or lookbook'],
              ['brand_lifestyle', 'Brand lifestyle'],
              ['real_estate_interiors', 'Property or interiors'],
              ['headshots', 'Headshots'],
              ['portrait_family', 'Portrait or family'],
              ['other', 'Something else']
            ] },

          { id: 'event_date', label: 'Event date', type: 'date', req: 1, half: 1,
            when: isEvent,
            help: 'Fixed dates drive the schedule, so we price against this.' },

          { id: 'shoot_length', label: 'How long do we need to shoot?', type: 'select',
            req: 1, half: 1, unsure: 1,
            opts: [['2', 'A couple of hours'],
                   ['4', 'Half a day — about 4 hours'],
                   ['8', 'A full day — about 8 hours'],
                   ['12', 'A long day — 10 to 12 hours'],
                   ['16', 'Two full days']] },

          { id: 'location_type', label: 'Where?', type: 'select', req: 1, half: 1,
            opts: [['our_studio', 'Your studio'],
                   ['client_site', 'Our premises'],
                   ['on_location_outdoor', 'On location or outdoors'],
                   ['multiple_mixed', 'Several places']] },

          { id: 'location_city', label: 'Which town or city?', type: 'text', req: 1, half: 1 },

          { id: 'travel_band', label: 'Roughly how far from Cape Town?', type: 'select',
            half: 1, unsure: 1,
            opts: [['0', 'Local — within about 40 km'],
                   ['120', 'An hour or two away'],
                   ['400', 'Further than that']] },

          { id: 'preferred_shoot_dates', label: 'Preferred dates', type: 'text',
            req: 1, when: function (s) { return !isEvent(s); },
            placeholder: 'e.g. late October, fairly flexible' }
        ] },

      { title: 'What you get back', short: 'Delivery',
        note: 'The last answer is the one that moves the price most.',
        fields: [
          { id: 'image_band', label: 'How many finished images?', type: 'select',
            req: 1, half: 1, unsure: 1,
            opts: [['15', 'A handful — around 15'],
                   ['40', 'A set — around 40'],
                   ['80', 'A lot — around 80'],
                   ['150', 'Full coverage — 150 or more']] },

          { id: 'retouch_level', label: 'How much retouching?', type: 'select',
            req: 1, half: 1,
            opts: [['standard', 'Standard — colour and tidy-up'],
                   ['advanced', 'Advanced — detailed retouch'],
                   ['beauty', 'Beauty — skin and fine detail']] },

          { id: 'turnaround', label: 'How soon do you need them?', type: 'select',
            req: 1, half: 1,
            opts: [['standard_3wk', 'Three weeks is fine'],
                   ['expedited_10day', 'Within ten days'],
                   ['rush_72hr', 'Within 72 hours']] },

          { id: 'usage_rights', label: 'Where will the images be used?', type: 'multi',
            req: 1,
            help: 'Tick everything that applies. This is the biggest single lever ' +
                  'on cost, and the expensive thing to get wrong later.',
            opts: [
              ['personal_only', 'Personal use only'],
              ['organic_social', 'Social media'],
              ['website', 'Your website'],
              ['email_marketing', 'Email marketing'],
              ['print_collateral', 'Printed material'],
              ['paid_digital_ads', 'Paid advertising'],
              ['ooh_billboard', 'Billboards'],
              ['packaging', 'Product packaging'],
              ['broadcast_tv', 'TV'],
              ['resale_stock', 'Resale or stock']
            ] },

          { id: 'usage_term', label: 'For how long?', type: 'select', req: 1, half: 1,
            opts: [['6_months', 'Six months'], ['1_year', 'A year'],
                   ['3_years', 'Three years'], ['perpetual', 'Indefinitely']] },

          { id: 'usage_territory', label: 'Where in the world?', type: 'select',
            req: 1, half: 1,
            opts: [['local', 'South Africa, locally'],
                   ['national', 'Nationally'],
                   ['worldwide', 'Worldwide']] }
        ] },

      { title: 'Anything else', short: 'Extras',
        note: 'All optional. Skip straight past if none apply.',
        fields: [
          { id: 'extras', label: 'Do you need any of these?', type: 'multi',
            opts: [
              ['second_shooter', 'A second photographer'],
              ['hmu', 'Hair & makeup'],
              ['styling', 'Styling and props'],
              ['models', 'Models or talent'],
              ['set', 'A built set or backdrop'],
              ['album', 'An album or prints'],
              ['bts', 'Behind-the-scenes content'],
              ['cutouts', 'White-background cutouts']
            ] },

          { id: 'notes', label: 'Anything we should know?', type: 'textarea', rows: 3,
            placeholder: 'Access, timings, references, must-have shots…' },

          { id: 'template_choice', label: 'Proposal style', type: 'select', req: 1,
            opts: [['let_us_recommend', 'Pick one for me'],
                   ['event', 'Event — coverage timeline and contingency'],
                   ['commercial_product', 'Commercial — shot list and licensing'],
                   ['portrait_headshot', 'Portrait — what to expect, how to prepare']] }
        ] }
    ],

    calc: function (s, h) {
      var flags = [], deferred = [], assumed = [];
      var ex = function (k) { return h.has('extras', k); };

      var hrs = h.num('shoot_length', 0);
      if (!hrs) { hrs = 4; flags.push('hours_estimated'); }
      var days = Math.max(1, Math.ceil(hrs / 8));

      var second = ex('second_shooter') || (isEvent(s) && hrs > 8);
      if (!ex('second_shooter') && second) assumed.push('a second photographer, because the day is long');

      var crew = 1 + (second ? 1 : 0) + (ex('styling') ? 1 : 0) + (ex('hmu') ? 1 : 0);

      /* Shooting fee — half and full day rates act as minimums. */
      var shoot;
      if (hrs <= 2)       shoot = hrs * R.PHOTOG_HOUR;
      else if (hrs <= 5)  shoot = R.HALF_DAY + Math.max(0, hrs - 4) * R.PHOTOG_HOUR;
      else if (hrs <= 10) shoot = R.FULL_DAY + Math.max(0, hrs - 8) * R.PHOTOG_HOUR;
      else                shoot = R.FULL_DAY + 2 * R.PHOTOG_HOUR + (hrs - 10) * R.OVERTIME_HOUR;

      var secondFee = second ? hrs * R.SECOND_SHOOTER_HR : 0;
      var studio = (s.location_type === 'our_studio' && hrs > 4) ? R.STUDIO_DAY * days : 0;
      var moves = s.location_type === 'multiple_mixed' ? R.LOCATION_MOVE * 2 : 0;

      var production = [{ label: 'Photography — ' + hrs + ' hours', qty: hrs, unit: 'hrs', amount: shoot }];
      if (secondFee) production.push({ label: 'Second photographer', qty: hrs, unit: 'hrs', amount: secondFee });
      if (studio)    production.push({ label: 'Studio', qty: days, unit: 'days', amount: studio });
      if (moves)     production.push({ label: 'Moving between locations', qty: null, amount: moves });

      var BASE = shoot + secondFee + studio + moves;

      /* Post */
      var n = h.num('image_band', 0);
      if (!n) { n = Math.round(hrs * 10); flags.push('image_count_estimated'); }

      var per = s.retouch_level === 'advanced' ? R.EDIT_ADVANCED
              : s.retouch_level === 'beauty'   ? R.EDIT_BEAUTY : R.EDIT_IMAGE;
      var edit = n * per;
      var cutouts = ex('cutouts') ? n * R.CLIPPING_PATH : 0;
      var tmult = h.pick('turnaround', { standard_3wk: 1, expedited_10day: 1.25, rush_72hr: 1.6 }, 1);
      var POST = (edit + cutouts) * tmult;

      var post = [{ label: n + ' images — ' + h.pick('retouch_level',
          { standard: 'standard edit', advanced: 'advanced retouch', beauty: 'beauty retouch' }, 'edit'),
          qty: n, unit: 'images', amount: edit }];
      if (cutouts) post.push({ label: 'White-background cutouts', qty: n, unit: 'images', amount: cutouts });
      if (tmult > 1) post.push({ label: 'Faster turnaround', qty: null, amount: (edit + cutouts) * (tmult - 1) });

      /* Extras — each tick gets a sensible assumed quantity, stated on the estimate. */
      var extras = [];
      function add(label, amount, qty, unit) {
        if (amount) extras.push({ label: label, qty: qty != null ? qty : null, unit: unit || '', amount: amount });
      }
      var styling = ex('styling') ? R.STYLIST_DAY * 0.5 * days : 0;
      var models  = ex('models')  ? 2 * R.MODEL_DAY * days : 0;
      var hmu     = ex('hmu')     ? R.HMU_DAY * days : 0;
      var set     = ex('set')     ? R.SET_SIMPLE : 0;
      var album   = ex('album')   ? R.ALBUM_20 : 0;
      var bts     = ex('bts')     ? R.BTS : 0;

      if (models)  assumed.push('two models — tell us if you need more');
      if (styling) assumed.push('a half-day stylist');
      if (set)     assumed.push('a simple backdrop rather than a full build');
      if (album)   assumed.push('a 20-page album');

      add('Styling', styling, days, 'days');
      add('Models', models, 2, 'people');
      add('Hair & makeup', hmu, days, 'days');
      add('Set or backdrop', set);
      add('Album', album);
      add('Behind-the-scenes', bts);

      var ADD_ONS = POST + styling + models + hmu + set + album + bts;

      /* Licensing */
      var pts = { personal_only: 0, organic_social: 1, website: 1, email_marketing: 1,
                  print_collateral: 2, paid_digital_ads: 4, packaging: 5,
                  ooh_billboard: 6, broadcast_tv: 6, resale_stock: 8 };
      var usage = 0;
      Object.keys(pts).forEach(function (k) { if (h.has('usage_rights', k)) usage += pts[k]; });
      var term = h.pick('usage_term', { '6_months': 0.8, '1_year': 1, '3_years': 1.5, perpetual: 2.2 }, 1);
      var terr = h.pick('usage_territory', { local: 1, national: 1.3, worldwide: 1.6 }, 1);
      var lic = 1 + (usage * 0.06 * term * terr);

      if (s.usage_term === 'perpetual' && usage >= 5) flags.push('perpetual_broad_usage_review');
      if (h.has('usage_rights', 'resale_stock')) {
        flags.push('resale_rights_transfer');
        deferred.push({ label: 'Resale / stock licensing', reason:
          'That is a transfer of rights rather than a licence. It needs a different ' +
          'contract and a person, and it is not in the figure above.' });
      }
      if (assumed.length) flags.push('assumptions_made');

      /* Travel */
      var dist = h.num('travel_band', 0);
      var travel = dist > 40 ? (dist - 40) * R.MILEAGE * 2 * days : 0;
      var lodging = 0;
      if (dist > 250) { lodging = R.PER_DIEM * crew * Math.max(1, days - 1); flags.push('travel_manual_review'); }

      return {
        base: BASE, addOns: ADD_ONS,
        rushableBase: BASE,
        licensableBase: BASE + POST,
        licenseMultiplier: lic,
        travel: travel, lodging: lodging,
        assumed: assumed,
        phases: [
          { name: 'On the day', items: production },
          { name: 'Editing', items: post },
          { name: 'Extras', items: extras }
        ],
        flags: flags, deferred: deferred,
        tiers: {
          good: ['About a third fewer images', 'Standard three-week turnaround', 'A one-year licence'],
          standard: ['Exactly as you have scoped it'],
          premium: ['Around 40% more images', 'Faster turnaround',
                    'A second photographer', 'Behind-the-scenes content', 'A longer licence']
        },
        excludes: [
          'RAW files and unedited selects',
          'Travel beyond the quoted distance',
          'Permits and venue fees',
          'Model and property releases — those are yours to obtain',
          'Any use beyond the licence described above'
        ],
        timeline: [
          'Contract and deposit',
          'A short call before the day — shot list, timings, access',
          'Shoot day' + (days > 1 ? 's (' + days + ')' : ''),
          'Gallery of selects, three working days later',
          'Final images — ' + h.pick('turnaround',
            { standard_3wk: 'three weeks', expedited_10day: 'ten days', rush_72hr: '72 hours' },
            'three weeks') + ' after you choose'
        ]
      };
    },

    flagNotes: {
      assumptions_made:
        'Where you ticked an extra we have assumed a sensible size for it — two ' +
        'models, a half-day stylist, a simple backdrop, a 20-page album. Tell us ' +
        'if any of those are wrong and we will re-quote; none of them are fixed.',
      perpetual_broad_usage_review:
        'You have asked for broad usage indefinitely. We are glad to arrange it, but ' +
        'at that scope it is worth a conversation rather than a formula.',
      hours_estimated:
        'You were not sure how long the shoot needs, so we have assumed half a day. ' +
        'That is the number that moves this total most.',
      image_count_estimated:
        'Image count was left open, so we have estimated from the shooting time.',
      lead_time_infeasible:
        'Your date is very close. The estimate includes a rush fee, but we need to ' +
        'confirm we can actually staff it before you rely on this.',
      travel_manual_review:
        'That distance means overnight travel. The figure shown is a placeholder ' +
        'and a real one will replace it.'
    },

    email: function (s, est, h) {
      var first = (s.client_name || '').split(' ')[0];
      var label = { wedding: 'wedding', event_corporate: 'corporate event',
        event_social: 'event', product: 'product', food_beverage: 'food & drink',
        fashion_lookbook: 'fashion', brand_lifestyle: 'brand', editorial: 'editorial',
        real_estate_interiors: 'property', headshots: 'headshot',
        portrait_family: 'portrait', other: 'photography' }[s.shoot_type] || 'photography';
      var hrs = h.num('shoot_length', 4);
      var when = s.event_date || s.preferred_shoot_dates || 'a date to confirm';

      return {
        subject: 'Your ' + label + ' proposal — ' + (s.project_name || 'enquiry'),
        body:
          'Hi ' + first + ',\n\n' +
          'Thanks for sending the details for ' + (s.project_name || 'your shoot') +
          ' — it sounds like a\ngood one, and we would like to shoot it.\n\n' +
          '  Shoot      ' + label + ', ' + when + '\n' +
          '  Coverage   ' + hrs + ' hours\n' +
          '  Delivery   ' + h.num('image_band', 0) + ' finished images, ' +
            h.pick('turnaround', { standard_3wk: '3 weeks', expedited_10day: '10 days',
              rush_72hr: '72 hours' }, '3 weeks') + ' after the shoot\n' +
          '  Estimate   $' + Math.round(est.tiers.good.low || est.tiers.good.amount).toLocaleString('en-US') +
            ' – $' + Math.round(est.tiers.premium.high || est.tiers.premium.amount).toLocaleString('en-US') + '\n\n' +
          'The estimate covers the scope exactly as you described it. If anything\n' +
          'shifts, tell us and we will re-quote rather than surprise you later. We\n' +
          'will confirm availability within one working day; nothing is held until\n' +
          'we do.\n\n' +
          (est.confidence === 'preliminary'
            ? 'A few details were still open, so treat this as a range. A ten-minute\ncall usually tightens it.\n\n' : '') +
          'Josh\nKriel Ventures\njosh@kriel.us'
      };
    }
  };
})();
