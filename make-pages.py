#!/usr/bin/env python3
"""Generate the four service pages.

Generated rather than hand-written: four near-identical pages would drift the
moment one got edited. Re-run after changing the template or the tables:

    python3 make-pages.py

The page design is the v2 shell (kv-* classes in v2.css). The estimator is the
real one: pg.js builds the UI into #pg-app, but the *form* it submits has to be
in the static HTML, because Netlify registers forms by parsing deployed HTML.
A form injected by script is never registered and every submission 404s. Hence
the fixed field list in NETLIFY_FIELDS; the variable part of a long intake
travels inside `summary`.
"""

import os

# slug, accent key, nav/display title, pg config, frame variant
SERVICES = [
    ("photography", "photography", "Photography", "pg-photography.js", "photo"),
    ("videography", "videography", "Videography", "pg-videography.js", "film"),
    ("web-design",  "web",         "Web design",  "pg-web-design.js",  "web"),
    ("audio",       "audio",       "Audio",       "pg-audio.js",       "audio"),
]

# The image each service shows. Both widths exist; the frames are displayed
# small, so they load the 1200 and offer the 2000 for dense screens.
IMAGE = {
    "photography": "photography",
    "videography": "videography",
    "web-design":  "webdesign",
    "audio":       "audio",
}

# The frame is the thing each craft produces: a camera back, a monitor, a
# browser window, a transport deck. Film puts its bar on top (timecode above
# the picture); the rest sit underneath.
FRAMES = {
    "photo": (
        '  <div class="kv-frame__pic">{img}</div>\n'
        '  <div class="kv-frame__bar"><span>RAW</span>'
        '<span>f/2.8&nbsp;&nbsp;1/250&nbsp;&nbsp;ISO 200</span><span>35mm</span></div>'
    ),
    "film": (
        '  <div class="kv-frame__bar"><span class="kv-rec">REC</span>'
        '<span>00:00:12:04</span><span>24fps</span></div>\n'
        '  <div class="kv-frame__pic">{img}</div>'
    ),
    "web": (
        '  <div class="kv-frame__bar"><span class="kv-dots"><i></i><i></i><i></i></span>'
        '<span class="kv-url">yourbusiness.com</span><span>0.4s</span></div>\n'
        '  <div class="kv-frame__pic">{img}</div>'
    ),
    "audio": (
        '  <div class="kv-frame__pic">{img}</div>\n'
        '  <div class="kv-frame__bar"><span>WAV</span><span>48kHz&nbsp;&nbsp;24-bit</span>'
        '<span class="kv-meter" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></div>'
    ),
}

META = {
    "photography": "Photography at Kriel Ventures, Austin. Headshots, products, events and brand imagery, shot and finished in house.",
    "videography": "Videography at Kriel Ventures, Austin. Brand films, testimonials and event recaps, directed, filmed and cut from one brief.",
    "web-design":  "Web design at Kriel Ventures, Austin. Fast, hand-built sites that run on your photography, hosted and kept current by us.",
    "audio":       "Audio at Kriel Ventures, Austin. Recording, mixing and mastering for podcasts, voiceover and original score.",
}

PITCH = {
    "photography": "Pictures that do a job: headshots that get the meeting, products that sell themselves, events people remember.",
    "videography": "Films people finish watching. Brand films, testimonials and recaps, shot with intent and cut to the length the platform wants.",
    "web-design":  "A fast, hand-built site that runs on your own photography, and that we host, secure and keep current so it never goes stale.",
    "audio":       "Sound that carries the room. Podcasts, voiceover and original score, recorded clean and finished so it holds up on a phone speaker.",
}

# (hero button label, estimator section heading, estimator lede)
PRICE_CTA = {
    "photography": ("Price a shoot", "Price a shoot.",
                    "Answer a few questions about the shoot, what, how long, how many images, and where they'll be used, and you'll get a costed estimate in about three minutes."),
    "videography": ("Price a film", "Price a film.",
                    "Answer a few questions about the film, what it's for, how long, where it plays, and you'll get a costed estimate in about three minutes."),
    "web-design":  ("Price a site", "Price a site.",
                    "Answer a few questions about the site, what kind, roughly how big, what it needs to connect to, and you'll get a costed estimate in about three minutes."),
    "audio":       ("Price an audio project", "Price an audio project.",
                    "Answer a few questions about what you're making and what state it's in, and you'll get an estimate that keeps studio time and finishing time separate, because they're different work."),
}

