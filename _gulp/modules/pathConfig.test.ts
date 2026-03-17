import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveProjectPaths, resolveWatchGlobs } from './pathConfig';

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

test('resolveWatchGlobs returns expected watch paths for JavaScript + Sass + HTML', () => {
  const globs = resolveWatchGlobs({
    script: 'JavaScript',
    style: 'Sass',
    markup: 'HTML',
    addNormalize: false,
    addReset: false,
  });

  assert.equal(globs.styleGlob, 'src/sass/**/*.sass');
  assert.equal(globs.scriptGlob, 'src/js/**/*.js');
  assert.equal(globs.markupGlob, 'src/html/**/*.html');
  assert.equal(globs.imageGlob, 'src/img/**/*');
});

test('resolveWatchGlobs returns expected watch paths for TypeScript + SCSS + Pug', () => {
  const globs = resolveWatchGlobs({
    script: 'TypeScript',
    style: 'SCSS',
    markup: 'Pug',
    addNormalize: true,
    addReset: true,
  });

  assert.equal(globs.styleGlob, 'src/scss/**/*.scss');
  assert.equal(globs.scriptGlob, 'src/ts/**/*.ts');
  assert.equal(globs.markupGlob, 'src/pug/**/*.pug');
  assert.equal(globs.imageGlob, 'src/img/**/*');
});
