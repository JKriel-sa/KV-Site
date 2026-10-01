# Global Spec — inherited by all four Proposal Generators

Load this file first. Everything here applies to every PG unless the
service-specific spec explicitly overrides it.

---

## 1. Agency constants

```
AGENCY_NAME        = "{{agency_name}}"
AGENCY_EMAIL       = "{{agency_email}}"
AGENCY_PHONE       = "{{agency_phone}}"
AGENCY_SITE        = "{{agency_site}}"
CURRENCY           = "USD"           # symbol: $
TAX_RATE           = 0.00            # set per jurisdiction
PROPOSAL_VALID_DAYS = 30
DEPOSIT_PCT        = 0.50            # due on signature
```

---

## 2. The four required modules

Every PG implements these in order.

**Module 1 — Client Intake.** Identity and logistics. Identical field set
across all four PGs so records stay comparable in the CRM.

**Module 2 — Scoping & Calculation Inputs.** Service-specific. Every field must
either (a) feed a formula, (b) change which template is recommended, or (c)
appear verbatim in the proposal's scope section. A field that does none of those
three does not belong on the form.

**Module 3 — Template Options.** Three curated layouts per service. The
generator recommends one based on intake answers and lets the user override.

**Module 4 — Thank-You Email Draft.** Produced immediately on submission,
presented as an editable draft.

---

## 3. Universal client intake block (Module 1)

| Field ID | Label | Type | Required | Validation |
|---|---|---|---|---|
| `client_name` | Contact full name | text | ✅ | 2–80 chars |
| `client_company` | Company / organization | text | ➖ | blank ⇒ treat as individual |
| `client_email` | Email | email | ✅ | RFC-valid |
| `client_phone` | Phone | tel | ✅ | E.164 preferred |
| `client_role` | Role / title | text | ➖ | — |
| `project_name` | Project name | text | ✅ | 2–100 chars |
| `project_summary` | One-paragraph description | textarea | ✅ | 20–800 chars |
| `target_completion_date` | Target completion date | date | ✅ | must be ≥ today |
| `budget_range` | Budget range | select | ➖ | see banding below |
| `referral_source` | How did you hear about us? | select | ➖ | Referral / Search / Social / Past client / Other |
| `decision_timeline` | When do you need to decide? | select | ➖ | This week / 2–4 weeks / 1–3 months / Exploring |

**Budget bands (shared enum):** `under_2k`, `2k_5k`, `5k_15k`, `15k_40k`,
`40k_100k`, `over_100k`, `not_sure`.

---

## 4. Universal pricing skeleton

Every PG's `02-proposal-logic.md` resolves to this same shape:

```
BASE          = service-specific base package
ADD_ONS       = Σ (line-item qty × line-item rate)
SUBTOTAL      = BASE + ADD_ONS
VOLUME_ADJ    = SUBTOTAL × (volume_factor − 1)         # ≤ 0; recurring work only
RUSH_FEE      = rushable_base × rush_multiplier_delta   # see §5
TRAVEL        = travel/logistics costs                  # see §6
LICENSE_FEE   = licensable_base × (license_multiplier − 1)
DISCOUNT      = SUBTOTAL × discount_pct                 # see §7
PRE_TAX       = SUBTOTAL + VOLUME_ADJ + RUSH_FEE + TRAVEL + LICENSE_FEE − DISCOUNT
TAX           = PRE_TAX × TAX_RATE
TOTAL         = PRE_TAX + TAX
```

**`licensable_base`** defaults to `SUBTOTAL`. A service may narrow it — and must
say so in its own logic file — where parts of the subtotal are pass-through
costs that no licence attaches to (printed albums, session musicians, product
data entry). Never widen it beyond `SUBTOTAL`.

**`rushable_base`** defaults to `SUBTOTAL`, **minus any component that already
carries a turnaround multiplier.** Photography, videography, and audio all apply
a `TURNAROUND_MULT` to post-production. Charging rush on that same amount bills
the client twice for one compressed schedule. In those three services
`rushable_base = BASE` (production only).

