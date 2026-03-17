# Troubleshooting

## `npm run init` fails with prompt/runtime errors
- Run `npm run typecheck` and `npm test` first.
- Remove generated folders and retry: `rm -rf src dist && npm run init`.
- For automation, pass full flags: `npm run init -- --script ts --style scss --markup pug --yes`.

## `npm run lint` fails in restricted environments
If your environment blocks registry packages, lint dependencies may not install.
Use `npm run typecheck` + `npm test` as a fallback until package access is available.

## BrowserSync or gulp startup issues
- Ensure Node 18+.
- Ensure dependencies are installed with `npm install`.
- Re-run init to regenerate `gulpfile.js` after changing options.

## Invalid setup choices in automation mode
Provide all required flags together:
- `--script`
- `--style`
- `--markup`

Optional flags:
- `--normalize`
- `--reset`
- `--yes` / `-y`
