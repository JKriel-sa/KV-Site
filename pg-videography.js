/* ==========================================================================
   Proposal generator — Videography
   Implements proposal-generators/02-videography/.
   ========================================================================== */
(function () {
  'use strict';

  var R = {
    PREPRO_DAY: 750, SCRIPT_MIN: 350, BOARD_FRAME: 45, CASTING: 600,
    DIRECTOR: 1400, DOP: 1200, CAM_OP: 750, GAFFER: 700, GRIP: 600,
    SOUND_REC: 700, HMU: 550, STYLIST: 650, ART_DEPT: 800,
    PRODUCER_SET: 900, PA: 300, PROMPTER_OP: 450, SCRIPT_SUP: 550, DRONE_PILOT: 950,
    CAM: { standard_mirrorless: 350, cinema_s35: 900, cinema_full_frame: 1400, high_speed: 2200 },
    EXTRA_CAM: 400,
    LIGHT: { natural_minimal: 150, standard_kit: 450, full_grip_electric: 1200 },
    AUDIO_KIT: 250, GIMBAL: 300,
    MOVE: { none: 0, slider: 150, dolly: 500, jib_crane: 850, techno: 2500 },
    PROMPTER: 350, STUDIO: 1200, SET_SIMPLE: 900, SET_CUSTOM: 4500, LIVESTREAM: 1800,
    EDIT_HOUR: 95, INGEST_HOUR: 55,
    GRADE: { basic_correction: 120, full_grade: 300, cinematic_look_dev: 550 },
    MGFX_SEC: 45, LOWER_THIRDS: 350, VFX_HOUR: 140,
    MIX_BASIC: 60, MIX_FULL: 180, MASTER: 90,
    MUSIC_LIB: 250, MUSIC_CUSTOM_MIN: 900, VO: 850,
    SUBTITLE_MIN: 35, TRANSLATION_MIN: 75,
    CUTDOWN: 400, ASPECT: 250, REVISION: 450, RAW: 350,
    MILEAGE: 0.85, PER_DIEM: 90, PERMIT: 450, TALENT_DAY: 750
  };

  var ROSTER = {
    solo:     ['CAM_OP'],
    small:    ['DOP', 'CAM_OP'],
    standard: ['DIRECTOR', 'DOP', 'CAM_OP', 'GAFFER', 'SOUND_REC', 'PA'],
    full:     ['DIRECTOR', 'DOP', 'CAM_OP', 'GAFFER', 'SOUND_REC', 'PA',
               'GRIP', 'HMU', 'ART_DEPT', 'PRODUCER_SET', 'SCRIPT_SUP']
  };

  window.PG_CONFIG = {
    service: 'Videography',
    standardLeadDays: 35,
    taxRate: 0,

    sections: [
      window.PG_INTAKE,

      { title: 'The deliverable', short: 'Deliverable',
        note: 'What we\'re making, how long it runs, and where it ends up.',
        fields: [
          { id: 'video_type', label: 'What are we making?', type: 'select', req: 1,
            opts: [
              ['brand_film', 'Brand film'], ['corporate_explainer', 'Corporate explainer'],
              ['product_demo', 'Product demo'], ['tv_commercial', 'TV commercial'],
              ['social_ad', 'Social ad'], ['event_recap', 'Event recap'],
              ['event_full_coverage', 'Full event coverage'],
              ['testimonial_case_study', 'Testimonial / case study'],
              ['documentary_short', 'Documentary short'],
              ['training_internal', 'Training / internal'],
              ['music_video', 'Music video'], ['livestream', 'Livestream'],
              ['other', 'Something else']
            ] },
          { id: 'video_purpose', label: 'What should it achieve?', type: 'textarea',
            req: 1, rows: 3 },
          { id: 'primary_runtime_sec', label: 'Runtime of the main video (seconds)',
            type: 'number', req: 1, half: 1, min: 5, unsure: 1,
            help: '60 for a minute, 600 for ten minutes.' },
          { id: 'deliverable_count', label: 'How many separate videos?', type: 'number',
            req: 1, half: 1, min: 1, placeholder: '1' },
          { id: 'cutdowns', label: 'Cutdowns needed', type: 'multi',
            opts: [['60s', '60 seconds'], ['30s', '30 seconds'], ['15s', '15 seconds'],
                   ['6s_bumper', '6-second bumper'], ['vertical_9x16', 'Vertical social cut'],
                   ['square_1x1', 'Square social cut']] },
          { id: 'aspect_ratios', label: 'Aspect ratios required', type: 'multi', req: 1,
            opts: [['16x9', '16:9 landscape'], ['9x16', '9:16 vertical'],
                   ['1x1', '1:1 square'], ['4x5', '4:5 portrait'], ['21x9', '21:9 wide']] },
          { id: 'distribution', label: 'Where will it run?', type: 'multi', req: 1,
            help: 'This sets the usage licence, which is priced separately from ' +
                  'the production itself.',
            opts: [['internal_only', 'Internal only'], ['website', 'Your website'],
                   ['organic_social', 'Organic social'], ['paid_social', 'Paid social'],
                   ['youtube_preroll', 'YouTube pre-roll'], ['broadcast_tv', 'Broadcast TV'],
                   ['cinema', 'Cinema'], ['ooh_screens', 'Out-of-home screens'],
                   ['trade_show', 'Trade show'], ['client_pitch', 'Pitches only']] },
          { id: 'usage_term', label: 'Usage term', type: 'select', req: 1, half: 1,
            opts: [['6_months', 'Six months'], ['1_year', 'One year'],
                   ['3_years', 'Three years'], ['perpetual', 'Indefinitely']] },
          { id: 'usage_territory', label: 'Territory', type: 'select', req: 1, half: 1,
            opts: [['local', 'Local'], ['national', 'National'], ['worldwide', 'Worldwide']] },
          { id: 'reference_videos', label: 'Reference links', type: 'textarea', rows: 2, help: 'Two or three references tell us more than a page of brief.' }
        ] },

      { title: 'The shoot', short: 'Production',
        note: 'Days, crew and kit. If you\'re unsure, say so — we\'ll propose.',
        fields: [
          { id: 'shoot_days', label: 'Number of shoot days', type: 'number', req: 1,
            half: 1, min: 1, unsure: 1 },
          { id: 'shoot_hours_per_day', label: 'Hours per shoot day', type: 'select',
            req: 1, half: 1,
            opts: [['half_day_5', 'Half day — 5 hours'], ['full_day_10', 'Full day — 10 hours'],
                   ['extended_12', 'Extended — 12 hours']] },
          { id: 'location_count', label: 'Number of locations', type: 'number', req: 1,
            half: 1, min: 1, placeholder: '1' },
          { id: 'location_type', label: 'Location type', type: 'select', req: 1, half: 1,
            opts: [['studio', 'Studio'], ['client_site', 'Your premises'],
                   ['on_location', 'On location'], ['multiple_mixed', 'A mix']] },
          { id: 'location_address', label: 'City or address', type: 'text', req: 1, half: 1 },
          { id: 'travel_distance_km', label: 'Distance from central studio (km)',
            type: 'number', half: 1, unsure: 1 },
          { id: 'shoot_dates', label: 'Preferred or fixed shoot dates', type: 'text', req: 1,
            help: 'Note if the date can\'t move.' },

          { id: 'crew_size', label: 'Crew size', type: 'select', req: 1, half: 1,
            opts: [['solo_shooter', 'Solo shooter'], ['small_2_3', 'Small — 2 to 3'],
                   ['standard_4_6', 'Standard — 4 to 6'], ['full_7_plus', 'Full — 7 or more'],
                   ['recommend_for_me', 'Recommend for me']] },
          { id: 'director_required', label: 'Director on set', type: 'select', req: 1, half: 1,
            opts: [['yes', 'Yes'], ['no', 'No'], ['client_directs', 'We\'ll direct']] },
          { id: 'talent_needed', label: 'On-camera talent', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['client_staff', 'Our own staff'],
                   ['client_provides_talent', 'We\'ll provide talent'],
                   ['agency_casts', 'Please cast for us']] },
          { id: 'talent_count', label: 'How many?', type: 'number', half: 1,
            when: function (s) {
              return ['client_provides_talent', 'agency_casts'].indexOf(s.talent_needed) !== -1; } },
          { id: 'talent_usage_buyout', label: 'Talent usage buyout needed', type: 'bool',
            when: function (s) { return s.talent_needed && s.talent_needed !== 'none'; } },

          { id: 'camera_tier', label: 'Camera package', type: 'select', req: 1, half: 1,
            opts: [['standard_mirrorless', 'Standard mirrorless'],
                   ['cinema_s35', 'Cinema Super-35'], ['cinema_full_frame', 'Cinema full-frame'],
                   ['high_speed', 'High-speed'], ['recommend_for_me', 'Recommend for me']] },
          { id: 'multicam_count', label: 'Simultaneous cameras', type: 'number', half: 1,
            min: 1, placeholder: '1' },
          { id: 'lighting_package', label: 'Lighting', type: 'select', req: 1, half: 1,
            opts: [['natural_minimal', 'Natural / minimal'], ['standard_kit', 'Standard kit'],
                   ['full_grip_electric', 'Full grip & electric']] },
          { id: 'audio_capture', label: 'Audio', type: 'select', req: 1, half: 1,
            opts: [['camera_audio', 'Camera audio'], ['lav_and_boom', 'Lav and boom'],
                   ['dedicated_recordist', 'Dedicated recordist']] },
          { id: 'jib_dolly_required', label: 'Camera movement', type: 'select', half: 1,
            opts: [['none', 'None'], ['slider', 'Slider'], ['dolly', 'Dolly'],
                   ['jib_crane', 'Jib or crane'], ['techno', 'Technocrane']] },
          { id: 'gimbal_required', label: 'Gimbal / stabilised movement', type: 'bool' },
          { id: 'drone_required', label: 'Drone or aerial footage', type: 'bool' },
          { id: 'drone_hours', label: 'Aerial hours needed', type: 'number', half: 1,
            when: function (s) { return s.drone_required === true; } },
          { id: 'teleprompter', label: 'Teleprompter', type: 'bool' },
          { id: 'livestream_required', label: 'Live streaming', type: 'bool' },
          { id: 'set_build', label: 'Set build', type: 'select', half: 1,
            opts: [['none', 'None'], ['simple', 'Simple'], ['custom_build', 'Custom build']] },
          { id: 'permits_needed', label: 'Permits expected', type: 'select', half: 1,
            opts: [['no', 'No'], ['client_handles', 'We\'ll handle them'],
                   ['please_handle', 'Please handle them']] }
        ] },

      { title: 'Post-production', short: 'Post',
        note: 'Usually about half a video budget. Worth answering carefully.',
        fields: [
          { id: 'scriptwriting', label: 'Script', type: 'select', req: 1, half: 1,
            opts: [['client_provides', 'We\'ll provide it'], ['we_write', 'Please write it'],
                   ['collaborative', 'Let\'s write it together']] },
          { id: 'storyboard', label: 'Storyboard or animatic', type: 'bool' },
          { id: 'edit_complexity', label: 'Edit complexity', type: 'select', req: 1, half: 1,
            opts: [['assembly_light', 'Light assembly'], ['standard_narrative', 'Standard narrative'],
                   ['heavy_multicam', 'Heavy / multicam'], ['complex_vfx_heavy', 'Complex, VFX-heavy']] },
          { id: 'footage_volume_hours', label: 'Estimated footage hours', type: 'number',
            half: 1, unsure: 1, help: 'Leave it unsure and we\'ll estimate from the shoot days.' },
          { id: 'color_grade', label: 'Colour grading', type: 'select', req: 1, half: 1,
            opts: [['basic_correction', 'Basic correction'], ['full_grade', 'Full grade'],
                   ['cinematic_look_dev', 'Cinematic look development']] },
          { id: 'motion_graphics', label: 'Motion graphics', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['lower_thirds_only', 'Lower thirds only'],
                   ['light_5_scenes', 'Light — a few scenes'],
                   ['moderate_15_scenes', 'Moderate'], ['heavy_custom', 'Heavy, custom']] },
          { id: 'mgfx_seconds', label: 'Roughly how many seconds of animation', type: 'number',
            half: 1, when: function (s) {
              return ['light_5_scenes', 'moderate_15_scenes', 'heavy_custom']
                .indexOf(s.motion_graphics) !== -1; },
            help: 'Bounding this keeps it from becoming open-ended.' },
          { id: 'vfx_cleanup', label: 'VFX or cleanup (logo removal, comps)', type: 'bool' },
          { id: 'sound_mix', label: 'Sound treatment', type: 'select', req: 1, half: 1,
            opts: [['basic_levels', 'Basic levels'], ['full_mix_sfx', 'Full mix with SFX'],
                   ['mix_and_master', 'Mix and master']] },
          { id: 'music', label: 'Music', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['library_track', 'Library track'],
                   ['custom_composed', 'Originally composed'],
                   ['licensed_commercial', 'A commercially released track']] },
          { id: 'voiceover', label: 'Voiceover', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['client_provides', 'We\'ll provide it'],
                   ['we_cast_and_record', 'Please cast and record it']] },
          { id: 'subtitles', label: 'Subtitles', type: 'multi',
            opts: [['burned_in', 'Burned in'], ['srt_file', 'SRT file'],
                   ['open_captions', 'Open captions']] },
          { id: 'translations', label: 'Additional languages', type: 'number', half: 1 },
          { id: 'revision_rounds', label: 'Revision rounds', type: 'select', req: 1, half: 1,
            opts: [['2_standard', 'Two — standard'], ['3', 'Three'], ['4_plus', 'Four or more']] },
          { id: 'turnaround', label: 'Turnaround after the final shoot day', type: 'select',
            req: 1, half: 1,
            opts: [['standard_4wk', 'Standard — 4 weeks'], ['expedited_2wk', 'Expedited — 2 weeks'],
                   ['rush_5day', 'Rush — 5 days']] },
          { id: 'raw_footage_handover', label: 'You want the raw footage afterwards',
            type: 'bool' }
        ] },

      { title: 'Proposal style', short: 'Style',
        fields: [
          { id: 'template_choice', label: 'Proposal layout', type: 'select', req: 1,
            opts: [['let_us_recommend', 'Recommend one for me'],
                   ['corporate_brand', 'Corporate / brand — strategic, stands alone'],
                   ['event_coverage', 'Event — run-of-show, crew, logistics'],
                   ['commercial_ad', 'Commercial — treatment-led, bid-comparable']] },
          { id: 'include_samples', label: 'Include reel and relevant work', type: 'bool' }
        ] }
    ],

    /* --------------------------------------------------------------------
       Pricing — 02-videography/02-proposal-logic.md
       -------------------------------------------------------------------- */
    calc: function (s, h) {
      var flags = [], deferred = [];

      /* §2 derived */
      var dayFactor = h.pick('shoot_hours_per_day',
        { half_day_5: 0.6, full_day_10: 1, extended_12: 1.2 }, 1);
      var runtimeMin = h.num('primary_runtime_sec', 60) / 60;
      if (h.unsure('primary_runtime_sec')) { runtimeMin = 1.5; flags.push('runtime_estimated'); }

      var shootDays = h.num('shoot_days', 0);
      if (!shootDays || h.unsure('shoot_days')) {
        shootDays = h.clamp(Math.ceil(runtimeMin / 4), 1, 5);
        flags.push('shoot_days_estimated');
      }
      var crewDays = shootDays * dayFactor;
      var multicam = Math.max(1, h.num('multicam_count', 1));

      var size = s.crew_size;
      if (size === 'recommend_for_me' || !size) {
        size = ['testimonial_case_study', 'training_internal', 'event_recap'].indexOf(s.video_type) !== -1 ? 'solo_shooter'
             : ['corporate_explainer', 'product_demo', 'social_ad', 'documentary_short'].indexOf(s.video_type) !== -1 ? 'small_2_3'
             : s.video_type === 'tv_commercial' ? 'full_7_plus' : 'standard_4_6';
      }
      var roster = ROSTER[{ solo_shooter: 'solo', small_2_3: 'small',
                            standard_4_6: 'standard', full_7_plus: 'full' }[size]].slice();
      if (size === 'small_2_3' && s.audio_capture !== 'camera_audio') roster.push('SOUND_REC');
      if (s.director_required === 'yes' && roster.indexOf('DIRECTOR') === -1) roster.push('DIRECTOR');

      var footage = h.num('footage_volume_hours', 0);
      if (!footage || h.unsure('footage_volume_hours')) footage = crewDays * 6 * multicam;

      /* §3 pre-production */
      var pre = [];
      var preproDays = Math.ceil(shootDays * 0.75) + (s.video_type === 'tv_commercial' ? 1 : 0);
      var PREPRO = preproDays * R.PREPRO_DAY;
      pre.push({ label: 'Pre-production & producing', qty: preproDays, unit: 'days', amount: PREPRO });

      var SCRIPT = s.scriptwriting === 'we_write' ? runtimeMin * R.SCRIPT_MIN
                 : s.scriptwriting === 'collaborative' ? runtimeMin * R.SCRIPT_MIN * 0.5 : 0;
      if (SCRIPT) pre.push({ label: 'Scriptwriting', qty: runtimeMin.toFixed(1), unit: 'min', amount: SCRIPT });

      var frames = Math.ceil(runtimeMin * 8);
      var BOARD = h.bool('storyboard') ? frames * R.BOARD_FRAME : 0;
      if (BOARD) pre.push({ label: 'Storyboard', qty: frames, unit: 'frames', amount: BOARD });

      var CASTING = s.talent_needed === 'agency_casts' ? R.CASTING : 0;
      if (CASTING) pre.push({ label: 'Casting session', qty: null, amount: CASTING });

      var PRE = PREPRO + SCRIPT + BOARD + CASTING;

      /* §4 production */
      var prod = [];
      var CREW = 0;
      roster.forEach(function (role) { CREW += R[role] * crewDays; });
      prod.push({ label: 'Crew — ' + roster.length + ' positions', qty: crewDays.toFixed(1), unit: 'days', amount: CREW });

      if (h.bool('drone_required')) {
        var droneDays = Math.ceil(h.num('drone_hours', 3) / 6);
        var DRONE = R.DRONE_PILOT * droneDays;
        CREW += DRONE;
        prod.push({ label: 'Licensed drone pilot', qty: droneDays, unit: 'days', amount: DRONE });
        flags.push('drone_airspace');
      }

      var camTier = s.camera_tier === 'recommend_for_me' || !s.camera_tier
        ? (s.video_type === 'tv_commercial' ? 'cinema_full_frame' : 'cinema_s35')
        : s.camera_tier;
      var CAMERA = R.CAM[camTier] * crewDays + Math.max(0, multicam - 1) * R.EXTRA_CAM * crewDays;
      prod.push({ label: 'Camera package', qty: crewDays.toFixed(1), unit: 'days', amount: CAMERA });

      var LIGHTING = R.LIGHT[s.lighting_package || 'standard_kit'] * crewDays;
      prod.push({ label: 'Lighting', qty: crewDays.toFixed(1), unit: 'days', amount: LIGHTING });

      var AUDIO = s.audio_capture !== 'camera_audio' ? R.AUDIO_KIT * crewDays : 0;
      if (AUDIO) prod.push({ label: 'Audio kit', qty: crewDays.toFixed(1), unit: 'days', amount: AUDIO });

      var MOVEMENT = (h.bool('gimbal_required') ? R.GIMBAL * crewDays : 0) +
                     (R.MOVE[s.jib_dolly_required || 'none'] * crewDays);
      if (MOVEMENT) prod.push({ label: 'Camera movement', qty: crewDays.toFixed(1), unit: 'days', amount: MOVEMENT });

      var PROMPTER = h.bool('teleprompter') ? R.PROMPTER * crewDays : 0;
      if (PROMPTER) prod.push({ label: 'Teleprompter', qty: crewDays.toFixed(1), unit: 'days', amount: PROMPTER });

      var STUDIO = s.location_type === 'studio' ? R.STUDIO * shootDays : 0;
      if (STUDIO) prod.push({ label: 'Studio hire', qty: shootDays, unit: 'days', amount: STUDIO });

      var SET = h.pick('set_build', { simple: R.SET_SIMPLE, custom_build: R.SET_CUSTOM }, 0);
      if (SET) prod.push({ label: 'Set build', qty: null, amount: SET });

      var STREAM = h.bool('livestream_required') ? R.LIVESTREAM * shootDays : 0;
      if (STREAM) prod.push({ label: 'Livestream package', qty: shootDays, unit: 'days', amount: STREAM });

      var TALENT = s.talent_needed === 'agency_casts'
        ? h.num('talent_count', 1) * R.TALENT_DAY * shootDays : 0;
      if (TALENT) prod.push({ label: 'Talent — session fees', qty: h.num('talent_count', 1), unit: 'people', amount: TALENT });

      var PERMITS = s.permits_needed === 'please_handle' ? R.PERMIT : 0;
      if (PERMITS) prod.push({ label: 'Permit handling', qty: null, amount: PERMITS });

      var PROD = CREW + CAMERA + LIGHTING + AUDIO + MOVEMENT + PROMPTER +
                 STUDIO + SET + STREAM + TALENT + PERMITS;

      /* §5 post */
      var post = [];
      var ratio = h.pick('edit_complexity',
        { assembly_light: 1.5, standard_narrative: 3, heavy_multicam: 5, complex_vfx_heavy: 8 }, 3);
      var editHours = footage * 0.6 + runtimeMin * ratio * 2.5;

      var INGEST = footage * 0.4 * R.INGEST_HOUR;
      var EDIT = editHours * R.EDIT_HOUR;
      var GRADE = runtimeMin * R.GRADE[s.color_grade || 'basic_correction'];
      var MIX = h.pick('sound_mix',
        { basic_levels: runtimeMin * R.MIX_BASIC,
          full_mix_sfx: runtimeMin * R.MIX_FULL,
          mix_and_master: runtimeMin * (R.MIX_FULL + R.MASTER) }, runtimeMin * R.MIX_BASIC);

      /* Multi-deliverable scaling happens BEFORE the turnaround multiplier, or
         a rush uplift compounds against every extra video. */
      var count = Math.max(1, h.num('deliverable_count', 1));
      var multi = 1 + 0.65 * (count - 1);
      EDIT *= multi; GRADE *= multi; MIX *= multi;

      var mgfxSec = h.num('mgfx_seconds', 0) ||
        h.pick('motion_graphics', { light_5_scenes: 20, moderate_15_scenes: 60, heavy_custom: 150 }, 0);
      var MGFX = s.motion_graphics === 'lower_thirds_only' ? R.LOWER_THIRDS : mgfxSec * R.MGFX_SEC;
      var VFX = h.bool('vfx_cleanup') ? runtimeMin * 2 * R.VFX_HOUR : 0;

      var MUSIC = 0;
      if (s.music === 'library_track') MUSIC = R.MUSIC_LIB;
      else if (s.music === 'custom_composed') MUSIC = runtimeMin * R.MUSIC_CUSTOM_MIN;
      else if (s.music === 'licensed_commercial') {
        flags.push('sync_license_manual_quote');
        deferred.push({ label: 'Commercial music sync licence', reason:
          'Sync rights are quoted by the rights holders and vary enormously. ' +
          'Guessing would be worse than leaving it out — tell us the track and ' +
          'we\'ll get a real number.' });
      }

      var VO = s.voiceover === 'we_cast_and_record' ? R.VO : 0;
      var SUBS = (Array.isArray(s.subtitles) && s.subtitles.length) ? runtimeMin * R.SUBTITLE_MIN : 0;
      var TRANS = h.num('translations', 0) * runtimeMin * R.TRANSLATION_MIN;
      var CUTDOWNS = (Array.isArray(s.cutdowns) ? s.cutdowns.length : 0) * R.CUTDOWN;
      var VERSIONS = Math.max(0, (Array.isArray(s.aspect_ratios) ? s.aspect_ratios.length : 1) - 1) *
                     R.ASPECT * count;

      var tmult = h.pick('turnaround', { standard_4wk: 1, expedited_2wk: 1.3, rush_5day: 1.75 }, 1);
      var postCore = INGEST + EDIT + GRADE + MGFX + VFX + MIX + MUSIC + VO +
                     SUBS + TRANS + CUTDOWNS + VERSIONS;
      var EXTRA_REV = h.pick('revision_rounds', { '3': R.REVISION, '4_plus': R.REVISION * 2 }, 0);
      var RAW = h.bool('raw_footage_handover') ? R.RAW : 0;
      var POST = postCore * tmult + EXTRA_REV + RAW;

      post.push({ label: 'Ingest, sync & selects', qty: footage.toFixed(0), unit: 'hrs footage', amount: INGEST });
      post.push({ label: 'Edit' + (count > 1 ? ' — ' + count + ' videos' : ''),
                  qty: editHours.toFixed(0), unit: 'hrs', amount: EDIT });
      post.push({ label: 'Colour grade', qty: runtimeMin.toFixed(1), unit: 'min', amount: GRADE });
      if (MGFX) post.push({ label: 'Motion graphics', qty: mgfxSec || null, unit: 'sec', amount: MGFX });
      if (VFX) post.push({ label: 'VFX & cleanup', qty: null, amount: VFX });
      post.push({ label: 'Sound mix', qty: runtimeMin.toFixed(1), unit: 'min', amount: MIX });
      if (MUSIC) post.push({ label: 'Music', qty: null, amount: MUSIC });
      if (VO) post.push({ label: 'Voiceover casting & record', qty: null, amount: VO });
      if (SUBS) post.push({ label: 'Subtitles', qty: runtimeMin.toFixed(1), unit: 'min', amount: SUBS });
      if (TRANS) post.push({ label: 'Translations', qty: h.num('translations', 0), unit: 'languages', amount: TRANS });
      if (CUTDOWNS) post.push({ label: 'Cutdowns', qty: s.cutdowns.length, unit: '', amount: CUTDOWNS });
      if (VERSIONS) post.push({ label: 'Aspect-ratio versions', qty: null, amount: VERSIONS });
      if (tmult > 1) post.push({ label: 'Expedited post schedule', qty: null, amount: postCore * (tmult - 1) });
      if (EXTRA_REV) post.push({ label: 'Additional revision rounds', qty: null, amount: EXTRA_REV });
      if (RAW) post.push({ label: 'Raw footage handover', qty: null, amount: RAW });

      if (POST / (PRE + PROD + POST) < 0.30) flags.push('post_underweighted');

      /* §6 licence */
      var pts = { internal_only: 0, client_pitch: 0, website: 1, organic_social: 1,
                  trade_show: 2, paid_social: 4, youtube_preroll: 4, ooh_screens: 5,
                  cinema: 6, broadcast_tv: 7 };
      var dist = 0;
      Object.keys(pts).forEach(function (k) { if (h.has('distribution', k)) dist += pts[k]; });
      var term = h.pick('usage_term', { '6_months': 0.8, '1_year': 1, '3_years': 1.5, perpetual: 2 }, 1);
      var terr = h.pick('usage_territory', { local: 1, national: 1.3, worldwide: 1.6 }, 1);
      var lic = 1 + (dist * 0.05 * term * terr);

      if (h.has('distribution', 'broadcast_tv') || h.has('distribution', 'cinema') ||
          h.bool('talent_usage_buyout')) {
        flags.push('broadcast_usage_manual_review');
      }
      if (h.bool('talent_usage_buyout')) {
        deferred.push({ label: 'Talent usage buyout', reason:
          'A buyout depends on where the film runs and for how long. It is a ' +
          'separate figure from the session fees above, and a producer sets it.' });
      }

      /* §6 travel */
      var km = h.num('travel_distance_km', 0);
      var travel = km > 40 ? (km - 40) * R.MILEAGE * 2 * shootDays : 0;
      var lodging = 0;
      if (km > 250) {
        lodging = R.PER_DIEM * roster.length * Math.max(1, shootDays - 1);
        flags.push('travel_manual_review');
      }

      return {
        base: PRE + PROD, addOns: POST,
        rushableBase: PRE + PROD,
        licensableBase: PRE + PROD + POST,
        licenseMultiplier: lic,
        travel: travel, lodging: lodging,
        phases: [
          { name: 'Pre-production', items: pre },
          { name: 'Production', items: prod },
          { name: 'Post-production', items: post }
        ],
        flags: flags, deferred: deferred,
        paymentSchedule: (PRE + PROD + POST) >= 15000
          ? [{ milestone: 'On signature', pct: 0.4 },
             { milestone: 'On first cut', pct: 0.3 },
             { milestone: 'On final delivery', pct: 0.3 }]
          : [{ milestone: 'On signature', pct: 0.5 },
             { milestone: 'On final delivery', pct: 0.5 }],
        tiers: {
          good: ['One fewer shoot day or a smaller crew', 'Basic colour correction',
                 'Lower thirds only', 'Two revision rounds', 'A single aspect ratio'],
          standard: ['Everything exactly as you\'ve scoped it here'],
          premium: ['An additional shoot day', 'Full grip & electric',
                    'Full colour grade', 'Expanded motion graphics',
                    'Every cutdown and aspect ratio', 'Expedited turnaround']
        },
        excludes: [
          'Raw footage (unless ticked above)',
          'Sync licensing for commercially released music',
          'Talent usage renewals beyond the agreed term',
          'Media buying and distribution',
          'Permits and location fees themselves',
          'Re-shoots caused by changes to an approved script'
        ],
        timeline: [
          'Contract and deposit',
          'Creative kickoff',
          'Script and storyboard approval — your gate, and the usual cause of slippage',
          'Pre-production and scouting',
          shootDays + ' shoot day' + (shootDays === 1 ? '' : 's'),
          'First cut',
          h.pick('revision_rounds', { '2_standard': 'Two', '3': 'Three', '4_plus': 'Four+' }, 'Two') + ' revision rounds',
          'Colour and mix',
          'Final delivery — ' + h.pick('turnaround',
            { standard_4wk: 'four weeks', expedited_2wk: 'two weeks', rush_5day: 'five days' }, 'four weeks') +
            ' after the last shoot day'
        ]
      };
    },

    flagNotes: {
      shoot_days_estimated:
        'You weren\'t sure how many shoot days this needs, so we\'ve proposed what ' +
        'suits the runtime and scope. It\'s the number that moves this total most — ' +
        'it\'s the one we\'d most like your reaction to.',
      runtime_estimated:
        'Runtime was left open, so we\'ve assumed roughly 90 seconds.',
      sync_license_manual_quote:
        'The commercial track you want is deliberately not in the figure above. ' +
        'Sync licences are quoted by the rights holders — tell us the track and ' +
        'we\'ll chase a real number, and bring library alternatives alongside it.',
      broadcast_usage_manual_review:
        'Because this runs on broadcast or in cinema, usage terms and any talent ' +
        'buyout need setting properly rather than estimating. Those sit outside ' +
        'the production figure.',
      drone_airspace:
        'Aerial work is flown by a licensed pilot and is subject to airspace ' +
        'clearance and weather. Clearance is never guaranteed anywhere — if we ' +
        'can\'t get it, that line comes out and is credited back.',
      post_underweighted:
        'Post is coming out low relative to production here. On most films it\'s ' +
        'nearer half the budget, so a producer will sanity-check the edit inputs ' +
        'before this is firmed up.',
      lead_time_infeasible:
        'Your date is very close to the shoot. The estimate carries an expedited ' +
        'fee, but crew and post availability need confirming before you rely on it.',
      travel_manual_review:
        'That distance means overnight travel for the crew. The figure shown is a ' +
        'placeholder and a producer will replace it.'
    },

    email: function (s, est, h) {
      var first = (s.client_name || '').split(' ')[0];
      var runtime = h.num('primary_runtime_sec', 60);
      var runLabel = runtime >= 120 ? Math.round(runtime / 60) + '-minute' : runtime + '-second';
      var days = h.num('shoot_days', 1) || 1;

      var body =
        'Hi ' + first + ',\n\n' +
        'Thanks for the detail on ' + (s.project_name || 'your project') +
        ' — that\'s more than most briefs\ngive us, and it makes for a much more honest estimate.\n\n' +
        'Here\'s the shape of it:\n\n' +
        '  The film      ' + runLabel + ' ' + (s.video_type || 'video').replace(/_/g, ' ') + '\n' +
        '  Production    ' + days + ' shoot day' + (days === 1 ? '' : 's') + ', ' +
          (s.shoot_dates || 'dates to confirm') + '\n' +
        '  Post          ' + h.pick('color_grade',
            { basic_correction: 'basic correction', full_grade: 'full grade',
              cinematic_look_dev: 'cinematic look development' }, 'grade') + ', ' +
          h.pick('revision_rounds', { '2_standard': 'two', '3': 'three', '4_plus': 'four+' }, 'two') +
          ' rounds of revisions\n' +
        '  Delivery      ' + h.pick('turnaround',
            { standard_4wk: '4 weeks', expedited_2wk: '2 weeks', rush_5day: '5 days' }, '4 weeks') +
          ' after the final shoot day\n' +
        '  Estimate      $' + Math.round(est.tiers.good.low || est.tiers.good.amount).toLocaleString('en-US') +
          ' – $' + Math.round(est.tiers.premium.high || est.tiers.premium.amount).toLocaleString('en-US') + '\n\n' +
        'Two things worth saying up front. The estimate is broken into\n' +
        'pre-production, production and post so you can see where the money\n' +
        'actually goes — post is usually about half of a video budget, and a\n' +
        'proposal that hides that is a proposal that runs over. And the timeline\n' +
        'works backwards from your target date with your approval points marked;\n' +
        'those are the things most likely to move a delivery date, so they\'re\n' +
        'visible rather than buried.\n\n' +
        (est.confidence === 'preliminary'
          ? 'A few details were still open, so this is a range rather than a fixed\nfigure. A short call would tighten it.\n\n' : '') +
        'I\'ll check in in a couple of days either way.\n\n' +
        'Josh\nKriel Ventures\njosh@kriel.us';

      return { subject: (s.project_name || 'Your project') + ' — video proposal from Kriel Ventures', body: body };
    }
  };
})();
