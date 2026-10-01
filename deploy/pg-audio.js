/* ==========================================================================
   Proposal generator — Sound Design & Audio Recording
   Implements proposal-generators/04-sound-design/. Recording is priced per
   hour, post per finished minute; the two are never blended, because a
   two-hour session almost never means two hours of work.
   ========================================================================== */
(function () {
  'use strict';

  var R = {
    STUDIO_HOUR: 150, ENGINEER_HOUR: 110, STUDIO_DAY: 950, LIVE_ROOM: 75,
    REMOTE_HOUR: 90, FIELD_HOUR: 165, DIRECTION_HOUR: 125,
    TALENT_SESSION: 450, MUSICIAN_SESSION: 400,
    /* Dense audio — scored picture, commercials, foley, music. Every finished
       minute is worked densely, so per-minute is the right unit. */
    EDIT: { light_topntail: 25, standard_dialogue_edit: 55,
            heavy_narrative_edit: 110, full_story_edit: 190 },
    CLEAN: { standard: 20, heavy_restoration: 75 },
    MIX: { stereo_mix: 70, stem_mix: 110, surround_51: 220 },
    MASTER: 45, MASTER_EXTRA: 20,

    /* Long-form speech — podcasts, audiobooks, VO. The same per-minute rates
       are badly wrong here: cost scales sub-linearly with runtime because a
       40-minute interview is not forty minutes of dense work. Mixing and
       mastering in particular are set up once per episode and then largely
       ride, so they're priced per piece rather than per minute. Without this
       split the generator quoted $28,000 to mix a ten-episode podcast. */
    EDIT_SPOKEN: { light_topntail: 4, standard_dialogue_edit: 8,
                   heavy_narrative_edit: 18, full_story_edit: 35 },
    CLEAN_SPOKEN: { standard: 3, heavy_restoration: 10 },
    MIX_PIECE: { stereo_mix: 150, stem_mix: 260, surround_51: 500 },
    MASTER_PIECE: 80, MASTER_PIECE_EXTRA: 35,
    SFX_EACH: 65, SFX_BED_MIN: 90, FOLEY_MIN: 260, ADR_LINE: 35,
    MUSIC_ORIG_MIN: 900, MUSIC_LIB: 220,
    INTRO_OUTRO: 750, SONIC_LOGO: 2200,
    ALT_VERSION_MIN: 25, STEMS: 150, TRANSCRIPT_MIN: 4, SHOW_NOTES: 90,
    MARKERS: 40, REVISION: 250, PUBLISH: 120,
    MILEAGE: 0.85, PER_DIEM: 90
  };

  /* Long-form spoken work. See the rate card above for why these are priced on
     a different curve from dense audio. */
  var SPOKEN = ['podcast_series', 'podcast_single', 'audiobook', 'voiceover',
                'live_event_recording'];
  function isSpoken(s) { return SPOKEN.indexOf(s.audio_project_type) !== -1; }

  /* The recording section only makes sense if there's nothing recorded yet. */
  function needsRecording(s) { return s.source_material_state === 'nothing_yet'; }
  function isSeries(s) {
    return s.audio_project_type === 'podcast_series' || (parseFloat(s.deliverable_count) > 4);
  }

  window.PG_CONFIG = {
    service: 'Sound Design & Audio',
    standardLeadDays: 21,
    taxRate: 0,

    sections: [
      window.PG_INTAKE,

      { title: 'What we\'re making', short: 'Project',
        fields: [
          { id: 'audio_project_type', label: 'Project type', type: 'select', req: 1,
            opts: [['podcast_series', 'Podcast series'], ['podcast_single', 'Single episode'],
                   ['voiceover', 'Voiceover'], ['audiobook', 'Audiobook'],
                   ['music_recording', 'Music recording'], ['film_scoring', 'Film scoring'],
                   ['sound_design_post', 'Sound design for picture'],
                   ['mixing_only', 'Mixing only'], ['mastering_only', 'Mastering only'],
                   ['audio_restoration', 'Restoration / rescue'],
                   ['audio_branding_sonic_logo', 'Sonic branding'],
                   ['live_event_recording', 'Live event recording'],
                   ['other', 'Something else']] },
          { id: 'project_description', label: 'Describe it', type: 'textarea', req: 1,
            rows: 3 },
          { id: 'total_runtime_min', label: 'Total finished runtime (minutes)',
            type: 'number', req: 1, half: 1, min: 1, unsure: 1,
            help: 'Across everything — all episodes, tracks or cues together.' },
          { id: 'deliverable_count', label: 'Number of separate pieces', type: 'number',
            req: 1, half: 1, min: 1, placeholder: '1',
            help: 'Episodes, tracks, cues or spots.' },
          { id: 'source_material_state', label: 'What do you have already?',
            type: 'select', req: 1,
            opts: [['nothing_yet', 'Nothing yet — we need to record'],
                   ['raw_recordings', 'Raw recordings'],
                   ['edited_needs_mix', 'Edited, needs mixing'],
                   ['mixed_needs_master', 'Mixed, needs mastering'],
                   ['poor_quality_needs_rescue', 'Recordings, but they\'re rough']] },
          { id: 'reference_links', label: 'Reference audio', type: 'textarea', rows: 2 },

          /* --- Series --- */
          { id: 'episode_count', label: 'Episodes in this commitment', type: 'number',
            req: 1, half: 1, min: 1, when: isSeries },
          { id: 'cadence', label: 'Release cadence', type: 'select', req: 1, half: 1,
            when: isSeries,
            opts: [['weekly', 'Weekly'], ['biweekly', 'Fortnightly'],
                   ['monthly', 'Monthly'], ['seasonal_batch', 'In seasonal batches']] },
          { id: 'season_or_ongoing', label: 'Commitment shape', type: 'select', req: 1,
            half: 1, when: isSeries,
            opts: [['one_season', 'One season'], ['ongoing_retainer', 'Ongoing retainer'],
                   ['pilot_only', 'A pilot first']] },
          { id: 'host_count', label: 'Number of hosts', type: 'number', half: 1,
            when: isSeries },
          { id: 'remote_recording', label: 'How are hosts and guests recorded?',
            type: 'select', req: 1, half: 1, when: isSeries,
            opts: [['all_in_studio', 'All in studio'], ['all_remote', 'All remote'],
                   ['hybrid', 'A mix']] }
        ] },

      { title: 'Recording', short: 'Recording',
        note: 'Priced by the hour. If you already have the audio, this section ' +
              'is skipped entirely.',
        fields: [
          { id: 'studio_required', label: 'Where are we recording?', type: 'select',
            req: 1, half: 1, when: needsRecording,
            opts: [['our_studio', 'Your studio'], ['client_location', 'Our location'],
                   ['remote_direction', 'Remotely, with you directing'],
                   ['none_client_records', 'We\'ll record it ourselves']] },
          { id: 'studio_hours', label: 'Studio hours needed', type: 'number', half: 1,
            min: 1, unsure: 1, when: needsRecording },
          { id: 'session_count', label: 'Number of separate sessions', type: 'number',
            half: 1, min: 1, placeholder: '1', when: needsRecording },
          { id: 'engineer_required', label: 'Recording engineer', type: 'select',
            req: 1, half: 1, when: needsRecording,
            opts: [['yes', 'Yes'], ['self_serve_room', 'Just the room']] },
          { id: 'direction_required', label: 'Session direction or producing',
            type: 'bool', when: needsRecording },
          { id: 'talent_needed', label: 'Voice talent', type: 'select', req: 1, half: 1,
            when: needsRecording,
            opts: [['none', 'None'], ['client_provides', 'We\'ll provide it'],
                   ['we_cast', 'Please cast for us']] },
          { id: 'talent_count', label: 'How many voices?', type: 'number', half: 1,
            when: function (s) { return needsRecording(s) && s.talent_needed === 'we_cast'; } },
          { id: 'talent_usage_buyout', label: 'Talent usage buyout needed', type: 'bool',
            when: function (s) { return needsRecording(s) && s.talent_needed && s.talent_needed !== 'none'; } },
          { id: 'musicians_count', label: 'Session musicians needed', type: 'number',
            half: 1, when: needsRecording },
          { id: 'live_room_needed', label: 'Live room or drum room required', type: 'bool',
            when: needsRecording },
          { id: 'on_location_recording', label: 'Field or location recording', type: 'bool',
            when: needsRecording },
          { id: 'travel_distance_km', label: 'Distance from studio (km)', type: 'number',
            half: 1, unsure: 1,
            when: function (s) { return needsRecording(s) && s.on_location_recording === true; } }
        ] },

      { title: 'Post-production', short: 'Post',
        note: 'Priced per finished minute, not per session hour. Finishing almost ' +
              'always costs more than capturing.',
        fields: [
          { id: 'editing_scope', label: 'Editing required', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['light_topntail', 'Light — top and tail'],
                   ['standard_dialogue_edit', 'Standard dialogue edit'],
                   ['heavy_narrative_edit', 'Heavy narrative edit'],
                   ['full_story_edit', 'Full story edit']] },
          { id: 'noise_cleanup', label: 'Noise reduction', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['standard', 'Standard'],
                   ['heavy_restoration', 'Heavy restoration']] },
          { id: 'mixing', label: 'Mixing', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['stereo_mix', 'Stereo mix'],
                   ['stem_mix', 'Stem mix'], ['surround_51', '5.1 surround'],
                   ['atmos', 'Dolby Atmos']] },
          { id: 'mastering', label: 'Mastering', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['single_target', 'One delivery target'],
                   ['multi_platform_targets', 'Several platform targets']] },
          { id: 'loudness_target', label: 'Delivery loudness standard', type: 'select',
            req: 1, half: 1,
            help: 'Getting this wrong means redelivering everything, so we\'d rather ' +
                  'ask than assume.',
            opts: [['podcast_-16lufs', 'Podcast / spoken — −16 LUFS'],
                   ['music_-14lufs', 'Music streaming — −14 LUFS'],
                   ['broadcast_-23lufs', 'Broadcast — −23 LUFS'],
                   ['cinema', 'Cinema'], ['not_sure', 'Not sure — pick for us']] },
          { id: 'sound_design', label: 'Sound design and effects', type: 'select',
            req: 1, half: 1,
            opts: [['none', 'None'], ['light_transitions', 'Light — transitions'],
                   ['moderate_scene_beds', 'Moderate — scene beds'],
                   ['heavy_immersive', 'Heavy — immersive']] },
          { id: 'sfx_count', label: 'Roughly how many designed effects', type: 'number',
            half: 1, when: function (s) {
              return ['moderate_scene_beds', 'heavy_immersive'].indexOf(s.sound_design) !== -1; } },
          { id: 'foley', label: 'Custom foley', type: 'select', half: 1,
            opts: [['none', 'None'], ['light', 'Light'], ['full_foley_pass', 'Full pass']] },
          { id: 'foley_scene_minutes', label: 'Minutes of foley coverage', type: 'number',
            half: 1, when: function (s) { return s.foley && s.foley !== 'none'; } },
          { id: 'adr_required', label: 'ADR / dialogue replacement', type: 'bool' },
          { id: 'adr_lines', label: 'Approximate ADR lines', type: 'number', half: 1,
            when: function (s) { return s.adr_required === true; } },
          { id: 'music_needs', label: 'Music', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['library_licensed', 'Library, licensed'],
                   ['original_composed', 'Originally composed'],
                   ['commercial_track', 'A commercially released track']] },
          { id: 'music_minutes', label: 'Minutes of original music', type: 'number',
            half: 1, when: function (s) { return s.music_needs === 'original_composed'; } },
          { id: 'music_arrangement', label: 'Instrumentation', type: 'select', half: 1,
            when: function (s) { return s.music_needs === 'original_composed'; },
            opts: [['solo_electronic', 'Solo or electronic'],
                   ['small_ensemble', 'Small ensemble'],
                   ['live_session_players', 'Live session players'],
                   ['orchestral', 'Orchestral']] },
          { id: 'intro_outro', label: 'Branded intro and outro package', type: 'bool' },
          { id: 'sonic_logo', label: 'Sonic logo / audio brand mark', type: 'bool' }
        ] },

      { title: 'Delivery & rights', short: 'Delivery',
        fields: [
          { id: 'delivery_formats', label: 'Formats needed', type: 'multi', req: 1,
            opts: [['mp3', 'MP3'], ['wav_16_44', 'WAV 16/44.1'], ['wav_24_48', 'WAV 24/48'],
                   ['aac', 'AAC'], ['stems', 'Stems'], ['omf_aaf', 'OMF / AAF'],
                   ['broadcast_wav', 'Broadcast WAV']] },
          { id: 'alt_versions', label: 'Alternate versions', type: 'multi',
            opts: [['instrumental', 'Instrumental'], ['dialogue_free_MnE', 'Music & effects'],
                   ['shortened_cutdown', 'Shortened cutdown'], ['clean_censored', 'Clean version']] },
          { id: 'transcription', label: 'Transcript', type: 'select', half: 1,
            opts: [['none', 'None'], ['raw_transcript', 'Raw transcript'],
                   ['edited_transcript', 'Edited transcript'],
                   ['show_notes', 'Transcript and show notes']] },
          { id: 'chapter_markers', label: 'Chapter markers and metadata', type: 'bool' },
          { id: 'hosting_distribution_help', label: 'Help with hosting and publishing',
            type: 'bool' },
          { id: 'distribution', label: 'Where will it be published?', type: 'multi', req: 1,
            opts: [['internal', 'Internal only'], ['podcast_platforms', 'Podcast platforms'],
                   ['website', 'Your website'], ['organic_social', 'Organic social'],
                   ['paid_ads', 'Paid advertising'], ['broadcast_radio', 'Broadcast radio'],
                   ['broadcast_tv', 'Broadcast TV'], ['cinema', 'Cinema'],
                   ['game_app', 'A game or app'],
                   ['retail_music_streaming', 'Music streaming platforms']] },
          { id: 'usage_term', label: 'Usage term', type: 'select', req: 1, half: 1,
            opts: [['6_months', 'Six months'], ['1_year', 'One year'],
                   ['3_years', 'Three years'], ['perpetual', 'Indefinitely']] },
          { id: 'usage_territory', label: 'Territory', type: 'select', req: 1, half: 1,
            opts: [['local', 'Local'], ['national', 'National'], ['worldwide', 'Worldwide']] },
          { id: 'rights_ownership', label: 'Who owns the finished audio?', type: 'select',
            req: 1,
            opts: [['agency_licenses_to_client', 'You licence it from us'],
                   ['full_buyout_to_client', 'We buy it outright'],
                   ['work_for_hire', 'Work for hire']] },
          { id: 'pro_registration', label: 'PRO or publishing registration needed',
            type: 'bool' },
          { id: 'revision_rounds', label: 'Revision rounds', type: 'select', req: 1, half: 1,
            opts: [['2_standard', 'Two — standard'], ['3', 'Three'], ['4_plus', 'Four or more']] },
          { id: 'turnaround', label: 'Turnaround', type: 'select', req: 1, half: 1,
            opts: [['standard_2wk', 'Standard — 2 weeks'], ['expedited_1wk', 'Expedited — 1 week'],
                   ['rush_48hr', 'Rush — 48 hours']] },

          { id: 'template_choice', label: 'Proposal layout', type: 'select', req: 1,
            opts: [['let_us_recommend', 'Recommend one for me'],
                   ['podcast_production', 'Podcast — per-episode workflow and rates'],
                   ['commercial_audio_foley', 'Commercial — deliverables matrix and spec'],
                   ['music_film_scoring', 'Scoring — cue sheet and rights']] },
          { id: 'include_samples', label: 'Include audio samples', type: 'bool' }
        ] }
    ],

    /* --------------------------------------------------------------------
       Pricing — 04-sound-design/02-proposal-logic.md
       -------------------------------------------------------------------- */
    calc: function (s, h) {
      var flags = [], deferred = [];

      var Rm = h.num('total_runtime_min', 0);
      if (!Rm || h.unsure('total_runtime_min')) { Rm = 30; flags.push('runtime_estimated'); }
      var N = Math.max(1, h.num('deliverable_count', 1));
      var sessions = Math.max(1, h.num('session_count', 1));

      /* §3 recording */
      var record = [];
      var RECORD = 0, prodDays = 1, crew = 1;

      var skip = !needsRecording(s) || s.studio_required === 'none_client_records';
      if (!skip) {
        var hrs = h.num('studio_hours', 0);
        if (!hrs || h.unsure('studio_hours')) {
          var ratio = ['podcast_series', 'podcast_single', 'voiceover', 'audiobook']
            .indexOf(s.audio_project_type) !== -1 ? 1.4
            : s.audio_project_type === 'music_recording' ? 4
            : s.audio_project_type === 'film_scoring' ? 2.5 : 2;
          hrs = Math.ceil(Rm * ratio / 60) || 2;
          hrs = Math.max(2, hrs);
          flags.push('studio_hours_estimated');
        }
        prodDays = Math.max(1, Math.ceil(hrs / 8));
        crew = 1 + (s.engineer_required === 'yes' ? 1 : 0) +
               (h.bool('direction_required') ? 1 : 0) +
               (s.talent_needed === 'we_cast' ? h.num('talent_count', 1) : 0) +
               h.num('musicians_count', 0);

        var ROOM;
        if (s.studio_required === 'remote_direction') ROOM = hrs * R.REMOTE_HOUR;
        else if (h.bool('on_location_recording')) ROOM = hrs * R.FIELD_HOUR;
        else ROOM = hrs >= 7 ? R.STUDIO_DAY * Math.ceil(hrs / 8) : hrs * R.STUDIO_HOUR;
        if (h.bool('live_room_needed')) ROOM += hrs * R.LIVE_ROOM;

        var ENGINEER = s.engineer_required === 'yes' ? hrs * R.ENGINEER_HOUR : 0;
        var DIRECTION = h.bool('direction_required') ? hrs * R.DIRECTION_HOUR : 0;
        var TALENT = s.talent_needed === 'we_cast'
          ? h.num('talent_count', 1) * R.TALENT_SESSION * sessions : 0;
        var MUSICIANS = h.num('musicians_count', 0) * R.MUSICIAN_SESSION * sessions;

        RECORD = ROOM + ENGINEER + DIRECTION + TALENT + MUSICIANS;

        record.push({ label: h.bool('on_location_recording') ? 'Location recording' : 'Studio time',
          qty: hrs, unit: 'hrs', amount: ROOM });
        if (ENGINEER) record.push({ label: 'Recording engineer', qty: hrs, unit: 'hrs', amount: ENGINEER });
        if (DIRECTION) record.push({ label: 'Session direction', qty: hrs, unit: 'hrs', amount: DIRECTION });
        if (TALENT) record.push({ label: 'Voice talent — session fees',
          qty: h.num('talent_count', 1), unit: 'voices', amount: TALENT });
        if (MUSICIANS) record.push({ label: 'Session musicians',
          qty: h.num('musicians_count', 0), unit: 'players', amount: MUSICIANS });
      }

      var TALENT_FEES = record.reduce(function (a, i) {
        return a + (/talent|musician/i.test(i.label) ? i.amount : 0); }, 0);

      if (h.bool('talent_usage_buyout')) {
        flags.push('talent_buyout_manual_quote');
        deferred.push({ label: 'Voice talent usage buyout', reason:
          'The session fee is above; the buyout is separate and depends on where ' +
          'the audio runs and for how long. A producer sets it rather than a formula.' });
      }

      /* §4 post */
      var post = [];
      var spoken = isSpoken(s);

      var EDIT = Rm * ((spoken ? R.EDIT_SPOKEN : R.EDIT)[s.editing_scope] || 0);
      var cleanRate = (spoken ? R.CLEAN_SPOKEN : R.CLEAN)[s.noise_cleanup] || 0;
      var CLEANUP = Rm * cleanRate;
      if (s.remote_recording === 'all_remote') CLEANUP *= 1.4;
      else if (s.remote_recording === 'hybrid') CLEANUP *= 1.2;
      if (s.source_material_state === 'poor_quality_needs_rescue') {
        CLEANUP *= 1.6;
        flags.push('source_quality_risk');
      }

      /* Per piece for speech, per finished minute for dense audio. */
      var MIX;
      if (s.mixing === 'atmos') {
        MIX = Rm * R.MIX.surround_51 * 1.8;
        flags.push('atmos_manual_quote');
      } else if (spoken) {
        MIX = N * (R.MIX_PIECE[s.mixing] || 0);
      } else {
        MIX = Rm * (R.MIX[s.mixing] || 0);
      }

      var MASTER = 0;
      if (s.mastering !== 'none' && s.mastering) {
        MASTER = spoken
          ? N * R.MASTER_PIECE +
            (s.mastering === 'multi_platform_targets' ? N * R.MASTER_PIECE_EXTRA * 2 : 0)
          : Rm * R.MASTER +
            (s.mastering === 'multi_platform_targets' ? Rm * R.MASTER_EXTRA * 2 : 0);
      }

      var sfxCount = h.num('sfx_count', 0);
      var SFX = 0;
      if (s.sound_design === 'light_transitions') SFX = N * 4 * R.SFX_EACH;
      else if (s.sound_design === 'moderate_scene_beds') {
        SFX = (sfxCount || N * 10) * R.SFX_EACH + Rm * 0.3 * R.SFX_BED_MIN;
      } else if (s.sound_design === 'heavy_immersive') {
        SFX = (sfxCount || N * 25) * R.SFX_EACH + Rm * 0.7 * R.SFX_BED_MIN;
      }

      var foleyMin = h.num('foley_scene_minutes', 0);
      var FOLEY = s.foley === 'full_foley_pass' ? foleyMin * R.FOLEY_MIN
                : s.foley === 'light' ? foleyMin * R.FOLEY_MIN * 0.5 : 0;
      var ADR = h.bool('adr_required') ? h.num('adr_lines', 0) * R.ADR_LINE : 0;

      var arrangement = h.pick('music_arrangement',
        { solo_electronic: 1, small_ensemble: 1.6, live_session_players: 2.4, orchestral: 4 }, 1);
      if (s.music_arrangement === 'orchestral') flags.push('orchestral_scope');
      var MUSIC = 0;
      if (s.music_needs === 'library_licensed') MUSIC = N * R.MUSIC_LIB;
      else if (s.music_needs === 'original_composed') {
        MUSIC = h.num('music_minutes', 1) * R.MUSIC_ORIG_MIN * arrangement;
      } else if (s.music_needs === 'commercial_track') {
        flags.push('sync_license_manual_quote');
        deferred.push({ label: 'Commercial music sync licence', reason:
          'Quoted by the rights holders and hugely variable. Left out deliberately ' +
          'rather than guessed — tell us the track and we\'ll chase a real number.' });
      }

      var BRANDING = (h.bool('intro_outro') ? R.INTRO_OUTRO : 0) +
                     (h.bool('sonic_logo') ? R.SONIC_LOGO : 0);

      if (EDIT) post.push({ label: 'Editing', qty: Rm, unit: 'min', amount: EDIT });
      if (CLEANUP) post.push({ label: 'Noise reduction & cleanup', qty: Rm, unit: 'min', amount: CLEANUP });
      if (MIX) post.push({ label: 'Mixing', qty: spoken ? N : Rm,
        unit: spoken ? 'pieces' : 'min', amount: MIX });
      if (MASTER) post.push({ label: 'Mastering', qty: spoken ? N : Rm,
        unit: spoken ? 'pieces' : 'min', amount: MASTER });
      if (SFX) post.push({ label: 'Sound design', qty: sfxCount || null, unit: 'effects', amount: SFX });
      if (FOLEY) post.push({ label: 'Foley', qty: foleyMin, unit: 'min', amount: FOLEY });
      if (ADR) post.push({ label: 'ADR', qty: h.num('adr_lines', 0), unit: 'lines', amount: ADR });
      if (MUSIC) post.push({ label: 'Music', qty: null, amount: MUSIC });
      if (BRANDING) post.push({ label: 'Branded intro / sonic identity', qty: null, amount: BRANDING });

      var POST_CORE = EDIT + CLEANUP + MIX + MASTER + SFX + FOLEY + ADR + MUSIC + BRANDING;

      /* §5 deliverables */
      var deliver = [];
      var altCount = Array.isArray(s.alt_versions) ? s.alt_versions.length : 0;
      var ALTS = altCount * Rm * R.ALT_VERSION_MIN;
      var STEMS = h.has('delivery_formats', 'stems') ? N * R.STEMS : 0;
      var TRANSCR = h.pick('transcription',
        { raw_transcript: Rm * R.TRANSCRIPT_MIN,
          edited_transcript: Rm * R.TRANSCRIPT_MIN * 1.8,
          show_notes: Rm * R.TRANSCRIPT_MIN * 1.8 + N * R.SHOW_NOTES }, 0);
      var MARKERS = h.bool('chapter_markers') ? N * R.MARKERS : 0;
      var PUBLISH = h.bool('hosting_distribution_help') ? N * R.PUBLISH : 0;
      var EXTRA_REV = h.pick('revision_rounds', { '3': R.REVISION, '4_plus': R.REVISION * 2 }, 0);

      if (ALTS) deliver.push({ label: altCount + ' alternate version' + (altCount > 1 ? 's' : ''),
        qty: Rm, unit: 'min', amount: ALTS });
      if (STEMS) deliver.push({ label: 'Stem delivery', qty: N, unit: 'pieces', amount: STEMS });
      if (TRANSCR) deliver.push({ label: 'Transcription', qty: Rm, unit: 'min', amount: TRANSCR });
      if (MARKERS) deliver.push({ label: 'Chapter markers & metadata', qty: N, unit: 'pieces', amount: MARKERS });
      if (PUBLISH) deliver.push({ label: 'Publishing assistance', qty: N, unit: 'pieces', amount: PUBLISH });

      var tmult = h.pick('turnaround', { standard_2wk: 1, expedited_1wk: 1.3, rush_48hr: 1.7 }, 1);
      var beforeRush = POST_CORE + ALTS + STEMS + TRANSCR + MARKERS + PUBLISH;
      var POST = beforeRush * tmult + EXTRA_REV;
      if (tmult > 1) deliver.push({ label: 'Expedited turnaround', qty: null,
        amount: beforeRush * (tmult - 1) });
      if (EXTRA_REV) deliver.push({ label: 'Additional revision rounds', qty: null, amount: EXTRA_REV });

      if (s.audio_project_type !== 'mastering_only' && RECORD > 0 && POST < RECORD * 0.8) {
        flags.push('post_underweighted');
      }

      /* §6 series volume */
      var episodes = h.num('episode_count', 0);
      var volumeFactor = 1;
      var recurring = null;
      if (isSeries(s) && episodes > 1) {
        volumeFactor = episodes >= 20 ? 0.80 : episodes >= 10 ? 0.87 : episodes >= 4 ? 0.93 : 1;
        recurring = { applies: true, unit: 'episode', unitCount: episodes };
      }

      /* §7 rights */
      var pts = { internal: 0, website: 1, podcast_platforms: 1, organic_social: 1,
                  game_app: 3, paid_ads: 4, retail_music_streaming: 4,
                  broadcast_radio: 5, broadcast_tv: 6, cinema: 6 };
      var dist = 0;
      Object.keys(pts).forEach(function (k) { if (h.has('distribution', k)) dist += pts[k]; });
      var term = h.pick('usage_term', { '6_months': 0.8, '1_year': 1, '3_years': 1.5, perpetual: 2 }, 1);
      var terr = h.pick('usage_territory', { local: 1, national: 1.3, worldwide: 1.6 }, 1);
      var lic = 1 + (dist * 0.05 * term * terr);
      if (s.rights_ownership === 'full_buyout_to_client') lic *= 1.35;
      if (s.rights_ownership === 'work_for_hire') lic *= 1.50;

      if (h.bool('pro_registration')) {
        flags.push('publishing_rights_manual_review');
        deferred.push({ label: 'PRO registration and publishing administration',
          reason: 'Contractual rather than production work — it needs a signed ' +
                  'agreement, not a line on an estimate.' });
      }
      if (s.rights_ownership === 'work_for_hire' && s.music_needs === 'original_composed') {
        flags.push('work_for_hire_composition');
      }
      if (s.loudness_target === 'not_sure') flags.push('loudness_assumed');

      /* §6 travel */
      var km = h.num('travel_distance_km', 0);
      var travel = (h.bool('on_location_recording') && km > 40)
        ? (km - 40) * R.MILEAGE * 2 * prodDays : 0;
      var lodging = 0;
      if (km > 250 && h.bool('on_location_recording')) {
        lodging = R.PER_DIEM * crew * Math.max(1, prodDays - 1);
        flags.push('travel_manual_review');
      }

      var phases = [];
      if (record.length) phases.push({ name: 'Recording (hours)', items: record });
      phases.push({ name: 'Post-production (finished minutes)', items: post });
      if (deliver.length) phases.push({ name: 'Deliverables', items: deliver });

      return {
        base: RECORD, addOns: POST,
        rushableBase: RECORD,                          /* POST carries TURNAROUND_MULT */
        licensableBase: Math.max(0, RECORD + POST - TALENT_FEES),
        licenseMultiplier: lic,
        volumeFactor: volumeFactor,
        travel: travel, lodging: lodging,
        phases: phases,
        flags: flags, deferred: deferred,
        recurring: recurring,
        tiers: {
          good: ['Standard edit rather than heavy', 'Stereo mix',
                 'A single master target', 'Library music',
                 'No sound design', 'Two revision rounds'],
          standard: ['Everything exactly as you\'ve scoped it here'],
          premium: ['Heavier edit', 'Stem mix', 'Multi-platform mastering',
                    'Original music', 'Fuller sound design',
                    'Transcripts and show notes', 'Expedited turnaround']
        },
        excludes: [
          'Sync licensing for commercially released recordings',
          'Talent usage renewals beyond the agreed term',
          'PRO registration and publishing administration',
          'Session musician royalties',
          'Podcast hosting and distribution fees',
          'Re-records caused by script changes after approval'
        ],
        timeline: [
          'Contract and deposit',
          record.length ? 'Session booking confirmed' : 'Files received and checked',
          record.length ? 'Recording' : 'First pass on your material',
          'First edit and rough mix',
          h.pick('revision_rounds', { '2_standard': 'Two', '3': 'Three', '4_plus': 'Four+' }, 'Two') +
            ' revision rounds',
          'Final mix',
          'Master and delivery — ' + h.pick('turnaround',
            { standard_2wk: 'two weeks', expedited_1wk: 'one week', rush_48hr: '48 hours' },
            'two weeks')
        ]
      };
    },

    flagNotes: {
      studio_hours_estimated:
        'You weren\'t sure how much studio time you\'d need, so we\'ve estimated it ' +
        'from the runtime. Talk records close to real time; music and scoring don\'t. ' +
        'Worth a quick conversation before we book the room.',
      runtime_estimated: 'Total runtime was left open, so we\'ve assumed 30 minutes.',
      source_quality_risk:
        'You\'ve said the existing recordings are rough. We can do a lot with ' +
        'difficult audio, but not everything, and we\'d rather show you than promise. ' +
        'Send two or three minutes of the worst of it and we\'ll do a test pass — ' +
        'then you\'ll know exactly what you\'re buying.',
      sync_license_manual_quote:
        'Sync licensing for a commercially released track is quoted by the rights ' +
        'holders and can range from manageable to eye-watering. It\'s deliberately ' +
        'not in the figure above.',
      talent_buyout_manual_quote:
        'Voice talent has two separate costs: the session, which is in the estimate, ' +
        'and the usage buyout, which is not. Buyouts depend on where the audio runs ' +
        'and for how long.',
      atmos_manual_quote:
        'An Atmos mix needs a room and a workflow we\'d want to confirm rather than ' +
        'estimate. The figure shown is indicative only.',
      publishing_rights_manual_review:
        'PRO registration and publishing splits are contractual matters. They need a ' +
        'signed agreement, not a line on an estimate.',
      work_for_hire_composition:
        'Work-for-hire on original composition assigns authorship, which is a bigger ' +
        'step than a licence. The proposal lays out the three ownership options — ' +
        'worth five minutes to pick the one you actually need.',
      loudness_assumed:
        'You weren\'t sure of the loudness target, so we\'ve set it from where the ' +
        'audio is going and stated the assumption. If a platform has specified one, ' +
        'tell us — redelivering everything is the avoidable version of this problem.',
      post_underweighted:
        'Post is coming out low relative to the recording time. Finishing usually ' +
        'costs more than capturing, so a producer will sanity-check the inputs.',
      orchestral_scope:
        'Orchestral arrangement means players, a room, and a contractor. It\'s priced ' +
        'here, but at that scale a producer builds the number rather than a formula.',
      lead_time_infeasible:
        'Your date is very close. The estimate carries an expedited fee, but studio ' +
        'and post availability need confirming before you rely on it.',
      travel_manual_review:
        'That distance means overnight travel. The figure shown is a placeholder.'
    },

    email: function (s, est, h) {
      var first = (s.client_name || '').split(' ')[0];
      var Rm = h.num('total_runtime_min', 30);
      var N = h.num('deliverable_count', 1);
      var eps = h.num('episode_count', 0);

      var runtimeSummary = eps > 1
        ? eps + ' episodes, about ' + Math.round(Rm / eps) + ' minutes each'
        : N + ' piece' + (N === 1 ? '' : 's') + ', ' + Rm + ' minutes in total';

      var recording = s.source_material_state === 'nothing_yet'
        ? (h.num('studio_hours', 0) || 'some') + ' studio hours' +
          (s.engineer_required === 'yes' ? ' with an engineer' : '')
        : 'you supply the recordings, we finish them';

      var loudness = {
        'podcast_-16lufs': '−16 LUFS', 'music_-14lufs': '−14 LUFS',
        'broadcast_-23lufs': '−23 LUFS', cinema: 'cinema standard',
        not_sure: 'the standard for where it\'s going'
      }[s.loudness_target] || '−16 LUFS';

      var body =
        'Hi ' + first + ',\n\n' +
        'Thanks for the detail on ' + (s.project_name || 'your project') +
        ' — good briefs make for honest\nestimates, and yours was one.\n\n' +
        'Here\'s the shape of it:\n\n' +
        '  Project    ' + (s.audio_project_type || 'audio').replace(/_/g, ' ') +
          ' — ' + runtimeSummary + '\n' +
        '  Recording  ' + recording + '\n' +
        '  Delivery   ' + h.pick('turnaround',
            { standard_2wk: '2 weeks', expedited_1wk: '1 week', rush_48hr: '48 hours' }, '2 weeks') +
          ', ' + h.pick('revision_rounds',
            { '2_standard': 'two', '3': 'three', '4_plus': 'four+' }, 'two') +
          ' rounds of revisions,\n             mastered to ' + loudness + '\n' +
        (eps > 1 ? '  Per episode $' +
          Math.round(est.total / eps).toLocaleString('en-US') + '\n' : '') +
        '  Estimate   $' + Math.round(est.tiers.good.low || est.tiers.good.amount).toLocaleString('en-US') +
          ' – $' + Math.round(est.tiers.premium.high || est.tiers.premium.amount).toLocaleString('en-US') + '\n\n' +
        'One thing the estimate makes deliberately visible: recording time and\n' +
        'finishing time are priced separately, in different units — hours for the\n' +
        'room, finished minutes for the edit and mix. They\'re genuinely different\n' +
        'work, and a two-hour session almost never means two hours of work. Better\n' +
        'you see that structure now than wonder about it on the invoice.\n\n' +
        (eps > 1 ? 'Because this is a series, the number that matters is the per-episode rate.\nLonger commitments bring it down, and the proposal shows where those\nbreakpoints are.\n\n' : '') +
        (est.confidence === 'preliminary'
          ? 'A few details were still open, so this is a range. The one that moves it\nmost is how much editing the material actually needs — usually settled\nfastest by us hearing a few minutes of it.\n\n' : '') +
        'If you\'d like to hear how we\'d approach it before deciding, I\'m happy to\n' +
        'do a short sample pass on a few minutes of your material.\n\n' +
        'Josh\nKriel Ventures\njosh@kriel.us';

      return {
        subject: (s.project_name || 'Your project') + ' — audio proposal & estimate',
        body: body
      };
    }
  };
})();
