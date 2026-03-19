# Web Learning Kit Generator

Web Learning Kit Generator helps beginners generate a **local, realistic front-end workflow** (not a browser sandbox) using Gulp, with interactive choices for:

- Markup: **HTML** or **Pug**
- Styles: **Sass** or **SCSS**
- Scripts: **JavaScript** or **TypeScript**

It is designed to teach how real projects are structured, built, and shipped from your own machine.

---

## Why this project exists

Most beginners start in online playgrounds and miss practical workflows such as:

- Local tooling setup
- Build pipelines
- Static asset optimization
- Source organization
- Deployment-ready `dist` outputs

This generator creates a beginner-friendly starting point while still exposing real-world build concepts.

## Features

- **Interactive project bootstrap** for language/tool choices
- **Generated Gulp pipeline** for styles, scripts, markup, and images
- **Live reload dev server** via BrowserSync
- **Production build output** in `dist/`
- Optional CSS starter files:
  - Josh Comeau-style reset
  - Nicolas Gallagher normalize

## Requirements

- Node.js 18+ (Node.js 20 recommended)
- npm (recommended)

The repository also declares supported runtime versions in `package.json` under `engines`.

## Quick start

```bash
npm install
npm run init
npm start
```

Build for production:

```bash
npm run build
```

Non-interactive setup (for automation):

```bash
npm run init -- --script ts --style scss --markup pug --normalize --reset --yes
```

Quality checks:

```bash
npm run typecheck
npm test
npm run lint
```

Environment toggles (optional):

```bash
# keep BrowserSync from opening a browser
BROWSERSYNC_OPEN=false

# skip image optimization for faster local loops
SKIP_IMAGE_OPTIMIZATION=true
```

See `.env.example` for supported toggles.

## Project structure

```text
.
├── src/                # Generated source files (created after npm run init)
│   ├── img/            # Image assets
│   ├── js|ts/          # Script entry and modules
│   ├── sass|scss/      # Styling source
│   └── html|pug/       # Markup source
├── dist/               # Build output
├── _gulp/              # Generator modules and task templates
├── gulpfile.js         # Generated Gulp pipeline
└── README.md
```

## Generated output examples

See concrete scaffold output trees here: [Generated output examples](./docs/generated-output-examples.md).

## Current quality/devops baseline

This repository now includes:

- Type checking (`npm run typecheck`)
- Unit tests for filesystem utilities (`npm test`)
- CI workflow for typecheck + tests (GitHub Actions)
- Contributing and security documentation
- A single runtime architecture: setup always generates one `gulpfile.js` from user choices (no parallel dynamic task runtime)

## Architecture decision

This project intentionally uses **one runtime path**:

1. collect user choices (interactive prompts or CLI flags)
2. scaffold source files
3. generate a single `gulpfile.js`
4. run gulp commands through npm scripts

See ADRs for rationale and trade-offs:
- [ADR 0001: single generated-gulpfile runtime](./docs/adr/0001-generated-gulpfile-runtime.md)
- [ADR 0002: template composition](./docs/adr/0002-template-composition.md)

---

## Deep improvement roadmap

Track roadmap execution with milestones/labels using this guide: [Roadmap tracking](./docs/roadmap-tracking.md).


If your goal is to make this starter more production-realistic for learners, implement the following in phases.

### Phase 1 — Reliability and maintainability (short term)

1. **Refactor generator templates into composable modules**
   - Move generated gulpfile snippets into dedicated template files.
   - Add snapshot tests for generated output.
2. **Introduce a config schema**
   - Validate user choices with a typed schema (e.g., Zod).
3. **Error handling and UX improvements**
   - Improve setup error messages and recovery paths.
   - Add non-interactive flags for automation (`--script ts --style scss --markup pug`).

### Phase 2 — Security and supply chain

1. **Automated dependency security**
   - Enable Dependabot/Renovate.
   - Add `npm audit --audit-level=high` in CI (non-blocking at first).
2. **Secure generated defaults**
   - Include optional security headers guidance (CSP, X-Content-Type-Options) in deployment docs.
3. **Harden build tooling**
   - Pin and regularly review toolchain versions.

### Phase 3 — Better learning outcomes for users

1. **Preset modes**
   - `beginner`, `intermediate`, `production-lite` presets.
2. **Educational comments in generated files**
   - Explain each Gulp task and where to customize.
3. **Project recipes**
   - Add examples: landing page, docs site, multi-page static site.

### Phase 4 — DevOps and deployment excellence

1. **Deployment templates**
   - Add one-click workflows for GitHub Pages / Netlify / Vercel static output.
2. **Release automation**
   - Semantic versioning + changelog generation.
   - Track with Changesets config (`.changeset/config.json`).
3. **Performance checks**
   - Add Lighthouse CI or static asset budget checks.

### Phase 5 — Ecosystem growth

1. **Plugin architecture** for additional features (ESLint, Prettier, Vitest, Playwright)
2. **CLI packaging** (`npx web-learning-kit-generator`)
3. **Template marketplace** for community starter packs

---

## Suggested next features (high impact)

- Add generated **ESLint + Prettier** setup.
- Add optional **testing scaffold** (Vitest + basic smoke tests).
- Add generated `.editorconfig`, `.gitignore`, `.nvmrc`.
- Add optional accessibility starter checks (axe/lint guidance).

## Documentation

- [Contributing guide](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Generated output examples](./docs/generated-output-examples.md)
- [Roadmap tracking guide](./docs/roadmap-tracking.md)
- [Architecture Decision Records](./docs/adr)

## Inspiration

- [H5BP Project](https://github.com/h5bp/html5-boilerplate)
- [React Redux Starter Kit](https://github.com/davezuko/react-redux-starter-kit)
- [Mark Goodyear's Blog](https://markgoodyear.com/2014/01/getting-started-with-gulp/)
- [Web Starter Kit](https://github.com/google/web-starter-kit)

## License

MIT