WHAT = {
    "photography": [
        ("Headshots and team portraits", "Consistent, current, and shot where your team actually is. One look across the whole company page."),
        ("Product", "Clean cutouts for the store, styled sets for the campaign, both from the same session."),
        ("Events", "Full coverage of the day, selected and graded in house so the gallery lands while it still matters."),
        ("Brand and lifestyle", "The library your website, socials and pitch deck all draw from, planned so it lasts a year, not a week."),
    ],
    "videography": [
        ("Brand film", "Two to three minutes on who you are and why it matters, built to sit at the top of your site for a year."),
        ("Testimonials and interviews", "Real customers, lit and cut so they sound like themselves, with subtitles for the feed."),
        ("Event recaps", "The energy of the day in ninety seconds, delivered while people are still talking about it."),
        ("Social cutdowns", "One shoot, many formats. Vertical, square and wide, each edited for its platform rather than cropped from the master."),
    ],
    "web-design": [
        ("One-page sites", "A single fast page that says what you do and gets people to the next step. Live in weeks, not months."),
        ("Brochure sites", "Several pages, built up from your photography, with a layout you can extend as the business grows."),
        ("Online stores", "Products, payments and the mailing list, set up so you can run it yourself day to day."),
        ("Hosting and care", "We host it, keep it secure and make the small changes, for one monthly fee. You own the domain and the site; we just look after it."),
    ],
    "audio": [
        ("Podcasts", "Recorded, edited and levelled so every episode sounds the same, with transcripts and chapter markers ready to publish."),
        ("Voiceover", "Scripts cast, directed and recorded clean, cut to the exact length the edit needs."),
        ("Original score and sound design", "Music written for your film rather than licensed to it, plus the foley and atmospheres that make a cut feel finished."),
        ("Mix and master", "Someone else's recording, brought up to broadcast level and delivered to the spec the platform asks for."),
    ],
}

HOW_TITLE = {
    "photography": "How a shoot works.",
    "videography": "How a film works.",
    "web-design":  "How a site gets built.",
    "audio":       "How a session works.",
}

HOW = {
    "photography": [
        ("Brief", "What, where, how many images, and where they'll be used. The estimator asks exactly this, so by the time we talk the shape is already clear."),
        ("Shoot", "On location or in studio, with a shot list we agreed beforehand and room to chase the picture that wasn't on it."),
        ("Select", "A proof gallery you choose from. We suggest; you decide."),
        ("Deliver", "Finished, retouched files in the sizes you need, licensed for the uses you told us about."),
    ],
    "videography": [
        ("Brief", "What the film is for, who's in it, and where it'll play. That decides length, format and how we shoot."),
        ("Plan", "Shot list, locations, interview questions and a call sheet, so the day is spent filming, not deciding."),
        ("Shoot", "Directed, filmed and recorded in house. Gimbal, lighting and audio sized to the job."),
        ("Cut and deliver", "A first cut, one round of notes built in, then the master and every cutdown you need, graded and subtitled."),
    ],
    "web-design": [
        ("Brief", "What the site needs to do, roughly how big it is, and what already exists. The estimator asks this in plain language."),
        ("Design", "Built up from your photography. If you don't have it yet, we shoot it. That's rather the point of the studio."),
        ("Build", "Hand-coded, no template, no plugin sprawl. Fast on a phone, easy for us to change later."),
        ("Launch and care", "We put it live, connect the domain and analytics, then stay on to keep it current."),
    ],
    "audio": [
        ("Brief", "What you're making, how long it runs, and what already exists. Studio time and finishing time are priced separately, so the estimator asks about both."),
        ("Record", "In the studio or on location, with the room treated and the levels set before anyone says a word."),
        ("Edit and mix", "Cuts, levels, noise and music, balanced so it holds up on a phone speaker as well as it does on headphones."),
        ("Master and deliver", "Finished to the loudness spec your platform asks for, with the stems and transcripts you'll want later."),
    ],
}

