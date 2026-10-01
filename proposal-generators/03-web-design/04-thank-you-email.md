# Automated Thank-You Email — Web Design

Draft only. Never auto-sent.

## Variables

| Placeholder | Source |
|---|---|
| `{{client_name}}` | first name |
| `{{client_company}}` | `client_company` |
| `{{project_name}}` | `project_name` |
| `{{site_type_label}}` | human label for `site_type` |
| `{{scope_summary}}` | e.g. "a 24-page site built from 7 unique templates" |
| `{{unique_templates}}` | `unique_templates`, after the §2 estimate fallback; used in the templates-estimated conditional |
| `{{integration_name}}` | the specific flagged integration (ERP, custom API); used in the integration conditional |
| `{{cms_label}}` | chosen or recommended CMS |
| `{{integration_summary}}` | named integrations, or "no third-party integrations" |
| `{{content_owner_phrase}}` | "you're writing the copy" / "we're writing the copy" |
| `{{timeline_weeks}}` | computed total weeks |
| `{{target_launch}}` | `target_completion_date` |
| `{{estimate_range}}` | `${good:,} – ${premium:,}` |
| `{{monthly_costs_note}}` | ongoing platform/app costs, e-commerce only |
| `{{proposal_link}}` | hosted URL or "attached" |
| `{{producer_name}}` | assigned producer |
| `{{calendar_link}}` | discovery-call link |
| `{{agency_name}}` `{{agency_phone}}` `{{agency_site}}` | constants |

---

## Subject line

Primary: `{{project_name}} — website proposal & estimate`

Variants: portfolio → `Your new site — proposal inside, {{client_name}}`;
e-commerce → `{{client_company}} store build — scope, timeline & costs`;
corporate → `{{client_company}} website — proposal, timeline and estimate`.

---

## Body

```
Hi {{client_name}},

Thanks for working through all of that — website briefs ask a lot of
questions, and the detail you gave means the estimate below is a real one
rather than a guess.

Here's what we've scoped:

  • Site         {{site_type_label}} — {{scope_summary}}
  • Platform     {{cms_label}}
  • Integrations {{integration_summary}}
  • Content      {{content_owner_phrase}}
  • Timeline     roughly {{timeline_weeks}} weeks, targeting {{target_launch}}
  • Estimate     {{estimate_range}}

Full proposal: {{proposal_link}}

One honest note before you read it. Web projects almost never slip because
of design or code — they slip because content arrives late. The timeline
above assumes copy and imagery reach us on the dates set out in the
proposal, and there's a section listing exactly what we need from you and
when. If those dates look unrealistic, tell me now and we'll build the
plan around the truth instead of around optimism.

Happy to walk through any of it: {{calendar_link}}

I'll follow up in a couple of days.

{{producer_name}}
{{agency_name}}
{{agency_phone}} · {{agency_site}}
```

---

## Conditional blocks

**Preliminary estimate** (`confidence == preliminary`)
```
Some of the scope was still open, so treat this as a range. The two
numbers that move it most are how many distinct page layouts you need and
how many systems we're integrating with — worth twenty minutes on a call.
```

**Templates estimated** (`templates_estimated`)
```
You weren't sure how many distinct page layouts the site needs, so we've
estimated {{unique_templates}}. That's the single biggest lever on the
price — a 30-page site built from 6 layouts costs far less than a 12-page
site where every page is bespoke. Worth pinning down early.
```

**E-commerce** (`site_type == ecommerce`)
```
Two things specific to running a store. First, the ongoing costs — platform
subscription, apps, payment processing — sit outside the build figure, and
they're listed separately in the proposal so nothing surprises you in month
one: {{monthly_costs_note}}. Second, we'll do test orders and a soft launch
before cutover, with a rollback plan. Checkout is not something to find out
about in production.
```

**Client writing all copy** (`copywriting == client_provides_all`)
```
You've said your team will write the copy. That's completely workable, and
it's the cheapest option — but it's also where most projects stall. If it
starts to drag, say so early; we can pick up part of it mid-project far
more easily than we can rescue a launch date.
```

**Hard deadline at risk** (`deadline_feasibility_review`)
```
Your date is fixed and it's tighter than the scope comfortably allows.
Rather than quietly hope, the proposal names which pieces I'd move to a
phase two so the launch date holds. I'd like your view on whether that
split is the right one.
```

**Migration from an unknown platform** (`current_platform == unknown` or
`project_nature == migration_only`)
```
On the migration: until we've looked inside the existing site, any number
for moving content is an educated guess. The proposal quotes a short paid
audit first — it's a few hundred dollars that routinely saves several
thousand in surprises.
```

**Custom API / ERP integration flagged**
```
The {{integration_name}} integration is the one genuine unknown here. It
depends on their API, their sandbox, and their documentation, none of which
we control. I've quoted a realistic figure but I'd want a short technical
call before either of us treats it as fixed.
```

**Needs branding first** (`brand_assets == none_need_branding`)
```
You've mentioned there's no brand identity yet. That's a separate piece of
work and genuinely should come first — designing a site around a logo
that's about to change is money spent twice. Happy to scope the identity
alongside this.
```

---

## Tone rules
- Under 260 words before conditional blocks.
- Always name the content dependency in the main body — not buried in a
  conditional. It is the most useful sentence in the email.
- Never a single firm total.
- Never promise rankings, traffic, or conversion outcomes.
- Signed by a named producer.
