# Proposal Templates — Sound Design & Audio

## Recommendation rules

```
audio_project_type ∈ {podcast_series, podcast_single, audiobook}      → "Podcast Production"
audio_project_type ∈ {voiceover, sound_design_post, audio_branding_sonic_logo,
                      audio_restoration, mixing_only, mastering_only} → "Commercial Audio / Foley"
audio_project_type ∈ {music_recording, film_scoring}                  → "Music / Film Scoring"
```
Overrides: `foley != none` or `adr_required` → **Commercial Audio / Foley**
(that template carries the scene-based sections those need).
`music_needs == original_composed` with `music_minutes > 5` → **Music / Film
Scoring**, regardless of stated type — composition needs the rights sections.

---

## Template A — Podcast Production

**For:** series, single episodes, audiobooks. The buyer is thinking about
sustaining a schedule, not delivering one file.

**Voice:** practical, partnership-minded, cadence-aware.

**Section order**
1. Cover — show name, episode count, cadence
2. The show — the concept restated in the client's own framing
3. **Per-episode workflow** — a numbered pipeline: record → cleanup → edit →
   mix → master → deliver, with who does what at each step and how long it takes
4. Recording setup — studio, remote, or hybrid; what each host and guest needs
   at their end (a genuinely useful kit and environment checklist)
5. What each episode includes — edit level, music, intro/outro, transcript,
   show notes, chapter markers
6. Turnaround per episode — from recording to publish-ready
7. **Investment** — per-episode rate first, then season total, then monthly
8. Ongoing options — retainer terms, minimum commitment, notice period
9. Technical delivery spec — format, loudness (−16 LUFS), file naming
10. What we need from you — recording files, deadlines, guest details, artwork
11. Terms — revisions, cancellation, episode carry-over
12. Next steps
13. Shows we've produced

**Distinctives:** per-episode economics are the headline, not the total. The
guest/host recording checklist is a real deliverable in itself and reduces
cleanup cost — say so. Episode carry-over terms (what happens when a client
skips a week) prevent the most common series dispute.

---

## Template B — Commercial Audio / Foley

**For:** ads, VO, sound design for picture, foley, restoration, sonic branding.
Often supplied into someone else's edit, so technical spec is critical.

**Voice:** precise, craft-specific, spec-led.

**Section order**
1. Cover — project name, deliverable count and durations
2. The brief — what the audio has to do, and to what picture
3. Deliverables matrix — every version, duration, format, and where it runs
4. Sound design approach — palette, texture, references, scene-by-scene where
   applicable
5. Foley & effects scope — **bounded**: number of designed effects, minutes of
   foley coverage, ADR line count
6. Voice & talent — session plan, casting, direction; **buyout stated
   separately and marked to be confirmed**
7. Recording plan — studio, field, hours per session
8. Post pipeline — edit → design → mix → master, with the mix format named
9. **Technical delivery spec** — full page: sample rate, bit depth, loudness
   and true-peak targets, stem structure, OMF/AAF handback, naming convention
10. Usage & rights — distribution, term, territory, ownership model
11. Timeline — anchored to the picture-lock date if there is one
12. Investment — Recording / Post / Deliverables blocks, three tiers
13. Terms — revisions, picture-change policy, approval gates
14. Next steps
15. Selected work with audio samples

**Distinctives:** the technical delivery spec gets a full page because this
audio hands off to someone else's timeline. The **picture-change policy** is
essential — a re-cut after mix means re-conforming everything, and that must be
priced as a change, not absorbed. Foley and SFX are always bounded by count.

---

## Template C — Music / Film Scoring

**For:** original composition, scoring to picture, music recording and
production. Rights and authorship are as important as the music.

**Voice:** collaborative, artistic, but contractually clear.

**Section order**
1. Cover — project title, composer name
2. Creative intent — the emotional job the music does, in the director's terms
3. Musical direction — palette, instrumentation, references, tempo/mood map
4. **Cue sheet / scope** — every cue: name, scene, approximate duration,
   arrangement. This is the scope document; nothing outside it is included
5. Instrumentation & performers — programmed vs. live, session players needed
6. Recording plan — studio time, live room, sessions per cue group
7. Process & milestones — sketches → approval → demos → recording → mix →
   master, with a named approval point at each stage
8. **Rights, ownership & publishing** — full page: licence vs. buyout vs.
   work-for-hire, term, territory, PRO registration, publishing splits, and
   performer royalties, each stated or explicitly deferred to contract
9. Delivery spec — stems, formats, loudness, cue naming for the dub stage
10. Timeline — anchored to picture lock and the dub/mix date
11. Investment — per finished minute and total, three tiers
12. Terms — revisions per cue, re-scoring after picture change, kill fee
13. Next steps
14. Score work and listening links

**Distinctives:** the cue sheet is the contract's scope in miniature — price per
finished minute, and any cue added later is a new line. Rights get a full page
because composition creates authorship that licensing alone does not resolve;
anything involving PRO registration or publishing splits is explicitly marked as
requiring a signed agreement rather than being settled in the proposal. A kill
fee protects composition work abandoned mid-project — include it every time.

---

## Shared rendering rules

- Investment is always grouped Recording / Post-production / Deliverables, with
  hours shown for recording and finished minutes shown for post. Never one
  blended number.
- The technical delivery spec appears in every template, even the podcast one.
- Loudness target is always stated explicitly, including when it was inferred
  rather than specified.
- Talent buyouts, sync licences, and publishing registration always appear as
  separate, clearly-marked to-be-confirmed lines — never inside the total.
- Revision policy in identical words across all three.
- `confidence == preliminary` → banner under the cover.
- Active flags (`source_quality_risk`, `sync_license_manual_quote`,
  `talent_buyout_manual_quote`, `atmos_manual_quote`,
  `publishing_rights_manual_review`, `studio_hours_estimated`) render as visible
  notes in their relevant sections.