**`volume_factor`** defaults to `1.0`. Only recurring or multi-unit work sets it
(audio series, multi-video packages). It is a scale economy, not a discount —
`DISCOUNT` in §7 still applies on top, and both may run together.

### Payment schedule
```
DEPOSIT = TOTAL × DEPOSIT_PCT
BALANCE = TOTAL − DEPOSIT
```
Services with long delivery cycles override this with a milestone schedule (web
design uses 40 / 30 / 30). Whatever the shape, it is emitted as
`payment_schedule` in `estimate.json` — see §10 — and the stages must sum to
`TOTAL`.

### The two independent axes

Do not conflate these. They answer different questions.

**Scope tiers** — *what could you buy?* Always presented:
```
Good     = TOTAL × 0.85     (reduced scope — trade-offs stated explicitly)
Standard = TOTAL            (exactly as scoped — recommended)
Premium  = TOTAL × 1.30     (expanded scope — additions stated explicitly)
```
Each tier names what actually changes. A tier that is only a smaller number,
with no stated change in deliverables, is dishonest — do not render one.

**Confidence band** — *how sure are we?* Applied only when triggered:
```
firm         → each tier shown as a single figure
preliminary  → each tier shown as a band of ±20% around its own figure
```

### Confidence rule
If ≥ 3 scoping fields are `not_sure` / blank, set `confidence = preliminary`,
label the estimate **"Preliminary — subject to discovery call"**, and render
every tier as a ±20% band. The Standard tier therefore reads
`TOTAL × 0.80 – TOTAL × 1.20`. Scope tiers and the confidence band multiply;
they never replace each other.

---

## 5. Rush multiplier (shared)

```
lead_ratio = (target_completion_date − today) / STANDARD_LEAD_DAYS
rush_multiplier_delta = rush_multiplier − 1
```

| `lead_ratio` | `rush_multiplier` | Delta applied |
|---|---|---|
| ≥ 1.00 | 1.00 | 0% |
| 0.75 – < 1.00 | 1.15 | +15% |
| 0.50 – < 0.75 | 1.30 | +30% |
| 0.25 – < 0.50 | 1.50 | +50% |
| < 0.25 | 1.75 | +75%, flag `"lead_time_infeasible"` |

Bands are half-open so no ratio falls between them. A service whose delivery
date is fixed by an external event (a wedding, a conference, a picture-lock
date) computes `lead_ratio` from that date, not from
`target_completion_date` — each service's logic file says which it uses.

Applied to `rushable_base`, not to `SUBTOTAL` — see §4.

---

## 6. Travel & logistics (shared)

Applies only to services with on-site production. Web design sets
`TRAVEL = 0` unless an on-site workshop is scoped.

Every such service defines `production_days` and `crew_size` as integers in its
own normalisation step, because the field names differ per service (photography
derives days from session hours, audio from session count). This block uses
those two names.

```
TRAVEL = 0
         if travel_distance_km ≤ 40

       = (travel_distance_km − 40) × RATE_MILEAGE × 2 × production_days
         if 40 < travel_distance_km ≤ 250

       = the above, plus LODGING, plus flag "travel_manual_review"
         if travel_distance_km > 250 or overnight_required
```

```
nights  = overnight_required ? max(1, production_days − 1) : 0
LODGING = RATE_PER_DIEM × crew_size × nights
```

`nights` is derived, never asked. Beyond 250 km the computed figure is an
interim placeholder only — the flag routes it to a human for a real quote before
the proposal is sent.

---

## 7. Discounts (shared, apply at most one)

| Condition | `discount_pct` |
|---|---|
| Returning client (2+ prior projects) | 0.10 |
| Multi-service bundle (2+ PGs in one project) | 0.12 |
| Registered non-profit | 0.15 |
| Retainer commitment ≥ 6 months | 0.20 |

