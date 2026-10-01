# Intake Form — Sound Design & Audio Recording Proposal Generator

**Section 1 of 4 — Your details** → universal client intake block,
`_shared/00-global-spec.md` §3.

---

## Section 2 of 4 — What we're making

| Field ID | Label | Type | Req | Options / notes |
|---|---|---|---|---|
| `audio_project_type` | Project type | select | ✅ | `podcast_series`, `podcast_single`, `voiceover`, `audiobook`, `music_recording`, `film_scoring`, `sound_design_post`, `mixing_only`, `mastering_only`, `audio_restoration`, `audio_branding_sonic_logo`, `live_event_recording`, `other` |
| `project_description` | Describe it | textarea | ✅ | quoted into the brief section |
| `total_runtime_min` | Total finished runtime (minutes) | number | ✅ | across all deliverables |
| `deliverable_count` | Number of separate pieces | number | ✅ | episodes, tracks, cues, spots |
| `runtime_per_piece_min` | Runtime per piece | number | ➖ | auto: total ÷ count |
| `reference_links` | Reference audio | textarea | ➖ | strongly encouraged |
| `source_material_state` | What do you have already? | select | ✅ | `nothing_yet`, `raw_recordings`, `edited_needs_mix`, `mixed_needs_master`, `poor_quality_needs_rescue` (flag) |

### 2B. Recurring / series (conditional on `podcast_series`, or `deliverable_count > 4`)

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `episode_count` | Episodes in this commitment | number | ✅ | |
| `cadence` | Release cadence | select | ✅ | `weekly`, `biweekly`, `monthly`, `seasonal_batch` |
| `season_or_ongoing` | Commitment shape | select | ✅ | `one_season`, `ongoing_retainer`, `pilot_only` |
| `host_count` | Number of hosts | number | ✅ | |
| `guest_per_episode` | Guests per episode | number | ➖ | remote guests add cleanup |
| `remote_recording` | How are hosts/guests recorded? | select | ✅ | `all_in_studio`, `all_remote`, `hybrid` |

---

## Section 3 of 4 — Recording & post

### 3A. Recording (skip entirely if `source_material_state != nothing_yet`)

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `studio_required` | Studio recording needed? | select | ✅ | `our_studio`, `client_location`, `remote_direction`, `none_client_records` |
| `studio_hours` | Studio hours needed | number | conditional | or `not_sure` |
| `session_count` | Number of separate sessions | number | ➖ | default 1 |
| `engineer_required` | Recording engineer? | select | ✅ | `yes`, `self_serve_room`, `n_a` |
| `talent_needed` | Voice talent required? | select | ✅ | `none`, `client_provides`, `we_cast` |
| `talent_count` | How many voices? | number | conditional | |
| `talent_usage_buyout` | Talent buyout needed? | bool | conditional | true → flag, quoted separately |
| `musicians_count` | Session musicians needed | number | ➖ | |
| `live_room_needed` | Live room / drum room required? | bool | ➖ | |
| `on_location_recording` | Field / location recording? | bool | ➖ | |
| `location_address` | Location | text | conditional | drives travel |
| `travel_distance_km` | Distance from base | number | auto | |
| `direction_required` | Session direction / producing? | bool | ➖ | |

### 3B. Post-production

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `editing_scope` | Editing required | select | ✅ | `none`, `light_topntail`, `standard_dialogue_edit`, `heavy_narrative_edit`, `full_story_edit` |
| `noise_cleanup` | Noise reduction / restoration | select | ✅ | `none`, `standard`, `heavy_restoration` |
| `mixing` | Mixing | select | ✅ | `none`, `stereo_mix`, `stem_mix`, `surround_51`, `atmos` (flag) |
| `mastering` | Mastering | select | ✅ | `none`, `single_target`, `multi_platform_targets` |
| `loudness_target` | Delivery loudness standard | select | ✅ | `podcast_-16lufs`, `music_-14lufs`, `broadcast_-23lufs`, `cinema`, `not_sure` |
| `sound_design` | Sound design / SFX | select | ✅ | `none`, `light_transitions`, `moderate_scene_beds`, `heavy_immersive` |
| `sfx_count` | Approx. number of designed effects | number | conditional | bounds the open item |
| `foley` | Custom foley recording? | select | ➖ | `none`, `light`, `full_foley_pass` |
| `foley_scene_minutes` | Minutes of foley coverage | number | conditional | |
| `adr_required` | ADR / dialogue replacement? | bool | ➖ | |
| `adr_lines` | Approx. ADR lines | number | conditional | |
| `music_needs` | Music | select | ✅ | `none`, `library_licensed`, `original_composed`, `commercial_track` (flag) |
| `music_minutes` | Minutes of original music | number | conditional | |
| `music_arrangement` | Instrumentation | select | conditional | `solo_electronic`, `small_ensemble`, `live_session_players`, `orchestral` (flag) |
| `intro_outro` | Branded intro / outro package? | bool | ➖ | podcasts |
| `sonic_logo` | Sonic logo / audio brand mark? | bool | ➖ | |

### 3C. Deliverables & rights

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `delivery_formats` | Formats needed | multiselect | ✅ | `mp3`, `wav_16_44`, `wav_24_48`, `aac`, `stems`, `omf_aaf`, `broadcast_wav` |
| `alt_versions` | Alternate versions | multiselect | ➖ | `none`, `instrumental`, `dialogue_free_MnE`, `shortened_cutdown`, `clean_censored` |
| `transcription` | Transcript required? | select | ➖ | `none`, `raw_transcript`, `edited_transcript`, `show_notes` |
| `chapter_markers` | Chapter markers / metadata? | bool | ➖ | |
| `distribution` | Where will it be published? | multiselect | ✅ | `internal`, `podcast_platforms`, `website`, `organic_social`, `paid_ads`, `broadcast_radio`, `broadcast_tv`, `cinema`, `game_app`, `retail_music_streaming` |
| `usage_term` | Usage term | select | ✅ | `6_months`, `1_year`, `3_years`, `perpetual` |
| `usage_territory` | Territory | select | ✅ | `local`, `national`, `worldwide` |
| `rights_ownership` | Who owns the finished audio? | select | ✅ | `agency_licenses_to_client`, `full_buyout_to_client`, `work_for_hire` |
| `pro_registration` | PRO / publishing registration needed? | bool | ➖ | flag → human |
| `revision_rounds` | Revision rounds | select | ✅ | `2_standard`, `3`, `4_plus` |
| `turnaround` | Turnaround | select | ✅ | `standard_2wk`, `expedited_1wk`, `rush_48hr` |
| `hosting_distribution_help` | Need help with podcast hosting/publishing? | bool | ➖ | |

---

## Section 4 of 4 — Proposal style

| Field ID | Label | Type | Req | Options |
|---|---|---|---|---|
| `template_choice` | Proposal layout | select | ✅ | `podcast_production`, `commercial_audio_foley`, `music_film_scoring`, `let_us_recommend` |
| `include_samples` | Include audio samples? | bool | ➖ | default true |
| `delivery_method` | Send as | select | ➖ | `pdf_email`, `web_link`, `both` |

---

## Submit
Compute → render → draft email. Confirmation screen shows the estimate range
and, for series work, the **per-episode rate** alongside the total. Closing
line: *"A studio producer will confirm booking availability and come back within
one business day."*
