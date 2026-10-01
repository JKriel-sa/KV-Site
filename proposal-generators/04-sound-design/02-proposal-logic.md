# Proposal Logic — Sound Design & Audio

`STANDARD_LEAD_DAYS = 21`

Recording is priced **per hour**. Post is priced **per finished minute**. Never
blend the two units.

## 1. Rate card (edit here only)

```
# Recording
RATE_STUDIO_HOUR        = 150    # room only
RATE_ENGINEER_HOUR      = 110
RATE_STUDIO_DAY         = 950    # 8 hrs, replaces hourly at ≥ 7 hrs
RATE_LIVE_ROOM_UPLIFT   = 75     # per hour, live/drum room
RATE_REMOTE_SESSION_HR  = 90     # remote-direction session
RATE_FIELD_RECORD_HOUR  = 165    # location recording, kit included
RATE_DIRECTION_HOUR     = 125    # session producing / talent direction
RATE_TALENT_SESSION     = 450    # per voice, per session (buyout separate)
RATE_MUSICIAN_SESSION   = 400    # per player, per session

# Post — DENSE audio (scored picture, commercial, foley, music).
# Per finished minute unless noted. Every minute is worked densely, so the
# minute is the right unit.
RATE_EDIT_LIGHT_MIN     = 25
RATE_EDIT_STANDARD_MIN  = 55
RATE_EDIT_HEAVY_MIN     = 110
RATE_EDIT_STORY_MIN     = 190    # narrative / documentary story editing
RATE_CLEANUP_STD_MIN    = 20
RATE_CLEANUP_HEAVY_MIN  = 75
RATE_MIX_STEREO_MIN     = 70
RATE_MIX_STEM_MIN       = 110
RATE_MIX_51_MIN         = 220
RATE_MASTER_MIN         = 45
RATE_MASTER_EXTRA_TGT   = 20     # per additional platform target, per minute

# Post — LONG-FORM SPEECH (podcast, audiobook, voiceover, live capture).
# A separate curve, not a discount on the one above. Cost scales sub-linearly
# with runtime here: a 40-minute interview is not forty minutes of dense work,
# and mixing and mastering are set up once per episode and then largely ride.
# Priced per minute for edit and cleanup, PER PIECE for mix and master.
RATE_SPK_EDIT_LIGHT_MIN = 4
RATE_SPK_EDIT_STD_MIN   = 8
RATE_SPK_EDIT_HEAVY_MIN = 18
RATE_SPK_EDIT_STORY_MIN = 35
RATE_SPK_CLEANUP_STD    = 3      # per minute
RATE_SPK_CLEANUP_HEAVY  = 10     # per minute
RATE_SPK_MIX_STEREO     = 150    # per piece
RATE_SPK_MIX_STEM       = 260    # per piece
RATE_SPK_MIX_51         = 500    # per piece
RATE_SPK_MASTER         = 80     # per piece
RATE_SPK_MASTER_EXTRA   = 35     # per additional target, per piece
RATE_SFX_EACH           = 65     # per designed effect
RATE_SFX_BED_MIN        = 90     # per minute of ambient/scene bed
RATE_FOLEY_MIN          = 260    # per minute of foley coverage
RATE_ADR_LINE           = 35
RATE_MUSIC_ORIG_MIN     = 900    # per finished minute, solo/electronic baseline
RATE_MUSIC_LIBRARY      = 220    # per track licensed
RATE_INTRO_OUTRO_PKG    = 750
RATE_SONIC_LOGO         = 2200

# Deliverables & extras
RATE_ALT_VERSION_MIN    = 25     # per minute, per alternate version
RATE_STEMS_DELIVERY     = 150    # per piece
RATE_TRANSCRIPT_MIN     = 4
RATE_SHOW_NOTES_EACH    = 90
RATE_CHAPTER_MARKERS    = 40     # per piece
RATE_REVISION_ROUND     = 250    # each beyond 2
RATE_PUBLISH_ASSIST     = 120    # per episode, hosting/publishing help
RATE_MILEAGE            = 0.85
RATE_PER_DIEM           = 90
```

## 2. Normalise

