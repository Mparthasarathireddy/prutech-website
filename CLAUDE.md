# PruTech website — working rules

A static marketing site: plain HTML, CSS and JavaScript. **No build step.**
Files are published exactly as they are.

## Always open a pull request

When a request comes from an issue, do the work on a branch and then
**open the pull request yourself** with `gh pr create`. Do not stop at
pushing a branch — a pull request is what triggers the automated checks
and builds the preview environment the reviewer needs.

Never commit directly to `main`.

## Which page is which

| File | What it is |
|---|---|
| `prutech-it-solutions.html` | **The home page.** The site root serves this. Globe hero, Salesforce in the nav |
| `salesforce.html` | Salesforce practice page — project spiral, project strip |
| `sf-projects/*.html` | Eight solution-brief pages |
| `index.html` | An older landing page, not served at the root. Leave alone unless asked |

If a change refers to "the home page", it means `prutech-it-solutions.html`.

## Brand

- Navy `#0D152A` · green `#00DA83` · secondary blue `#3B4AA1`
- Headline gradient uses `<span class="grad">` — keep that wrapper when editing headlines
- Fonts: Kanit for the branded pages, JetBrains Mono for code and figures

## Leave these alone unless explicitly asked

They are hand-tuned and easy to break:

- `js/intro.js` + `css/intro.css` — the logo intro and its once-per-session gating
- `js/hero-sphere.js` + `js/world-mask.js` — the dotted world globe
- `js/helix.js` + `js/strip.js` — the Salesforce project spiral and strip

## Never

- Commit passwords, API keys or tokens. The employee portal uses deliberately
  fake credentials (`demo` / `demo1234`) printed on the sign-in page — keep it that way
- Add a build step, framework or bundler
- Break the `staticwebapp.config.json` route that serves the home page at `/`
