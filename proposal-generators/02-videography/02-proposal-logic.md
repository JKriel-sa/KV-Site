# Proposal Logic — Videography

`STANDARD_LEAD_DAYS = 35`

## 1. Rate card (edit here only)

```
# Pre-production
RATE_PREPRO_DAY         = 750    # producer + planning, per day
RATE_SCRIPT_MINUTE      = 350    # per finished minute of scripted runtime
RATE_STORYBOARD_FRAME   = 45
RATE_CASTING_SESSION    = 600

# Crew day rates (10-hr day; half day = 0.6×; 12-hr = 1.2×)
RATE_DIRECTOR_DAY       = 1400
RATE_DOP_DAY            = 1200
RATE_CAM_OP_DAY         = 750
RATE_GAFFER_DAY         = 700
RATE_GRIP_DAY           = 600
RATE_SOUND_REC_DAY      = 700
RATE_HMU_DAY            = 550
RATE_STYLIST_DAY        = 650
RATE_ART_DEPT_DAY       = 800
RATE_PRODUCER_SET_DAY   = 900
RATE_PA_DAY             = 300
RATE_PROMPTER_OP_DAY    = 450
RATE_SCRIPT_SUP_DAY     = 550
RATE_DRONE_PILOT_DAY    = 950    # licensed pilot + aircraft + insurance

# Equipment day rates
RATE_CAM_STANDARD_DAY   = 350
RATE_CAM_S35_DAY        = 900
RATE_CAM_FF_DAY         = 1400
RATE_CAM_HIGHSPEED_DAY  = 2200
RATE_EXTRA_CAM_DAY      = 400    # each camera beyond the first
RATE_LIGHT_MINIMAL_DAY  = 150
RATE_LIGHT_STANDARD_DAY = 450
RATE_LIGHT_FULL_DAY     = 1200
RATE_AUDIO_KIT_DAY      = 250
RATE_GIMBAL_DAY         = 300
RATE_SLIDER_DAY         = 150
RATE_DOLLY_DAY          = 500
RATE_JIB_DAY            = 850
RATE_TECHNO_DAY         = 2500
RATE_PROMPTER_DAY       = 350
RATE_STUDIO_DAY         = 1200
RATE_SET_SIMPLE         = 900
RATE_SET_CUSTOM         = 4500
RATE_LIVESTREAM_DAY     = 1800   # switcher, encoder, operator

# Post-production
RATE_EDIT_HOUR          = 95
RATE_ASSIST_INGEST_HOUR = 55
RATE_GRADE_BASIC_MIN    = 120    # per finished minute
RATE_GRADE_FULL_MIN     = 300
RATE_GRADE_LOOKDEV_MIN  = 550
RATE_MGFX_SECOND        = 45     # per second of animation
RATE_LOWER_THIRDS_PKG   = 350
RATE_VFX_HOUR           = 140
RATE_MIX_BASIC_MIN      = 60
RATE_MIX_FULL_MIN       = 180
RATE_MASTER_MIN         = 90
RATE_MUSIC_LIBRARY      = 250
RATE_MUSIC_CUSTOM_MIN   = 900
RATE_VO_CAST_RECORD     = 850
RATE_SUBTITLE_MIN       = 35
RATE_TRANSLATION_MIN    = 75
RATE_CUTDOWN_EACH       = 400
RATE_ASPECT_VERSION     = 250    # per additional aspect ratio per video
RATE_REVISION_ROUND     = 450    # each round beyond 2
RATE_RAW_HANDOVER       = 350    # drive + transfer + archive

# Logistics
RATE_MILEAGE            = 0.85
RATE_PER_DIEM           = 90
RATE_PERMIT_HANDLING    = 450
```

## 2. Derived values

```
day_factor    = half_day_5 0.6 | full_day_10 1.0 | extended_12 1.2
crew_days     = shoot_days × day_factor
runtime_min   = primary_runtime_sec / 60

if crew_size == recommend_for_me:
    solo    if video_type ∈ {testimonial_case_study, training_internal, event_recap}
    small   if video_type ∈ {corporate_explainer, product_demo, social_ad, documentary_short}
    standard if video_type ∈ {brand_film, event_full_coverage, music_video}
    full    if video_type ∈ {tv_commercial}

if shoot_days == not_sure:
    shoot_days = ceil(runtime_min / 4) clamped to [1, 5]
    → flag "shoot_days_estimated"

if footage_volume_hours blank:
    footage_volume_hours = crew_days × 6 × max(1, multicam_count)
```

## 3. Pre-production