```
R = total_runtime_min
N = deliverable_count
if runtime_per_piece_min blank: runtime_per_piece_min = R / N

if studio_hours == not_sure:
    studio_hours = ceil(R × ratio) where ratio =
        podcast/voiceover/audiobook  1.4     # talk records close to real time
        music_recording              4.0
        film_scoring                 2.5
        default                      2.0
    → flag "studio_hours_estimated"

arrangement_factor = solo_electronic 1.0 | small_ensemble 1.6
                   | live_session_players 2.4 | orchestral 4.0 (flag)
```

## 3. Recording (RECORD)

```
# Section 3A of the intake is skipped entirely unless source_material_state
# == nothing_yet, so studio_required may be unset. Both cases mean no session:
if source_material_state != nothing_yet:        RECORD = 0, skip block
if studio_required == none_client_records:      RECORD = 0, skip block

hrs             = studio_hours
production_days = max(1, ceil(hrs / 8))    # global §6 travel expects this name
crew_size       = 1 + (engineer_required == yes ? 1 : 0)
                    + (direction_required ? 1 : 0)
                    + (talent_needed == we_cast ? talent_count : 0)
                    + musicians_count

ROOM   = hrs >= 7 ? RATE_STUDIO_DAY × ceil(hrs/8) : hrs × RATE_STUDIO_HOUR
       + (live_room_needed ? hrs × RATE_LIVE_ROOM_UPLIFT : 0)
if studio_required == remote_direction: ROOM = hrs × RATE_REMOTE_SESSION_HR
if on_location_recording:               ROOM = hrs × RATE_FIELD_RECORD_HOUR

ENGINEER  = (engineer_required == yes) ? hrs × RATE_ENGINEER_HOUR : 0
DIRECTION = direction_required ? hrs × RATE_DIRECTION_HOUR : 0
TALENT    = (talent_needed == we_cast)
            ? talent_count × RATE_TALENT_SESSION × session_count : 0
MUSICIANS = musicians_count × RATE_MUSICIAN_SESSION × session_count

RECORD = ROOM + ENGINEER + DIRECTION + TALENT + MUSICIANS
```
`talent_usage_buyout == true` → flag `"talent_buyout_manual_quote"`. The buyout
is stated in the proposal as a separate, to-be-confirmed line — never folded in.

## 4. Post-production (POST)

### 4A. Pick the curve first

```
SPOKEN = audio_project_type ∈ {podcast_series, podcast_single, audiobook,
                               voiceover, live_event_recording}
```

Everything below reads from the spoken rate table when `SPOKEN`, and from the
dense table otherwise. This is the single most important line in this file:
applying the dense per-minute rates to a ten-episode podcast quotes $28,000 to
mix it and $18,000 to master it, which is not a calibration error but a
category error. Speech is a different curve, not a cheaper version of the same
one.

```
EDIT    = R × (editing_scope: none 0 | light | standard | heavy | full_story)
                from EDIT table for the chosen curve

CLEANUP = R × (noise_cleanup: none 0 | standard | heavy_restoration)
                from CLEANUP table for the chosen curve
if remote_recording == all_remote:  CLEANUP × 1.4
if remote_recording == hybrid:      CLEANUP × 1.2
if source_material_state == poor_quality_needs_rescue:
    CLEANUP × 1.6  → flag "source_quality_risk"

MIX     = SPOKEN ? N × RATE_SPK_MIX_<tier>        # per piece
                 : R × RATE_MIX_<tier>_MIN        # per finished minute
          atmos → flag "atmos_manual_quote", R × RATE_MIX_51_MIN × 1.8 either way

MASTER  = mastering == none ? 0
        : SPOKEN ? N × RATE_SPK_MASTER
                   + (multi_platform_targets ? N × RATE_SPK_MASTER_EXTRA × 2 : 0)
                 : R × RATE_MASTER_MIN
                   + (multi_platform_targets ? R × RATE_MASTER_EXTRA_TGT × 2 : 0)

SFX     = sound_design: none 0
        | light_transitions      N × 4 × RATE_SFX_EACH
        | moderate_scene_beds    (sfx_count or N × 10) × RATE_SFX_EACH
                                 + R × 0.3 × RATE_SFX_BED_MIN
        | heavy_immersive        (sfx_count or N × 25) × RATE_SFX_EACH
                                 + R × 0.7 × RATE_SFX_BED_MIN

FOLEY   = foley: none 0 | light foley_scene_minutes × RATE_FOLEY_MIN × 0.5
                | full_foley_pass foley_scene_minutes × RATE_FOLEY_MIN
ADR     = adr_required ? adr_lines × RATE_ADR_LINE : 0

MUSIC   = none 0
        | library_licensed   N × RATE_MUSIC_LIBRARY
        | original_composed  music_minutes × RATE_MUSIC_ORIG_MIN × arrangement_factor
        | commercial_track   0 → flag "sync_license_manual_quote"

BRANDING = (intro_outro ? RATE_INTRO_OUTRO_PKG : 0)
         + (sonic_logo ? RATE_SONIC_LOGO : 0)

POST_CORE = EDIT + CLEANUP + MIX + MASTER + SFX + FOLEY + ADR + MUSIC + BRANDING
```

