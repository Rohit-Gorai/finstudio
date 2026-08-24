#!/usr/bin/env bash
#
# FinStudio — Phase 0 repository repair.
#
# Fixes the damage from the drag-and-drop upload. No user-visible change to the
# live site: index.html only ever loads css/ and js/, and none of the files
# removed here are referenced by it.
#
# Run from inside a clone of the repo:
#   git clone https://github.com/rohit-gorai/finstudio.git
#   cd finstudio && bash phase0-repair.sh
#   git diff --stat          # review
#   git commit -am "Phase 0: repo repair" && git push
#
set -euo pipefail

[ -f index.html ] && [ -d js/lessons ] || { echo "Run this from the repo root."; exit 1; }

echo "==> 1. Removing stale root duplicates of live js/ and css/ files"
# These are an OLDER generation than js/ — root app.js has no glossary support.
git rm -q --ignore-unmatch \
  app.js engine.js quizzes.js reference.js sharecard.js \
  company.js manifest.js m1000.js m1100.js m1200.js m1300.js \
  m1400.js m1500.js m1600.js m2100.js m2200.js \
  site.css screenshot.png \
  engine.test.html lessons.test.html

echo "==> 2. Removing root duplicates of src/ and tests/ files"
git rm -q --ignore-unmatch \
  Button.tsx Callout.tsx Card.tsx HomePage.tsx NotFoundPage.tsx \
  RootLayout.tsx StyleGuidePage.tsx main.tsx router.tsx cn.ts \
  theme.css vite-env.d.ts smoke.test.ts

echo "==> 3. Moving deploy.yml into .github/workflows/ so Actions can see it"
mkdir -p .github/workflows
[ -f deploy.yml ] && git mv -f deploy.yml .github/workflows/deploy.yml

echo "==> 4. Restoring .gitignore (uploaded as a file named 'download')"
[ -f download ] && git mv -f download .gitignore

echo "==> 5. Fixing 404.html links (site is served from /finstudio/, not /)"
sed -i 's|href="/"|href="/finstudio/"|g; s|href="/#/|href="/finstudio/#/|g' 404.html

echo "==> 6. Aligning finschool -> finstudio in build config"
sed -i 's|"name": "finschool"|"name": "finstudio"|' package.json
sed -i 's|VITE_BASE ?? "/finschool/"|VITE_BASE ?? "/finstudio/"|' vite.config.ts

echo
echo "Done. Sanity check before committing:"
echo "  - every <script src> in index.html still resolves:"
grep -oE 'src="[^"]+\.js"' index.html | sed 's/src="//; s/"//' | while read -r f; do
  [ -f "$f" ] && echo "      ok   $f" || echo "      MISSING $f"
done
echo "  - open tests/lessons.test.html and tests/engine.test.html in a browser;"
echo "    all 371 assertions must still pass."
