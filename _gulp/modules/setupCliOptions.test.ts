import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSetupOptions } from './setupCliOptions';

test('parseSetupOptions returns interactive mode when no flags are provided', () => {
  const parsed = parseSetupOptions([]);
  assert.equal(parsed.shouldPrompt, true);
  assert.equal(parsed.choices, undefined);
});

test('parseSetupOptions parses non-interactive flags with aliases and booleans', () => {
  const parsed = parseSetupOptions(['--script', 'ts', '--style=scss', '--markup', 'pug', '--normalize']);

  assert.equal(parsed.shouldPrompt, false);
  assert.deepEqual(parsed.choices, {
    script: 'TypeScript',
    style: 'SCSS',
    markup: 'Pug',
    addNormalize: true,
    addReset: false,
  });
});

test('parseSetupOptions throws when non-interactive flags are partially provided', () => {
  assert.throws(
    () => parseSetupOptions(['--script', 'js', '--style', 'sass']),
    /provide --script, --style, and --markup together/,
  );
});

test('parseSetupOptions throws when a flag has no value', () => {
  assert.throws(() => parseSetupOptions(['--script']), /Missing value for --script/);
});

test('parseSetupOptions throws when a value is invalid', () => {
  assert.throws(
    () => parseSetupOptions(['--script', 'coffee', '--style', 'scss', '--markup', 'html']),
    /Invalid user choices/,
  );
});
