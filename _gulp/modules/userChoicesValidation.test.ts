import test from 'node:test';
import assert from 'node:assert/strict';
import { assertUserChoices, isUserChoices } from './userChoicesValidation';

test('isUserChoices returns true for a valid prompt payload', () => {
  const valid = {
    script: 'TypeScript',
    style: 'SCSS',
    markup: 'Pug',
    addNormalize: true,
    addReset: false,
  };

  assert.equal(isUserChoices(valid), true);
});

test('isUserChoices returns false for invalid payload shape', () => {
  const invalid = {
    script: 'CoffeeScript',
    style: 'SCSS',
    markup: 'Pug',
    addNormalize: true,
    addReset: false,
  };

  assert.equal(isUserChoices(invalid), false);
});

test('assertUserChoices throws on invalid choices', () => {
  assert.throws(() => assertUserChoices({ script: 'JavaScript' }), /Invalid user choices/);
});
