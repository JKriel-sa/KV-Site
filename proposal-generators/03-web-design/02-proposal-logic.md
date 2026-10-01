# Proposal Logic — Web Design

`STANDARD_LEAD_DAYS = 70`

Web is estimated in **hours per phase**, then priced. This keeps the estimate
auditable and lets a producer argue with a single number rather than the whole
total.

## 1. Rate card (edit here only)

```
RATE_STRATEGY_HOUR      = 145
RATE_DESIGN_HOUR        = 125
RATE_DEV_HOUR           = 135
RATE_CONTENT_HOUR       = 95
RATE_SEO_HOUR           = 120
RATE_PM_HOUR            = 110
RATE_QA_HOUR            = 90
RATE_TRAINING_HOUR      = 110

RATE_COPY_PAGE          = 350    # per page written from scratch
RATE_MIGRATE_PAGE       = 45     # per existing page migrated
RATE_ILLUSTRATION_ICON  = 60     # per custom icon
RATE_ILLUSTRATION_SPOT  = 450    # per spot illustration
RATE_PRODUCT_ENTRY      = 6      # per product, manual entry
RATE_LANGUAGE_UPLIFT    = 0.35   # of design+build, per additional language
RATE_RETAINER_HOUR      = 125
```

## 2. Normalise inputs

```
if unique_templates == not_sure:
    unique_templates = clamp(ceil(total_pages × 0.35), 3, 12)
    → flag "templates_estimated"

if total_pages == not_sure:
    total_pages = unique_templates × 3
    → flag "pages_estimated"

T = unique_templates
P = total_pages

complexity_factor =                          # applied to design + build hours
    motion_interaction: none_static 0.90 | subtle_transitions 1.00
                      | rich_scroll_motion 1.25 | showcase_experimental 1.55
  × design_direction:  use_a_theme_template 0.70 | follow_our_brand 1.00
                      | evolve_our_brand 1.10 | fresh_concept 1.25
```

## 3. Phase 1 — Discovery & strategy

```
DISC_HOURS = 8                                   # baseline kickoff
           + (sitemap_known == need_help  ? 10 : sitemap_known == rough_idea ? 5 : 0)
           + (project_nature != new_build ? 6 : 0)      # audit existing
           + (site_type == ecommerce      ? 10 : 0)
           + (gated_content              ? 6 : 0)
           + min(count(integrations) × 2, 16)           # integration discovery
           + (stakeholder_count > 3 ? (stakeholder_count − 3) × 2 : 0)

DISCOVERY = DISC_HOURS × RATE_STRATEGY_HOUR
```

## 4. Phase 2 — Design

```
DESIGN_HOURS = concept_hours + template_hours + system_hours + proto_hours

concept_hours  = design_concepts: 1_direction 14 | 2_directions 24 | 3_directions 34
template_hours = T × 9                       # desktop design per unique template
               + T × 4                       # responsive/mobile adaptation
system_hours   = 12                          # design system: type, colour, components
               + (cms_editing_depth == full_page_building ? 10 : 0)
               + (accessibility_target == wcag_22_aa  ? 8  : 0)
               + (accessibility_target == wcag_22_aaa ? 20 : 0)
proto_hours    = prototype_required ? T × 2.5 : 0

DESIGN_HOURS × = complexity_factor

ILLUSTRATION = custom_illustration:
    none 0
  | icon_set              20 × RATE_ILLUSTRATION_ICON
  | spot_illustrations    6  × RATE_ILLUSTRATION_SPOT
  | full_illustrated_system  14 × RATE_ILLUSTRATION_SPOT

DESIGN = DESIGN_HOURS × RATE_DESIGN_HOUR + ILLUSTRATION
```

## 5. Phase 3 — Build

