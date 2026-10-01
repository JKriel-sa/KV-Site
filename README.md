# Kriel Ventures

The site for krielventures.com. Static, no build step beyond copying files.

## Layout

- `index.html` — home: hero, why, four crafts, how it works, about, contact
- `photography/`, `videography/`, `web-design/`, `audio/` — one page per craft,
  each ending in its live estimator
- `styles.css` — base styles, Stadium webfont, menu, reveals
- `v2.css` — the current design layer, prefixed `.kv-`, on the same tokens
  (`--ink`, `--bone`, `--tan`, `--display`, `--ui`, `--edge`, `--ease`)
- `pg.css`, `pg.js`, `pg-intake.js`, `pg-<service>.js` — the proposal generator
- `deploy/` — what Netlify publishes. Generated; never edit by hand.

## Changing things

The four service pages are generated. Edit the tables at the top of
`make-pages.py` (copy, prices, steps), not the HTML:

```sh
python3 make-pages.py   # regenerate the four service pages
./build.sh              # copy everything into deploy/ and the preview mirror
```

`index.html` is hand-written; edit it directly, then `./build.sh`.

`netlify.toml` and `robots.txt` live at the root and are copied into `deploy/`.
They are not generated, so keep them in source — anything that wipes `deploy/`
would otherwise lose them.

The CSP in `netlify.toml` pins the one inline script by SHA-256 hash. If you
change that line in any page, regenerate the hash or the reveal animations stop
running:

```sh
printf "%s" "document.documentElement.classList.add('js');" | openssl dgst -sha256 -binary | openssl base64
```

## Preview

`./build.sh` mirrors the site to `/tmp/kv-website-preview`, which the editor's
preview server reads (it is sandboxed out of this directory — see
`.claude/launch.json`). Or serve it yourself:

```sh
cd deploy && python3 -m http.server 4321
```

## Outstanding

- **Real work.** Every image is stock. The portrait frame on the home page is
  empty on purpose.
- **Check the prices.** The worked examples on each service page come from the
  live generator, so they are what it will quote. A $10,206 one-page site and a
  $58,407 brochure site (more than the $39,968 store) may lose the
  small-business enquiries the copy is written for. Rates live in the `R = { … }`
  block of each `pg-<service>.js`.
- **Confirm the copy claims** before going live: "one round of notes built in",
  "files you own", "you own the domain and the site", and "started in 2026".
