# Proposal Templates — Web Design

## Recommendation rules

```
site_type ∈ {portfolio, landing_page, blog_publication}         → "Minimalist Portfolio"
site_type ∈ {ecommerce}                                          → "E-Commerce"
site_type ∈ {brochure_marketing, saas_marketing,
             booking_service, membership_gated, web_app}         → "Corporate Site"
```
Overrides: `stakeholder_count > 4` or `total_pages > 40` → **Corporate Site**
regardless of type (procurement scrutiny needs the governance sections).
`product_count > 0` → **E-Commerce** regardless of stated type.

---

## Template A — Minimalist Portfolio

**For:** creatives, studios, photographers, small practices, single-product
launches. Usually one decision-maker, design-literate, budget-sensitive.

**Voice:** direct, confident, uncluttered. The proposal itself should look like
the site you're proposing — if it doesn't, you've lost the argument.

**Section order**
1. Cover — one strong image, project name, nothing else
2. What you're building — three sentences
3. The approach — how the work will feel and function
4. Pages & structure — a simple sitemap diagram
5. Design direction — reference frames, type and colour thinking
6. Build — platform, what you'll be able to edit yourself
7. Timeline — a short list of weeks, not a Gantt chart
8. Investment — three tiers, one table
9. What we need from you
10. Terms — payments, revisions, what's not included
11. Next steps
12. Recent work

**Distinctives:** the shortest of the three — aim for 6–8 pages. Heavy on visual
reference, light on process language. The "what you'll be able to edit yourself"
section matters more than usual here, because these clients maintain their own
sites. No procurement or governance sections.

---

## Template B — E-Commerce

**For:** online stores. The buyer is thinking about revenue per visitor and
about who fixes it at 2am when checkout breaks.

**Voice:** commercially fluent, operationally serious.

**Section order**
1. Cover — project name, platform badge
2. Commercial objective — what the store needs to do, in revenue terms
3. Store architecture — catalogue structure, categories, filtering, search
4. **Product & catalogue plan** — product count, variant model, data source,
   who enters what
5. Customer journey — landing → browse → PDP → cart → checkout → post-purchase
6. Payments, shipping & tax — a table per area, decisions stated explicitly
7. Integrations — one row each: system, what it does, who owns credentials,
   risk note
8. Design — templates, PDP and cart treatment, mobile-first notes
9. Build & platform — CMS/platform rationale, apps and their monthly costs
10. Content & migration — products, imagery, copy, redirects
11. SEO & analytics — technical SEO, e-commerce tracking, conversion events
12. Launch plan — soft launch, test orders, cutover, rollback
13. Timeline
14. Investment — phase-grouped, plus a **separate table of ongoing monthly
    costs** (platform, apps, gateways)
15. Aftercare — warranty, retainer options, incident response
16. Terms
17. Next steps
18. Store work we've shipped

**Distinctives:** the ongoing-costs table is mandatory and separate — the
number one e-commerce client complaint is discovering the monthly stack cost
after signing. Payments/shipping/tax get explicit decision tables because each
is a scope fork. Launch section includes rollback, which wins trust.

---

## Template C — Corporate Site

**For:** established organisations, multi-stakeholder approval, procurement.
This proposal will be read by people who did not attend any meeting.

**Voice:** thorough, governed, unambiguous. Assume it will be compared
side-by-side against two other bids by someone counting deliverables.

**Section order**
1. Cover + one-page executive summary (extractable)
2. Understanding of your objectives
3. Scope of work — numbered, itemised, unambiguous
4. Information architecture — full sitemap, template inventory
5. Design process — rounds, deliverables, approval gates per round
6. Technical approach — CMS, hosting, environments, version control, browsers
7. Accessibility — target conformance, testing method, what is and isn't covered
8. Security & compliance — data handling, consent, relevant regulations
9. Integrations — system, purpose, owner, dependency, risk
10. Content strategy & migration — inventory, who writes what, migration method
11. SEO, analytics & performance — including the ranking-honesty clause
12. QA & testing — device matrix, test plan, acceptance criteria
13. Governance — RACI, named contacts, meeting cadence, escalation path
14. Timeline — Gantt with client approval gates as explicit dependencies
15. Investment — phase-grouped with hours, three tiers
16. Payment schedule — 40 / 30 / 30
17. Post-launch support & retainer options (priced separately)
18. Assumptions, dependencies & exclusions — its own numbered section
19. Terms & conditions
20. Next steps
21. Case studies with measurable outcomes
22. Team bios

**Distinctives:** the governance and assumptions sections are the point. The
assumptions/dependencies/exclusions list is numbered so it can be referenced by
number in a later change order — that is what stops scope disputes. Acceptance
criteria are stated, so "done" is defined before work starts.

---

## Shared rendering rules

- Every template groups investment by phase and shows hours.
- Every template includes "What we need from you" with dated obligations.
- Every template includes the content-dependency clause and the SEO-honesty
  clause, in the same words.
- Retainer and ongoing third-party costs always appear outside the project
  total.
- `confidence == preliminary` → banner under the cover.
- Active flags (`templates_estimated`, `custom_api_scope_review`,
  `deadline_feasibility_review`, `regulated_compliance_manual_review`, …)
  render as visible notes in their relevant sections.
