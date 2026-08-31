# Deploying FinStudio to GitHub Pages

The site is plain static files with no build step, so Pages can serve the repository
root directly. Nothing to install, no Actions workflow, no `dist/`.

## One-time setup

1. Push the site to GitHub (the files must be at the **repository root** — `index.html`,
   `css/`, `js/`, `favicon.svg`, `404.html`).
2. Go to your repository on GitHub → **Settings** → **Pages** (left sidebar).
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`, folder `/ (root)`
4. Click **Save**.

GitHub builds and publishes within a minute or two. The green banner at the top of the
Pages settings shows the live URL:

```
https://<your-username>.github.io/<repository-name>/
```

For this repository that is <https://rohit-gorai.github.io/finschool/>.

## Deploying updates

Push to `main`. Pages redeploys automatically — usually live in under a minute. Watch
progress under the repository's **Actions** tab (`pages-build-deployment`).

## Checks worth doing after the first deploy

- **The site loads and the syllabus renders.** If you get a blank page, open the browser
  console: a 404 on `css/site.css` or `js/app.js` means the files aren't at the root.
- **Deep links work.** Open `https://…/#/1330-balance-sheet` directly. Routing is
  hash-based specifically so Pages needs no rewrite rules — the server only ever serves
  `index.html`, and the fragment is handled in the browser.
- **A sandbox accepts a formula.** Type `=B2-B3` into lesson 1020 and press
  *Check my sheet*.
- **`404.html` works.** Visit `https://…/nonexistent`. Pages serves `404.html`
  automatically for unmatched paths.
- **The test pages run.** `https://…/tests/engine.test.html` and
  `tests/lessons.test.html` should each show a green "All N assertions passed."

## If the site is served from a subpath

A project site lives at `/<repository-name>/`, not at the domain root. Nothing needs
changing for this, and renaming the repository is safe:

- **`index.html` and the test pages** use only **relative** references
  (`css/site.css`, `js/app.js`, `../js/engine.js`), so they resolve at any depth.
- **`404.html` is fully self-contained** — its CSS is inlined rather than linked,
  because Pages serves that one file for unmatched paths at *any* depth, where neither
  a relative nor an absolute stylesheet link would be reliable. Its navigation links
  derive the site root from `location.pathname` at runtime, so they point at
  `/<repository-name>/` on a project site and `/` on a user site or custom domain.

## Custom domain (optional)

1. Settings → Pages → **Custom domain** → enter your domain → **Save**. This writes a
   `CNAME` file to the repository.
2. At your DNS provider, add a `CNAME` record pointing your subdomain to
   `<your-username>.github.io`. For an apex domain, add GitHub's `A` records instead.
3. Once DNS resolves, tick **Enforce HTTPS**.

## Fonts and offline use

`index.html` loads three families from Google Fonts. If that request is blocked — a
restrictive network, an offline machine, a locked-down corporate proxy — the site still
works: the CSS declares full fallback stacks (Georgia for the display face, the system
UI font for body text, and the platform monospace for cells). Only the typography
changes; nothing breaks. (`404.html` makes no network requests at all.)

To remove the dependency entirely, download the three families into `css/fonts/`, add
`@font-face` rules to `css/site.css`, and delete the `<link>` tags from `index.html`.

## What is *not* needed

- No `.nojekyll` file. Jekyll ignores directories beginning with `_` or `.`, and this
  project has none.
- No build, bundler, or Node toolchain. The tests are HTML pages you open in a browser.
- No environment variables or secrets. The site makes no network requests beyond fonts,
  and stores progress only in the visitor's own `localStorage`.
