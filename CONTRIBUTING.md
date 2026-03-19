# Contributing

Thanks for your interest in improving Web Learning Kit Generator.

## Development setup

1. Install dependencies:
   - `npm install`
2. Run checks:
   - `npm run typecheck`
   - `npm test`
3. Run the interactive generator:
   - `npm run init`

## Test strategy

- **Unit tests**: validate individual modules (path resolution, setup option parsing, validators).
- **Template tests**: verify section behavior and snapshot generated gulpfile variants.
- **Integration tests**: scaffold in a temp directory and validate expected output tree/content.

## Acceptance criteria for changes

A change is ready to merge when all of the following are true:

- Behavior changes are covered by tests (unit/integration/snapshot as appropriate).
- `npm run typecheck` passes.
- `npm test` passes.
- Docs are updated for any user-facing command or setup-flow change.
- PR notes describe generated-project behavior changes (if any).

## Contribution guidelines

- Keep changes small and focused.
- Prefer TypeScript-safe updates.
- Add or update tests when behavior changes.
- Update README/docs when UX or command flow changes.

## Commit and PR guidance

- Use clear, imperative commit messages.
- Include a short summary of what changed and why.
- Mention any behavior changes for generated projects.