**Loudness sanity check:** if `loudness_target == not_sure`, do not guess —
default from `distribution` (podcast → −16 LUFS, retail_music_streaming → −14,
broadcast → −23) and state the assumption in the proposal in plain text.

## 5. Deliverables & extras

```
ALTS      = count(alt_versions ≠ none) × R × RATE_ALT_VERSION_MIN
STEMS     = (stems ∈ delivery_formats) ? N × RATE_STEMS_DELIVERY : 0
TRANSCR   = transcription: none 0 | raw R × RATE_TRANSCRIPT_MIN
          | edited R × RATE_TRANSCRIPT_MIN × 1.8
          | show_notes R × RATE_TRANSCRIPT_MIN × 1.8 + N × RATE_SHOW_NOTES_EACH
MARKERS   = chapter_markers ? N × RATE_CHAPTER_MARKERS : 0
PUBLISH   = hosting_distribution_help ? N × RATE_PUBLISH_ASSIST : 0
EXTRA_REV = revision_rounds == 3 ? RATE_REVISION_ROUND
          : revision_rounds == 4_plus ? RATE_REVISION_ROUND × 2 : 0

TURNAROUND_MULT = standard_2wk 1.00 | expedited_1wk 1.30 | rush_48hr 1.70

POST = (POST_CORE + ALTS + STEMS + TRANSCR + MARKERS + PUBLISH) × TURNAROUND_MULT
     + EXTRA_REV
```

## 6. Series economics (podcast / recurring)

When `audio_project_type == podcast_series` or `episode_count > 1`:

```
volume_factor = episode_count:  1–3   1.00
                                4–9   0.93
                                10–19 0.87
                                20+   0.80

VOLUME_ADJ = SUBTOTAL × (volume_factor − 1)        # negative
```

`volume_factor` is the global spec's §4 term — it must flow into `PRE_TAX`
through `VOLUME_ADJ`, or the scale economy shown to the client never reaches the
number they are charged. Do not compute a discounted per-episode rate and then
total the undiscounted figures; that mismatch is the single easiest way for this
generator to quote two different prices in one document.

Presentation figures, derived *after* `TOTAL` is final so they reconcile against
it exactly:

```
PER_EPISODE = TOTAL / episode_count
MONTHLY     = PER_EPISODE × (cadence: weekly 4.33 | biweekly 2.17 | monthly 1)
```

`RECORD` and `POST` are computed across the whole series — `R` is total runtime
and `studio_hours` is total session time — so dividing the final total by
`episode_count` is the correct per-episode figure, not an approximation.

Present the **per-episode rate** as the headline and the series total as
supporting; that is how podcast clients budget. Emit both to
`estimate.json.recurring` with `unit: "episode"`.

For `season_or_ongoing == ongoing_retainer`, quote `MONTHLY` as a retainer and
populate `min_term_months` and `notice_period_days` — an open-ended monthly
figure with no stated exit is not a quote either side can rely on.

`volume_factor` and the §7 discounts stack: a returning client committing to 20
episodes gets both. That is intended — one is a scale economy, the other is a
relationship decision.

## 7. Rights & distribution multiplier