```
prepro_days = ceil(shoot_days × 0.75) + (video_type == tv_commercial ? 1 : 0)

PREPRO   = prepro_days × RATE_PREPRO_DAY
SCRIPT   = scriptwriting == we_write        ? runtime_min × RATE_SCRIPT_MINUTE
         : scriptwriting == collaborative   ? runtime_min × RATE_SCRIPT_MINUTE × 0.5
         : 0
BOARD    = storyboard ? ceil(runtime_min × 8) × RATE_STORYBOARD_FRAME : 0
CASTING  = (talent_needed == agency_casts) ? RATE_CASTING_SESSION : 0

PRE = PREPRO + SCRIPT + BOARD + CASTING
```

## 4. Production (crew + kit)

```
# Crew roster: explicit crew_roles if given, else the crew_size preset
solo     → [cam_op]                                        (+ director if required)
small    → [dop, cam_op]                                   (+ sound_recordist if lav_and_boom)
standard → [director, dop, cam_op, gaffer, sound_recordist, pa]
full     → standard + [grip, hmu, art_dept, producer_on_set, script_supervisor]

# The intake's `cam_op_2` option means "a second camera operator" — it resolves
# to the role `cam_op` at RATE_CAM_OP_DAY. There is no separate rate constant.
# A roster may contain `cam_op` more than once; each instance bills.

CREW = Σ over roster: RATE_<ROLE>_DAY × crew_days
if director_required == yes and director not in roster: CREW += RATE_DIRECTOR_DAY × crew_days
if drone_required: CREW += RATE_DRONE_PILOT_DAY × ceil(drone_hours / 6)

CAMERA   = RATE_CAM_<tier>_DAY × crew_days
           + max(0, multicam_count − 1) × RATE_EXTRA_CAM_DAY × crew_days
LIGHTING = RATE_LIGHT_<package>_DAY × crew_days
AUDIO    = (audio_capture != camera_audio) ? RATE_AUDIO_KIT_DAY × crew_days : 0
MOVEMENT = (gimbal_required ? RATE_GIMBAL_DAY × crew_days : 0)
         + jib_dolly_required mapped to its rate × crew_days
PROMPTER = teleprompter ? RATE_PROMPTER_DAY × crew_days : 0
STUDIO   = (location_type == studio) ? RATE_STUDIO_DAY × shoot_days : 0
SET      = none 0 | simple RATE_SET_SIMPLE | custom RATE_SET_CUSTOM
STREAM   = livestream_required ? RATE_LIVESTREAM_DAY × shoot_days : 0
TALENT   = (talent_needed == agency_casts) ? talent_count × 750 × shoot_days : 0
PERMITS  = (permits_needed == please_handle) ? RATE_PERMIT_HANDLING : 0

PROD = CREW + CAMERA + LIGHTING + AUDIO + MOVEMENT + PROMPTER
     + STUDIO + SET + STREAM + TALENT + PERMITS
```

## 5. Post-production

```
complexity_ratio = assembly_light 1.5 | standard_narrative 3.0
                 | heavy_multicam 5.0 | complex_vfx_heavy 8.0

edit_hours = footage_volume_hours × 0.6              # ingest, sync, select
           + runtime_min × complexity_ratio × 2.5    # the actual cut

INGEST   = footage_volume_hours × 0.4 × RATE_ASSIST_INGEST_HOUR
EDIT     = edit_hours × RATE_EDIT_HOUR
GRADE    = runtime_min × RATE_GRADE_<color_grade>_MIN

MGFX     = none 0
         | lower_thirds_only  RATE_LOWER_THIRDS_PKG
         | otherwise          mgfx_seconds × RATE_MGFX_SECOND
           (if mgfx_seconds blank, default: light 20s, moderate 60s, heavy 150s)
VFX      = vfx_cleanup ? runtime_min × 2 × RATE_VFX_HOUR : 0

MIX      = basic_levels runtime_min × RATE_MIX_BASIC_MIN
         | full_mix_sfx runtime_min × RATE_MIX_FULL_MIN
         | mix_and_master runtime_min × (RATE_MIX_FULL_MIN + RATE_MASTER_MIN)

MUSIC    = none 0 | library RATE_MUSIC_LIBRARY
         | custom_composed runtime_min × RATE_MUSIC_CUSTOM_MIN
         | licensed_commercial → 0 + flag "sync_license_manual_quote"
VO       = (voiceover == we_cast_and_record) ? RATE_VO_CAST_RECORD : 0

SUBS     = subtitles != none ? runtime_min × RATE_SUBTITLE_MIN : 0
TRANS    = translations × runtime_min × RATE_TRANSLATION_MIN

CUTDOWNS = count(cutdowns) × RATE_CUTDOWN_EACH
VERSIONS = (count(aspect_ratios) − 1) × RATE_ASPECT_VERSION × deliverable_count
EXTRA_REV= revision_rounds == 3 ? RATE_REVISION_ROUND
         : revision_rounds == 4_plus ? RATE_REVISION_ROUND × 2 : 0
RAW      = raw_footage_handover ? RATE_RAW_HANDOVER : 0

TURNAROUND_MULT = standard_4wk 1.00 | expedited_2wk 1.30 | rush_5day 1.75
```

