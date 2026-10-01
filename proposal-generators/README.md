# Proposal Generators (PGs)

Four specialized proposal generators for the agency. Each PG is a self-contained
spec: an intake form, the internal logic that turns intake answers into a priced
proposal, a set of layout templates, and an automated thank-you email.

## Folder map

| Folder | Generator |
|---|---|
| `_shared/` | Cross-cutting spec inherited by all four PGs |
| `01-photography/` | Photography Proposal Generator |
| `02-videography/` | Videography Proposal Generator |
| `03-web-design/` | Web Design Proposal Generator |
| `04-sound-design/` | Sound Design & Audio Recording Proposal Generator |

## Files inside each generator folder

| File | Contents |
|---|---|
| `00-system-prompt.md` | The LLM system prompt that runs the generator |
| `01-intake-form.md` | Structured questionnaire outline (field IDs, types, validation) |
| `02-proposal-logic.md` | Pricing formulas, section assembly order, rate card |
| `03-templates.md` | The three proposal layout/style templates for the service |
| `04-thank-you-email.md` | Automated follow-up email with `{{variable}}` placeholders |

## How to run one

1. Load `_shared/00-global-spec.md` plus the generator's `00-system-prompt.md`.
2. Run the intake form (`01-intake-form.md`) — one section at a time.
3. Apply `02-proposal-logic.md` to compute the estimate.
4. Render into the chosen template from `03-templates.md`.
5. Emit the thank-you email from `04-thank-you-email.md` as a **draft** for
   human review — never auto-send.

## Rate cards

All rates in the logic files are placeholders written as `RATE_*` constants and
collected at the top of each `02-proposal-logic.md`. Edit those constants in one
place; the formulas below them pick up the change. Currency is set once in
`_shared/00-global-spec.md`.