# Three worked examples per service. Every figure was computed by the live
# generator, not estimated by hand — see proposal-generators/EXAMPLES.md. They
# are static markup rather than rendered by pg.js so they are on screen the
# moment the page paints, and still there with scripting off.
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
         ["Single landing page", "You write the copy",
          "Basic SEO and analytics"]),
        ("A brochure site", "$58,407",
         ["14 pages from 7 layouts", "Blog, search, accessible to WCAG 2.2 AA",
          "Three integrations, we polish your copy"]),
        ("An online store", "$39,968",
         ["60 products", "We write the copy",
          "Payments, mailing list, reviews"]),
    ],
    "audio": [
        ("A radio ad", "$2,275",
         ["30 seconds, one cast voice", "Two studio hours",
          "Library music, one-week turnaround"]),
        ("A ten-part podcast", "$23,240",
         ["400 minutes across ten episodes", "20 studio hours with an engineer",
          "Transcripts, markers, branded intro"]),
        ("Score for a short film", "$62,706",
         ["15 minutes, three session players", "Fully designed sound and foley",
          "Original music, cinema release"]),
    ],
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
<meta name="description" content="{meta}">
<meta name="theme-color" content="#0B0B0B">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="icon" href="../favicon.jpg" type="image/jpeg" sizes="512x512">

<meta property="og:type" content="website">
<meta property="og:title" content="{title} — Kriel Ventures">
<meta property="og:description" content="{meta}">
<meta property="og:image" content="../images/{image}-2000.jpg">
<meta name="twitter:card" content="summary_large_image">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<link rel="preload" href="../fonts/stadium.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="../v2.css">
<link rel="stylesheet" href="../pg.css">

<!-- Reveal animations only exist if JS does; without it everything is simply visible. -->
<script>{inline_js}</script>
</head>
<body>

<a class="skip-link" href="#content">Skip to content</a>

<button id="menu-toggle" class="menu-btn" aria-expanded="false" aria-controls="site-menu">
  <span class="menu-btn__label" data-open="Menu" data-close="Close">Menu</span>
</button>

<nav id="site-menu" class="menu" aria-label="Main" hidden>
  <div class="menu__inner">
    <p class="menu__eyebrow">Kriel Ventures</p>
    <ul class="menu__list">
      <li><a href="../">Home</a></li>
{menu_items}
      <li><a href="../#contact">Contact</a></li>
    </ul>
    <div class="menu__foot">
      <a href="mailto:josh@kriel.us">josh@kriel.us</a>
    </div>
  </div>
</nav>

<header class="kv-svc-hero" id="top" data-key="{key}">
  <p class="opening__mark"><a href="../">Kriel Ventures</a></p>
  <div class="kv-svc-hero__grid">
    <div>
      <h1 class="kv-svc-hero__title"><span class="rise"><span>{title}</span></span></h1>
      <p class="kv-svc-hero__pitch">{pitch}</p>
      <div class="kv-actions">
        <a class="kv-btn kv-btn--primary" href="#costs">{cta}</a>
        <a class="kv-btn kv-btn--ghost" href="mailto:josh@kriel.us">Email Josh</a>
      </div>
    </div>
    <div class="kv-frame kv-frame--{frame}">
{frame_inner}
</div>
  </div>
</header>

<main id="content">

<section class="kv-section kv-section--bone">
  <div class="kv-wrap">
    <h2 class="kv-h2">What we make.</h2>
    <div class="kv-list">
{what_items}
    </div>
  </div>
</section>

<section class="kv-section kv-section--bone2">
  <div class="kv-wrap">
    <h2 class="kv-h2">{how_title}</h2>
    <ol class="kv-steps">
{how_items}
    </ol>
  </div>
</section>

<section class="kv-section kv-section--dark" id="costs">
  <div class="kv-wrap">
    <div class="kv-head">
      <h2 class="kv-h2">What this usually costs.</h2>
      <p class="kv-lede">Three jobs we have priced, so you have something to measure your own against before you start.</p>
    </div>
    <ul class="kv-prices">
{price_items}
    </ul>
    <p class="kv-prices-foot">Each is the middle of three options and assumes a comfortable deadline. Your own answers below will move it.</p>
  </div>