**Multi-deliverable rule — apply before the turnaround multiplier.** If
`deliverable_count > 1` and the videos are distinct pieces (not cutdowns of one
piece), scale the three craft lines:

```
multi_factor = 1 + 0.65 × (deliverable_count − 1)
EDIT  ×= multi_factor
GRADE ×= multi_factor
MIX   ×= multi_factor
```
The second video is cheaper than the first — shared setup, shared look, shared
session — but it is not free. `INGEST`, `MGFX`, `MUSIC`, and `VO` are not
scaled: they are already driven by their own quantities.

Only then:

```
POST = (INGEST + EDIT + GRADE + MGFX + VFX + MIX + MUSIC + VO
        + SUBS + TRANS + CUTDOWNS + VERSIONS) × TURNAROUND_MULT
       + EXTRA_REV + RAW
```
Order matters. Scaling after the multiplier would compound the rush uplift
against every extra deliverable. `EXTRA_REV` and `RAW` sit outside the
multiplier because neither gets faster or slower with turnaround.

**Post-share sanity check:** if `POST / (PRE + PROD + POST) < 0.30`, flag
`"post_underweighted"` and re-examine `edit_complexity` and `footage_volume_hours`
before rendering.

## 6. Licensing / distribution multiplier

```
dist_points = Σ: internal_only 0 | client_pitch 0 | website 1 | organic_social 1
            | trade_show 2 | paid_social 4 | youtube_preroll 4 | ooh_screens 5
            | cinema 6 | broadcast_tv 7

term_factor      = 6_months 0.8 | 1_year 1.0 | 3_years 1.5 | perpetual 2.0
territory_factor = local 1.0 | national 1.3 | worldwide 1.6

license_multiplier = 1 + (dist_points × 0.05 × term_factor × territory_factor)

licensable_base = PRE + PROD + POST          # = SUBTOTAL, the global default
LICENSE_FEE     = licensable_base × (license_multiplier − 1)
```
Unlike photography, video does not narrow the base: the whole production exists
to make the deliverable, and there are no meaningful pass-through goods in the
subtotal to carve out.

`broadcast_tv` or `cinema` selected, or `talent_usage_buyout == true` → flag
`"broadcast_usage_manual_review"`. Talent buyouts are never auto-quoted; the
buyout goes to `deferred_items` in `estimate.json`, outside the total.

## 7. Assemble

```
BASE          = PRE + PROD
ADD_ONS       = POST
rushable_base = BASE
volume_factor = 1.0
```

`rushable_base = BASE`, not `SUBTOTAL`. `POST` already carries
`TURNAROUND_MULT`; charging the rush delta on it too would bill one compressed
schedule twice. Note the two are genuinely different things — `TURNAROUND_MULT`
prices a fast *edit*, the rush delta prices a compressed *production* — which is
exactly why each should apply to its own half of the budget and no more.

Then travel (global §6, with `production_days = shoot_days` and `crew_size` =
the roster length from §4), rush (global §5, `STANDARD_LEAD_DAYS = 35`),
discounts (global §7), and the universal skeleton. Three tiers:

- **Good** — one fewer shoot day or smaller crew, standard grade, lower-thirds
  only, 2 revision rounds, one aspect ratio.
- **Standard** — as scoped.
- **Premium** — extra shoot day, full grip & electric, full grade, expanded
  motion graphics, all cutdowns and aspect ratios, expedited turnaround.

## 8. Section assembly

Universal order (global §8), with these video specifics:

- **Investment table is grouped in three blocks** — Pre-production, Production,
  Post-production — with a subtotal each. Clients who see post as a single line
  item negotiate it away; showing its structure prevents that.
- **Timeline** milestones: contract & deposit → creative kickoff → script/board
  approval → pre-production & scouting → shoot day(s) → first cut → revision
  rounds → colour & mix → final delivery. Anchor backwards from
  `target_completion_date`; if the math doesn't fit, say so explicitly and
  propose the earliest realistic date.
- **Revisions clause, verbatim intent:** *"{n} rounds of revisions are included.
  A round means one consolidated set of notes from your side. Additional rounds
  are billed at {{RATE_REVISION_ROUND}} each."*
- **Explicitly not included:** raw footage, sync licensing for commercial music,
  talent usage renewals, media buying, permits and location fees, travel beyond
  the quoted radius, and re-shoots caused by changes to an approved script.
- **Drone dependency note** whenever `drone_required`: aerial work is subject to
  airspace clearance and weather; if clearance is denied, that line is removed
  and credited.
