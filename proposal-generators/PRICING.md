# Pricing structure — one page

How every estimate on the site is built. The same seven steps run for all four
services; only the line items underneath differ.

---

## The seven steps

Every quote, every service, in this order:

| # | Step | What it does |
|---|---|---|
| 1 | **Base** | The core job — shooting, crew, studio time, discovery + design |
| 2 | **Add-ons** | Everything else — post-production, extras, build, deliverables |
| 3 | **Volume** | Scale economy on recurring work. Audio series only; 1.0 elsewhere |
| 4 | **Rush** | Charged if the deadline is inside our normal lead time |
| 5 | **Travel** | Only past 40 km. Overnight adds a per-diem |
| 6 | **Licence** | What the client is allowed to do with the work |
| 7 | **Discount** | Returning / bundle / non-profit — one only |

`Base + Add-ons = Subtotal`, then steps 3–7 adjust it, then tax, then total.

---

## Two rules worth knowing

**Rush is charged on production only, not on post.** Post already carries its
own turnaround multiplier when the client picks a faster delivery. Charging
rush on top would bill the same urgency twice. (Web design is the exception —
nothing there has a turnaround multiplier, so rush applies to the whole job.)

**Licence doesn't apply to pass-through costs.** A usage multiplier belongs on
the work we made, not on an album we had printed, a stylist's day, or a session
musician's fee. Those sit outside the licence calculation.

---

## Rush — how late is late

Measured against each service's normal lead time.

| Time left | Uplift |
|---|---|
| Full lead time or more | — |
| 75–99% | +15% |
| 50–74% | +30% |
| 25–49% | +50% |
| Under 25% | +75%, flagged for a human |

Normal lead time: **photography 21 days · videography 35 · web design 70 · audio 21.**

Where a date is fixed by the world — a wedding, an event — we measure from that
date, not from when they'd like the files.

---

## Licence — the biggest lever

Each place the work will appear scores points. More points, wider reach, longer
term, bigger multiplier.

| Points | Where it runs |
|---|---|
| 0 | Internal or personal use only |
| 1 | Website, organic social, email |
| 2 | Print collateral, trade show |
| 3–4 | Paid digital, pre-roll, games/apps, music streaming |
| 5–6 | Packaging, out-of-home, radio |
| 6–7 | Broadcast TV, cinema |
| 8 | Resale / stock — always goes to a human |

Then: **term** × (6 months 0.8 · 1 year 1.0 · 3 years 1.5 · perpetual 2.0–2.2)
and **territory** × (local 1.0 · national 1.3 · worldwide 1.6).

Audio adds an ownership step: full buyout ×1.35, work-for-hire ×1.50.

---

## Discounts

One only, never stacked with each other.

| | |
|---|---|
| Returning client | 10% |
| Multi-service project | 12% |
| Registered non-profit | 15% |

Audio series volume is separate and *does* stack: 4–9 episodes 7% off,
10–19 13%, 20+ 20%. That's a scale economy, not a relationship decision.

---

## What the client sees

Three tiers, always, each saying what actually changes:

- **Good** — 85% of standard, with the trade-offs listed
- **Standard** — exactly as scoped. Recommended
- **Premium** — 130% of standard, with the additions listed

If two or more "I'm not sure" answers are left open, the estimate is marked
**preliminary** and every figure becomes a ±20% band instead of a number.

**Payment:** 50/50 by default. Over $15,000, web design and videography split
40 / 30 / 30 across signature, mid-point and delivery.

---

## What's never auto-quoted

These are pulled out of the total and flagged for a person, because guessing
them would be worse than leaving them out:

- Sync licences for commercially released music
- Talent usage buyouts
- Resale or stock rights
- ERP and custom API integrations
- HIPAA / SOC 2 compliance work
- PRO registration and publishing splits
- Travel beyond 250 km

---

## Rates at a glance

**Photography** — $250/hr, $900 half day, $1,600 full day. Second shooter
$125/hr. Editing $12/image standard, $28 advanced, $65 beauty.

**Videography** — crew $300–$1,400/day by role. Camera $350–$2,200/day.
Editing $95/hr. Grading $120–$550 per finished minute.

**Web design** — strategy $145/hr, design $125, development $135, SEO $120,
project management $110, QA $90.

**Audio** — studio $150/hr, engineer $110/hr. Post splits in two: **dense**
work (film, ads, foley) is priced per finished minute; **speech** (podcasts,
audiobooks, VO) is priced far lower per minute, with mixing and mastering
charged per episode. A 40-minute interview isn't 40 minutes of dense work.

---

## Editing the rates

All rates live in one block at the top of each file:

- `pg-photography.js`
- `pg-videography.js`
- `pg-web-design.js`
- `pg-audio.js`

Change the number there and every formula below picks it up. The seven-step
structure lives in `pg.js` and is shared by all four.

> **These rates are placeholders.** They're structurally sound but the numbers
> are invented. Before the first real proposal goes out, test them against three
> or four past jobs where you know the final invoice.
