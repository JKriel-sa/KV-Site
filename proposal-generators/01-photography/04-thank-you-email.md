# Automated Thank-You Email — Photography

Generated on intake submission, **as a draft for human review**. Never sent
automatically.

## Variables

| Placeholder | Source |
|---|---|
| `{{client_name}}` | `client_name` — first name only |
| `{{client_company}}` | `client_company` |
| `{{project_name}}` | `project_name` |
| `{{shoot_type_label}}` | human label for `shoot_type` |
| `{{shoot_date_phrase}}` | `event_date` formatted, or `preferred_shoot_dates` |
| `{{coverage_summary}}` | e.g. "8 hours of coverage across 2 locations" |
| `{{image_count}}` | `final_image_count` |
| `{{turnaround_label}}` | "3 weeks" / "10 days" / "72 hours" |
| `{{estimate_range}}` | `${good:,} – ${premium:,}` |
| `{{valid_until_date}}` | today + `PROPOSAL_VALID_DAYS` |
| `{{proposal_link}}` | hosted proposal URL, or "attached" |
| `{{producer_name}}` | assigned producer |
| `{{agency_name}}` `{{agency_phone}}` `{{agency_site}}` | agency constants |
| `{{calendar_link}}` | booking link for the discovery call |

---

## Subject line

Primary: `Your {{shoot_type_label}} proposal — {{project_name}}`

Variants: event → `{{project_name}} — coverage proposal for {{shoot_date_phrase}}`;
commercial → `{{client_company}} × {{agency_name}} — photography proposal`;
portrait → `Your session details, {{client_name}}`.

---

## Body

```
Hi {{client_name}},

Thanks for sending through the details for {{project_name}} — it sounds
like a great one, and we'd love to shoot it.

Here's what we've got so far:

  • Shoot        {{shoot_type_label}}, {{shoot_date_phrase}}
  • Coverage     {{coverage_summary}}
  • Delivery     {{image_count}} final edited images, {{turnaround_label}}
                 after the shoot
  • Estimate     {{estimate_range}}

Your full proposal is here: {{proposal_link}}

A couple of notes. The estimate covers the scope exactly as you described
it — if anything shifts, tell us and we'll re-quote rather than surprise
you later. And we'll confirm calendar availability for
{{shoot_date_phrase}} within one business day; nothing is held until we
do.

If it's easier to talk it through, grab any slot that works:
{{calendar_link}}

Either way, I'll follow up in the next day or two.

{{producer_name}}
{{agency_name}}
{{agency_phone}} · {{agency_site}}
```

---

## Conditional blocks

Insert immediately before the sign-off when the condition holds.

**Preliminary estimate** (`confidence == preliminary`)
```
One thing worth flagging: a few details were still open, so treat this as
a preliminary range. A ten-minute call usually tightens it considerably.
```

**Rush timeline** (`rush_multiplier > 1.15`)
```
Your timeline is tighter than our standard lead time, so the estimate
includes an expedited production fee. If the date has any flex at all,
moving it out even a week would bring the cost down.
```

**Broad or perpetual licensing flagged**
```
You've asked for fairly broad usage rights, which we're glad to arrange —
those are priced separately from the shoot itself, and I'd like to walk
you through the options rather than guess. It's a five-minute
conversation.
```

**RAW files requested**
```
On the RAW files: we deliver finished, colour-corrected images rather than
raw captures, since the edit is a real part of the work. If your team has
a specific workflow reason for needing them, let's talk — there are
usually good ways to solve for it.
```

**Second shooter auto-added**
```
We've included a second photographer. For a shoot this size that's not an
upsell — one camera genuinely cannot be in two places, and the moments you
listed are spread across the day.
```

---

## Tone rules
- Under 200 words before conditional blocks.
- Plain text renders correctly; HTML version keeps the same line breaks.
- No exclamation marks beyond the first line, if at all.
- Never state the estimate as a single firm number in the email — always the
  range, always with the proposal link alongside it.
- Signed by a named human, never by "the team" or the generator.
