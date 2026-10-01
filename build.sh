#!/bin/sh
# Copy the site files into deploy/ — the folder Netlify publishes.
#
# deploy/ also holds netlify.toml and robots.txt, which live only there and
# are deliberately left alone by this script.
#
# The four service pages are generated, not hand-written: run
# `python3 make-pages.py` after editing their template, then this.

set -e
cd "$(dirname "$0")"

mkdir -p deploy/images deploy/fonts

cp index.html styles.css v2.css main.js favicon.svg favicon.jpg deploy/

# Netlify config and robots live in source, not only in deploy/: they are
# not generated, so anything that wipes deploy/ would lose them for good.
cp netlify.toml robots.txt deploy/

# Proposal generator: shared engine and styles, plus one config per service.
# The service pages load pg-intake.js, their own config, then pg.js — in that
# order, since pg.js runs on load and reads what the other two defined.
cp pg.css pg.js pg-intake.js deploy/
cp pg-photography.js pg-videography.js pg-web-design.js pg-audio.js deploy/
cp images/*.jpg deploy/images/
cp fonts/stadium.woff2 fonts/stadium.ttf fonts/stadium-license.txt deploy/fonts/

for page in photography videography web-design audio; do
  mkdir -p "deploy/$page"
  cp "$page/index.html" "deploy/$page/"
done

# Finder litter would otherwise get published. Finder can recreate .DS_Store
# moments later, so re-check after a build if the listing below shows one.
find deploy -name '.DS_Store' -delete

# Mirror to the local preview root. The preview server is sandboxed out of
# this directory and can only read /tmp, so it serves the copy rather than
# these files — see .claude/launch.json. Previewing therefore shows exactly
# what would deploy, but only after this script runs.
PREVIEW=/tmp/kv-website-preview
rm -rf "$PREVIEW"
mkdir -p "$PREVIEW"
cp -R deploy/ "$PREVIEW"/

# Verify the mirror rather than trusting cp's exit code. /tmp is not ours: it
# has been found emptied of files while its directories survived, which the
# server then answered as directory listings — a preview that is entirely
# broken while still returning 200 to every check. Comparing counts turns that
# silent failure into a build failure.
want=$(find deploy -type f | wc -l | tr -d ' ')
got=$(find "$PREVIEW" -type f | wc -l | tr -d ' ')
if [ "$want" != "$got" ]; then
  echo "build.sh: preview mirror is incomplete — $got of $want files in $PREVIEW" >&2
  echo "build.sh: deploy/ itself is fine and safe to ship; only the local preview is affected." >&2
  echo "build.sh: re-run ./build.sh. If it keeps happening, something outside this script is clearing /tmp." >&2
  exit 1
fi

echo "deploy/ updated:"
find deploy -type f | sort | sed 's/^/  /'
echo "mirrored to $PREVIEW for local preview ($got files)"
