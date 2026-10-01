# Proposal Templates — Videography

## Recommendation rules

```
video_type ∈ {brand_film, corporate_explainer, product_demo,
              testimonial_case_study, training_internal, documentary_short}  → "Corporate / Brand"
video_type ∈ {event_recap, event_full_coverage, livestream}                  → "Event Coverage"
video_type ∈ {tv_commercial, social_ad, music_video}                         → "Commercial / Ad"
```
Override: any project with `dist_points ≥ 5` (broadcast, cinema, OOH) uses
**Commercial / Ad** regardless of type — that template gives usage and talent
the prominence a campaign budget requires.

---

## Template A — Corporate / Brand

**For:** brand films, explainers, case studies, internal comms. The buyer is
usually a marketing manager who must justify the spend internally.

**Voice:** strategic, structured, ROI-aware. This proposal will be forwarded to
someone who wasn't on the call — it must stand alone.

**Section order**
1. Cover — project name, client logo lock-up, date
2. Executive summary — one page a CFO could read alone
3. The objective — the business problem the video solves
4. Creative approach — narrative angle, tone, visual references
5. Deliverables — table: each video, runtime, aspect ratio, where it runs
6. Production plan — shoot days, locations, crew, equipment
7. Post-production plan — edit, grade, motion graphics, sound, versions
8. Timeline — Gantt-style, milestone dates
9. Investment — three grouped blocks (Pre / Prod / Post), three tiers
10. What's included / not included
11. Terms — revisions, approvals, payment schedule, usage
12. Next steps
13. Selected work + reel link

**Distinctives:** the executive summary is written to be extracted and pasted
into an internal approval email. Deliverables table doubles as a media plan.

---

## Template B — Event Coverage

**For:** conferences, launches, festivals, livestreams. The event happens once;
the buyer needs confidence in logistics, not creative theory.

**Voice:** logistical, precise, calm. Schedules over adjectives.

**Section order**
1. Cover — event name and date, prominent
2. Coverage plan — run-of-show table mapped hour by hour to crew positions
3. Camera positions & coverage map — what each camera is responsible for
4. Deliverables — recap film, speaker sessions, social cutdowns, stream archive
5. Crew on site — role by role, with call times
6. Technical requirements from you — power, feed, mults, internet, rigging
   access, load-in window
7. Turnaround — same-day social cuts vs. final recap
8. Investment — three tiers as coverage depth
9. Contingency — backup recording, redundant audio feeds, crew illness cover
10. Terms — cancellation, weather, date-hold, overtime
11. Next steps
12. Events we've covered

**Distinctives:** the run-of-show table and the "what we need from you"
checklist are the load-bearing sections. Overtime terms stated explicitly —
events always run long. Livestream projects add a redundancy/failover section.

---

## Template C — Commercial / Ad

**For:** TV spots, paid social campaigns, music videos. Higher budgets, agency
or brand-side buyers, real legal scrutiny.

**Voice:** confident, craft-forward, campaign-literate.

**Section order**
1. Cover — cinematic still, campaign name
2. The idea — treatment-style, one page, first person
3. Look & feel — reference frames, palette, lensing, movement notes
4. Deliverables & versioning matrix — every cut, ratio, and duration as a grid
5. **Usage, media & term** — full page, prominent
6. Production plan — days, locations, crew, kit, talent
7. Talent & casting — buyout terms clearly separated from the shoot fee
8. Post-production — edit, grade, VFX, sound design, music
9. Timeline — with client approval gates marked as dependencies
10. Investment — grouped blocks, three tiers, clearly bid-comparable
11. Terms — overages, weather days, approval gates, force majeure
12. Next steps
13. Reel

**Distinctives:** treatment-led opening rather than an executive summary; usage
and talent buyout get dedicated sections; the investment table is formatted to
be comparable line-for-line against competing production bids, because it will
be. Approval gates appear in the timeline as client-side dependencies, so
delays are visibly not the agency's fault.

---

## Shared rendering rules

- Investment always grouped Pre / Production / Post with visible subtotals.
- Revision policy appears in every template, in the same words.
- Payment stages rendered from `estimate.json.payment_schedule` as currency
  amounts. Video uses the global default (50/50) below ~$15k; above that,
  producers commonly split 40% signature / 30% first cut / 30% delivery — if
  they do, the stages must still sum to the total.
- Validity line on the cover.
- `confidence == preliminary` → banner under the cover.
- Any active flag (`sync_license_manual_quote`, `broadcast_usage_manual_review`,
  `shoot_days_estimated`) renders as a visible note in the relevant section —
  never silently swallowed.
