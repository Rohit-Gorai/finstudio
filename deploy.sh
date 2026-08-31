#!/usr/bin/env bash
# Deploy FinStudio WITHOUT the web uploader, which has now flattened the
# folder structure three times. Run from anywhere.
set -euo pipefail
REPO="${1:-$HOME/finstudio}"
ZIP="${2:-$PWD/finstudio-fixed.zip}"

[ -d "$REPO/.git" ] || { echo "Clone first:  git clone https://github.com/Rohit-Gorai/finstudio.git $REPO"; exit 1; }
[ -f "$ZIP" ]       || { echo "Can't find $ZIP"; exit 1; }

cd "$REPO"
git pull --ff-only
rm -rf js/learn js/sheets            # replaced wholesale
unzip -o -q "$ZIP" -d .
git add -A
git status --short
echo
echo "Check that js/learn/ and js/sheets/ appear above, then:"
echo "  git commit -m 'Wire the learning layer; honest curriculum status' && git push"
