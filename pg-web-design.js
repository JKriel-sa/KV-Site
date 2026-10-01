/* ==========================================================================
   Proposal generator — Web Design
   Implements proposal-generators/03-web-design/. Estimated in hours per phase,
   then priced, so a producer can argue with one number rather than the total.

   The two questions that drove the price — total pages and number of distinct
   layouts — were also the two nobody could answer. They are now one "how big"
   choice with both numbers behind it, stated back on the estimate so the
   assumption is visible rather than hidden.
   ========================================================================== */
(function () {
  'use strict';

  var R = {
    STRATEGY: 145, DESIGN: 125, DEV: 135, SEO: 120, PM: 110, QA: 90,
    TRAINING: 110, RETAINER: 125,
    COPY_PAGE: 350, MIGRATE_PAGE: 45, ICON: 60, SPOT: 450,
    PRODUCT_ENTRY: 6, LANGUAGE_UPLIFT: 0.35
  };

  /* pages, distinct layouts, and an overhead factor.
     `oh` scales the parts of design that do not grow with page count —
     concept exploration and the design system. Without it the fixed overheads
     dominate a small job and a single landing page prices like a small site,
     which is both wrong and the fastest way to lose the enquiry. */
  var SIZE = {
    landing:  { p: 1,  t: 1,  oh: 0.35, label: 'a single landing page' },
    small:    { p: 6,  t: 4,  oh: 0.70, label: 'about 6 pages from 4 layouts' },
    standard: { p: 14, t: 7,  oh: 1.00, label: 'about 14 pages from 7 layouts' },
    large:    { p: 30, t: 11, oh: 1.15, label: 'about 30 pages from 11 layouts' }
  };

  var INTEGRATION_HOURS = {
    analytics: 2, mailing_list: 5, crm: 8, bookings: 12, payments: 10,
    chat: 3, reviews: 5, maps: 3, social: 4, custom_api: 28
  };

  var CMS_FACTOR = {
    no_cms_static: 0.80, squarespace: 0.75, webflow: 0.90, wordpress: 1.00,
    shopify: 1.00, headless: 1.35
  };

  function isShop(s, h) { return s.site_type === 'ecommerce' || h.has('features', 'shop'); }

  window.PG_CONFIG = {
    service: 'Web Design',
    standardLeadDays: 70,
    taxRate: 0,

    sections: [
      window.PG_INTAKE,

      { title: 'The site', short: 'Site',
        note: 'What it is and roughly how big.',
        fields: [
          { id: 'site_type', label: 'What kind of site?', type: 'select', req: 1,
            opts: [['brochure_marketing', 'Marketing or brochure site'],
                   ['portfolio', 'Portfolio'],
                   ['ecommerce', 'Online store'],
                   ['booking_service', 'Bookings or services'],
                   ['saas_marketing', 'Product or SaaS site'],
                   ['blog_publication', 'Blog or publication'],
                   ['landing_page', 'A single landing page'],
                   ['other', 'Something else']] },

          { id: 'project_nature', label: 'New site or an existing one?', type: 'select',
            req: 1, half: 1,
            opts: [['new_build', 'Brand new'],
                   ['redesign_same_content', 'Redesign, same content'],
                   ['redesign_and_restructure', 'Redesign and restructure'],
                   ['migration_only', 'Move it to a new platform']] },

          { id: 'current_url', label: 'Current website', type: 'url', half: 1,
            when: function (s) { return s.project_nature && s.project_nature !== 'new_build'; },
            placeholder: 'https://' },

          { id: 'size_band', label: 'Roughly how big?', type: 'select', req: 1, unsure: 1,
            help: 'A rough idea is fine. What drives the cost is how many pages ' +
                  'need their own layout, not the page count itself.',
            opts: [['landing',  'One page'],
                   ['small',    'Small — a handful of pages'],
                   ['standard', 'Standard — a dozen or so'],
                   ['large',    'Large — thirty or more']] },

          { id: 'product_band', label: 'How many products?', type: 'select', req: 1,
            half: 1, when: isShop,
            opts: [['20', 'Under 25'], ['60', '25 to 100'],
                   ['250', '100 to 500'], ['800', 'More than 500']] }
        ] },

      { title: 'Design & content', short: 'Design',
        note: 'The copy question matters more than it looks — late content is the ' +
              'single most common reason a launch date slips.',
        fields: [
          { id: 'design_direction', label: 'How should it look?', type: 'select',
            req: 1, half: 1,
            opts: [['use_a_theme_template', 'Start from a good theme'],
                   ['follow_our_brand', 'Follow our existing brand'],
                   ['evolve_our_brand', 'Evolve our brand'],
                   ['fresh_concept', 'Something designed from scratch']] },

          { id: 'copywriting', label: 'Who writes the words?', type: 'select', req: 1,
            half: 1,
            opts: [['client_provides_all', 'We will'],
                   ['client_drafts_we_edit', 'We draft, you polish'],
                   ['we_write_all', 'Please write it for us']] },

          { id: 'accessibility_target', label: 'Accessibility', type: 'select', req: 1,
            half: 1,
            help: 'WCAG 2.2 AA is a legal requirement in many contexts.',
            opts: [['best_effort', 'Sensible defaults'],
                   ['wcag_22_aa', 'WCAG 2.2 AA — tested and certified']] },

          { id: 'features', label: 'What does the site need to do?', type: 'multi',
            opts: [['blog', 'A blog or news section'],
                   ['shop', 'Sell things online'],
                   ['bookings', 'Take bookings or appointments'],
                   ['login', 'A members or client login'],
                   ['search', 'Search and filtering'],
                   ['multilingual', 'More than one language'],
                   ['illustration', 'Custom illustration or icons'],
                   ['animation', 'Rich scroll animation']] }
        ] },

      { title: 'Build & launch', short: 'Build',
        fields: [
          { id: 'cms_preference', label: 'Any platform preference?', type: 'select',
            req: 1, half: 1,
            opts: [['recommend_for_me', 'Recommend one for me'],
                   ['wordpress', 'WordPress'], ['webflow', 'Webflow'],
                   ['shopify', 'Shopify'], ['squarespace', 'Squarespace'],
                   ['headless', 'Something headless'],
                   ['no_cms_static', 'No CMS needed']] },

          { id: 'seo_scope', label: 'How much SEO?', type: 'select', req: 1, half: 1,
            opts: [['none', 'None for now'],
                   ['technical_basics', 'Technical basics'],
                   ['technical_plus_onpage', 'Technical plus on-page'],
                   ['full_strategy_content', 'Full strategy and content']] },

          { id: 'integrations', label: 'Anything it has to connect to?', type: 'multi',
            help: 'Each one is a dependency on someone else, so they are priced ' +
                  'one at a time rather than bundled.',
            opts: [['analytics', 'Google Analytics'],
                   ['mailing_list', 'A mailing list — Mailchimp, Klaviyo'],
                   ['crm', 'A CRM — HubSpot, Salesforce'],
                   ['bookings', 'A booking system'],
                   ['payments', 'Payments'],
                   ['chat', 'Live chat'],
                   ['reviews', 'Reviews'],
                   ['maps', 'Maps'],
                   ['social', 'Social feeds'],
                   ['custom_api', 'Something custom of ours']] },

          { id: 'launch_support', label: 'After launch?', type: 'select', req: 1, half: 1,
            opts: [['none', 'We will take it from there'],
                   ['30_day_warranty', 'A 30-day warranty'],
                   ['retainer_monthly', 'An ongoing monthly retainer']] },

          { id: 'stakeholder_count', label: 'How many people sign off on design?',
            type: 'select', req: 1, half: 1,
            help: 'Not a trick question — more approvers genuinely takes more time.',
            opts: [['1', 'Just me'], ['3', 'Two or three'], ['6', 'Four or more']] },

          { id: 'notes', label: 'Anything we should know?', type: 'textarea', rows: 3,
            placeholder: 'Sites you like, a fixed deadline, anything unusual…' },

          { id: 'template_choice', label: 'Proposal style', type: 'select', req: 1,
            opts: [['let_us_recommend', 'Pick one for me'],
                   ['minimalist_portfolio', 'Short and visual'],
                   ['ecommerce', 'Store — catalogue, payments, running costs'],
                   ['corporate_site', 'Detailed — assumptions and acceptance criteria']] }
        ] }
    ],

    calc: function (s, h) {
      var flags = [], deferred = [], assumed = [];
      var f = function (k) { return h.has('features', k); };

      var band = SIZE[s.size_band];
      if (!band) { band = SIZE.standard; flags.push('size_estimated'); }
      var P = band.p, T = band.t;
      assumed.push(band.label);

      var complexity =
        (f('animation') ? 1.25 : 1.0) *
        h.pick('design_direction', { use_a_theme_template: 0.7, follow_our_brand: 1,
          evolve_our_brand: 1.1, fresh_concept: 1.25 }, 1);

      var oh = band.oh;
      var stake = Math.max(1, h.num('stakeholder_count', 1));
      var shop = isShop(s, h);

      /* Discovery */
      var discHours = 8 * Math.max(0.5, oh) +
        (s.project_nature !== 'new_build' ? 6 : 0) +
        (shop ? 10 : 0) +
        (f('login') ? 6 : 0) +
        Math.min((Array.isArray(s.integrations) ? s.integrations.length : 0) * 2, 16) +
        (stake > 3 ? (stake - 3) * 2 : 0);
      var DISCOVERY = discHours * R.STRATEGY;

      /* Design */
      var conceptHours = (s.design_direction === 'fresh_concept' ? 34
                       : s.design_direction === 'use_a_theme_template' ? 10 : 24) * oh;
      var templateHours = T * 13;          /* scales with layouts already */
      var systemHours = 12 * oh + (s.accessibility_target === 'wcag_22_aa' ? 8 : 0);
      var designHours = (conceptHours + templateHours + systemHours) * complexity;
      var ILLUS = f('illustration') ? 20 * R.ICON : 0;
      var DESIGN = designHours * R.DESIGN + ILLUS;

      var design = [
        { label: 'Concepts', qty: Math.round(conceptHours * complexity), unit: 'hrs',
          amount: conceptHours * complexity * R.DESIGN },
        { label: T + ' page layouts, desktop and mobile',
          qty: Math.round(templateHours * complexity), unit: 'hrs',
          amount: templateHours * complexity * R.DESIGN },
        { label: 'Design system and components',
          qty: Math.round(systemHours * complexity), unit: 'hrs',
          amount: systemHours * complexity * R.DESIGN }
      ];
      if (ILLUS) design.push({ label: 'Custom icons and illustration', qty: null, amount: ILLUS });

      /* Build */
      var cms = s.cms_preference;
      if (!cms || cms === 'recommend_for_me') {
        cms = shop ? 'shopify'
            : s.site_type === 'blog_publication' ? 'wordpress'
            : ['portfolio', 'landing_page'].indexOf(s.site_type) !== -1 ? 'webflow' : 'wordpress';
        flags.push('cms_recommended');
      }
      var cmsFactor = CMS_FACTOR[cms] || 1;

      var buildHours = T * 11 + Math.max(0, P - T) * 0.8 + 10 +
        (f('blog') ? 8 : 0) +
        (f('search') ? 12 : 0) +
        (f('login') ? 24 : 0) +
        (f('bookings') ? 16 : 0) +
        (s.accessibility_target === 'wcag_22_aa' ? 0.9 * T : 0);
      buildHours *= complexity * cmsFactor;

      var intHours = 0;
      (Array.isArray(s.integrations) ? s.integrations : []).forEach(function (k) {
        intHours += INTEGRATION_HOURS[k] || 4;
      });
      if (h.has('integrations', 'custom_api')) flags.push('custom_api_scope_review');
      var INTEGRATIONS = intHours * R.DEV;

      var LANGUAGES = f('multilingual') ? R.LANGUAGE_UPLIFT * (DESIGN + buildHours * R.DEV) : 0;
      if (LANGUAGES) assumed.push('one additional language');

      var build = [{ label: 'Front-end and CMS build (' + cms.replace(/_/g, ' ') + ')',
                     qty: Math.round(buildHours), unit: 'hrs', amount: buildHours * R.DEV }];
      if (INTEGRATIONS) build.push({ label: s.integrations.length + ' integrations',
        qty: intHours, unit: 'hrs', amount: INTEGRATIONS });
      if (LANGUAGES) build.push({ label: 'Second language', qty: null, amount: LANGUAGES });
      var BUILD = buildHours * R.DEV + INTEGRATIONS + LANGUAGES;

      /* Shop */
      var ECOMMERCE = 0;
      if (shop) {
        var products = h.num('product_band', 60);
        var ecomHours = 16 + 8 + 6 + 6;           /* setup, variants, shipping, tax */
        var ENTRY = products > 100 ? 0 : products * R.PRODUCT_ENTRY;
        if (products > 100) assumed.push('a bulk product import rather than hand entry');
        ECOMMERCE = ecomHours * R.DEV + ENTRY;
        build.push({ label: 'Store setup — catalogue, payments, shipping, tax',
          qty: ecomHours, unit: 'hrs', amount: ecomHours * R.DEV });
        if (ENTRY) build.push({ label: 'Product entry', qty: products, unit: 'products', amount: ENTRY });
        deferred.push({ label: 'Platform, app and payment-processing fees', reason:
          'These are yours directly and ongoing — typically $30 to $300 a month ' +
          'depending on the stack. Not ours to charge, and not something you should ' +
          'discover in month one.' });
      }

      /* Content & SEO */
      var content = [];
      var copyPages = P;
      var COPY = s.copywriting === 'we_write_all' ? copyPages * R.COPY_PAGE
               : s.copywriting === 'client_drafts_we_edit' ? copyPages * R.COPY_PAGE * 0.45 : 0;
      if (COPY) content.push({ label: 'Copywriting', qty: copyPages, unit: 'pages', amount: COPY });

      var migPages = s.project_nature !== 'new_build' ? P : 0;
      var MIGRATION = migPages * R.MIGRATE_PAGE;
      if (MIGRATION) content.push({ label: 'Content migration', qty: migPages, unit: 'pages', amount: MIGRATION });

      var seoHours = h.pick('seo_scope', { technical_basics: 8,
        technical_plus_onpage: 8 + P * 0.4, full_strategy_content: 20 + P * 0.7 }, 0) +
        (s.project_nature !== 'new_build' ? 4 + P * 0.15 : 0);
      var SEO = seoHours * R.SEO;
      if (SEO) content.push({ label: 'SEO and redirects', qty: Math.round(seoHours), unit: 'hrs', amount: SEO });
      var CONTENT = COPY + MIGRATION + SEO;

      /* QA, launch, PM */
      var qaHours = (designHours + buildHours) * 0.15;
      var launchHours = 6 + (s.project_nature !== 'new_build' ? 4 : 0);
      var TRAINING = s.launch_support !== 'none' ? 3 * R.TRAINING : 0;
      var LAUNCH = qaHours * R.QA + launchHours * R.DEV + TRAINING;
      var launch = [
        { label: 'Testing across browsers and devices', qty: Math.round(qaHours), unit: 'hrs', amount: qaHours * R.QA },
        { label: 'Launch — DNS, redirects, go-live', qty: launchHours, unit: 'hrs', amount: launchHours * R.DEV }
      ];
      if (TRAINING) launch.push({ label: 'Training and handover', qty: null, amount: TRAINING });

      var pmHours = (discHours + designHours + buildHours + qaHours) * 0.15 * (stake > 3 ? 1.2 : 1);
      var PM = pmHours * R.PM;
      var WARRANTY = s.launch_support === '30_day_warranty' ? BUILD * 0.05 : 0;
      if (WARRANTY) launch.push({ label: '30-day post-launch warranty', qty: null, amount: WARRANTY });

      var ADD_ONS = BUILD + ECOMMERCE + CONTENT + LAUNCH + PM + WARRANTY;
      var SUBTOTAL = DISCOVERY + DESIGN + ADD_ONS;

      if (s.copywriting === 'client_provides_all') flags.push('client_writes_copy');
      if (s.project_nature === 'migration_only') flags.push('migration_audit_needed');
      if (assumed.length) flags.push('assumptions_made');

      var days = (new Date(s.target_completion_date + 'T00:00:00') - new Date()) / 86400000;
      if (days / 70 < 0.6) flags.push('deadline_feasibility_review');

      if (s.launch_support === 'retainer_monthly') {
        deferred.push({ label: 'Monthly retainer — 4 hrs at $' + R.RETAINER + '/hr = $' +
          (4 * R.RETAINER).toLocaleString('en-US') + '/month', reason:
          'Recurring, so it sits outside the project total rather than inflating a ' +
          'figure you would compare against other quotes.' });
      }

      return {
        base: DISCOVERY + DESIGN, addOns: ADD_ONS,
        rushableBase: SUBTOTAL,
        licenseMultiplier: 1,
        travel: 0, lodging: 0,
        assumed: assumed,
        phases: [
          { name: 'Discovery', items: [{ label: 'Discovery, sitemap and planning',
            qty: Math.round(discHours), unit: 'hrs', amount: DISCOVERY }] },
          { name: 'Design', items: design },
          { name: 'Build', items: build },
          { name: 'Content & SEO', items: content },
          { name: 'Testing & launch', items: launch },
          { name: 'Project management', items: [{ label: 'Producing and coordination',
            qty: Math.round(pmHours), unit: 'hrs', amount: PM }] }
        ],
        flags: flags, deferred: deferred,
        paymentSchedule: SUBTOTAL >= 15000
          ? [{ milestone: 'On signature', pct: 0.4 },
             { milestone: 'On design sign-off', pct: 0.3 },
             { milestone: 'On launch', pct: 0.3 }]
          : [{ milestone: 'On signature', pct: 0.5 }, { milestone: 'On launch', pct: 0.5 }],
        tiers: {
          good: ['Fewer distinct layouts', 'Start from a theme',
                 'You write all the copy', 'Technical SEO only',
                 'Integrations deferred to a phase two'],
          standard: ['Exactly as you have scoped it'],
          premium: ['More layouts and a bespoke concept', 'We write the copy',
                    'Full SEO and analytics', 'Richer animation',
                    'Training and documentation']
        },
        excludes: [
          'Hosting, domain and SSL',
          'Third-party subscriptions and app fees',
          'Stock photography licences',
          'Ongoing SEO and content updates after launch',
          'Anything not listed in this scope'
        ],
        timeline: [
          'Discovery — one to two weeks',
          'Design — two to four weeks, your sign-off at the end',
          'Build — three to eight weeks',
          'Content loading — one to two weeks, dependent on your copy arriving',
          'Testing — one week',
          'Launch'
        ]
      };
    },

    flagNotes: {
      assumptions_made:
        'We have had to assume a size to price this. The estimate is built on the ' +
        'figures listed above — if your site is bigger or smaller than that, say so ' +
        'and we will re-quote. Layout count is the single biggest lever here.',
      size_estimated:
        'Site size was left open, so we have assumed a standard site of about a ' +
        'dozen pages. It is worth pinning down before anything else.',
      cms_recommended:
        'We have picked a platform that suits the brief. Happy to talk through why, ' +
        'or to build on something you already have.',
      client_writes_copy:
        'You have said your team will write the copy. That is completely workable and ' +
        'the cheapest option — but it is also where most projects stall. If it starts ' +
        'to drag, say so early: we can pick up part of it mid-project far more easily ' +
        'than we can rescue a launch date.',
      deadline_feasibility_review:
        'Your date is tighter than this scope comfortably allows. Rather than quietly ' +
        'hope, we will come back naming which pieces move to a phase two so the launch ' +
        'date holds.',
      custom_api_scope_review:
        'A custom integration needs a technical call before the number means much. ' +
        'What is shown is based on typical scope.',
      migration_audit_needed:
        'Until we have looked inside the existing site, any figure for moving content ' +
        'is an educated guess. We would suggest a short paid audit first — a few ' +
        'hundred dollars that routinely saves several thousand in surprises.',
      lead_time_infeasible:
        'The target date is very close for a project this size. The honest answer may ' +
        'be a phased launch.'
    },

    email: function (s, est, h) {
      var first = (s.client_name || '').split(' ')[0];
      var band = SIZE[s.size_band] || SIZE.standard;

      return {
        subject: (s.project_name || 'Your site') + ' — website proposal & estimate',
        body:
          'Hi ' + first + ',\n\n' +
          'Thanks for working through that. Here is what we have scoped:\n\n' +
          '  Site        ' + (s.site_type || 'website').replace(/_/g, ' ') +
            ' — ' + band.label + '\n' +
          '  Platform    ' + (s.cms_preference === 'recommend_for_me'
            ? 'our recommendation, explained in the proposal'
            : (s.cms_preference || '').replace(/_/g, ' ')) + '\n' +
          '  Content     ' + h.pick('copywriting', {
            client_provides_all: 'you are writing the copy',
            client_drafts_we_edit: 'you draft, we polish',
            we_write_all: 'we are writing the copy' }, 'to be confirmed') + '\n' +
          '  Estimate    $' + Math.round(est.tiers.good.low || est.tiers.good.amount).toLocaleString('en-US') +
            ' – $' + Math.round(est.tiers.premium.high || est.tiers.premium.amount).toLocaleString('en-US') + '\n\n' +
          'One honest note. Web projects almost never slip because of design or\n' +
          'code — they slip because content arrives late. The timeline assumes copy\n' +
          'and images reach us on the dates in the proposal, and there is a section\n' +
          'listing exactly what we need from you and when. If those dates look\n' +
          'unrealistic, say so now and we will plan around the truth.\n\n' +
          (est.confidence === 'preliminary'
            ? 'Some of the scope was still open, so treat this as a range.\n\n' : '') +
          'Josh\nKriel Ventures\njosh@kriel.us'
      };
    }
  };
})();