---

## 8. Universal proposal section order

1. Cover — project name, client, agency, date, validity date
2. Executive summary — 3–5 sentences, restates the client's goal in their words
3. Understanding of the brief — bullets drawn from `project_summary`
4. Scope of work — service-specific deliverables, itemized
5. Approach & process — phased, with the service's standard phase names
6. Timeline — milestones anchored to `target_completion_date`
7. Investment — the three-tier table, deposit and balance called out
8. What's included / explicitly not included
9. Terms — payment schedule, revision policy, cancellation, licensing
10. Next steps — single clear call to action
11. About the agency + relevant work samples

---

## 9. Tone and writing rules

- Second person ("you", "your team"). Never "the client" in body copy.
- No jargon the client did not use first.
- Every deliverable is a countable noun with a number attached.
- State exclusions plainly; unstated exclusions become disputes.
- Never invent past work, awards, or client names for the samples section —
  pull only from the agency's supplied portfolio list, or leave a
  `[INSERT RELEVANT SAMPLES]` marker.
- Never state a firm total when the confidence rule (§4) triggered.

---

## 10. Output contract

The generator returns three artifacts:

1. `proposal.md` — the rendered proposal
2. `estimate.json` — every computed line item, so pricing is auditable
3. `thank-you-email.md` — the draft follow-up

`estimate.json` shape:

```json
{
  "project_name": "", "client": "", "generated_at": "", "currency": "USD",
  "service": "photography | videography | web_design | audio",
  "template_used": "", "confidence": "firm | preliminary",

  "line_items": [
    {"phase": "", "label": "", "qty": 0, "unit": "", "rate": 0, "amount": 0}
  ],

  "base": 0, "add_ons": 0, "subtotal": 0,
  "volume_factor": 1.0, "volume_adj": 0,
  "rushable_base": 0, "rush_multiplier": 1.0, "rush_fee": 0,
  "travel": 0, "lodging": 0,
  "licensable_base": 0, "license_multiplier": 1.0, "license_fee": 0,
  "discount_reason": null, "discount_pct": 0, "discount": 0,
  "pre_tax": 0, "tax_rate": 0, "tax": 0, "total": 0,

  "tiers": {
    "good":     {"amount": 0, "band_low": 0, "band_high": 0, "changes": []},
    "standard": {"amount": 0, "band_low": 0, "band_high": 0, "changes": []},
    "premium":  {"amount": 0, "band_low": 0, "band_high": 0, "changes": []}
  },

  "payment_schedule": [
    {"milestone": "On signature", "pct": 0.5, "amount": 0}
  ],

  "recurring": {
    "applies": false, "unit": "episode | month",
    "unit_rate": 0, "unit_count": 0, "monthly": 0,
    "min_term_months": null, "notice_period_days": null
  },

  "deferred_items": [
    {"label": "", "reason": "manual quote required", "included_in_total": false}
  ],

  "flags": []
}
```

Three rules on this object:

- `line_items` carries a `phase` so the investment table can be grouped without
  re-deriving it — every service groups its table by phase.
- `payment_schedule` stages must sum to `total`. It replaces the flat
  deposit/balance pair, which could not express a milestone schedule.
- `deferred_items` holds everything a flag pulled out of the total — talent
  buyouts, sync licences, manual travel quotes. `included_in_total` is always
  `false` there. This is what stops a to-be-confirmed cost silently reading as
  zero.

---

## 11. Interaction rules for the intake

- Ask **one section at a time**, never the whole form at once.
- Show progress as `Section {n} of {N}`, where `N` is that service's own section
  count (photography 3, videography 4, web design 6, audio 4).
- Accept "not sure" on any scoping field; record it and let §4 widen the range.
- Echo a plain-language summary of the scope back before computing, and get a
  confirmation.
- Never ask for payment details, card numbers, or account credentials. Payment
  is arranged separately by a human.
- Emit the thank-you email as a draft. Do not send it.
