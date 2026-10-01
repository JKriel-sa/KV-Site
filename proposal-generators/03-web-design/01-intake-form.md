# Intake Form — Web Design Proposal Generator

**Section 1 of 6 — Your details** → universal client intake block,
`_shared/00-global-spec.md` §3.

---

## Section 2 of 6 — Purpose & type

| Field ID | Label | Type | Req | Options / notes |
|---|---|---|---|---|
| `site_type` | What kind of site? | select | ✅ | `brochure_marketing`, `portfolio`, `ecommerce`, `booking_service`, `membership_gated`, `saas_marketing`, `blog_publication`, `landing_page`, `web_app` (flag), `other` |
| `project_nature` | New build or existing? | select | ✅ | `new_build`, `redesign_same_content`, `redesign_and_restructure`, `migration_only`, `incremental_improvements` |
| `current_url` | Current website | url | conditional | required unless `new_build` |
| `current_platform` | Current platform | select | conditional | `wordpress`, `shopify`, `squarespace`, `wix`, `webflow`, `custom`, `unknown` |
| `primary_goal` | Main outcome the site must deliver | textarea | ✅ | quoted into objective |
| `success_metric` | How will you judge success? | text | ➖ | leads/mo, revenue, applications, etc. |
| `target_audience` | Who is it for? | textarea | ✅ | |
| `competitor_urls` | Sites you admire or compete with | textarea | ➖ | drives design direction |

---

## Section 3 of 6 — Structure & scope

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `total_pages` | Total pages at launch | number | ✅ | or `not_sure` |
| `unique_templates` | Distinct page layouts needed | number | ✅ | **the real cost driver**; or `not_sure` |
| `sitemap_known` | Do you have a sitemap? | select | ✅ | `yes_have_one`, `rough_idea`, `need_help` |
| `sitemap_detail` | Paste or describe it | textarea | ➖ | |
| `languages` | Number of languages | number | ➖ | default 1 |
| `blog_required` | Blog or news section? | bool | ➖ | |
| `search_required` | On-site search? | select | ➖ | `none`, `basic`, `faceted_filtered` |
| `gated_content` | Login / member area? | bool | ➖ | true → auth scope |
| `user_accounts_expected` | Approx. number of users | select | conditional | `<100`, `100_1k`, `1k_10k`, `10k_plus` |

### 3B. E-commerce (conditional on `site_type == ecommerce` or `blog`→shop)

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `product_count` | Number of products at launch | number | ✅ | |
| `variant_complexity` | Variants per product | select | ✅ | `none`, `simple_1_axis`, `complex_multi_axis`, `configurable_custom` |
| `product_data_source` | Where does product data come from? | select | ✅ | `client_spreadsheet`, `existing_platform_export`, `erp_pim_feed`, `manual_entry_needed` |
| `payment_gateways` | Payment methods | multiselect | ✅ | `stripe`, `paypal`, `apple_google_pay`, `klarna_bnpl`, `bank_transfer`, `regional_other` |
| `shipping_logic` | Shipping rules | select | ✅ | `flat_rate`, `weight_zone_based`, `live_carrier_rates`, `local_delivery_pickup` |
| `tax_complexity` | Tax handling | select | ✅ | `single_jurisdiction`, `multi_state_country`, `automated_service` |
| `subscriptions` | Subscription products? | bool | ➖ | |
| `b2b_pricing` | Customer-specific / wholesale pricing? | bool | ➖ | flag |
| `inventory_sync` | Inventory sync with another system? | bool | ➖ | |

---

