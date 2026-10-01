#!/usr/bin/env python3
"""Generate the four service holding pages.

They're temporary stubs, so they're generated rather than hand-written —
four copies of the same markup would drift the moment one gets edited.
Re-run after changing the template:  python3 make-pages.py

Each page carries its service's proposal generator below the holding notice.
The generator's UI is built by pg.js at runtime, but the *form* it submits is
written into the static HTML here — Netlify detects forms by parsing the
deployed HTML at deploy time, so a form injected by script would never be
registered and every submission would 404. Hence the fixed field list below:
those names are what Netlify stores, and the variable part of a 40-field
intake travels inside `summary`.
"""

import os

SERVICES = [
    # slug, accent key, number, kind, title, pg-config file
    ("photography", "photography", "01", "Stills",  "Photography", "pg-photography.js"),
    ("videography", "videography", "02", "Motion",  "Videography", "pg-videography.js"),
    ("web-design",  "web",         "03", "Digital", "Web Design",  "pg-web-design.js"),
    ("audio",       "audio",       "04", "Sound",   "Audio",       "pg-audio.js"),
]

# What the generator invites you to do, per service. Kept here rather than in
# the JS config so the page reads sensibly with scripting off.
PITCH = {
    "photography": ("Price a shoot",
                    "Answer a few questions about the shoot — what, how long, how "
                    "many images, and where they'll be used — and you'll get a "
                    "costed estimate in about three minutes."),
    "videography": ("Price a video",
                    "Tell us what you're making, how it's shot and what happens in "
                    "post, and you'll get an estimate broken into pre-production, "
                    "production and post — so you can see where the money goes."),
    "web-design":  ("Price a website",
                    "Walk through scope, platform, integrations and content, and "
                    "you'll get an estimate costed by phase, with the assumptions "
                    "and dependencies stated rather than buried."),
    "audio":       ("Price an audio project",
                    "Tell us what you're making and what state it's in, and you'll "
                    "get an estimate that keeps studio time and finishing time "
                    "separate — because they're different work."),
}

# Three worked examples per service, shown under the generator. Every figure
# was computed by the live generator, not estimated by hand — see
# proposal-generators/EXAMPLES.md. They are static markup rather than rendered
# by pg.js so they are on screen the moment the page paints, and still there
# with scripting off.
EXAMPLES = {
    "photography": [
        ("Team headshots", "$1,274",
         ["Half a day at your office", "15 finished images, standard retouch",
          "Website and LinkedIn, three years"]),
        ("A wedding", "$7,122",
         ["12 hours, several locations", "Second photographer",
          "150 images and a 20-page album"]),
        ("A product lookbook", "$11,032",
         ["A studio day with models and a stylist",
          "80 images, advanced retouch, cutouts",
          "Paid advertising, national, one year"]),
    ],
    "videography": [
        ("A testimonial", "$4,017",
         ["5 hours at your office", "Two to three minutes finished",
          "Simple edit, library music, subtitles"]),
        ("A brand film", "$12,969",
         ["One full day on location", "Gimbal and full lighting",
          "Polished grade, two social cutdowns"]),
        ("A two-day commercial", "$41,976",
         ["Aerials, second camera, a presenter", "Two 30-second films",
          "Cinematic grade and original music"]),
    ],
    "web-design": [
        ("A one-page site", "$10,206",
         ["Single landing page in Webflow", "You write the copy",
          "Basic SEO and analytics"]),
        ("A brochure site", "$58,407",
         ["14 pages from 7 layouts, WordPress", "Blog, search, WCAG 2.2 AA",
          "Three integrations, we polish your copy"]),
        ("An online store", "$39,968",
         ["Shopify, 60 products", "We write the copy",
          "Payments, mailing list, reviews"]),
    ],
    "audio": [
        ("A radio ad", "$2,275",
         ["30 seconds, one cast voice", "Two studio hours",
          "Library music, one-week turnaround"]),
        ("A ten-part podcast", "$23,240",
         ["400 minutes across ten episodes", "20 studio hours with an engineer",
          "Transcripts, markers, branded intro", "Works out at $2,324 an episode"]),
        ("Score for a short film", "$62,706",
         ["15 minutes, three session players", "Fully designed sound and foley",
          "Original music, cinema release"]),
    ],
}


def example_markup(slug):
    out = []
    for name, price, bullets in EXAMPLES[slug]:
        items = "\n".join(
            '          <li>%s</li>' % b for b in bullets)
        out.append(
            '        <li class="pgx__card">\n'
            '          <p class="pgx__name">%s</p>\n'
            '          <p class="pgx__price">%s</p>\n'
            '          <ul class="pgx__lines">\n%s\n          </ul>\n'
            '        </li>' % (name, price, items))
    return "\n".join(out)


# The fields Netlify stores. Everything else rides inside `summary`.
NETLIFY_FIELDS = [
    "service", "client_name", "client_email", "client_phone", "client_company",
    "project_name", "target_date", "template", "estimate_low", "estimate_high",
    "confidence",
]