</section>

<!-- ── Proposal generator ───────────────────────────────────────────────
     pg.js builds the estimator into #pg-app. The form below is deliberately
     in the static markup: Netlify registers forms by parsing deployed HTML,
     so one created by script would never receive a submission.
     ------------------------------------------------------------------- -->
<section class="kv-section kv-section--dark" id="estimate" data-key="{key}" aria-labelledby="pg-title">
  <div class="kv-wrap">
    <div class="kv-head">
      <h2 class="kv-h2" id="pg-title">{est_title}</h2>
      <p class="kv-lede">{est_lede}</p>
    </div>

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

</main>

<section class="kv-section kv-section--dark" id="contact">
  <div class="kv-wrap">
    <h2 class="kv-h2">Start with a number, or a conversation.</h2>
    <div class="kv-contact">
      <div class="kv-contact__col">
        <h3 class="kv-h3">Price it yourself</h3>
        <p class="kv-p">Each service has an estimator. Answer a few questions and get a costed range in about three minutes, before you've talked to anyone.</p>
        <div class="kv-contact__list">
{contact_links}
        </div>
      </div>
      <div class="kv-contact__col">
        <h3 class="kv-h3">Or just write</h3>
        <p class="kv-p">Tell us what you're building. A person reads it, and a person replies.</p>
        <a class="kv-email" href="mailto:josh@kriel.us">josh@kriel.us</a>
        <div class="kv-social">
          <a href="https://www.instagram.com/jkriel_/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.linkedin.com/in/josh-kriel-aaa353429/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </div>
    <div class="kv-foot">
      <p>&copy; <span id="year">2026</span> Kriel Ventures, Austin, Texas</p>
      <p><a href="#top">Back to top</a></p>
    </div>
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

contact_links = "\n".join(
    '      <a href="../%s/#costs">%s</a>' % (s, t)
    for s, _k, t, _c, _f in SERVICES
)

for slug, key, title, pg_config, frame in SERVICES:
    img = IMAGE[slug]
    img_tag = (
        '<img src="../images/%s-1200.jpg" '
        'srcset="../images/%s-1200.jpg 1200w, ../images/%s-2000.jpg 2000w" '
        'sizes="(min-width: 900px) 45vw, 100vw" alt="" loading="lazy" decoding="async">'
        % (img, img, img)
    )

    menu_items = "\n".join(
        '      <li><a href="%s"%s>%s</a></li>'
        % ("./" if s2 == slug else "../%s/" % s2,
           ' aria-current="page"' if s2 == slug else "",
           t2)
        for s2, _k2, t2, _c2, _f2 in SERVICES
    )

    what_items = "\n".join(
        '      <div><h3 class="kv-h3">%s</h3><p>%s</p></div>' % (h, p)
        for h, p in WHAT[slug]
    )

    how_items = "\n".join(
        '      <li class="kv-step"><h3 class="kv-h3">%s</h3><p>%s</p></li>' % (h, p)
        for h, p in HOW[slug]
    )

    price_items = "\n".join(
        '      <li class="kv-price"><p class="kv-price__name">%s</p>'
        '<p class="kv-price__num">%s</p><ul>%s</ul></li>'
        % (name, price, "".join("<li>%s</li>" % b for b in bullets))
        for name, price, bullets in EXAMPLES[slug]
    )

    cta, est_title, est_lede = PRICE_CTA[slug]

    html = TEMPLATE.format(
        title=title,
        meta=META[slug],
        image=img,
        key=key,
        pitch=PITCH[slug],
        cta=cta,
        frame=frame,
        frame_inner=FRAMES[frame].format(img=img_tag),
        what_items=what_items,
        how_title=HOW_TITLE[slug],
        how_items=how_items,
        price_items=price_items,
        est_title=est_title,
        est_lede=est_lede,
        netlify_fields=netlify_fields,
        contact_links=contact_links,
        menu_items=menu_items,
        inline_js=INLINE_JS,
        pg_config=pg_config,
    )

    outdir = os.path.join(ROOT, slug)
    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, "index.html"), "w") as fh:
        fh.write(html)
    print("wrote %s/index.html" % slug)
