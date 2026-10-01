# Proposal Templates — Photography

Three layouts. Same underlying data, different emphasis, order, and voice.

## Recommendation rules

```
shoot_type ∈ {wedding, event_corporate, event_social}          → "Event"
shoot_type ∈ {product, food_beverage, fashion_lookbook,
              brand_lifestyle, editorial, real_estate}          → "Commercial / Product"
shoot_type ∈ {headshots, portrait_family}                       → "Portrait / Headshot"
```
Override: if `usage_points ≥ 4` on a portrait shoot (a brand buying headshots
for advertising), use **Commercial / Product** — the licensing section needs the
prominence that template gives it.

---

## Template A — Event

**For:** weddings, conferences, galas, launches. The client is buying certainty
that a one-time, unrepeatable day will be covered.

**Voice:** warm, reassuring, concrete. Emphasize coverage, contingency, and the
timeline of the day itself.

**Section order**
1. Cover — hero image, couple/company name, event date large
2. "Your day, as we understand it" — the brief, restated
3. Coverage timeline — hour-by-hour table mapped to `coverage_hours`
4. What you'll receive — gallery, image count, album, print options
5. The team on the day — lead, second shooter, assistant
6. Investment — three tiers as coverage packages, not abstract levels
7. Timeline after the day — preview → selects → final delivery
8. Contingency & backup — redundant cards, backup bodies, illness cover
9. Terms — deposit, date-hold, rescheduling, weather
10. Next steps — "Reserve your date"
11. Recent celebrations we've photographed

**Distinctives:** an hour-by-hour coverage table; an explicit date-hold clause;
strongest emphasis on backup and redundancy. Licensing is brief (usually
personal use).

---

## Template B — Commercial / Product

**For:** e-commerce, packaging, campaigns, food, lookbooks, real estate. The
client is buying assets with a defined commercial job.

**Voice:** efficient, specification-led. Numbers and deliverables up front.

**Section order**
1. Cover — clean, brand-forward, project name
2. Objective — the business outcome the images serve
3. Shot list & deliverables — SKU × angles table, total asset count
4. Production plan — studio/location, styling, talent, set, crew
5. Post-production spec — retouch level, formats, colour space, cutouts, naming
6. **Licensing & usage** — full-width, prominent, its own page
7. Investment — three tiers framed as asset volume
8. Timeline — pre-pro → shoot → selects → retouch → delivery
9. Inclusions / exclusions
10. Terms — releases, reshoot policy, approval rounds
11. Relevant commercial work

**Distinctives:** the shot-list matrix is the centrepiece; licensing gets its
own page; file-naming and delivery-spec table included, because production teams
actually need it.

---

## Template C — Portrait / Headshot

**For:** individual and team headshots, personal branding, family portraits.
The client is often nervous about being photographed — reduce friction.

**Voice:** personal, low-pressure, process-explaining.

**Section order**
1. Cover — single strong portrait, first-name greeting
2. "What to expect" — the session walked through step by step
3. Session details — duration, location, looks, subjects
4. How to prepare — wardrobe, grooming, timing (a genuinely useful checklist)
5. What you'll receive — image count, retouch level, formats, usage
6. Investment — three tiers as session sizes
7. Scheduling — proposed dates, booking window
8. Terms — rescheduling, retouch rounds, usage
9. Next steps — "Book your session"
10. Portraits we've made recently

**Distinctives:** the preparation checklist and the walkthrough are the point;
pricing is presented late and softly; per-person pricing table when
`subject_count > 1` (team headshot days).

---

## Shared rendering rules

- Investment table always shows Good / Standard / Premium as columns with a
  bulleted "what changes" list under each, never bare numbers.
- Payment stages rendered from `estimate.json.payment_schedule` as currency
  amounts, not just percentages. Photography uses the global default (50% on
  signature, 50% on delivery) unless a producer overrides it.
- Validity line on every cover: *"This proposal is valid until
  {{valid_until_date}}."*
- If `confidence == preliminary`, a banner sits directly under the cover:
  *"Preliminary estimate — we'll firm this up after a short discovery call."*
- If `include_samples == false`, drop the final section entirely rather than
  leaving an empty heading.