# Must stay byte-identical to the inline script on index.html — the CSP in
# netlify.toml pins it by hash.
INLINE_JS = "document.documentElement.classList.add('js');"

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Kriel Ventures</title>
<meta name="description" content="{title} at Kriel Ventures. This page is under construction.">
<meta name="theme-color" content="#0B0B0B">
<!-- Holding page: keep it out of search results until there's real content. -->
<meta name="robots" content="noindex">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="icon" href="../favicon.jpg" type="image/jpeg" sizes="512x512">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<link rel="preload" href="../fonts/stadium.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../pg.css">

<!-- Reveal animations only exist if JS does; without it everything is simply visible. -->
<script>{inline_js}</script>
</head>
<body>

<a class="skip-link" href="#content">Skip to content</a>

<!-- ── Fixed menu control ───────────────────────────────────────────── -->
<button id="menu-toggle" class="menu-btn" aria-expanded="false" aria-controls="site-menu">
  <span class="menu-btn__label" data-open="Menu" data-close="Close">Menu</span>
</button>

<nav id="site-menu" class="menu" aria-label="Main" hidden>
  <div class="menu__inner">
    <p class="menu__eyebrow">Kriel Ventures</p>
    <ul class="menu__list">
{menu_items}
      <li><a href="../#contact"><span class="menu__num">—</span>Contact</a></li>
    </ul>
    <div class="menu__foot">
      <a href="mailto:josh@kriel.us">josh@kriel.us</a>
    </div>
  </div>
</nav>

<main class="holding" id="content" data-key="{key}">
  <p class="opening__mark"><a href="../">&larr; Back to Kriel Ventures</a></p>

  <div class="holding__body">
    <p class="holding__label"><span>Service {num}</span><span>{kind}</span></p>
    <h1 class="holding__title"><span class="rise"><span>{title}</span></span></h1>

    <hr class="holding__rule">

    <p class="holding__state">Under construction</p>
    <p class="holding__note">This page is being built. The work and rates for
    {lower} are available on request — email
    <a href="mailto:josh@kriel.us">josh@kriel.us</a>, or
    <a href="#estimate">build yourself an estimate</a> without waiting for us.</p>
  </div>

  <div class="holding__foot">
    <a href="mailto:josh@kriel.us">josh@kriel.us</a>
  </div>
</main>

<!-- ── Proposal generator ───────────────────────────────────────────────
     The card is built by pg.js. The form below is deliberately in the static
     markup: Netlify registers forms by parsing deployed HTML, so one created
     by script would never receive a submission.
     ------------------------------------------------------------------- -->
<section class="pg" id="estimate" data-key="{key}" aria-labelledby="pg-title">
  <div class="pg__wrap">
    <p class="pg__eyebrow">Proposal generator</p>
    <h2 class="pg__title" id="pg-title">{pitch_title}</h2>
    <p class="pg__intro">{pitch_note}</p>

    <div class="pg__app" id="pg-app">
      <noscript>
        <p class="pg__noscript">The estimator needs JavaScript, which is off in
        this browser. Email <a href="mailto:josh@kriel.us">josh@kriel.us</a> with
        what you have in mind and you'll get the same answer from a person,
        usually within a day.</p>
      </noscript>
    </div>

    <section class="pgx" aria-labelledby="pgx-title">
      <h3 class="pgx__title" id="pgx-title">What this usually costs</h3>
      <p class="pgx__note">Three jobs we have priced, so you have something to
      measure your own against before you start.</p>
      <ul class="pgx__grid">
{example_cards}
      </ul>
      <p class="pgx__foot">Each is the middle of three options, and assumes a
      comfortable deadline. Your own answers above will move it.</p>
    </section>

    <form id="pg-form" name="proposal" method="POST" data-netlify="true"
          netlify-honeypot="bot-field" hidden>
      <input type="hidden" name="form-name" value="proposal">
      <p hidden><label>Leave this empty: <input name="bot-field"></label></p>
{netlify_fields}
      <textarea name="summary"></textarea>
      <textarea name="thankyou_email"></textarea>
    </form>
  </div>
</section>

<script src="../main.js"></script>
<script src="../pg-intake.js"></script>
<script src="../{pg_config}"></script>
<script src="../pg.js"></script>
</body>
</html>
"""

ROOT = os.path.dirname(os.path.abspath(__file__))

netlify_fields = "\n".join(
    '      <input type="hidden" name="%s">' % f for f in NETLIFY_FIELDS
)

for slug, key, num, kind, title, pg_config in SERVICES:
    items = []
    for s2, _k2, n2, _kind2, t2, _c2 in SERVICES:
        current = ' aria-current="page"' if s2 == slug else ""
        href = "./" if s2 == slug else "../%s/" % s2
        items.append(
            '      <li><a href="%s"%s><span class="menu__num">%s</span>%s</a></li>'
            % (href, current, n2, t2)
        )

    pitch_title, pitch_note = PITCH[slug]

    html = TEMPLATE.format(
        title=title,
        lower=title.lower(),
        key=key,
        num=num,
        kind=kind,
        inline_js=INLINE_JS,
        menu_items="\n".join(items),
        pitch_title=pitch_title,
        pitch_note=pitch_note,
        pg_config=pg_config,
        netlify_fields=netlify_fields,
        example_cards=example_markup(slug),
    )

    outdir = os.path.join(ROOT, slug)
    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, "index.html"), "w") as fh:
        fh.write(html)
    print("wrote %s/index.html" % slug)
