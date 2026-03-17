import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveProjectPaths } from './pathConfig';

test('resolveProjectPaths returns correct folders/extensions for Sass + JavaScript + HTML', () => {
  const result = resolveProjectPaths({
    script: 'JavaScript',
    style: 'Sass',
    markup: 'HTML',
    addNormalize: false,
    addReset: false,
  });

  assert.equal(result.scriptFolder, 'js');
  assert.equal(result.scriptExtension, 'js');
  assert.equal(result.styleFolder, 'sass');
  assert.equal(result.styleBaseFolder, 'sass/base');
  assert.equal(result.markupFolder, 'html');
  assert.equal(result.markupExtension, 'html');
});

test('resolveProjectPaths returns correct folders/extensions for SCSS + TypeScript + Pug', () => {
  const result = resolveProjectPaths({
    script: 'TypeScript',
    style: 'SCSS',
    markup: 'Pug',
    addNormalize: true,
    addReset: true,
  });

  assert.equal(result.scriptFolder, 'ts');
  assert.equal(result.scriptExtension, 'ts');
  assert.equal(result.styleFolder, 'scss');
  assert.equal(result.styleBaseFolder, 'scss/base');
  assert.equal(result.markupFolder, 'pug');
  assert.equal(result.markupExtension, 'pug');
});