```
cms_factor = no_cms_static 0.80 | squarespace 0.75 | webflow 0.90
           | wordpress 1.00 | shopify 1.00 | craft 1.15 | statamic 1.10
           | sanity_headless 1.35 | contentful_headless 1.35

if cms_preference == recommend_for_me:
    ecommerce                            → shopify
    blog_publication / brochure          → wordpress
    portfolio / landing_page             → webflow
    saas_marketing / membership_gated    → craft or headless (flag for human)

BUILD_HOURS = T × 11                                  # each unique template built
            + (P − T) × 0.8                           # remaining pages assembled
            + 10                                      # global: nav, footer, 404, forms shell
            + forms_count × 2
            + (blog_required ? 8 : 0)
            + search_required: none 0 | basic 5 | faceted_filtered 22
            + (gated_content ? 24 : 0)
            + user_accounts_expected: <100 0 | 100_1k 4 | 1k_10k 10 | 10k_plus 20
            + cms_editing_depth: text_images_only 0 | full_page_building 14
                               | structured_content_types 20
            + accessibility_target: best_effort 0 | wcag_22_aa 0.9×T | wcag_22_aaa 2.2×T
            + performance_target: standard 0 | core_web_vitals_green 10
                                | aggressive_optimisation 24

BUILD_HOURS × = complexity_factor × cms_factor

INTEGRATIONS = Σ per selected integration:
    analytics_ga4        2 hrs
    email_mailchimp      4 hrs
    email_klaviyo        6 hrs
    chat_intercom        3 hrs
    maps                 3 hrs
    social_feeds         4 hrs
    reviews              5 hrs
    booking_calendly     4 hrs
    crm_hubspot          8 hrs
    payments            10 hrs
    booking_custom      20 hrs
    sso                 20 hrs
    crm_salesforce      24 hrs
    erp                 32 hrs   → flag "erp_integration_scope_review"
    custom_api          28 hrs   → flag "custom_api_scope_review"
  × RATE_DEV_HOUR

LANGUAGES = (languages − 1) × RATE_LANGUAGE_UPLIFT × (DESIGN + BUILD_HOURS × RATE_DEV_HOUR)

BUILD = BUILD_HOURS × RATE_DEV_HOUR + INTEGRATIONS + LANGUAGES
```

### 5B. E-commerce module (only when applicable)

```
ECOM_HOURS = 16                                        # base store setup
  + variant_complexity: none 0 | simple_1_axis 6
                      | complex_multi_axis 18 | configurable_custom 40
  + product_data_source: existing_platform_export 6 | client_spreadsheet 10
                       | erp_pim_feed 24 | manual_entry_needed 4
  + count(payment_gateways) × 3
  + shipping_logic: flat_rate 2 | weight_zone_based 8
                  | live_carrier_rates 14 | local_delivery_pickup 10
  + tax_complexity: single_jurisdiction 2 | multi_state_country 10 | automated_service 6
  + (subscriptions ? 20 : 0)
  + (b2b_pricing ? 28 : 0)        → flag "b2b_pricing_scope_review"
  + (inventory_sync ? 18 : 0)

PRODUCT_ENTRY = (product_data_source == manual_entry_needed)
                ? product_count × RATE_PRODUCT_ENTRY : 0

ECOMMERCE = ECOM_HOURS × RATE_DEV_HOUR + PRODUCT_ENTRY
```
If `product_count > 500` and entry is manual, flag `"bulk_product_entry"` and
propose an import script instead — it is cheaper and the client should be told.

## 6. Phase 4 — Content & SEO

```
COPY      = copywriting: client_provides_all 0
          | client_drafts_we_edit  copy_pages × RATE_COPY_PAGE × 0.45
          | we_write_all           copy_pages × RATE_COPY_PAGE
MIGRATION = content_migration_pages × RATE_MIGRATE_PAGE

SEO_HOURS = seo_scope: none 0 | technical_basics 8
          | technical_plus_onpage 8 + P × 0.4
          | full_strategy_content 20 + P × 0.7
          + (keyword_research ? 8 : 0)
          + (redirect_mapping ? 4 + P × 0.15 : 0)
SEO = SEO_HOURS × RATE_SEO_HOUR

ANALYTICS = analytics_setup: none 0 | ga4_basic 2 | ga4_events_goals 6
          | full_tag_manager 12   × RATE_DEV_HOUR

CONTENT = COPY + MIGRATION + SEO + ANALYTICS
```

## 7. Phase 5 — QA, launch, training

```
QA_HOURS = (DESIGN_HOURS + BUILD_HOURS) × 0.15
         × qa_devices: modern_only 1.0 | modern_plus_legacy 1.4 | specific_list 1.25
LAUNCH_HOURS  = 6 + (project_nature != new_build ? 4 : 0)   # DNS, redirects, go-live
TRAINING      = training_required: none 0 | recorded_walkthrough 2
              | live_session 3 | full_documentation 8    × RATE_TRAINING_HOUR

COMPLIANCE = security_compliance: gdpr_cookie_consent 6 | ccpa 4 | pci 10 hrs
             × RATE_DEV_HOUR
             (hipaa or soc2 → flag "regulated_compliance_manual_review")

LAUNCH = QA_HOURS × RATE_QA_HOUR + LAUNCH_HOURS × RATE_DEV_HOUR
       + TRAINING + COMPLIANCE
```

