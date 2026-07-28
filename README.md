# AI Watchtower

🌐 **Live site: https://alephbeth-ai.github.io/AI-Watchtower/**

AI Watchtower is a bilingual (English / French) AI security research blog. It covers the offensive and defensive sides of LLM-based systems: prompt injection, data poisoning, agentic attack surfaces (SOC/SIEM agents, tool-using agents), jailbreak countermeasures, and practical hardening playbooks.

Beyond the articles, the site ships **interactive teaching widgets** — step-by-step visualizations that walk a sentence through an LSTM, a CNN, and a Transformer — so readers can build an intuition for *how* models mix information before reasoning about how that mixing is exploited.

## What the site offers

- **Articles** — security research posts, filterable by category (Fundamentals, Explainer, Analysis, Hardening, Strategy) with full-text search across titles, summaries, and tags.
- **Interactive** — standalone HTML widgets (LSTM / CNN / Transformer walkthroughs) embedded in articles and browsable from their own tab.
- **Bilingual** — every article exists in an English and a French version, linked by a shared `translationKey`; the language switcher toggles the whole site.
- **Dark / light mode** — follows the system preference by default, with a manual toggle.

## Tech stack

The site is a single-page application built with **React 18 + TypeScript + Vite + Tailwind CSS**. Articles are plain Markdown files with YAML frontmatter; at build time they are pulled in via Vite's `import.meta.glob`, parsed in [src/data/posts.ts](src/data/posts.ts), and rendered with [marked](https://github.com/markedjs/marked). Deployment to GitHub Pages is automated by GitHub Actions on every push to `main`.

## Project structure

```
.
├── index.html                      # SPA entry point
├── vite.config.ts                  # Vite config (publicDir: static, relative base)
├── src/
│   ├── App.tsx                     # Tabs (articles / interactive / contact), search, filters
│   ├── data/posts.ts               # Loads + parses all Markdown posts (frontmatter, reading time)
│   ├── components/                 # Header, PostCard, PostView, WidgetEmbed, showcase, etc.
│   └── types.ts
├── content/
│   ├── en/posts/                   # English articles (Markdown + frontmatter)
│   └── fr/posts/                   # French articles (Markdown + frontmatter)
├── static/
│   ├── favicon.svg
│   └── widgets/                    # Standalone HTML teaching widgets (lstm/cnn/transformer, en+fr)
└── .github/workflows/deploy.yml    # Build + deploy to GitHub Pages
```

> Note: `hugo.toml`, `layouts/`, `archetypes/` and `assets/` are leftovers from the previous Hugo version of the site and are not used by the React build.

## Local development

Requires Node.js ≥ 20.

```bash
npm install
npm run dev
```

Then open http://localhost:3000/.

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # type-check (tsc --noEmit)
```

## Add a new bilingual article

Create one Markdown file per language, keeping the date and slug in sync:

- `content/en/posts/YYYY-MM-DD-my-article.md`
- `content/fr/posts/YYYY-MM-DD-mon-article.md`

Frontmatter conventions the site relies on:

- **`translationKey`** — the **same** value in both files; it links the language pair for the language switcher.
- **`categories`** — a single type label, mirrored across languages: `Fundamentals`/`Fondamentaux`, `Explainer`/`Vulgarisation`, `Analysis`/`Analyse`, `Hardening`/`Durcissement`, `Strategy`/`Stratégie`. It drives the category filter on the homepage.
- **`theme`** — one of `fundamentals`, `agents`, `poisoning`, `hardening` (used for brand coloring).
- **`summary`** — a one-to-two sentence summary shown on the homepage cards.
- **`tags`** — searchable keywords.
- **`date`** / **`draft`** — posts with `draft: true` are excluded.

Reading time is computed automatically (~200 words/minute).

## Deployment

Every push to `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which installs dependencies, runs `npm run build`, and publishes `dist/` to GitHub Pages. In GitHub → Settings → Pages, the source must be set to **GitHub Actions**.

## License

Code: see [LICENSE](LICENSE). Article content: © AlephBeth-AI, all rights reserved unless otherwise noted in the article.
