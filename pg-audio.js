/* ==========================================================================
   Proposal generator — Sound Design & Audio Recording
   Implements proposal-generators/04-sound-design/. Recording is priced per
   hour, finishing per minute of finished audio. The two are never blended: a
   two-hour session almost never means two hours of work.
   ========================================================================== */
(function () {
  'use strict';

  var R = {
    STUDIO_HOUR: 150, ENGINEER_HOUR: 110, STUDIO_DAY: 950,
    FIELD_HOUR: 165, TALENT_SESSION: 450, MUSICIAN_SESSION: 400,

    /* Dense audio — scored picture, ads, foley. Every finished minute is
       worked densely, so the minute is the right unit. */
    EDIT:  { light: 25, standard: 55, heavy: 110 },
    CLEAN: { standard: 20, heavy: 75 },
    MIX:   { stereo: 70, stem: 110 },
    MASTER: 45,

    /* Long-form speech — podcasts, audiobooks, VO. A separate curve, not a
       discount on the one above: cost scales sub-linearly with runtime, and
       mixing and mastering are set up once per episode and then largely ride.
       Without this split the generator quoted $28,000 to mix a ten-part show. */
    EDIT_SPOKEN:  { light: 4, standard: 8, heavy: 18 },
    CLEAN_SPOKEN: { standard: 3, heavy: 10 },
    MIX_PIECE:    { stereo: 150, stem: 260 },
    MASTER_PIECE: 80,

    SFX_EACH: 65, SFX_BED_MIN: 90, FOLEY_MIN: 260,
    MUSIC_ORIG_MIN: 900, MUSIC_LIB: 220,
    INTRO_OUTRO: 750, SONIC_LOGO: 2200,
    STEMS: 150, TRANSCRIPT_MIN: 4, SHOW_NOTES: 90, MARKERS: 40,
    REVISION: 250, PUBLISH: 120, MILEAGE: 0.85, PER_DIEM: 90
  };

  var SPOKEN = ['podcast_series', 'podcast_single', 'audiobook', 'voiceover',
                'live_event_recording'];
  function isSpoken(s) { return SPOKEN.indexOf(s.audio_project_type) !== -1; }
  function needsRecording(s) { return s.source_state === 'nothing_yet'; }
  function isSeries(s) { return s.audio_project_type === 'podcast_series'; }

  window.PG_CONFIG = {
    service: 'Sound Design & Audio',
    standardLeadDays: 21,
    taxRate: 0,

    sections: [
      window.PG_INTAKE,

      { title: 'The project', short: 'Project',
        fields: [
          { id: 'audio_project_type', label: 'What are we making?', type: 'select', req: 1,
            opts: [['podcast_series', 'A podcast series'],
                   ['podcast_single', 'A single episode'],
                   ['audiobook', 'An audiobook'],
                   ['voiceover', 'Voiceover'],
                   ['music_recording', 'A music recording'],
                   ['film_scoring', 'Music for film or video'],
                   ['sound_design_post', 'Sound design for picture'],
                   ['mixing_only', 'Mixing only'],
                   ['mastering_only', 'Mastering only'],
                   ['audio_restoration', 'Rescuing rough recordings'],
                   ['audio_branding_sonic_logo', 'A sonic logo or audio brand'],
                   ['other', 'Something else']] },

          { id: 'runtime_band', label: 'How much finished audio, in total?',
            type: 'select', req: 1, half: 1, unsure: 1,
            opts: [['2', 'A minute or two'],
                   ['15', 'Around 15 minutes'],
                   ['40', 'Around 40 minutes'],
                   ['180', 'Several hours worth'],
                   ['400', 'A full series — six hours or more']] },

          { id: 'piece_count', label: 'How many separate pieces?', type: 'select',
            req: 1, half: 1,
            help: 'Episodes, tracks, cues or spots.',
            opts: [['1', 'Just the one'], ['3', 'Two or three'],
                   ['6', 'Four to eight'], ['10', 'Ten'], ['20', 'Twenty or more']] },

          { id: 'source_state', label: 'What do you have already?', type: 'select', req: 1,
            opts: [['nothing_yet', 'Nothing yet — we need to record'],
                   ['raw_recordings', 'Raw recordings'],
                   ['edited_needs_mix', 'Edited, needs mixing'],
                   ['mixed_needs_master', 'Mixed, needs mastering'],
                   ['poor_quality_needs_rescue', 'Recordings, but they are rough']] },

          { id: 'remote_recording', label: 'How are people recorded?', type: 'select',
            half: 1, when: isSpoken,
            opts: [['all_in_studio', 'All in one room'],
                   ['hybrid', 'Some remote'],
                   ['all_remote', 'All remote']] }
        ] },

      { title: 'Recording', short: 'Recording',
        note: 'Priced by the hour. Skipped entirely if you already have the audio.',
        fields: [
          { id: 'studio_band', label: 'How much studio time?', type: 'select', req: 1,
            half: 1, unsure: 1, when: needsRecording,
            opts: [['2', 'An hour or two'],
                   ['4', 'Half a day'],
                   ['8', 'A full day'],
                   ['20', 'Several sessions'],
                   ['40', 'A lot — a full series']] },

          { id: 'recording_extras', label: 'Does the session need any of these?',
            type: 'multi', when: needsRecording,
            opts: [['engineer', 'An engineer running the session'],
                   ['direction', 'Someone directing or producing'],
                   ['talent', 'Voice talent we cast'],
                   ['musicians', 'Session musicians'],
                   ['on_location', 'Recording out on location']] },

          { id: 'location_city', label: 'Where, if not our studio?', type: 'text',
            half: 1, when: function (s, h) {
              return needsRecording(s) && h.has('recording_extras', 'on_location'); } },

          { id: 'travel_band', label: 'Roughly how far from Cape Town?', type: 'select',
            half: 1, unsure: 1, when: function (s, h) {
              return needsRecording(s) && h.has('recording_extras', 'on_location'); },
            opts: [['0', 'Local — within about 40 km'],
                   ['120', 'An hour or two away'],
                   ['400', 'Further than that']] }
        ] },

      { title: 'Finishing & rights', short: 'Finishing',
        note: 'Finishing almost always costs more than capturing.',
        fields: [
          { id: 'editing_scope', label: 'How much editing?', type: 'select', req: 1, half: 1,
            opts: [['none', 'None needed'],
                   ['light', 'Light — top and tail'],
                   ['standard', 'Standard — tidy it properly'],
                   ['heavy', 'Heavy — shape it into a story']] },

          { id: 'cleanup', label: 'Noise and cleanup', type: 'select', req: 1, half: 1,
            opts: [['none', 'None needed'], ['standard', 'Standard'],
                   ['heavy', 'Heavy — it needs rescuing']] },

          { id: 'mix_level', label: 'Mixing and mastering', type: 'select', req: 1, half: 1,
            opts: [['none', 'Neither'],
                   ['stereo', 'Mix and master, stereo'],
                   ['stem', 'Mix with stems, and master']] },

          { id: 'loudness_target', label: 'Where is it going?', type: 'select', req: 1,
            half: 1,
            help: 'This sets the loudness standard. Getting it wrong means ' +
                  'redelivering everything.',
            opts: [['podcast_-16lufs', 'Podcast or spoken word'],
                   ['music_-14lufs', 'Music streaming'],
                   ['broadcast_-23lufs', 'Broadcast'],
                   ['cinema', 'Cinema'],
                   ['not_sure', 'Not sure — pick for us']] },

          { id: 'sound_design', label: 'Sound design and effects', type: 'select',
            req: 1, half: 1,
            opts: [['none', 'None'],
                   ['light_transitions', 'Light — stings and transitions'],
                   ['moderate_scene_beds', 'Moderate — atmospheres and beds'],
                   ['heavy_immersive', 'Heavy — fully designed']] },

          { id: 'music_needs', label: 'Music', type: 'select', req: 1, half: 1,
            opts: [['none', 'None'], ['library_licensed', 'A licensed library track'],
                   ['original_composed', 'Originally composed'],
                   ['commercial_track', 'A song you already have in mind']] },

          { id: 'finishing_extras', label: 'Anything else?', type: 'multi',
            opts: [['intro_outro', 'A branded intro and outro'],
                   ['sonic_logo', 'A sonic logo'],
                   ['foley', 'Custom foley'],
                   ['stems', 'Stems delivered'],
                   ['transcript', 'Transcripts and show notes'],
                   ['markers', 'Chapter markers'],
                   ['publishing', 'Help getting it published'],
                   ['extra_revision', 'An extra round of revisions']] },

          { id: 'distribution', label: 'Where will it be published?', type: 'multi', req: 1,
            opts: [['internal', 'Internally only'],
                   ['podcast_platforms', 'Podcast platforms'],
                   ['website', 'Your website'],
                   ['organic_social', 'Social media'],
                   ['paid_ads', 'Paid advertising'],
                   ['broadcast_radio', 'Radio'],
                   ['broadcast_tv', 'TV'],
                   ['cinema', 'Cinema'],
                   ['game_app', 'A game or app'],
                   ['retail_music_streaming', 'Music streaming platforms']] },

          { id: 'usage_term', label: 'For how long?', type: 'select', req: 1, half: 1,
            opts: [['6_months', 'Six months'], ['1_year', 'A year'],
                   ['3_years', 'Three years'], ['perpetual', 'Indefinitely']] },

          { id: 'rights_ownership', label: 'Who owns the finished audio?', type: 'select',
            req: 1, half: 1,
            opts: [['agency_licenses_to_client', 'You licence it from us'],
                   ['full_buyout_to_client', 'We buy it outright'],
                   ['work_for_hire', 'Work for hire']] },

          { id: 'turnaround', label: 'How soon?', type: 'select', req: 1, half: 1,
            opts: [['standard_2wk', 'Two weeks is fine'],
                   ['expedited_1wk', 'Within a week'],
                   ['rush_48hr', 'Within 48 hours']] },

          { id: 'notes', label: 'Anything we should know?', type: 'textarea', rows: 3 },

          { id: 'template_choice', label: 'Proposal style', type: 'select', req: 1,
            opts: [['let_us_recommend', 'Pick one for me'],
                   ['podcast_production', 'Podcast — per-episode rates'],
                   ['commercial_audio_foley', 'Commercial — deliverables and spec'],
                   ['music_film_scoring', 'Scoring — cue sheet and rights']] }
        ] }
    ],

    calc: function (s, h) {
      var flags = [], deferred = [], assumed = [];
      var re = function (k) { return h.has('recording_extras', k); };
      var fe = function (k) { return h.has('finishing_extras', k); };

      var Rm = h.num('runtime_band', 0);
      if (!Rm) { Rm = 30; flags.push('runtime_estimated'); }
      var N = Math.max(1, h.num('piece_count', 1));
      var spoken = isSpoken(s);

      /* --- Recording --- */
      var record = [], RECORD = 0, prodDays = 1, crew = 1;
      if (needsRecording(s)) {
        var hrs = h.num('studio_band', 0);
        if (!hrs) { hrs = 4; flags.push('studio_hours_estimated'); }
        prodDays = Math.max(1, Math.ceil(hrs / 8));
        crew = 1 + (re('engineer') ? 1 : 0) + (re('direction') ? 1 : 0) +
               (re('talent') ? 1 : 0) + (re('musicians') ? 3 : 0);

        var ROOM = re('on_location') ? hrs * R.FIELD_HOUR
                 : hrs >= 7 ? R.STUDIO_DAY * Math.ceil(hrs / 8)
                 : hrs * R.STUDIO_HOUR;
        record.push({ label: re('on_location') ? 'Location recording' : 'Studio time',
          qty: hrs, unit: 'hrs', amount: ROOM });
        RECORD += ROOM;

        if (re('engineer')) {
          var ENG = hrs * R.ENGINEER_HOUR;
          record.push({ label: 'Engineer', qty: hrs, unit: 'hrs', amount: ENG });
          RECORD += ENG;
        }
        if (re('direction')) {
          var DIR = hrs * 125;
          record.push({ label: 'Session direction', qty: hrs, unit: 'hrs', amount: DIR });
          RECORD += DIR;
        }
        if (re('talent')) {
          var TAL = R.TALENT_SESSION * prodDays;
          record.push({ label: 'Voice talent — session fee', qty: 1, unit: 'voice', amount: TAL });
          RECORD += TAL;
          assumed.push('one voice — tell us if you need more');
          deferred.push({ label: 'Voice talent usage buyout', reason:
            'The session fee is above. The buyout depends on where the audio runs and ' +
            'for how long, and is set by a person rather than a formula.' });
        }
        if (re('musicians')) {
          var MUS = 3 * R.MUSICIAN_SESSION * prodDays;
          record.push({ label: 'Session musicians', qty: 3, unit: 'players', amount: MUS });
          RECORD += MUS;
          assumed.push('three session players');
        }
      }
      var performerFees = record.reduce(function (a, i) {
        return a + (/talent|musician/i.test(i.label) ? i.amount : 0); }, 0);

      /* --- Finishing --- */
      var post = [];
      var EDIT = Rm * ((spoken ? R.EDIT_SPOKEN : R.EDIT)[s.editing_scope] || 0);
      var CLEANUP = Rm * ((spoken ? R.CLEAN_SPOKEN : R.CLEAN)[s.cleanup] || 0);
      if (s.remote_recording === 'all_remote') CLEANUP *= 1.4;
      else if (s.remote_recording === 'hybrid') CLEANUP *= 1.2;
      if (s.source_state === 'poor_quality_needs_rescue') {
        CLEANUP *= 1.6; flags.push('source_quality_risk');
      }

      var MIX = 0, MASTER = 0;
      if (s.mix_level && s.mix_level !== 'none') {
        MIX = spoken ? N * R.MIX_PIECE[s.mix_level] : Rm * R.MIX[s.mix_level];
        MASTER = spoken ? N * R.MASTER_PIECE : Rm * R.MASTER;
      }

      var SFX = 0;
      if (s.sound_design === 'light_transitions') SFX = N * 4 * R.SFX_EACH;
      else if (s.sound_design === 'moderate_scene_beds') SFX = N * 10 * R.SFX_EACH + Rm * 0.3 * R.SFX_BED_MIN;
      else if (s.sound_design === 'heavy_immersive') SFX = N * 25 * R.SFX_EACH + Rm * 0.7 * R.SFX_BED_MIN;

      var FOLEY = fe('foley') ? Math.min(Rm, 10) * R.FOLEY_MIN : 0;
      if (FOLEY) assumed.push('up to ten minutes of foley coverage');

      var MUSIC = 0;
      if (s.music_needs === 'library_licensed') MUSIC = N * R.MUSIC_LIB;
      else if (s.music_needs === 'original_composed') {
        MUSIC = Math.min(Rm, 10) * R.MUSIC_ORIG_MIN;
        assumed.push('up to ten minutes of original music');
      } else if (s.music_needs === 'commercial_track') {
        flags.push('sync_license_manual_quote');
        deferred.push({ label: 'Licence for a commercially released song', reason:
          'Quoted by the rights holders and hugely variable. Left out deliberately ' +
          'rather than guessed — tell us the track and we will chase a real number.' });
      }

      var BRANDING = (fe('intro_outro') ? R.INTRO_OUTRO : 0) + (fe('sonic_logo') ? R.SONIC_LOGO : 0);

      if (EDIT) post.push({ label: 'Editing', qty: Rm, unit: 'min', amount: EDIT });
      if (CLEANUP) post.push({ label: 'Cleanup and noise reduction', qty: Rm, unit: 'min', amount: CLEANUP });
      if (MIX) post.push({ label: 'Mixing', qty: spoken ? N : Rm, unit: spoken ? 'pieces' : 'min', amount: MIX });
      if (MASTER) post.push({ label: 'Mastering', qty: spoken ? N : Rm, unit: spoken ? 'pieces' : 'min', amount: MASTER });
      if (SFX) post.push({ label: 'Sound design', qty: null, amount: SFX });
      if (FOLEY) post.push({ label: 'Foley', qty: null, amount: FOLEY });
      if (MUSIC) post.push({ label: 'Music', qty: null, amount: MUSIC });
      if (BRANDING) post.push({ label: 'Branded intro / sonic identity', qty: null, amount: BRANDING });

      var POST_CORE = EDIT + CLEANUP + MIX + MASTER + SFX + FOLEY + MUSIC + BRANDING;

      /* --- Deliverables --- */
      var deliver = [];
      var STEMS = fe('stems') ? N * R.STEMS : 0;
      var TRANSCR = fe('transcript') ? Rm * R.TRANSCRIPT_MIN * 1.8 + N * R.SHOW_NOTES : 0;
      var MARKERS = fe('markers') ? N * R.MARKERS : 0;
      var PUBLISH = fe('publishing') ? N * R.PUBLISH : 0;
      var EXTRA_REV = fe('extra_revision') ? R.REVISION : 0;

      if (STEMS) deliver.push({ label: 'Stems', qty: N, unit: 'pieces', amount: STEMS });
      if (TRANSCR) deliver.push({ label: 'Transcripts and show notes', qty: Rm, unit: 'min', amount: TRANSCR });
      if (MARKERS) deliver.push({ label: 'Chapter markers', qty: N, unit: 'pieces', amount: MARKERS });
      if (PUBLISH) deliver.push({ label: 'Publishing help', qty: N, unit: 'pieces', amount: PUBLISH });

      var tmult = h.pick('turnaround', { standard_2wk: 1, expedited_1wk: 1.3, rush_48hr: 1.7 }, 1);
      var beforeRush = POST_CORE + STEMS + TRANSCR + MARKERS + PUBLISH;
      var POST = beforeRush * tmult + EXTRA_REV;
      if (tmult > 1) deliver.push({ label: 'Faster turnaround', qty: null, amount: beforeRush * (tmult - 1) });
      if (EXTRA_REV) deliver.push({ label: 'Extra revision round', qty: null, amount: EXTRA_REV });

      /* --- Series volume --- */
      var volumeFactor = 1, recurring = null;
      if (isSeries(s) && N > 1) {
        volumeFactor = N >= 20 ? 0.80 : N >= 10 ? 0.87 : N >= 4 ? 0.93 : 1;
        recurring = { applies: true, unit: 'episode', unitCount: N };
      }

      /* --- Rights --- */
      var pts = { internal: 0, website: 1, podcast_platforms: 1, organic_social: 1,
                  game_app: 3, paid_ads: 4, retail_music_streaming: 4,
                  broadcast_radio: 5, broadcast_tv: 6, cinema: 6 };
      var dist = 0;
      Object.keys(pts).forEach(function (k) { if (h.has('distribution', k)) dist += pts[k]; });
      var term = h.pick('usage_term', { '6_months': 0.8, '1_year': 1, '3_years': 1.5, perpetual: 2 }, 1);
      var lic = 1 + (dist * 0.05 * term);
      if (s.rights_ownership === 'full_buyout_to_client') lic *= 1.35;
      if (s.rights_ownership === 'work_for_hire') lic *= 1.50;
      if (s.rights_ownership === 'work_for_hire' && s.music_needs === 'original_composed') {
        flags.push('work_for_hire_composition');
      }
      if (s.loudness_target === 'not_sure') flags.push('loudness_assumed');
      if (assumed.length) flags.push('assumptions_made');

      /* --- Travel --- */
      var km = h.num('travel_band', 0);
      var travel = (re('on_location') && km > 40) ? (km - 40) * R.MILEAGE * 2 * prodDays : 0;
      var lodging = 0;
      if (km > 250 && re('on_location')) {
        lodging = R.PER_DIEM * crew * Math.max(1, prodDays - 1);
        flags.push('travel_manual_review');
      }

      var phases = [];
      if (record.length) phases.push({ name: 'Recording (by the hour)', items: record });
      phases.push({ name: 'Finishing (by the minute)', items: post });
      if (deliver.length) phases.push({ name: 'Deliverables', items: deliver });

      return {
        base: RECORD, addOns: POST,
        rushableBase: RECORD,
        licensableBase: Math.max(0, RECORD + POST - performerFees),
        licenseMultiplier: lic,
        volumeFactor: volumeFactor,
        travel: travel, lodging: lodging,
        assumed: assumed,
        phases: phases,
        flags: flags, deferred: deferred,
        recurring: recurring,
        tiers: {
          good: ['A standard edit rather than heavy', 'Stereo mix',
                 'Library music', 'No sound design'],
          standard: ['Exactly as you have scoped it'],
          premium: ['A heavier edit', 'Stems delivered', 'Original music',
                    'Fuller sound design', 'Transcripts and show notes']
        },
        excludes: [
          'Licences for commercially released recordings',
          'Talent usage renewals beyond the agreed term',
          'Publishing registration and administration',
          'Session musician royalties',
          'Podcast hosting and distribution fees'
        ],
        timeline: [
          'Contract and deposit',
          record.length ? 'Session booked and confirmed' : 'Files received and checked',
          record.length ? 'Recording' : 'First pass on your material',
          'First edit and rough mix',
          'Two rounds of revisions',
          'Final mix, master and delivery — ' + h.pick('turnaround',
            { standard_2wk: 'two weeks', expedited_1wk: 'one week', rush_48hr: '48 hours' },
            'two weeks')
        ]
      };
    },

    flagNotes: {
      assumptions_made:
        'Where you ticked an extra we assumed a sensible size for it — one voice, ' +
        'three players, up to ten minutes of music or foley. Tell us if that is ' +
        'wrong and we will re-quote.',
      studio_hours_estimated:
        'You were not sure how much studio time you need, so we have assumed half a ' +
        'day. Talk records close to real time; music and scoring do not.',
      runtime_estimated: 'Total runtime was left open, so we have assumed 30 minutes.',
      source_quality_risk:
        'You said the existing recordings are rough. We can do a lot with difficult ' +
        'audio, but not everything, and we would rather show you than promise. Send ' +
        'two or three minutes of the worst of it and we will do a test pass first.',
      sync_license_manual_quote:
        'Sync licensing for a commercially released song is quoted by the rights ' +
        'holders and ranges from manageable to eye-watering. It is deliberately not ' +
        'in the figure above.',
      work_for_hire_composition:
        'Work-for-hire on original music assigns authorship, which is a bigger step ' +
        'than a licence. Worth five minutes to pick the option you actually need.',
      loudness_assumed:
        'You were not sure of the loudness target, so we have set it from where the ' +
        'audio is going. If a platform has specified one, tell us — redelivering ' +
        'everything is the avoidable version of this problem.',
      lead_time_infeasible:
        'Your date is very close. The estimate carries a rush fee, but studio and ' +
        'post availability need confirming before you rely on it.',
      travel_manual_review:
        'That distance means overnight travel. The figure shown is a placeholder.'
    },

    email: function (s, est, h) {
      var first = (s.client_name || '').split(' ')[0];
      var Rm = h.num('runtime_band', 30);
      var N = h.num('piece_count', 1);
      var series = isSeries(s) && N > 1;

      return {
        subject: (s.project_name || 'Your project') + ' — audio proposal & estimate',
        body:
          'Hi ' + first + ',\n\n' +
          'Thanks for the detail on ' + (s.project_name || 'your project') +
          ' — good briefs make for honest\nestimates, and yours was one.\n\n' +
          '  Project    ' + (s.audio_project_type || 'audio').replace(/_/g, ' ') +
            ' — ' + (series ? N + ' episodes' : N + ' piece' + (N === 1 ? '' : 's')) +
            ', ' + Rm + ' minutes in total\n' +
          '  Recording  ' + (needsRecording(s)
            ? (h.num('studio_band', 4) + ' studio hours') : 'you supply it, we finish it') + '\n' +
          '  Delivery   ' + h.pick('turnaround', { standard_2wk: '2 weeks',
            expedited_1wk: '1 week', rush_48hr: '48 hours' }, '2 weeks') + '\n' +
          (series ? '  Per episode $' + Math.round(est.total / N).toLocaleString('en-US') + '\n' : '') +
          '  Estimate   $' + Math.round(est.tiers.good.low || est.tiers.good.amount).toLocaleString('en-US') +
            ' – $' + Math.round(est.tiers.premium.high || est.tiers.premium.amount).toLocaleString('en-US') + '\n\n' +
          'One thing the estimate makes deliberately visible: recording time and\n' +
          'finishing time are priced separately, in different units — hours for the\n' +
          'room, minutes for the edit and mix. They are genuinely different work, and\n' +
          'a two-hour session almost never means two hours of work.\n\n' +
          (series ? 'Because this is a series, the number that matters is the per-episode rate.\nLonger commitments bring it down.\n\n' : '') +
          'Josh\nKriel Ventures\njosh@kriel.us'
      };
    }
  };
})();
