# Proposal Logic — Photography

`STANDARD_LEAD_DAYS = 21`

## 1. Rate card (edit here only)

```
RATE_PHOTOG_HOUR        = 250    # lead photographer, per shooting hour
RATE_HALF_DAY           = 900    # 4 hrs, replaces hourly when 3 ≤ hrs ≤ 5
RATE_FULL_DAY           = 1600   # 8 hrs, replaces hourly when 6 ≤ hrs ≤ 10
RATE_OVERTIME_HOUR      = 275    # each hour beyond 10
RATE_SECOND_SHOOTER_HR  = 125
RATE_ASSISTANT_HOUR     = 85
RATE_EDIT_IMAGE         = 12     # standard edit, per final image
RATE_EDIT_ADVANCED      = 28     # per image, advanced retouch
RATE_EDIT_BEAUTY        = 65     # per image, beauty/skin retouch
RATE_CLIPPING_PATH      = 8      # per image, on-white cutout
RATE_STYLIST_DAY        = 650
RATE_MODEL_DAY          = 500    # per model, agency-cast
RATE_HMU_DAY            = 450
RATE_SET_BUILD_SIMPLE   = 400
RATE_SET_BUILD_CUSTOM   = 1800
RATE_LOCATION_MOVE      = 150    # each location beyond the first
RATE_STUDIO_RENTAL_DAY  = 500    # if location_type = our_studio and > 4 hrs
RATE_MILEAGE            = 0.85   # per km beyond the 40 km free radius
RATE_PER_DIEM           = 90     # per crew member per night
RATE_GALLERY_MONTH      = 15
RATE_ALBUM_20PG         = 600
RATE_ALBUM_40PG         = 1050
RATE_PRINTS_PACKAGE     = 250
RATE_BTS_ADDON          = 400
RATE_PERMIT_HANDLING    = 300    # our admin fee; permit cost is pass-through
```

## 1B. Normalise (run before anything else)

```
hrs             = session_duration_hours
production_days = max(1, ceil(hrs / 8))     # used by travel, styling, crew
crew_size       = 1 + (second_shooter_active ? 1 : 0)
                    + (styling_needed != none ? 1 : 0)
                    + (hmu_needed ? 1 : 0)
```
`production_days` and `crew_size` are the names the global travel block (§6)
expects. Define them here rather than inline, so the travel and add-on formulas
below cannot drift apart.

## 2. Shooting fee (BASE)

```

if hrs <= 2:        SHOOT = hrs × RATE_PHOTOG_HOUR
elif hrs <= 5:      SHOOT = RATE_HALF_DAY + max(0, hrs − 4) × RATE_PHOTOG_HOUR
elif hrs <= 10:     SHOOT = RATE_FULL_DAY + max(0, hrs − 8) × RATE_PHOTOG_HOUR
else:               SHOOT = RATE_FULL_DAY + 2 × RATE_PHOTOG_HOUR
                            + (hrs − 10) × RATE_OVERTIME_HOUR

SECOND  = second_shooter_active ? hrs × RATE_SECOND_SHOOTER_HR : 0
STUDIO  = (location_type == our_studio AND hrs > 4) ? RATE_STUDIO_RENTAL_DAY : 0
MOVES   = max(0, location_count − 1) × RATE_LOCATION_MOVE

BASE = SHOOT + SECOND + STUDIO + MOVES
```

**Second-shooter auto-rule** — set `second_shooter_active = true` when
`second_shooter == "yes"`, or when `second_shooter == "recommend_for_me"` and
any of: `shoot_type == wedding`; `coverage_hours > 6`; `guest_count > 150`;
`location_count ≥ 2` for an event.

## 3. Post-production

```
n = final_image_count

per_image = RATE_EDIT_IMAGE
            if retouch_level == "advanced" → RATE_EDIT_ADVANCED
            if retouch_level == "beauty"   → RATE_EDIT_BEAUTY

EDIT     = n × per_image
CUTOUTS  = on_white_required ? n × RATE_CLIPPING_PATH : 0

TURNAROUND_MULT = standard_3wk 1.00 | expedited_10day 1.25 | rush_72hr 1.60
POST = (EDIT + CUTOUTS) × TURNAROUND_MULT
```

**Sanity check:** if `final_image_count / session_duration_hours > 40`, flag
`"delivery_ratio_high"` — the client likely wants a volume rate, not a
per-image rate. Route to a human.

## 4. Production add-ons

