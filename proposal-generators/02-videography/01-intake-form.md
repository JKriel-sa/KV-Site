# Intake Form — Videography Proposal Generator

**Section 1 of 4 — Your details** → universal client intake block,
`_shared/00-global-spec.md` §3.

---

## Section 2 of 4 — The deliverable

| Field ID | Label | Type | Req | Options / notes |
|---|---|---|---|---|
| `video_type` | What are we making? | select | ✅ | `brand_film`, `corporate_explainer`, `product_demo`, `tv_commercial`, `social_ad`, `event_recap`, `event_full_coverage`, `testimonial_case_study`, `documentary_short`, `training_internal`, `music_video`, `livestream`, `other` |
| `video_purpose` | What should it achieve? | textarea | ✅ | quoted into the objective section |
| `primary_runtime_sec` | Runtime of the main video (seconds) | number | ✅ | 15–3600 |
| `deliverable_count` | How many separate videos? | number | ✅ | default 1 |
| `cutdowns` | Cutdowns / edits needed | multiselect | ➖ | `none`, `60s`, `30s`, `15s`, `6s_bumper`, `vertical_9x16`, `square_1x1` |
| `aspect_ratios` | Aspect ratios required | multiselect | ✅ | `16x9`, `9x16`, `1x1`, `4x5`, `21x9` |
| `distribution` | Where will it run? | multiselect | ✅ | `internal_only`, `website`, `organic_social`, `paid_social`, `youtube_preroll`, `broadcast_tv`, `cinema`, `ooh_screens`, `trade_show`, `client_pitch` |
| `usage_term` | Usage term | select | ✅ | `6_months`, `1_year`, `3_years`, `perpetual` |
| `usage_territory` | Territory | select | ✅ | `local`, `national`, `worldwide` |
| `reference_videos` | Reference links | textarea | ➖ | strongly encouraged — drives the complexity read |

---

## Section 3 of 4 — Production

### 3A. Schedule & scale

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `shoot_days` | Number of shoot days | number | ✅ | or `not_sure` — we'll propose |
| `shoot_hours_per_day` | Hours per shoot day | select | ✅ | `half_day_5`, `full_day_10`, `extended_12` |
| `location_count` | Number of locations | number | ✅ | |
| `location_type` | Location type | select | ✅ | `studio`, `client_site`, `on_location`, `multiple_mixed` |
| `location_address` | Primary city / address | text | ✅ | drives travel |
| `travel_distance_km` | Distance from base | number | auto | override allowed |
| `overnight_required` | Overnight stay? | bool | auto | |
| `shoot_dates` | Preferred / fixed shoot dates | text | ✅ | note if immovable |

### 3B. Crew

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `crew_size` | Crew size | select | ✅ | `solo_shooter`, `small_2_3`, `standard_4_6`, `full_7_plus`, `recommend_for_me` |
| `crew_roles` | Specific roles needed | multiselect | ➖ | `director`, `dop`, `cam_op_2`, `gaffer`, `grip`, `sound_recordist`, `hmu`, `stylist`, `art_dept`, `producer_on_set`, `pa`, `teleprompter_op`, `script_supervisor` |
| `director_required` | Director on set? | select | ✅ | `yes`, `no`, `client_directs` |
| `talent_needed` | On-camera talent | select | ✅ | `none`, `client_staff`, `client_provides_talent`, `agency_casts` |
| `talent_count` | How many? | number | conditional | |
| `talent_usage_buyout` | Talent buyout required? | bool | conditional | true → flag for human |

### 3C. Equipment & specials

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `camera_tier` | Camera package | select | ✅ | `standard_mirrorless`, `cinema_s35`, `cinema_full_frame`, `high_speed`, `recommend_for_me` |
| `lighting_package` | Lighting | select | ✅ | `natural_minimal`, `standard_kit`, `full_grip_electric` |
| `audio_capture` | Audio | select | ✅ | `camera_audio`, `lav_and_boom`, `dedicated_recordist` |
| `drone_required` | Drone / aerial footage? | bool | ➖ | true → licensed pilot + airspace check |
| `drone_hours` | Aerial hours needed | number | conditional | |
| `gimbal_required` | Gimbal / stabilised movement? | bool | ➖ | |
| `jib_dolly_required` | Jib, dolly, or slider? | select | ➖ | `none`, `slider`, `dolly`, `jib_crane`, `techno` |
| `teleprompter` | Teleprompter? | bool | ➖ | |
| `livestream_required` | Live streaming? | bool | ➖ | true → separate switching crew |
| `multicam_count` | Simultaneous cameras | number | ➖ | default 1 |
| `set_build` | Set build required? | select | ➖ | `none`, `simple`, `custom_build` |
| `permits_needed` | Permits expected? | select | ➖ | `no`, `client_handles`, `please_handle` |

---

## Section 4 of 4 — Post-production & style

### 4A. Post

| Field ID | Label | Type | Req | Notes |
|---|---|---|---|---|
| `edit_complexity` | Edit complexity | select | ✅ | `assembly_light`, `standard_narrative`, `heavy_multicam`, `complex_vfx_heavy` |
| `footage_volume_hours` | Estimated footage hours | number | ➖ | auto-estimated if blank |
| `color_grade` | Colour grading | select | ✅ | `basic_correction`, `full_grade`, `cinematic_look_dev` |
| `motion_graphics` | Motion graphics / animation | select | ✅ | `none`, `lower_thirds_only`, `light_5_scenes`, `moderate_15_scenes`, `heavy_custom` |
| `mgfx_seconds` | Approx. seconds of animation | number | conditional | bounds the open-ended item |
| `vfx_cleanup` | VFX or cleanup (logo removal, comps)? | bool | ➖ | |
| `sound_mix` | Sound treatment | select | ✅ | `basic_levels`, `full_mix_sfx`, `mix_and_master` |
| `music` | Music | select | ✅ | `none`, `library_track`, `custom_composed`, `licensed_commercial` (flag) |
| `voiceover` | Voiceover | select | ✅ | `none`, `client_provides`, `we_cast_and_record` |
| `subtitles` | Subtitles / captions | multiselect | ➖ | `none`, `burned_in`, `srt_file`, `open_captions` |
| `translations` | Additional languages | number | ➖ | each adds subtitle + version cost |
| `revision_rounds` | Revision rounds wanted | select | ✅ | `2_standard`, `3`, `4_plus` |
| `turnaround` | Turnaround after final shoot day | select | ✅ | `standard_4wk`, `expedited_2wk`, `rush_5day` |
| `raw_footage_handover` | Want the raw footage? | bool | ➖ | archive + transfer fee |
| `scriptwriting` | Script needed? | select | ✅ | `client_provides`, `we_write`, `collaborative` |
| `storyboard` | Storyboard / animatic? | bool | ➖ | |

### 4B. Proposal style

| Field ID | Label | Type | Req | Options |
|---|---|---|---|---|
| `template_choice` | Proposal layout | select | ✅ | `corporate_brand`, `event_coverage`, `commercial_ad`, `let_us_recommend` |
| `include_samples` | Include reel / samples? | bool | ➖ | default true |
| `delivery_method` | Send as | select | ➖ | `pdf_email`, `web_link`, `both` |

---

## Submit
Compute → render → draft email. Confirmation screen states the estimate range
and: *"A producer will review crew and equipment availability for your dates and
come back within one business day."*
