# ADR 0001: Keep a single generated-gulpfile runtime

- Status: Accepted
- Date: 2026-03-17

## Context
The project previously had two competing runtime paths:
1. A generated `gulpfile.js` flow.
2. A dynamic TypeScript task runtime.

This created maintenance drift, duplicated behavior, and made onboarding harder.

## Decision
Use a single runtime architecture: setup writes one generated `gulpfile.js` based on user choices.

## Consequences
- Pros: Lower complexity, easier debugging, fewer drift bugs.
- Cons: Generator templates become the central maintenance surface.

## Follow-up
- Keep snapshot tests for generated outputs.
- Keep path/option resolution centralized.
