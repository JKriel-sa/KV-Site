# Intake Form — Photography Proposal Generator

**Section 1 of 3 — Your details** → use the universal client intake block from
`_shared/00-global-spec.md` §3, verbatim.

---

## Section 2 of 3 — Project scoping

### 2A. Shoot type (asked first — it gates everything below)

| Field ID | Label | Type | Req | Options |
|---|---|---|---|---|
| `shoot_type` | What kind of shoot is this? | select | ✅ | `wedding`, `event_corporate`, `event_social`, `product`, `food_beverage`, `real_estate_interiors`, `fashion_lookbook`, `headshots`, `portrait_family`, `brand_lifestyle`, `editorial`, `other` |
| `shoot_type_other` | Tell us more | text | conditional | shown only if `other` |

**Branching:** `wedding` / `event_*` → 2B-Event. `product` / `food_beverage` /
`fashion_lookbook` / `brand_lifestyle` → 2B-Commercial. `headshots` /
`portrait_family` → 2B-Portrait. `real_estate_interiors` / `editorial` →
2B-Commercial with the volume block.

### 2B-Event (conditional)

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `event_date` | Event date | date | ✅ | fixed, non-negotiable — drives rush |
| `coverage_hours` | Hours of coverage needed | number | ✅ | 1–14 |
| `guest_count` | Approximate attendance | number | ➖ | >150 nudges second shooter |
| `key_moments` | Must-capture moments | textarea | ➖ | free text, quoted into scope |
| `second_shooter` | Second photographer? | select | ✅ | `yes` / `no` / `recommend_for_me` |
| `same_day_preview` | Same-day preview gallery? | bool | ➖ | rush post-production add-on |
| `printed_deliverable` | Album or prints? | select | ➖ | `none`, `prints_only`, `album_20pg`, `album_40pg` |

### 2B-Commercial (conditional)

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `sku_count` | Number of products / SKUs | number | conditional | required for `product`, `food_beverage` |
| `shots_per_sku` | Angles or setups per product | number | ➖ | default 3 |
| `styling_needed` | Styling / prop work required? | select | ✅ | `none`, `light`, `full_stylist` |
| `models_needed` | Talent / models required? | select | ✅ | `none`, `client_provides`, `agency_casts` |
| `model_count` | How many? | number | conditional | if not `none` |
| `set_build` | Set build or custom backdrop? | select | ➖ | `none`, `simple`, `custom_build` |
| `on_white_required` | Need clean-white / e-comm cutouts? | bool | ➖ | adds per-image path work |

### 2B-Portrait (conditional)

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `subject_count` | How many people? | number | ✅ | drives session length |
| `looks_per_subject` | Outfit / look changes each | number | ➖ | default 1 |
| `hmu_needed` | Hair & makeup required? | bool | ➖ | vendor pass-through |
| `retouch_level` | Retouching level | select | ✅ | `standard`, `advanced`, `beauty` |

### 2C. Logistics (all shoot types)

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `session_duration_hours` | Total shooting hours | number | ✅ | prefilled from `coverage_hours` for events |
| `location_count` | Number of locations | number | ✅ | ≥2 adds a move fee |
| `location_type` | Location type | select | ✅ | `our_studio`, `client_site`, `on_location_outdoor`, `multiple_mixed` |
| `location_address` | Primary address / city | text | ✅ | geocoded for travel |
| `travel_distance_km` | Distance from our base | number | auto | computed; user may override |
| `overnight_required` | Overnight stay needed? | bool | auto | true if distance > 250 km |
| `permits_needed` | Permits or venue fees expected? | select | ➖ | `no`, `yes_client_handles`, `yes_please_handle` |
| `preferred_shoot_dates` | Preferred date(s) | text | ✅ | free text; availability pending |

### 2D. Deliverables & licensing

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `final_image_count` | Final edited images required | number | ✅ | the core post-production driver |
| `delivery_format` | Delivery formats | multiselect | ✅ | `web_jpg`, `print_jpg`, `tiff`, `raw` (flagged) |
| `turnaround` | Turnaround needed | select | ✅ | `standard_3wk`, `expedited_10day`, `rush_72hr` |
| `usage_rights` | Where will the images be used? | multiselect | ✅ | `personal_only`, `organic_social`, `website`, `email_marketing`, `print_collateral`, `paid_digital_ads`, `ooh_billboard`, `broadcast_tv`, `packaging`, `resale_stock` |
| `usage_term` | For how long? | select | ✅ | `6_months`, `1_year`, `3_years`, `perpetual` |
| `usage_territory` | Where geographically? | select | ✅ | `local`, `national`, `worldwide` |
| `exclusivity` | Exclusive to you? | bool | ➖ | true adds exclusivity uplift |
| `credit_required` | Photographer credit given? | bool | ➖ | false adds small uplift |

### 2E. Extras

| Field ID | Label | Type | Req |
|---|---|---|---|
| `gallery_hosting_months` | Online gallery hosting (months) | select — `3`, `12`, `36` | ➖ |
| `bts_content` | Behind-the-scenes content needed? | bool | ➖ |
| `existing_brand_guide` | Do you have brand guidelines? | file/url | ➖ |
| `reference_links` | Reference images or moodboard | textarea | ➖ |
| `accessibility_notes` | Access, mobility, or scheduling constraints | textarea | ➖ |

---

## Section 3 of 3 — Proposal style

| Field ID | Label | Type | Req | Options |
|---|---|---|---|---|
| `template_choice` | Proposal layout | select | ✅ | `event`, `commercial_product`, `portrait_headshot`, `let_us_recommend` |
| `include_samples` | Include portfolio samples? | bool | ➖ | default true |
| `delivery_method` | Send proposal as | select | ➖ | `pdf_email`, `web_link`, `both` |

---

## Submit
On submit: compute per `02-proposal-logic.md`, render per `03-templates.md`,
and draft the email per `04-thank-you-email.md`. Show the client a confirmation
screen with the estimate range and the sentence: *"A producer will confirm
calendar availability within one business day."*