## 8. Project management & aftercare

```
PM_HOURS = (DISC_HOURS + DESIGN_HOURS + BUILD_HOURS + QA_HOURS) × 0.15
         × (stakeholder_count > 3 ? 1.20 : 1.00)
PM = PM_HOURS × RATE_PM_HOUR

WARRANTY = launch_support == 30_day_warranty ? (BUILD × 0.05) : 0
RETAINER = launch_support == retainer_monthly
           ? retainer_hours × RATE_RETAINER_HOUR   # quoted per month, SEPARATELY
           : 0
```
The retainer is **never** added into the project total. It appears as a separate
recurring line so the one-time figure stays comparable to other bids.

## 9. Assemble

```
BASE          = DISCOVERY + DESIGN
ADD_ONS       = BUILD + ECOMMERCE + CONTENT + LAUNCH + PM + WARRANTY
TRAVEL        = 0        # global §6 does not apply; add only for on-site workshops
LICENSE_FEE   = 0        # license_multiplier = 1.0; not applicable to web
volume_factor = 1.0
rushable_base = SUBTOTAL # the global default — see below
```

Web is the one service where `rushable_base` stays at the full `SUBTOTAL`.
Nothing here carries a turnaround multiplier the way post-production does in the
other three, so there is no double-charge to avoid: compressing a web project
compresses every phase of it at once.

Then rush (global §5, `STANDARD_LEAD_DAYS = 70`) and discounts (global §7), and
the universal skeleton.

### Payment schedule (overrides the global 50% deposit)

```
if TOTAL >= 15000:
    payment_schedule = [ {"On signature",       0.40},
                         {"On design approval", 0.30},
                         {"On launch",          0.30} ]
else:
    payment_schedule = [ {"On signature", 0.50}, {"On launch", 0.50} ]
```
Stages must sum to `TOTAL`. The retainer from §8 is never a stage — it is
recurring, and belongs in `estimate.json.recurring` with `unit: "month"`,
outside the project total entirely.

**Hard-deadline rule:** if `hard_deadline == hard_deadline` and the available
lead time is under 60% of standard, do not simply add the rush fee — also flag
`"deadline_feasibility_review"` and state in the proposal which scope items
would need to move to a phase two.

Three tiers:
- **Good** — fewer unique templates (T reduced ~30%), one design direction,
  client writes all copy, technical SEO only, no custom illustration, deferred
  integrations.
- **Standard** — as scoped.
- **Premium** — additional templates, extra design direction, we write the copy,
  full SEO and analytics, richer motion, prototype, full documentation and
  training.

## 10. Section assembly

Universal order (global §8), with these web specifics:

- **Investment table grouped by phase** — Discovery, Design, Build, Content &
  SEO, QA & Launch, Project Management — each with hours and subtotal. Hours
  shown, because web clients compare hours.
- **Payment schedule** replaces the simple deposit split for projects over
  ~$15k: 40% on signature, 30% on design approval, 30% on launch. State it
  explicitly.
- **"What we need from you"** is a required section: content, imagery, brand
  assets, platform credentials, named decision-maker, and review turnaround
  time. Give each a due date relative to the timeline.
- **Content dependency clause, always:** *"The timeline assumes final copy and
  imagery reach us by {{content_due_date}}. Content arriving later moves the
  launch date by the same amount — we'll flag it in writing rather than absorb
  it silently."*
- **Explicitly not included:** hosting, domain, SSL, third-party SaaS
  subscriptions, stock photography licences, ongoing SEO, content updates after
  launch, features not listed in this scope, and any integration not named
  above.
- **SEO honesty clause:** *"We optimise the site technically and on-page.
  Nobody can guarantee rankings, and we won't pretend otherwise."*
- **Timeline** phases: Discovery (1–2 wks) → Design (2–4 wks) → Build (3–8 wks)
  → Content population (1–2 wks) → QA (1 wk) → Launch. Mark client approval
  gates as dependencies.
