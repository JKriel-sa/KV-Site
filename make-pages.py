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
    )

    outdir = os.path.join(ROOT, slug)
    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, "index.html"), "w") as fh:
        fh.write(html)
    print("wrote %s/index.html" % slug)
