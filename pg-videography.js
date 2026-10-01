/* ==========================================================================
   Proposal generator — Videography
   Implements proposal-generators/02-videography/.

   Shooting is a flat base plus an hourly rate (see SHOOT_BASE / SHOOT_HOUR).
   That replaces the old per-role crew and per-package camera day rates: one
   number people can check in their head beats a roster they cannot. Genuine
   extras — aerial, a built set, a livestream, cast talent — are still priced
   individually, because those are real costs and not everyone needs them.
   ========================================================================== */
(function () {
  'use strict';

  var R = {
    /* The shooting fee. Everything a straightforward shoot needs — operator,
       camera, basic lighting and sound — is inside this. */
    SHOOT_BASE: 250,
    SHOOT_HOUR: 100,

    /* Extras, unchanged from the original rate card. */
    DRONE_DAY: 950, MOVEMENT_DAY: 300, EXTRA_CAM_DAY: 400, BIG_LIGHT_DAY: 1200,
    PROMPTER_DAY: 350, LIVESTREAM_DAY: 1800, SET: 900, TALENT_DAY: 750,
    STUDIO_DAY: 1200, PERMIT: 450,

    /* Pre-production and post, unchanged. */
    PREPRO_DAY: 750, SCRIPT_MIN: 350,
    EDIT_HOUR: 95, INGEST_HOUR: 55,
    GRADE: { simple: 120, polished: 300, premium: 550 },
    MGFX: { simple: 0, polished: 350, premium: 2700 },
    MIX_MIN: 60, MUSIC_LIB: 250, MUSIC_CUSTOM_MIN: 900, VO: 850,
    SUBTITLE_MIN: 35, CUTDOWN: 400, REVISION: 450, RAW: 350,
    MILEAGE: 0.85, PER_DIEM: 90
  };

  window.PG_CONFIG = {
    service: 'Videography',
    standardLeadDays: 35,
    taxRate: 0,

    sections: [
      window.PG_INTAKE,

      { title: 'The video', short: 'Video',
        note: 'What we are making and where it ends up.',
        fields: [
          { id: 'video_type', label: 'What are we making?', type: 'select', req: 1,
            opts: [['brand_film', 'Brand film'],
                   ['corporate_explainer', 'Explainer'],
                   ['product_demo', 'Product demo'],
                   ['tv_commercial', 'Commercial or ad'],
                   ['social_ad', 'Social video'],
                   ['event_recap', 'Event recap'],
                   ['event_full_coverage', 'Full event coverage'],
                   ['testimonial_case_study', 'Testimonial or case study'],
                   ['documentary_short', 'Documentary short'],
                   ['training_internal', 'Training or internal'],
                   ['music_video', 'Music video'],
                   ['other', 'Something else']] },

          { id: 'runtime_band', label: 'How long is the finished video?',
            type: 'select', req: 1, half: 1, unsure: 1,
            opts: [['30', 'About 30 seconds'],
                   ['60', 'About a minute'],
                   ['150', 'Two or three minutes'],
                   ['450', 'Five to ten minutes'],
                   ['900', 'Longer than ten minutes']] },

          { id: 'deliverable_count', label: 'How many separate videos?',
            type: 'select', req: 1, half: 1,
            opts: [['1', 'Just the one'], ['2', 'Two or three'], ['4', 'Four or more']] },

          { id: 'distribution', label: 'Where will it run?', type: 'multi', req: 1,
            help: 'This sets the usage licence, priced separately from production.',
            opts: [['internal_only', 'Internally only'],
                   ['website', 'Your website'],
                   ['organic_social', 'Social media'],
                   ['paid_social', 'Paid social'],
                   ['youtube_preroll', 'YouTube ads'],
                   ['trade_show', 'Events or trade shows'],
                   ['ooh_screens', 'Screens in public'],
                   ['broadcast_tv', 'TV'],
                   ['cinema', 'Cinema']] },

          { id: 'usage_term', label: 'For how long?', type: 'select', req: 1, half: 1,
            opts: [['6_months', 'Six months'], ['1_year', 'A year'],
                   ['3_years', 'Three years'], ['perpetual', 'Indefinitely']] },

          { id: 'usage_territory', label: 'Where in the world?', type: 'select',
            req: 1, half: 1,
            opts: [['local', 'South Africa, locally'], ['national', 'Nationally'],
                   ['worldwide', 'Worldwide']] }
        ] },

      { title: 'The shoot', short: 'Shoot',
        note: 'Shooting is $250 plus $100 an hour. Anything in the list below is extra.',
        fields: [
          { id: 'shoot_length', label: 'How much shooting time?', type: 'select',
            req: 1, half: 1, unsure: 1,
            opts: [['5', 'Half a day — about 5 hours'],
                   ['10', 'A full day — about 10 hours'],
                   ['20', 'Two days'],
                   ['30', 'Three days or more']] },

          { id: 'location_type', label: 'Where?', type: 'select', req: 1, half: 1,
            opts: [['studio', 'A studio'], ['client_site', 'Our premises'],
                   ['on_location', 'On location'], ['multiple_mixed', 'Several places']] },

          { id: 'location_city', label: 'Which town or city?', type: 'text', req: 1, half: 1 },

          { id: 'travel_band', label: 'Roughly how far from Cape Town?', type: 'select',
            half: 1, unsure: 1,
            opts: [['0', 'Local — within about 40 km'],
                   ['120', 'An hour or two away'],
                   ['400', 'Further than that']] },

          { id: 'shoot_dates', label: 'Preferred dates', type: 'text', req: 1,
            placeholder: 'e.g. mid-November, or a fixed date if it cannot move' },

          { id: 'kit', label: 'Does the shoot need any of these?', type: 'multi',
            opts: [['drone', 'Aerial / drone footage'],
                   ['movement', 'Gimbal, jib or dolly'],
                   ['extra_cam', 'A second camera running'],
                   ['big_light', 'Full lighting setup'],
                   ['prompter', 'Teleprompter'],
                   ['livestream', 'Live streaming'],
                   ['set', 'A built set or backdrop'],
                   ['talent', 'Actors or presenters we cast'],
                   ['studio_hire', 'Studio hire']] }
        ] },

      { title: 'Editing & style', short: 'Post',
        note: 'Post is usually about half a video budget, so these matter.',
        fields: [
          { id: 'edit_complexity', label: 'How involved is the edit?', type: 'select',
            req: 1, half: 1,
            opts: [['assembly_light', 'Simple — straightforward assembly'],
                   ['standard_narrative', 'Standard — a told story'],
                   ['heavy_multicam', 'Heavy — multicam or lots of footage']] },

          { id: 'finish_level', label: 'How polished should it look?', type: 'select',
            req: 1, half: 1,
            opts: [['simple', 'Clean and simple — colour corrected'],
                   ['polished', 'Polished — full grade, titles and lower thirds'],
                   ['premium', 'Premium — cinematic grade and custom graphics']] },

          { id: 'music', label: 'Music', type: 'select', req: 1, half: 1,
            opts: [['none', 'None needed'], ['library_track', 'A licensed library track'],
                   ['custom_composed', 'Originally composed'],
                   ['licensed_commercial', 'A song you already have in mind']] },

          { id: 'turnaround', label: 'How soon do you need it?', type: 'select',
            req: 1, half: 1,
            opts: [['standard_4wk', 'Four weeks is fine'],
                   ['expedited_2wk', 'Within two weeks'],
                   ['rush_5day', 'Within five days']] },

          { id: 'post_extras', label: 'Anything else in post?', type: 'multi',
            opts: [['subtitles', 'Subtitles or captions'],
                   ['voiceover', 'A voiceover we cast and record'],
                   ['cutdowns', 'Short cutdowns for social'],
                   ['vertical', 'A vertical version'],
                   ['extra_revision', 'An extra round of revisions'],
                   ['raw', 'The raw footage afterwards'],
                   ['script', 'Help writing the script']] },

          { id: 'notes', label: 'Anything we should know?', type: 'textarea', rows: 3,
            placeholder: 'References, must-have shots, people to interview…' },

          { id: 'template_choice', label: 'Proposal style', type: 'select', req: 1,
            opts: [['let_us_recommend', 'Pick one for me'],
                   ['corporate_brand', 'Corporate — strategic, stands alone'],
                   ['event_coverage', 'Event — run of show and logistics'],
                   ['commercial_ad', 'Commercial — treatment led']] }
        ] }
    ],

    calc: function (s, h) {
      var flags = [], deferred = [], assumed = [];
      var kit = function (k) { return h.has('kit', k); };
      var pe  = function (k) { return h.has('post_extras', k); };

      var hrs = h.num('shoot_length', 0);
      if (!hrs) { hrs = 10; flags.push('shoot_length_estimated'); }
      var days = Math.max(1, Math.ceil(hrs / 10));

      var runtimeSec = h.num('runtime_band', 0);
      if (!runtimeSec) { runtimeSec = 90; flags.push('runtime_estimated'); }
      var runtimeMin = runtimeSec / 60;
      var count = Math.max(1, h.num('deliverable_count', 1));

      /* --- Pre-production --- */
      var preproDays = Math.max(1, Math.ceil(days * 0.75));
      var PREPRO = preproDays * R.PREPRO_DAY;
      var SCRIPT = pe('script') ? runtimeMin * R.SCRIPT_MIN : 0;
      var pre = [{ label: 'Planning & producing', qty: preproDays, unit: 'days', amount: PREPRO }];
      if (SCRIPT) pre.push({ label: 'Scriptwriting', qty: runtimeMin.toFixed(1), unit: 'min', amount: SCRIPT });
      var PRE = PREPRO + SCRIPT;

      /* --- Production: flat base plus hourly --- */
      var SHOOT = R.SHOOT_BASE + hrs * R.SHOOT_HOUR;
      var prod = [{ label: 'Shooting — $' + R.SHOOT_BASE + ' base plus $' + R.SHOOT_HOUR + '/hr',
                    qty: hrs, unit: 'hrs', amount: SHOOT }];

      function kitLine(on, label, amount, qty, unit) {
        if (!on || !amount) return 0;
        prod.push({ label: label, qty: qty != null ? qty : null, unit: unit || '', amount: amount });
        return amount;
      }
      var EXTRAS = 0;
      EXTRAS += kitLine(kit('drone'), 'Aerial — licensed pilot', R.DRONE_DAY * days, days, 'days');
      EXTRAS += kitLine(kit('movement'), 'Gimbal, jib or dolly', R.MOVEMENT_DAY * days, days, 'days');
      EXTRAS += kitLine(kit('extra_cam'), 'Second camera', R.EXTRA_CAM_DAY * days, days, 'days');
      EXTRAS += kitLine(kit('big_light'), 'Full lighting setup', R.BIG_LIGHT_DAY * days, days, 'days');
      EXTRAS += kitLine(kit('prompter'), 'Teleprompter', R.PROMPTER_DAY * days, days, 'days');
      EXTRAS += kitLine(kit('livestream'), 'Live streaming', R.LIVESTREAM_DAY * days, days, 'days');
      EXTRAS += kitLine(kit('set'), 'Set or backdrop', R.SET);
      EXTRAS += kitLine(kit('talent'), 'Talent — session fees', R.TALENT_DAY * days, 1, 'person');
      EXTRAS += kitLine(kit('studio_hire'), 'Studio hire', R.STUDIO_DAY * days, days, 'days');

      if (kit('drone')) flags.push('drone_airspace');
      if (kit('talent')) assumed.push('one presenter or actor — tell us if you need more');

      var PROD = SHOOT + EXTRAS;

      /* --- Post --- */
      var footage = days * 6 * (kit('extra_cam') ? 2 : 1);
      var ratio = h.pick('edit_complexity',
        { assembly_light: 1.5, standard_narrative: 3, heavy_multicam: 5 }, 3);
      var editHours = footage * 0.6 + runtimeMin * ratio * 2.5;

      var multi = 1 + 0.65 * (count - 1);
      var INGEST = footage * 0.4 * R.INGEST_HOUR;
      var EDIT = editHours * R.EDIT_HOUR * multi;
      var finish = s.finish_level || 'simple';
      var GRADE = runtimeMin * R.GRADE[finish] * multi;
      var MGFX = R.MGFX[finish];
      var MIX = runtimeMin * R.MIX_MIN * multi;

      var MUSIC = 0;
      if (s.music === 'library_track') MUSIC = R.MUSIC_LIB;
      else if (s.music === 'custom_composed') MUSIC = runtimeMin * R.MUSIC_CUSTOM_MIN;
      else if (s.music === 'licensed_commercial') {
        flags.push('sync_license_manual_quote');
        deferred.push({ label: 'Licence for a commercially released song', reason:
          'Sync rights are quoted by the rights holders and vary enormously. ' +
          'Guessing would be worse than leaving it out — tell us the track and ' +
          'we will get a real number, with library alternatives alongside it.' });
      }

      var VO = pe('voiceover') ? R.VO : 0;
      var SUBS = pe('subtitles') ? runtimeMin * R.SUBTITLE_MIN : 0;
      var CUTDOWNS = (pe('cutdowns') ? 2 * R.CUTDOWN : 0) + (pe('vertical') ? R.CUTDOWN : 0);
      if (pe('cutdowns')) assumed.push('two social cutdowns');

      var tmult = h.pick('turnaround', { standard_4wk: 1, expedited_2wk: 1.3, rush_5day: 1.75 }, 1);
      var core = INGEST + EDIT + GRADE + MGFX + MIX + MUSIC + VO + SUBS + CUTDOWNS;
      var EXTRA_REV = pe('extra_revision') ? R.REVISION : 0;
      var RAW = pe('raw') ? R.RAW : 0;
      var POST = core * tmult + EXTRA_REV + RAW;

      var post = [
        { label: 'Ingest, sync and selects', qty: footage.toFixed(0), unit: 'hrs footage', amount: INGEST },
        { label: 'Edit' + (count > 1 ? ' — ' + count + ' videos' : ''),
          qty: editHours.toFixed(0), unit: 'hrs', amount: EDIT },
        { label: 'Colour grade', qty: runtimeMin.toFixed(1), unit: 'min', amount: GRADE }
      ];
      if (MGFX) post.push({ label: 'Titles and motion graphics', qty: null, amount: MGFX });
      post.push({ label: 'Sound mix', qty: runtimeMin.toFixed(1), unit: 'min', amount: MIX });
      if (MUSIC) post.push({ label: 'Music', qty: null, amount: MUSIC });
      if (VO) post.push({ label: 'Voiceover — casting and record', qty: null, amount: VO });
      if (SUBS) post.push({ label: 'Subtitles', qty: runtimeMin.toFixed(1), unit: 'min', amount: SUBS });
      if (CUTDOWNS) post.push({ label: 'Cutdowns and versions', qty: null, amount: CUTDOWNS });
      if (tmult > 1) post.push({ label: 'Faster turnaround', qty: null, amount: core * (tmult - 1) });
      if (EXTRA_REV) post.push({ label: 'Extra revision round', qty: null, amount: EXTRA_REV });
      if (RAW) post.push({ label: 'Raw footage handover', qty: null, amount: RAW });

      if (POST / (PRE + PROD + POST) < 0.30) flags.push('post_underweighted');
      if (assumed.length) flags.push('assumptions_made');

      /* --- Licence --- */
      var pts = { internal_only: 0, website: 1, organic_social: 1, trade_show: 2,
                  paid_social: 4, youtube_preroll: 4, ooh_screens: 5, cinema: 6,
                  broadcast_tv: 7 };
      var dist = 0;
      Object.keys(pts).forEach(function (k) { if (h.has('distribution', k)) dist += pts[k]; });
      var term = h.pick('usage_term', { '6_months': 0.8, '1_year': 1, '3_years': 1.5, perpetual: 2 }, 1);
      var terr = h.pick('usage_territory', { local: 1, national: 1.3, worldwide: 1.6 }, 1);
      var lic = 1 + (dist * 0.05 * term * terr);

      if (h.has('distribution', 'broadcast_tv') || h.has('distribution', 'cinema')) {
        flags.push('broadcast_usage_manual_review');
      }
      if (kit('talent')) {
        deferred.push({ label: 'Talent usage buyout', reason:
          'Session fees are above. A buyout depends on where the film runs and for ' +
          'how long, and is set by a person rather than a formula.' });
      }

      /* --- Travel --- */
      var km = h.num('travel_band', 0);
      var travel = km > 40 ? (km - 40) * R.MILEAGE * 2 * days : 0;
      var lodging = 0;
      if (km > 250) { lodging = R.PER_DIEM * 2 * Math.max(1, days - 1); flags.push('travel_manual_review'); }

      return {
        base: PRE + PROD, addOns: POST,
        rushableBase: PRE + PROD,
        licensableBase: PRE + PROD + POST,
        licenseMultiplier: lic,
        travel: travel, lodging: lodging,
        assumed: assumed,
        phases: [
          { name: 'Before the shoot', items: pre },
          { name: 'The shoot', items: prod },
          { name: 'Editing', items: post }
        ],
        flags: flags, deferred: deferred,
        paymentSchedule: (PRE + PROD + POST) >= 15000
          ? [{ milestone: 'On signature', pct: 0.4 },
             { milestone: 'On first cut', pct: 0.3 },
             { milestone: 'On delivery', pct: 0.3 }]
          : [{ milestone: 'On signature', pct: 0.5 }, { milestone: 'On delivery', pct: 0.5 }],
        tiers: {
          good: ['Less shooting time', 'Simple colour correction',
                 'Two rounds of revisions', 'One version, one ratio'],
          standard: ['Exactly as you have scoped it'],
          premium: ['More shooting time', 'Full lighting setup',
                    'Cinematic grade and custom graphics', 'Social cutdowns included',
                    'Faster turnaround']
        },
        excludes: [
          'Raw footage, unless ticked above',
          'Licences for commercially released music',
          'Talent usage renewals beyond the agreed term',
          'Media buying and ad spend',
          'Permits and location fees',
          'Re-shoots caused by changes to an approved script'
        ],
        timeline: [
          'Contract and deposit',
          'Creative kickoff',
          'Script and shot list signed off — your gate, and the usual cause of delay',
          days + ' shoot day' + (days === 1 ? '' : 's'),
          'First cut',
          'Two rounds of revisions',
          'Grade, mix and delivery — ' + h.pick('turnaround',
            { standard_4wk: 'four weeks', expedited_2wk: 'two weeks', rush_5day: 'five days' },
            'four weeks') + ' after the last shoot day'
        ]
      };
    },

    flagNotes: {
      assumptions_made:
        'Where you ticked an extra we assumed a sensible size for it — one presenter, ' +
        'two social cutdowns. Tell us if that is wrong and we will re-quote.',
      shoot_length_estimated:
        'You were not sure how much shooting time this needs, so we have assumed a ' +
        'full day. It moves the total more than anything else here.',
      runtime_estimated: 'Runtime was left open, so we have assumed about 90 seconds.',
      sync_license_manual_quote:
        'The song you mentioned is deliberately not in the figure above. Sync licences ' +
        'are quoted by the rights holders — tell us the track and we will chase a real ' +
        'number, and bring library alternatives that get close for a fraction of it.',
      broadcast_usage_manual_review:
        'Because this runs on TV or in cinema, usage terms and any talent buyout need ' +
        'setting properly rather than estimating. Those sit outside the figure above.',
      drone_airspace:
        'Aerial work is flown by a licensed pilot and depends on airspace clearance and ' +
        'weather. Clearance is never guaranteed — if we cannot get it, that line comes ' +
        'out and is credited back.',
      post_underweighted:
        'Post is coming out low against production here. On most films it is nearer ' +
        'half the budget, so we will sanity-check the edit inputs before firming up.',
      lead_time_infeasible:
        'Your date is very close. The estimate carries a rush fee, but we need to ' +
        'confirm availability before you rely on it.',
      travel_manual_review:
        'That distance means overnight travel. The figure shown is a placeholder.'
    },

    email: function (s, est, h) {
      var first = (s.client_name || '').split(' ')[0];
      var sec = h.num('runtime_band', 90);
      var runLabel = sec >= 120 ? Math.round(sec / 60) + '-minute' : sec + '-second';
      var hrs = h.num('shoot_length', 10);

      return {
        subject: (s.project_name || 'Your project') + ' — video proposal from Kriel Ventures',
        body:
          'Hi ' + first + ',\n\n' +
          'Thanks for the detail on ' + (s.project_name || 'your project') +
          ' — it makes for a much more\nhonest estimate than most briefs allow.\n\n' +
          '  The film    ' + runLabel + ' ' + (s.video_type || 'video').replace(/_/g, ' ') + '\n' +
          '  Shooting    ' + hrs + ' hours, ' + (s.shoot_dates || 'dates to confirm') + '\n' +
          '  Delivery    ' + h.pick('turnaround', { standard_4wk: '4 weeks',
            expedited_2wk: '2 weeks', rush_5day: '5 days' }, '4 weeks') +
            ' after the last shoot day\n' +
          '  Estimate    $' + Math.round(est.tiers.good.low || est.tiers.good.amount).toLocaleString('en-US') +
            ' – $' + Math.round(est.tiers.premium.high || est.tiers.premium.amount).toLocaleString('en-US') + '\n\n' +
          'The estimate is split into planning, shooting and editing so you can see\n' +
          'where the money actually goes. Post is usually about half a video budget,\n' +
          'and a proposal that hides that is a proposal that runs over.\n\n' +
          (est.confidence === 'preliminary'
            ? 'A few details were still open, so this is a range rather than a fixed\nfigure. A short call would tighten it.\n\n' : '') +
          'Josh\nKriel Ventures\njosh@kriel.us'
      };
    }
  };
})();
