# ADR 0002: Compose gulpfile from template sections

- Status: Accepted
- Date: 2026-03-17

## Context
A monolithic template string for `gulpfile.js` was hard to evolve and review.

## Decision
Split generation into composable template sections with a shared context object.

## Consequences
- Pros: Easier review, easier targeted testing, smaller future diffs.
- Cons: More files to navigate for newcomers.

## Follow-up
- Keep section-level unit tests and matrix snapshots.
