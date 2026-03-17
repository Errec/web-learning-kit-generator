import test from 'node:test';
import assert from 'node:assert/strict';
import { questions } from './setupQuestions';
import { markupChoices, scriptChoices, styleChoices } from './userChoicesValidation';

function questionByName(name: string): Record<string, unknown> {
  const question = questions.find((item) => item.name === name);
  assert.ok(question, `Expected question '${name}' to exist`);
  return question as Record<string, unknown>;
}

test('setup questions expose strict script/style/markup choice lists', () => {
  const scriptQuestion = questionByName('script');
  const styleQuestion = questionByName('style');
  const markupQuestion = questionByName('markup');

  assert.deepEqual(scriptQuestion.choices, [...scriptChoices]);
  assert.deepEqual(styleQuestion.choices, [...styleChoices]);
  assert.deepEqual(markupQuestion.choices, [...markupChoices]);
});

test('setup questions include boolean toggles with safe defaults', () => {
  const addNormalizeQuestion = questionByName('addNormalize');
  const addResetQuestion = questionByName('addReset');

  assert.equal(addNormalizeQuestion.type, 'confirm');
  assert.equal(addNormalizeQuestion.default, false);

  assert.equal(addResetQuestion.type, 'confirm');
  assert.equal(addResetQuestion.default, false);
});
