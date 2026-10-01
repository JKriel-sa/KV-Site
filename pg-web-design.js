/* ==========================================================================
   Proposal generator — Web Design
   Implements proposal-generators/03-web-design/. Estimated in hours per phase,
   then priced — so a producer can argue with one number rather than the total.
   ========================================================================== */
(function () {
  'use strict';

  var R = {
    STRATEGY: 145, DESIGN: 125, DEV: 135, CONTENT: 95, SEO: 120, PM: 110,
    QA: 90, TRAINING: 110, RETAINER: 125,
    COPY_PAGE: 350, MIGRATE_PAGE: 45,
    ICON: 60, SPOT: 450, PRODUCT_ENTRY: 6, LANGUAGE_UPLIFT: 0.35
  };

  var INTEGRATION_HOURS = {
    analytics_ga4: 2, email_mailchimp: 4, email_klaviyo: 6, chat_intercom: 3,
    maps: 3, social_feeds: 4, reviews: 5, booking_calendly: 4, crm_hubspot: 8,
    payments: 10, booking_custom: 20, sso: 20, crm_salesforce: 24,
    erp: 32, custom_api: 28
  };

  var CMS_FACTOR = {
    no_cms_static: 0.80, squarespace: 0.75, webflow: 0.90, wordpress: 1.00,
    shopify: 1.00, craft: 1.15, statamic: 1.10, sanity_headless: 1.35,
    contentful_headless: 1.35
  };

  function isEcom(s) {
    return s.site_type === 'ecommerce';
  }

  window.PG_CONFIG = {
    service: 'Web Design',
    standardLeadDays: 70,
    taxRate: 0,

    sections: [
      window.PG_INTAKE,

      { title: 'Purpose', short: 'Purpose',
        note: 'What the site is for, and what\'s there now.',
        fields: [
          { id: 'site_type', label: 'What kind of site?', type: 'select', req: 1,
            opts: [['brochure_marketing', 'Brochure / marketing site'],
                   ['portfolio', 'Portfolio'], ['ecommerce', 'Online store'],
                   ['booking_service', 'Booking or service site'],
                   ['membership_gated', 'Membership / gated'],
                   ['saas_marketing', 'SaaS marketing site'],
                   ['blog_publication', 'Blog or publication'],
                   ['landing_page', 'Single landing page'],
                   ['web_app', 'Web application'], ['other', 'Something else']] },
          { id: 'project_nature', label: 'New build or existing site?', type: 'select', req: 1,
            opts: [['new_build', 'New build'],
                   ['redesign_same_content', 'Redesign, same content'],
                   ['redesign_and_restructure', 'Redesign and restructure'],
                   ['migration_only', 'Migration only'],
                   ['incremental_improvements', 'Incremental improvements']] },
          { id: 'current_url', label: 'Current website', type: 'url', half: 1,
            when: function (s) { return s.project_nature && s.project_nature !== 'new_build'; },
            placeholder: 'https://' },
          { id: 'current_platform', label: 'Current platform', type: 'select', half: 1,
            when: function (s) { return s.project_nature && s.project_nature !== 'new_build'; },
            opts: [['wordpress', 'WordPress'], ['shopify', 'Shopify'],
                   ['squarespace', 'Squarespace'], ['wix', 'Wix'], ['webflow', 'Webflow'],
                   ['custom', 'Something custom'], ['unknown', 'Not sure']] },
          { id: 'primary_goal', label: 'What must the site deliver?', type: 'textarea',
            req: 1, rows: 3 },
          { id: 'target_audience', label: 'Who is it for?', type: 'textarea', req: 1,
            rows: 2 },
          { id: 'success_metric', label: 'How will you judge success?', type: 'text', placeholder: 'Leads per month, revenue, applications…' },
          { id: 'competitor_urls', label: 'Sites you admire or compete with',
            type: 'textarea', rows: 2 }
        ] },

      { title: 'Structure & scope', short: 'Scope',
        note: 'The number that matters most here isn\'t pages — it\'s how many ' +
              'distinct layouts those pages need.',
        fields: [
          { id: 'total_pages', label: 'Total pages at launch', type: 'number', req: 1,
            half: 1, min: 1, unsure: 1 },
          { id: 'unique_templates', label: 'Distinct page layouts needed', type: 'number',
            req: 1, half: 1, min: 1, unsure: 1,
            help: 'A 40-page site built from 6 layouts costs far less than a ' +
                  '12-page site where every page is bespoke. This is the real driver.' },
          { id: 'sitemap_known', label: 'Do you have a sitemap?', type: 'select', req: 1,
            half: 1,
            opts: [['yes_have_one', 'Yes'], ['rough_idea', 'A rough idea'],
                   ['need_help', 'We need help with it']] },
          { id: 'languages', label: 'Number of languages', type: 'number', half: 1,
            min: 1, placeholder: '1' },
          { id: 'blog_required', label: 'Blog or news section', type: 'bool' },
          { id: 'search_required', label: 'On-site search', type: 'select', half: 1,
            opts: [['none', 'None'], ['basic', 'Basic'],
                   ['faceted_filtered', 'Faceted / filtered']] },
          { id: 'gated_content', label: 'Login or member area', type: 'bool' },
          { id: 'user_accounts_expected', label: 'Roughly how many users', type: 'select',
            half: 1, when: function (s) { return s.gated_content === true; },
            opts: [['<100', 'Under 100'], ['100_1k', '100 – 1,000'],
                   ['1k_10k', '1,000 – 10,000'], ['10k_plus', 'Over 10,000']] },
          { id: 'forms_count', label: 'Number of forms', type: 'number', half: 1 },

          /* --- E-commerce --- */
          { id: 'product_count', label: 'Products at launch', type: 'number', req: 1,
            half: 1, when: isEcom },
          { id: 'variant_complexity', label: 'Variants per product', type: 'select',
            req: 1, half: 1, when: isEcom,
            opts: [['none', 'None'], ['simple_1_axis', 'Simple — one axis'],
                   ['complex_multi_axis', 'Complex — several axes'],
                   ['configurable_custom', 'Fully configurable']] },
          { id: 'product_data_source', label: 'Where does product data come from?',
            type: 'select', req: 1, when: isEcom,
            opts: [['client_spreadsheet', 'A spreadsheet we\'ll supply'],
                   ['existing_platform_export', 'Export from our current platform'],
                   ['erp_pim_feed', 'An ERP or PIM feed'],
                   ['manual_entry_needed', 'It needs entering by hand']] },
          { id: 'payment_gateways', label: 'Payment methods', type: 'multi', req: 1,
            when: isEcom,
            opts: [['stripe', 'Stripe'], ['paypal', 'PayPal'],
                   ['apple_google_pay', 'Apple / Google Pay'],
                   ['klarna_bnpl', 'Klarna or buy-now-pay-later'],
                   ['bank_transfer', 'Bank transfer'], ['regional_other', 'Something regional']] },
          { id: 'shipping_logic', label: 'Shipping rules', type: 'select', req: 1,
            half: 1, when: isEcom,
            opts: [['flat_rate', 'Flat rate'], ['weight_zone_based', 'Weight or zone based'],
                   ['live_carrier_rates', 'Live carrier rates'],
                   ['local_delivery_pickup', 'Local delivery or pickup']] },
          { id: 'tax_complexity', label: 'Tax handling', type: 'select', req: 1,
            half: 1, when: isEcom,
            opts: [['single_jurisdiction', 'One jurisdiction'],
                   ['multi_state_country', 'Several states or countries'],
                   ['automated_service', 'An automated tax service']] },
          { id: 'subscriptions', label: 'Subscription products', type: 'bool', when: isEcom },
          { id: 'b2b_pricing', label: 'Wholesale or customer-specific pricing',
            type: 'bool', when: isEcom },
          { id: 'inventory_sync', label: 'Inventory sync with another system',
            type: 'bool', when: isEcom }
        ] },

      { title: 'Design & content', short: 'Design',
        note: 'Content is the single most common reason web projects slip. The ' +
              'copywriting question below matters more than it looks.',
        fields: [
          { id: 'brand_assets', label: 'Brand identity', type: 'select', req: 1, half: 1,
            opts: [['full_guidelines', 'We have full guidelines'],
                   ['logo_only', 'A logo, not much else'],
                   ['needs_refresh', 'It needs a refresh'],
                   ['none_need_branding', 'There isn\'t one yet']] },
          { id: 'design_direction', label: 'Design approach', type: 'select', req: 1, half: 1,
            opts: [['follow_our_brand', 'Follow our brand'],
                   ['evolve_our_brand', 'Evolve our brand'],
                   ['fresh_concept', 'A fresh concept'],
                   ['use_a_theme_template', 'Start from a theme']] },
          { id: 'design_concepts', label: 'Concept rounds', type: 'select', req: 1, half: 1,
            opts: [['1_direction', 'One direction'], ['2_directions', 'Two directions'],
                   ['3_directions', 'Three directions']] },
          { id: 'motion_interaction', label: 'Animation and interaction', type: 'select',
            req: 1, half: 1,
            opts: [['none_static', 'Static'], ['subtle_transitions', 'Subtle transitions'],
                   ['rich_scroll_motion', 'Rich scroll motion'],
                   ['showcase_experimental', 'Showcase / experimental']] },
          { id: 'custom_illustration', label: 'Custom illustration or iconography',
            type: 'select', half: 1,
            opts: [['none', 'None'], ['icon_set', 'An icon set'],
                   ['spot_illustrations', 'Spot illustrations'],
                   ['full_illustrated_system', 'A full illustrated system']] },
          { id: 'photography_needed', label: 'Photography', type: 'select', half: 1,
            opts: [['no_have_assets', 'We have our own'], ['stock_ok', 'Stock is fine'],
                   ['need_shoot', 'We need a shoot']] },
          { id: 'copywriting', label: 'Who writes the copy?', type: 'select', req: 1,
            help: 'Be honest here. "We\'ll write it" is the cheapest option and ' +
                  'the most common reason a launch date slips.',
            opts: [['client_provides_all', 'We will, all of it'],
                   ['client_drafts_we_edit', 'We\'ll draft, you edit'],
                   ['we_write_all', 'Please write it']] },
          { id: 'copy_pages', label: 'Pages needing copy from us', type: 'number', half: 1,
            when: function (s) {
              return ['client_drafts_we_edit', 'we_write_all'].indexOf(s.copywriting) !== -1; } },
          { id: 'content_migration_pages', label: 'Existing pages to migrate',
            type: 'number', half: 1,
            when: function (s) { return s.project_nature && s.project_nature !== 'new_build'; } },
          { id: 'accessibility_target', label: 'Accessibility conformance', type: 'select',
            req: 1, half: 1,
            help: 'WCAG 2.2 AA is a legal requirement in many contexts. It costs ' +
                  'real hours, so it\'s scope rather than a nice-to-have.',
            opts: [['best_effort', 'Best effort'], ['wcag_22_aa', 'WCAG 2.2 AA'],
                   ['wcag_22_aaa', 'WCAG 2.2 AAA']] },
          { id: 'prototype_required', label: 'Interactive prototype before build', type: 'bool' }
        ] },

      { title: 'Build & SEO', short: 'Build',
        note: 'Every integration is a dependency on somebody else\'s uptime, so ' +
              'they\'re priced one at a time rather than bundled.',
        fields: [
          { id: 'cms_preference', label: 'CMS preference', type: 'select', req: 1, half: 1,
            opts: [['recommend_for_me', 'Recommend one for me'], ['wordpress', 'WordPress'],
                   ['webflow', 'Webflow'], ['shopify', 'Shopify'],
                   ['squarespace', 'Squarespace'], ['craft', 'Craft'],
                   ['statamic', 'Statamic'], ['sanity_headless', 'Sanity (headless)'],
                   ['contentful_headless', 'Contentful (headless)'],
                   ['no_cms_static', 'No CMS — static']] },
          { id: 'cms_editing_depth', label: 'How much should you be able to edit?',
            type: 'select', req: 1, half: 1,
            opts: [['text_images_only', 'Text and images only'],
                   ['full_page_building', 'Build whole pages'],
                   ['structured_content_types', 'Structured content types']] },
          { id: 'hosting', label: 'Hosting', type: 'select', req: 1, half: 1,
            opts: [['client_has', 'We have it'], ['we_arrange', 'Please arrange it'],
                   ['need_advice', 'We need advice']] },
          { id: 'integrations', label: 'Third-party integrations', type: 'multi',
            opts: [['analytics_ga4', 'Google Analytics'], ['email_mailchimp', 'Mailchimp'],
                   ['email_klaviyo', 'Klaviyo'], ['crm_hubspot', 'HubSpot'],
                   ['crm_salesforce', 'Salesforce'], ['booking_calendly', 'Calendly'],
                   ['booking_custom', 'Custom booking'], ['payments', 'Payments'],
                   ['chat_intercom', 'Live chat'], ['reviews', 'Reviews'],
                   ['maps', 'Maps'], ['social_feeds', 'Social feeds'],
                   ['sso', 'Single sign-on'], ['erp', 'ERP'],
                   ['custom_api', 'A custom API']] },
          { id: 'integration_notes', label: 'Describe any custom integration',
            type: 'textarea', rows: 2,
            when: function (s, h) { return h.has('integrations', 'custom_api') || h.has('integrations', 'erp'); } },
          { id: 'seo_scope', label: 'SEO scope', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['technical_basics', 'Technical basics'],
                   ['technical_plus_onpage', 'Technical plus on-page'],
                   ['full_strategy_content', 'Full strategy and content']] },
          { id: 'keyword_research', label: 'Keyword research', type: 'bool' },
          { id: 'redirect_mapping', label: 'Redirect mapping from old URLs', type: 'bool',
            when: function (s) { return s.project_nature && s.project_nature !== 'new_build'; } },
          { id: 'analytics_setup', label: 'Analytics & conversion tracking', type: 'select',
            half: 1,
            opts: [['none', 'None'], ['ga4_basic', 'Basic'],
                   ['ga4_events_goals', 'Events and goals'], ['full_tag_manager', 'Full tag manager']] },
          { id: 'performance_target', label: 'Performance target', type: 'select',
            half: 1,
            opts: [['standard', 'Standard'], ['core_web_vitals_green', 'Core Web Vitals green'],
                   ['aggressive_optimisation', 'Aggressive optimisation']] },
          { id: 'security_compliance', label: 'Compliance requirements', type: 'multi',
            opts: [['gdpr_cookie_consent', 'GDPR / cookie consent'], ['ccpa', 'CCPA'],
                   ['pci', 'PCI'], ['hipaa', 'HIPAA'], ['soc2', 'SOC 2']] }
        ] },

      { title: 'Launch & aftercare', short: 'Launch',
        fields: [
          { id: 'qa_devices', label: 'Browser and device support', type: 'select',
            req: 1, half: 1,
            opts: [['modern_only', 'Modern browsers only'],
                   ['modern_plus_legacy', 'Modern plus older browsers'],
                   ['specific_list', 'A specific list we\'ll give you']] },
          { id: 'training_required', label: 'CMS training for your team', type: 'select',
            half: 1,
            opts: [['none', 'None'], ['recorded_walkthrough', 'A recorded walkthrough'],
                   ['live_session', 'A live session'], ['full_documentation', 'Full documentation']] },
          { id: 'launch_support', label: 'Post-launch support', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['30_day_warranty', '30-day warranty'],
                   ['retainer_monthly', 'A monthly retainer']] },
          { id: 'retainer_hours', label: 'Monthly retainer hours', type: 'number', half: 1,
            when: function (s) { return s.launch_support === 'retainer_monthly'; } },
          { id: 'stakeholder_count', label: 'People approving the design', type: 'number',
            req: 1, half: 1, min: 1, placeholder: '1',
            help: 'Not a trick question — more approvers genuinely costs more time.' },
          { id: 'hard_deadline', label: 'Is the target date fixed?', type: 'select',
            req: 1, half: 1,
            opts: [['hard_deadline', 'Hard deadline'], ['preferred', 'Preferred'],
                   ['flexible', 'Flexible']] },
          { id: 'deadline_reason', label: 'Why that date?', type: 'text',
            when: function (s) { return s.hard_deadline === 'hard_deadline'; },
            placeholder: 'An event, a campaign, a contract ending…' },

          { id: 'template_choice', label: 'Proposal layout', type: 'select', req: 1,
            opts: [['let_us_recommend', 'Recommend one for me'],
                   ['minimalist_portfolio', 'Minimalist — short, visual, direct'],
                   ['ecommerce', 'E-commerce — catalogue, payments, ongoing costs'],
                   ['corporate_site', 'Corporate — governance, assumptions, acceptance criteria']] },
          { id: 'include_samples', label: 'Include case studies', type: 'bool' }
        ] }
    ],

    /* --------------------------------------------------------------------
       Pricing — 03-web-design/02-proposal-logic.md
       -------------------------------------------------------------------- */
    calc: function (s, h) {
      var flags = [], deferred = [];

      /* §2 normalise */
      var P = h.num('total_pages', 0);
      var T = h.num('unique_templates', 0);
      if (!T || h.unsure('unique_templates')) {
        T = h.clamp(Math.ceil((P || 12) * 0.35), 3, 12);
        flags.push('templates_estimated');
      }
      if (!P || h.unsure('total_pages')) { P = T * 3; flags.push('pages_estimated'); }
      P = Math.max(P, T);

      var complexity =
        h.pick('motion_interaction', { none_static: 0.9, subtle_transitions: 1,
          rich_scroll_motion: 1.25, showcase_experimental: 1.55 }, 1) *
        h.pick('design_direction', { use_a_theme_template: 0.7, follow_our_brand: 1,
          evolve_our_brand: 1.1, fresh_concept: 1.25 }, 1);

      var stakeholders = Math.max(1, h.num('stakeholder_count', 1));

      /* §3 discovery */
      var discHours = 8 +
        h.pick('sitemap_known', { need_help: 10, rough_idea: 5 }, 0) +
        (s.project_nature !== 'new_build' ? 6 : 0) +
        (s.site_type === 'ecommerce' ? 10 : 0) +
        (h.bool('gated_content') ? 6 : 0) +
        Math.min((Array.isArray(s.integrations) ? s.integrations.length : 0) * 2, 16) +
        (stakeholders > 3 ? (stakeholders - 3) * 2 : 0);
      var DISCOVERY = discHours * R.STRATEGY;

      /* §4 design */
      var conceptHours = h.pick('design_concepts',
        { '1_direction': 14, '2_directions': 24, '3_directions': 34 }, 24);
      var templateHours = T * 9 + T * 4;
      var systemHours = 12 +
        (s.cms_editing_depth === 'full_page_building' ? 10 : 0) +
        h.pick('accessibility_target', { wcag_22_aa: 8, wcag_22_aaa: 20 }, 0);
      var protoHours = h.bool('prototype_required') ? T * 2.5 : 0;
      var designHours = (conceptHours + templateHours + systemHours + protoHours) * complexity;

      var ILLUS = h.pick('custom_illustration',
        { icon_set: 20 * R.ICON, spot_illustrations: 6 * R.SPOT,
          full_illustrated_system: 14 * R.SPOT }, 0);
      var DESIGN = designHours * R.DESIGN + ILLUS;

      var design = [
        { label: 'Concepts — ' + h.pick('design_concepts',
            { '1_direction': 'one direction', '2_directions': 'two directions',
              '3_directions': 'three directions' }, 'directions'),
          qty: conceptHours, unit: 'hrs', amount: conceptHours * complexity * R.DESIGN },
        { label: T + ' page layouts, desktop and mobile', qty: Math.round(templateHours * complexity),
          unit: 'hrs', amount: templateHours * complexity * R.DESIGN },
        { label: 'Design system & components', qty: Math.round(systemHours * complexity),
          unit: 'hrs', amount: systemHours * complexity * R.DESIGN }
      ];
      if (protoHours) design.push({ label: 'Interactive prototype',
        qty: Math.round(protoHours * complexity), unit: 'hrs', amount: protoHours * complexity * R.DESIGN });
      if (ILLUS) design.push({ label: 'Custom illustration', qty: null, amount: ILLUS });

      /* §5 build */
      var cms = s.cms_preference;
      if (!cms || cms === 'recommend_for_me') {
        cms = s.site_type === 'ecommerce' ? 'shopify'
            : ['blog_publication', 'brochure_marketing'].indexOf(s.site_type) !== -1 ? 'wordpress'
            : ['portfolio', 'landing_page'].indexOf(s.site_type) !== -1 ? 'webflow' : 'craft';
        flags.push('cms_recommended');
      }
      var cmsFactor = CMS_FACTOR[cms] || 1;

      var buildHours = T * 11 + Math.max(0, P - T) * 0.8 + 10 +
        h.num('forms_count', 0) * 2 +
        (h.bool('blog_required') ? 8 : 0) +
        h.pick('search_required', { basic: 5, faceted_filtered: 22 }, 0) +
        (h.bool('gated_content') ? 24 : 0) +
        h.pick('user_accounts_expected', { '100_1k': 4, '1k_10k': 10, '10k_plus': 20 }, 0) +
        h.pick('cms_editing_depth', { full_page_building: 14, structured_content_types: 20 }, 0) +
        h.pick('accessibility_target', { wcag_22_aa: 0.9 * T, wcag_22_aaa: 2.2 * T }, 0) +
        h.pick('performance_target', { core_web_vitals_green: 10, aggressive_optimisation: 24 }, 0);
      buildHours *= complexity * cmsFactor;

      var intHours = 0;
      (Array.isArray(s.integrations) ? s.integrations : []).forEach(function (k) {
        intHours += INTEGRATION_HOURS[k] || 4;
      });
      if (h.has('integrations', 'erp')) flags.push('erp_integration_scope_review');
      if (h.has('integrations', 'custom_api')) flags.push('custom_api_scope_review');
      var INTEGRATIONS = intHours * R.DEV;

      var langs = Math.max(1, h.num('languages', 1));
      var LANGUAGES = (langs - 1) * R.LANGUAGE_UPLIFT * (DESIGN + buildHours * R.DEV);

      var build = [
        { label: 'Front-end and CMS build (' + cms.replace(/_/g, ' ') + ')',
          qty: Math.round(buildHours), unit: 'hrs', amount: buildHours * R.DEV }
      ];
      if (INTEGRATIONS) build.push({ label: (s.integrations.length) + ' integrations',
        qty: intHours, unit: 'hrs', amount: INTEGRATIONS });
      if (LANGUAGES) build.push({ label: (langs - 1) + ' additional language' + (langs > 2 ? 's' : ''),
        qty: null, amount: LANGUAGES });
      var BUILD = buildHours * R.DEV + INTEGRATIONS + LANGUAGES;

      /* §5B e-commerce */
      var ECOMMERCE = 0;
      if (s.site_type === 'ecommerce') {
        var ecomHours = 16 +
          h.pick('variant_complexity', { simple_1_axis: 6, complex_multi_axis: 18,
            configurable_custom: 40 }, 0) +
          h.pick('product_data_source', { existing_platform_export: 6, client_spreadsheet: 10,
            erp_pim_feed: 24, manual_entry_needed: 4 }, 0) +
          (Array.isArray(s.payment_gateways) ? s.payment_gateways.length : 1) * 3 +
          h.pick('shipping_logic', { flat_rate: 2, weight_zone_based: 8,
            live_carrier_rates: 14, local_delivery_pickup: 10 }, 2) +
          h.pick('tax_complexity', { single_jurisdiction: 2, multi_state_country: 10,
            automated_service: 6 }, 2) +
          (h.bool('subscriptions') ? 20 : 0) +
          (h.bool('b2b_pricing') ? 28 : 0) +
          (h.bool('inventory_sync') ? 18 : 0);
        if (h.bool('b2b_pricing')) flags.push('b2b_pricing_scope_review');

        var products = h.num('product_count', 0);
        var ENTRY = s.product_data_source === 'manual_entry_needed' ? products * R.PRODUCT_ENTRY : 0;
        if (products > 500 && s.product_data_source === 'manual_entry_needed') {
          flags.push('bulk_product_entry');
        }
        ECOMMERCE = ecomHours * R.DEV + ENTRY;
        build.push({ label: 'Store setup — catalogue, payments, shipping, tax',
          qty: Math.round(ecomHours), unit: 'hrs', amount: ecomHours * R.DEV });
        if (ENTRY) build.push({ label: 'Product entry', qty: products, unit: 'products', amount: ENTRY });
      }

      /* §6 content & SEO */
      var content = [];
      var copyPages = h.num('copy_pages', 0);
      var COPY = s.copywriting === 'we_write_all' ? copyPages * R.COPY_PAGE
               : s.copywriting === 'client_drafts_we_edit' ? copyPages * R.COPY_PAGE * 0.45 : 0;
      if (COPY) content.push({ label: 'Copywriting', qty: copyPages, unit: 'pages', amount: COPY });

      var migPages = h.num('content_migration_pages', 0);
      var MIGRATION = migPages * R.MIGRATE_PAGE;
      if (MIGRATION) content.push({ label: 'Content migration', qty: migPages, unit: 'pages', amount: MIGRATION });

      var seoHours = h.pick('seo_scope',
        { technical_basics: 8, technical_plus_onpage: 8 + P * 0.4,
          full_strategy_content: 20 + P * 0.7 }, 0) +
        (h.bool('keyword_research') ? 8 : 0) +
        (h.bool('redirect_mapping') ? 4 + P * 0.15 : 0);
      var SEO = seoHours * R.SEO;
      if (SEO) content.push({ label: 'SEO', qty: Math.round(seoHours), unit: 'hrs', amount: SEO });

      var anaHours = h.pick('analytics_setup',
        { ga4_basic: 2, ga4_events_goals: 6, full_tag_manager: 12 }, 0);
      var ANALYTICS = anaHours * R.DEV;
      if (ANALYTICS) content.push({ label: 'Analytics & tracking', qty: anaHours, unit: 'hrs', amount: ANALYTICS });

      var CONTENT = COPY + MIGRATION + SEO + ANALYTICS;

      /* §7 QA, launch, training */
      var qaHours = (designHours + buildHours) * 0.15 *
        h.pick('qa_devices', { modern_only: 1, modern_plus_legacy: 1.4, specific_list: 1.25 }, 1);
      var launchHours = 6 + (s.project_nature !== 'new_build' ? 4 : 0);
      var TRAINING = h.pick('training_required',
        { recorded_walkthrough: 2, live_session: 3, full_documentation: 8 }, 0) * R.TRAINING;

      var compHours = 0;
      if (h.has('security_compliance', 'gdpr_cookie_consent')) compHours += 6;
      if (h.has('security_compliance', 'ccpa')) compHours += 4;
      if (h.has('security_compliance', 'pci')) compHours += 10;
      if (h.has('security_compliance', 'hipaa') || h.has('security_compliance', 'soc2')) {
        flags.push('regulated_compliance_manual_review');
      }
      var COMPLIANCE = compHours * R.DEV;

      var LAUNCH = qaHours * R.QA + launchHours * R.DEV + TRAINING + COMPLIANCE;

      var launch = [
        { label: 'QA & cross-device testing', qty: Math.round(qaHours), unit: 'hrs', amount: qaHours * R.QA },
        { label: 'Launch — DNS, redirects, go-live', qty: launchHours, unit: 'hrs', amount: launchHours * R.DEV }
      ];
      if (TRAINING) launch.push({ label: 'Training & documentation', qty: null, amount: TRAINING });
      if (COMPLIANCE) launch.push({ label: 'Compliance work', qty: compHours, unit: 'hrs', amount: COMPLIANCE });

      /* §8 PM & aftercare */
      var pmHours = (discHours + designHours + buildHours + qaHours) * 0.15 *
                    (stakeholders > 3 ? 1.2 : 1);
      var PM = pmHours * R.PM;
      var WARRANTY = s.launch_support === '30_day_warranty' ? BUILD * 0.05 : 0;
      if (WARRANTY) launch.push({ label: '30-day post-launch warranty', qty: null, amount: WARRANTY });

      var ADD_ONS = BUILD + ECOMMERCE + CONTENT + LAUNCH + PM + WARRANTY;
      var SUBTOTAL = DISCOVERY + DESIGN + ADD_ONS;

      /* Deadline feasibility — an independent check on top of the rush band. */
      if (s.hard_deadline === 'hard_deadline') {
        var days = (new Date(s.target_completion_date + 'T00:00:00') - new Date()) / 86400000;
        if (days / 70 < 0.6) flags.push('deadline_feasibility_review');
      }
      if (s.brand_assets === 'none_need_branding') flags.push('needs_branding_first');
      if (s.current_platform === 'unknown' || s.project_nature === 'migration_only') {
        flags.push('migration_audit_needed');
      }
      if (s.copywriting === 'client_provides_all') flags.push('client_writes_copy');
      if (s.site_type === 'web_app') flags.push('web_app_scope');

      if (s.launch_support === 'retainer_monthly') {
        deferred.push({ label: 'Monthly retainer — ' + h.num('retainer_hours', 4) +
          ' hrs at $' + R.RETAINER + '/hr = $' +
          (h.num('retainer_hours', 4) * R.RETAINER).toLocaleString('en-US') + '/month',
          reason: 'Recurring, so it sits outside the project total rather than ' +
                  'inflating a figure you\'d compare against other bids.' });
      }
      if (s.site_type === 'ecommerce') {
        deferred.push({ label: 'Platform, app and payment-processing fees',
          reason: 'These are yours directly and ongoing — typically $30–$300 a ' +
                  'month depending on the stack. Not ours to charge, and not ' +
                  'something you should discover in month one.' });
      }

      return {
        base: DISCOVERY + DESIGN,
        addOns: ADD_ONS,
        rushableBase: SUBTOTAL,     /* nothing here carries a turnaround multiplier */
        licenseMultiplier: 1,
        travel: 0, lodging: 0,
        phases: [
          { name: 'Discovery & strategy', items: [
            { label: 'Discovery, sitemap & planning', qty: Math.round(discHours), unit: 'hrs', amount: DISCOVERY }] },
          { name: 'Design', items: design },
          { name: 'Build', items: build },
          { name: 'Content & SEO', items: content },
          { name: 'QA & launch', items: launch },
          { name: 'Project management', items: [
            { label: 'Producing & coordination', qty: Math.round(pmHours), unit: 'hrs', amount: PM }] }
        ],
        flags: flags, deferred: deferred,
        paymentSchedule: SUBTOTAL >= 15000
          ? [{ milestone: 'On signature', pct: 0.4 },
             { milestone: 'On design approval', pct: 0.3 },
             { milestone: 'On launch', pct: 0.3 }]
          : [{ milestone: 'On signature', pct: 0.5 }, { milestone: 'On launch', pct: 0.5 }],
        tiers: {
          good: ['Around 30% fewer unique layouts', 'One design direction',
                 'You write all the copy', 'Technical SEO only',
                 'No custom illustration', 'Integrations deferred to phase two'],
          standard: ['Everything exactly as you\'ve scoped it here'],
          premium: ['More unique layouts', 'An extra design direction',
                    'We write the copy', 'Full SEO and analytics',
                    'Richer motion', 'Prototype, documentation and training']
        },
        excludes: [
          'Hosting, domain and SSL',
          'Third-party SaaS subscriptions and app fees',
          'Stock photography licences',
          'Ongoing SEO and content updates after launch',
          'Any feature not listed in this scope',
          'Any integration not named above'
        ],
        timeline: [
          'Discovery — 1 to 2 weeks',
          'Design — 2 to 4 weeks, with your approval gate at the end',
          'Build — 3 to 8 weeks',
          'Content population — 1 to 2 weeks, dependent on your copy arriving',
          'QA — 1 week',
          'Launch'
        ]
      };
    },

    flagNotes: {
      templates_estimated:
        'You weren\'t sure how many distinct page layouts the site needs, so we\'ve ' +
        'estimated. It\'s the single biggest lever on this price — worth pinning ' +
        'down before anything else.',
      pages_estimated: 'Page count was left open, so it\'s estimated from the layout count.',
      cms_recommended:
        'We\'ve picked a platform that suits the brief. Happy to talk through why, ' +
        'or to build on something you already have.',
      client_writes_copy:
        'You\'ve said your team will write the copy. That is completely workable ' +
        'and it\'s the cheapest option — but it is also where most projects stall. ' +
        'If it starts to drag, say so early: we can pick up part of it mid-project ' +
        'far more easily than we can rescue a launch date.',
      deadline_feasibility_review:
        'Your date is fixed and tighter than this scope comfortably allows. Rather ' +
        'than quietly hope, a producer will come back naming which pieces move to ' +
        'a phase two so the launch date holds.',
      erp_integration_scope_review:
        'The ERP integration is the real unknown here — it depends on their API, ' +
        'their sandbox and their documentation, none of which we control. The ' +
        'figure is realistic but neither of us should treat it as fixed yet.',
      custom_api_scope_review:
        'A custom API integration needs a technical call before the number means ' +
        'anything. What\'s shown is a placeholder based on typical scope.',
      b2b_pricing_scope_review:
        'Customer-specific or wholesale pricing is closer to software than to a ' +
        'storefront setting. It\'s priced here, but a producer will confirm.',
      bulk_product_entry:
        'At that product count, hand entry is the wrong tool — an import script is ' +
        'cheaper and less error-prone. We\'d rather tell you that than bill for it.',
      regulated_compliance_manual_review:
        'HIPAA or SOC 2 changes how the whole build is run, not just what\'s in it. ' +
        'That needs a conversation before any number is meaningful.',
      migration_audit_needed:
        'Until we\'ve looked inside the existing site, any figure for moving content ' +
        'is an educated guess. We\'d suggest a short paid audit first — a few ' +
        'hundred dollars that routinely saves several thousand in surprises.',
      needs_branding_first:
        'You\'ve mentioned there\'s no brand identity yet. That\'s separate work and ' +
        'genuinely should come first — designing a site around a logo that\'s about ' +
        'to change is money spent twice.',
      web_app_scope:
        'What you\'ve described sounds closer to an application than a website. ' +
        'That\'s a different process with different estimating, so treat this as ' +
        'indicative only.',
      lead_time_infeasible:
        'The target date is very close for a project this size. The estimate carries ' +
        'an expedited fee, but the honest answer may be a phased launch.'
    },

    email: function (s, est, h) {
      var first = (s.client_name || '').split(' ')[0];
      var T = h.num('unique_templates', 0);
      var P = h.num('total_pages', 0);
      var weeks = Math.max(6, Math.round((h.num('total_pages', 12) * 0.4) + 6));

      var body =
        'Hi ' + first + ',\n\n' +
        'Thanks for working through all of that — website briefs ask a lot of\n' +
        'questions, and the detail you gave means the estimate below is a real one\n' +
        'rather than a guess.\n\n' +
        'Here\'s what we\'ve scoped:\n\n' +
        '  Site         ' + (s.site_type || 'website').replace(/_/g, ' ') +
          (P && T ? ' — ' + P + ' pages from ' + T + ' layouts' : '') + '\n' +
        '  Platform     ' + (s.cms_preference === 'recommend_for_me'
          ? 'our recommendation, explained in the proposal'
          : (s.cms_preference || '').replace(/_/g, ' ')) + '\n' +
        '  Content      ' + h.pick('copywriting',
          { client_provides_all: 'you\'re writing the copy',
            client_drafts_we_edit: 'you draft, we edit',
            we_write_all: 'we\'re writing the copy' }, 'to be confirmed') + '\n' +
        '  Timeline     roughly ' + weeks + ' weeks, targeting ' +
          (s.target_completion_date || 'your date') + '\n' +
        '  Estimate     $' + Math.round(est.tiers.good.low || est.tiers.good.amount).toLocaleString('en-US') +
          ' – $' + Math.round(est.tiers.premium.high || est.tiers.premium.amount).toLocaleString('en-US') + '\n\n' +
        'One honest note before you read it. Web projects almost never slip because\n' +
        'of design or code — they slip because content arrives late. The timeline\n' +
        'above assumes copy and imagery reach us on the dates set out in the\n' +
        'proposal, and there\'s a section listing exactly what we need from you and\n' +
        'when. If those dates look unrealistic, tell me now and we\'ll build the\n' +
        'plan around the truth instead of around optimism.\n\n' +
        (est.confidence === 'preliminary'
          ? 'Some of the scope was still open, so treat this as a range. The two\nnumbers that move it most are how many distinct layouts you need and how\nmany systems we\'re integrating with.\n\n' : '') +
        'Happy to walk through any of it.\n\n' +
        'Josh\nKriel Ventures\njosh@kriel.us';

      return { subject: (s.project_name || 'Your site') + ' — website proposal & estimate', body: body };
    }
  };
})();