## Section 4 of 6 — Design & content

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `brand_assets` | Brand identity status | select | ✅ | `full_guidelines`, `logo_only`, `needs_refresh`, `none_need_branding` (flag: separate engagement) |
| `design_direction` | Design approach | select | ✅ | `follow_our_brand`, `evolve_our_brand`, `fresh_concept`, `use_a_theme_template` |
| `design_concepts` | Concept rounds wanted | select | ✅ | `1_direction`, `2_directions`, `3_directions` |
| `custom_illustration` | Custom illustration or iconography? | select | ➖ | `none`, `icon_set`, `spot_illustrations`, `full_illustrated_system` |
| `motion_interaction` | Animation / interaction level | select | ✅ | `none_static`, `subtle_transitions`, `rich_scroll_motion`, `showcase_experimental` |
| `photography_needed` | Need new photography? | select | ➖ | `no_have_assets`, `stock_ok`, `need_shoot` → cross-sell Photography PG |
| `copywriting` | Who writes the copy? | select | ✅ | `client_provides_all`, `client_drafts_we_edit`, `we_write_all` |
| `copy_pages` | Pages needing copy from us | number | conditional | |
| `content_migration_pages` | Existing pages to migrate | number | conditional | |
| `accessibility_target` | Accessibility conformance | select | ✅ | `best_effort`, `wcag_22_aa`, `wcag_22_aaa` |
| `prototype_required` | Interactive prototype before build? | bool | ➖ | |

---

## Section 5 of 6 — Build, integrations & SEO

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `cms_preference` | CMS preference | select | ✅ | `wordpress`, `webflow`, `shopify`, `squarespace`, `craft`, `sanity_headless`, `contentful_headless`, `statamic`, `no_cms_static`, `recommend_for_me` |
| `cms_editing_depth` | How much should you be able to edit? | select | ✅ | `text_images_only`, `full_page_building`, `structured_content_types` |
| `hosting` | Hosting | select | ✅ | `client_has`, `we_arrange`, `need_advice` |
| `integrations` | Third-party integrations | multiselect | ➖ | `crm_hubspot`, `crm_salesforce`, `email_mailchimp`, `email_klaviyo`, `booking_calendly`, `booking_custom`, `payments`, `erp`, `analytics_ga4`, `chat_intercom`, `reviews`, `maps`, `social_feeds`, `sso`, `custom_api` |
| `integration_notes` | Describe any custom integration | textarea | conditional | |
| `forms_count` | Number of forms | number | ➖ | |
| `seo_scope` | SEO scope | select | ✅ | `none`, `technical_basics`, `technical_plus_onpage`, `full_strategy_content` |
| `keyword_research` | Keyword research needed? | bool | ➖ | |
| `redirect_mapping` | Redirect mapping from old URLs? | bool | conditional | required if redesign/migration |
| `analytics_setup` | Analytics & conversion tracking? | select | ➖ | `none`, `ga4_basic`, `ga4_events_goals`, `full_tag_manager` |
| `performance_target` | Performance target | select | ➖ | `standard`, `core_web_vitals_green`, `aggressive_optimisation` |
| `security_compliance` | Compliance requirements | multiselect | ➖ | `none`, `gdpr_cookie_consent`, `ccpa`, `pci`, `hipaa` (flag), `soc2` (flag) |

---

## Section 6 of 6 — Launch, aftercare & style

| Field ID | Label | Type | Req | Options |
|---|---|---|---|---|
| `training_required` | CMS training for your team? | select | ➖ | `none`, `recorded_walkthrough`, `live_session`, `full_documentation` |
| `qa_devices` | Browser / device support | select | ✅ | `modern_only`, `modern_plus_legacy`, `specific_list` |
| `launch_support` | Post-launch support | select | ✅ | `none`, `30_day_warranty`, `retainer_monthly` |
| `retainer_hours` | Monthly retainer hours | number | conditional | |
| `stakeholder_count` | People approving the design | number | ✅ | >3 adds approval overhead — genuinely |
| `hard_deadline` | Is the target date fixed? | select | ✅ | `hard_deadline`, `preferred`, `flexible` |
| `deadline_reason` | Why that date? | text | ➖ | event, campaign, contract end |
| `template_choice` | Proposal layout | select | ✅ | `minimalist_portfolio`, `ecommerce`, `corporate_site`, `let_us_recommend` |
| `include_samples` | Include case studies? | bool | ➖ | default true |
| `delivery_method` | Send as | select | ➖ | `pdf_email`, `web_link`, `both` |

---

## Submit
Compute → render → draft email. Confirmation screen shows the estimate range
and: *"A digital producer will review the scope and come back within one
business day — usually with one or two questions that sharpen the number."*
