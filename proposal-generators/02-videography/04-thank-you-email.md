# Automated Thank-You Email — Videography

Draft only. Never auto-sent.

## Variables

| Placeholder | Source |
|---|---|
| `{{client_name}}` | first name |
| `{{client_company}}` | `client_company` |
| `{{project_name}}` | `project_name` |
| `{{video_type_label}}` | human label for `video_type` |
| `{{runtime_label}}` | e.g. "90-second" / "12-minute" |
| `{{deliverable_summary}}` | e.g. "1 main film + 3 social cutdowns in 2 ratios" |
| `{{shoot_summary}}` | e.g. "2 shoot days, 4-person crew, 1 location" |
| `{{shoot_dates}}` | `shoot_dates` |
| `{{post_summary}}` | e.g. "full grade, motion graphics, full sound mix" |
| `{{revision_rounds}}` | `revision_rounds` |
| `{{turnaround_label}}` | "4 weeks" / "2 weeks" / "5 days" |
| `{{estimate_range}}` | `${good:,} – ${premium:,}` |
| `{{distribution_label}}` | selected `distribution` channels, prose-joined — e.g. "broadcast TV and cinema"; used only in the broadcast conditional |
| `{{proposal_link}}` | hosted URL or "attached" |
| `{{producer_name}}` | assigned producer |
| `{{calendar_link}}` | discovery-call booking link |
| `{{agency_name}}` `{{agency_phone}}` `{{agency_site}}` | constants |

---

## Subject line

Primary: `{{project_name}} — video proposal from {{agency_name}}`

Variants: corporate → `Your {{runtime_label}} {{video_type_label}} — proposal
inside`; event → `Coverage plan for {{project_name}}`; commercial →
`{{client_company}} campaign — production proposal & estimate`.

---

## Body

```
Hi {{client_name}},

Thanks for the detail on {{project_name}} — that's more than most briefs
give us, and it makes for a much more honest estimate.

Here's the shape of it:

  • The film      {{runtime_label}} {{video_type_label}}
  • Deliverables  {{deliverable_summary}}
  • Production    {{shoot_summary}}, {{shoot_dates}}
  • Post          {{post_summary}}, {{revision_rounds}} rounds of revisions
  • Delivery      {{turnaround_label}} after the final shoot day
  • Estimate      {{estimate_range}}

Full proposal: {{proposal_link}}

Two things worth saying up front. The estimate is broken into
pre-production, production, and post so you can see where the money
actually goes — post is usually about half of a video budget, and a
proposal that hides that is a proposal that runs over. And the timeline
works backwards from your target date, with your approval points marked;
those are the things most likely to move a delivery date, so they're
visible rather than buried.

If you'd rather talk it through than read it, here's my calendar:
{{calendar_link}}

I'll check in in a couple of days either way.

{{producer_name}}
{{agency_name}}
{{agency_phone}} · {{agency_site}}
```

---

## Conditional blocks

**Preliminary estimate** (`confidence == preliminary`)
```
A few details were still open, so this is a range rather than a fixed
figure. A short call would let us tighten it — usually by narrowing the
top end rather than raising the bottom.
```

**Shoot days estimated** (`shoot_days_estimated`)
```
You weren't sure how many shoot days this needs, so we've proposed what
we think is right for the runtime and scope. That's the number I'd most
like your reaction to — it moves the total more than anything else here.
```

**Rush timeline** (`rush_multiplier > 1.15`)
```
Your target date is inside our standard lead time, so the estimate carries
an expedited fee covering the crew and post scheduling that requires. If
the date can move even a week or two, I'll happily re-quote.
```

**Commercial music requested** (`sync_license_manual_quote`)
```
On the music: you've mentioned a commercially released track. Sync
licensing for those is quoted by the rights holders and varies enormously,
so I've deliberately left it out of the estimate rather than guess. Tell
me the track and I'll get you a real number — and I'll bring a couple of
library alternatives that get close for a fraction of it.
```

**Broadcast / cinema / talent buyout** (`broadcast_usage_manual_review`)
```
Because this runs on {{distribution_label}}, talent buyouts and usage
terms need to be set properly rather than estimated. Those sit outside the
production figure above; I'll bring you a specific number once we know the
term and territory you need.
```

**Drone included**
```
The aerial work is in the estimate, flown by a licensed pilot. Worth
knowing that airspace clearance isn't guaranteed anywhere — if we can't
get it for your location, that line comes out and is credited back.
```

---

## Tone rules
- Under 250 words before conditional blocks (video briefs justify slightly more
  than photo).
- Lead with the deliverable, not the price.
- Never a single firm total — always the range plus the link.
- Never promise crew, location, talent, or airspace availability.
- Signed by a named producer.