```
STYLING   = none 0
          | light RATE_STYLIST_DAY × 0.5 × production_days
          | full  RATE_STYLIST_DAY × production_days
MODELS    = (models_needed == agency_casts)
            ? model_count × RATE_MODEL_DAY × production_days : 0
HMU       = hmu_needed ? RATE_HMU_DAY × production_days : 0
SET       = none 0 | simple RATE_SET_BUILD_SIMPLE | custom RATE_SET_BUILD_CUSTOM
ALBUM     = per printed_deliverable
GALLERY   = gallery_hosting_months × RATE_GALLERY_MONTH
BTS       = bts_content ? RATE_BTS_ADDON : 0
PERMITS   = (permits_needed == yes_please_handle) ? RATE_PERMIT_HANDLING : 0

ADD_ONS = POST + STYLING + MODELS + HMU + SET + ALBUM + GALLERY + BTS + PERMITS
```
`STYLING`, `MODELS`, and `HMU` all scale by `production_days` — a two-day shoot
books a stylist for two days. `SET`, `ALBUM`, `GALLERY`, `BTS`, and `PERMITS`
are one-time and deliberately do not scale.

## 5. Licensing multiplier — the big lever

Score the requested usage, then map to a multiplier applied to `BASE + POST`.

```
usage_points = Σ over selected usage_rights:
    personal_only        0
    organic_social       1
    website              1
    email_marketing      1
    print_collateral     2
    paid_digital_ads     4
    packaging            5
    ooh_billboard        6
    broadcast_tv         6
    resale_stock         8

term_factor      = 6_months 0.8 | 1_year 1.0 | 3_years 1.5 | perpetual 2.2
territory_factor = local 1.0 | national 1.3 | worldwide 1.6

license_multiplier = 1 + (usage_points × 0.06 × term_factor × territory_factor)
if exclusivity:         license_multiplier × 1.25
if not credit_required: license_multiplier × 1.05

licensable_base = BASE + POST
LICENSE_FEE     = licensable_base × (license_multiplier − 1)
```

`licensable_base` deliberately narrows the global default (§4). A licence
attaches to the images — the shooting and the edit that made them. It does not
attach to a printed album, a stylist's day rate, or a permit fee, so those sit
in `ADD_ONS` and outside the licence calculation. Charging a worldwide-perpetual
multiplier on the cost of a photo book would be indefensible if a client ever
asked us to itemise it.

**Flags:** `usage_term == perpetual` AND `usage_points ≥ 5` → flag
`"perpetual_broad_usage_review"`. `resale_stock` selected → always flag; that is
a rights transfer, not a license, and needs a human and a different contract.

## 6. Travel, rush, discount, total

**Travel** — global §6, using the `production_days` and `crew_size` defined in
§1B above.

**Rush** — global §5 against `STANDARD_LEAD_DAYS = 21`. For every shoot type
where a date is fixed (`wedding`, `event_corporate`, `event_social`), compute
`lead_ratio` from `event_date`; otherwise from `target_completion_date`.

```
rushable_base = BASE
```
Not `SUBTOTAL`. `POST` already carries `TURNAROUND_MULT` from §3 — a client who
picks `rush_72hr` has paid for the compressed edit there. Applying the rush
delta to POST as well would bill the same urgency twice.

**Discounts** — global §7. `volume_factor = 1.0`; photography has no recurring
mode.

Then assemble with the universal skeleton in §4 and emit the three tiers.

**Good / Standard / Premium composition for photography** — don't just scale the
number; state what changes:

- **Good** — image count reduced ~30%, standard turnaround, single location,
  narrower usage term (1 year).
- **Standard** — exactly as scoped.
- **Premium** — +40% images, expedited turnaround, second shooter, BTS content,
  extended usage term.

## 7. Section assembly

Follow the universal order (global §8). Photography specifics:

- **Scope of work** must state, as separate numbered lines: shooting hours,
  crew, locations, number of final edited images, retouch level, delivery
  formats, turnaround, and the exact licensing grant.
- **Licensing** gets its own subsection under Terms, written in plain English:
  *"You may use these images for {usage list} in {territory} for {term}. Uses
  beyond this are available — just ask, and we'll quote them."*
- **Explicitly not included** — always list: RAW files, unedited selects,
  travel outside the quoted radius, permits and venue fees, talent usage
  renewals, and model/property releases (client's responsibility).
- **Timeline** milestones: contract & deposit → pre-production call → shoot day
  → selects gallery (3 business days) → final delivery.