```
dist_points = Σ: internal 0 | website 1 | podcast_platforms 1 | organic_social 1
            | game_app 3 | paid_ads 4 | retail_music_streaming 4
            | broadcast_radio 5 | broadcast_tv 6 | cinema 6

term_factor      = 6_months 0.8 | 1_year 1.0 | 3_years 1.5 | perpetual 2.0
territory_factor = local 1.0 | national 1.3 | worldwide 1.6

license_multiplier = 1 + (dist_points × 0.05 × term_factor × territory_factor)
if rights_ownership == full_buyout_to_client: license_multiplier × 1.35
if rights_ownership == work_for_hire:         license_multiplier × 1.50

licensable_base = RECORD + POST − MUSICIANS − TALENT
LICENSE_FEE     = licensable_base × (license_multiplier − 1)
```

The base narrows the global default (§4) by the two performer line items.
Session players and voice talent are paid for their performance; their fees are
a cost of making the recording, not a function of how widely it is later used.
Their *usage* is handled separately and correctly by the buyout, which is
deferred to a human. Applying a worldwide-perpetual multiplier to a musician's
day rate would charge the client twice for the same right.
Flags: `pro_registration == true` → `"publishing_rights_manual_review"`.
`music_needs == commercial_track` → always flag. `work_for_hire` with original
composition → flag; that assigns authorship and needs a real contract.

## 8. Assemble

```
BASE          = RECORD
ADD_ONS       = POST
rushable_base = BASE                      # POST already carries TURNAROUND_MULT
volume_factor = from §6, else 1.0
```

`rushable_base = BASE` for the same reason as photography and video: `POST`
already carries `TURNAROUND_MULT`, so charging the rush delta on it as well
bills one compressed schedule twice. Note the edge case this creates — when
`RECORD = 0` (the client supplies their own recordings), `rushable_base = 0` and
no rush fee applies at all. That is correct, not a gap: on a post-only job the
turnaround multiplier is already the entire urgency charge.

Then travel (global §6, only when `on_location_recording`, using the
`production_days` and `crew_size` from §3), rush (global §5,
`STANDARD_LEAD_DAYS = 21`), discounts (global §7), and the universal skeleton.

**Post-share sanity check:** for anything other than `mastering_only`, if
`POST < RECORD × 0.8`, flag `"post_underweighted"` — finishing almost always
costs more than capturing.

Three tiers:
- **Good** — standard edit, stereo mix, single master target, library music,
  no sound design, 2 revisions, standard turnaround.
- **Standard** — as scoped.
- **Premium** — heavier edit, stem mix, multi-platform mastering, original
  music, fuller sound design, transcripts and show notes, expedited turnaround.

## 9. Section assembly

Universal order (global §8), with these audio specifics:

- **Investment table grouped in three blocks** — Recording, Post-production,
  Deliverables — each with its own subtotal and its own unit shown (hours for
  recording, finished minutes for post). This is the single most important
  formatting rule in this generator: it is what stops the "why does a 30-minute
  episode cost more than 30 minutes of work" conversation.
- **Series proposals lead with the per-episode rate**, then the season total,
  then the monthly figure.
- **Technical delivery spec** is its own section: formats, sample rate, bit
  depth, loudness target, true-peak ceiling, file naming, and stem structure.
  Engineers downstream need this, and stating it prevents redelivery.
- **Revisions clause:** *"{n} rounds are included. A round is one consolidated
  set of notes. Further rounds are {{RATE_REVISION_ROUND}} each."*
- **Rights section** states plainly what the client gets: licence vs. buyout vs.
  work-for-hire, term, territory, and — separately — any talent buyout still to
  be confirmed.
- **Explicitly not included:** sync licensing for commercial recordings, talent
  usage renewals, PRO registration and publishing administration, session
  musician royalties, distribution/hosting fees, and re-records caused by script
  changes after approval.
- **Source-quality caveat** whenever `source_quality_risk` is flagged: *"We will
  improve this material as far as it can be improved. We won't promise a result
  the original recording can't support — we'll show you a test on a sample
  before you commit to the full pass."* Offer the paid test.
- **Timeline** milestones: contract & deposit → session booking confirmed →
  recording → first edit/rough mix → revision rounds → final mix → master &
  delivery.
