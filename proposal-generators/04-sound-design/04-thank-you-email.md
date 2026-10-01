# Automated Thank-You Email — Sound Design & Audio

Draft only. Never auto-sent.

## Variables

| Placeholder | Source |
|---|---|
| `{{client_name}}` | first name |
| `{{client_company}}` | `client_company` |
| `{{project_name}}` | `project_name` |
| `{{project_type_label}}` | human label for `audio_project_type` |
| `{{runtime_summary}}` | e.g. "10 episodes, ~35 minutes each" |
| `{{recording_summary}}` | e.g. "6 studio hours with an engineer" or "you record, we finish" |
| `{{post_summary}}` | e.g. "full dialogue edit, stereo mix, mastered to −16 LUFS" |
| `{{loudness_target_label}}` | resolved loudness standard |
| `{{per_episode_rate}}` | `PER_EPISODE` from logic §6; series only |
| `{{episode_count}}` | `episode_count`; series only |
| `{{estimate_range}}` | `${good:,} – ${premium:,}` |
| `{{turnaround_label}}` | "2 weeks" / "1 week" / "48 hours" |
| `{{revision_rounds}}` | `revision_rounds` |
| `{{proposal_link}}` | hosted URL or "attached" |
| `{{producer_name}}` | assigned studio producer |
| `{{calendar_link}}` | booking link |
| `{{agency_name}}` `{{agency_phone}}` `{{agency_site}}` | constants |

---

## Subject line

Primary: `{{project_name}} — audio proposal & estimate`

Variants: podcast → `{{project_name}} — production plan and per-episode rate`;
commercial → `{{client_company}} — sound design proposal`;
scoring → `{{project_name}} — score proposal and cue breakdown`.

---

## Body

```
Hi {{client_name}},

Thanks for the detail on {{project_name}} — good briefs make for honest
estimates, and yours was one.

Here's the shape of it:

  • Project    {{project_type_label}} — {{runtime_summary}}
  • Recording  {{recording_summary}}
  • Post       {{post_summary}}
  • Delivery   {{turnaround_label}}, {{revision_rounds}} rounds of revisions,
               mastered to {{loudness_target_label}}
  • Estimate   {{estimate_range}}

Full proposal: {{proposal_link}}

One thing the proposal makes deliberately visible: recording time and
finishing time are priced separately, in different units — hours for the
room, finished minutes for the edit and mix. They're genuinely different
work, and a two-hour session almost never means two hours of work. Better
you see that structure now than wonder about it on the invoice.

If you'd like to hear how we'd approach it before deciding, I'm happy to
do a short sample pass on a few minutes of your material:
{{calendar_link}}

I'll follow up in a day or two.

{{producer_name}}
{{agency_name}}
{{agency_phone}} · {{agency_site}}
```

---

## Conditional blocks

**Series / podcast** (`episode_count > 1`)
```
Because this is a series, the headline number is the per-episode rate:
{{per_episode_rate}} per episode at {{episode_count}} episodes. Longer
commitments bring that down — the proposal shows where the breakpoints
are, so you can see what committing to a full season actually saves.
```

**Preliminary estimate** (`confidence == preliminary`)
```
A few details were still open, so this is a range. The one that moves it
most is how much editing the material actually needs — which is usually
settled fastest by us hearing a few minutes of it.
```

**Studio hours estimated** (`studio_hours_estimated`)
```
You weren't sure how much studio time you'd need, so we've estimated it
from the runtime. Talk records close to real time; music and scoring don't.
Worth a quick conversation before we book the room.
```

**Poor source material** (`source_quality_risk`)
```
You mentioned the existing recordings aren't in great shape. We can do a
lot with difficult audio, but not everything, and I'd rather show you than
promise. Send us two or three minutes of the worst of it and we'll do a
test pass — then you'll know exactly what you're buying before committing
to the full restoration.
```

**Commercial music requested** (`sync_license_manual_quote`)
```
On the commercial track: sync licensing is quoted by the rights holders
and can range from manageable to eye-watering, so I've left it out of the
estimate rather than invent a figure. Tell me the track and I'll chase a
real number — and bring a couple of alternatives that get you most of the
way for a fraction of it.
```

**Talent buyout** (`talent_buyout_manual_quote`)
```
Voice talent has two separate costs: the session, which is in the estimate,
and the usage buyout, which isn't. Buyouts depend on where the audio runs
and for how long, so I've kept it as a separate line to confirm rather than
bury it in the total.
```

**Original composition / publishing** (`publishing_rights_manual_review` or
`rights_ownership == work_for_hire` with original music)
```
Since we're writing original music, there's an ownership question worth
settling early: whether you're licensing the music, buying it outright, or
commissioning it as work-for-hire. They price differently and they mean
genuinely different things down the line. The proposal lays out the three
options; a short call usually settles which one you actually need.
```

**Rush turnaround** (`rush_multiplier > 1.15`)
```
Your timeline is inside our standard lead time, so the estimate includes an
expedited fee for the studio and post scheduling that takes. If the date
has any give, I'll happily re-quote.
```

---

## Tone rules
- Under 240 words before conditional blocks.
- The recording-vs-post explanation stays in the main body for every project
  type. It is the single most useful paragraph in this email and prevents the
  most common pricing objection in audio work.
- Never a single firm total.
- Never promise that damaged source audio can be rescued — offer the test pass
  instead.
- Signed by a named studio producer.
