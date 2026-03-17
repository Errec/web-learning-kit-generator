import test from 'node:test';
import assert from 'node:assert/strict';
import { markupSection } from '../templates/gulpfile/sections';
import { createGulpTemplateContext } from '../templates/gulpfile/types';

test('markupSection includes pug compilation when markup is Pug', () => {
  const context = createGulpTemplateContext({
    script: 'JavaScript',
    style: 'Sass',
    markup: 'Pug',
    addNormalize: false,
    addReset: false,
  });

  const output = markupSection(context);

  assert.match(output, /\.pipe\(pug\(\)\)/);
});

test('markupSection does not inject pug compilation when markup is HTML', () => {
  const context = createGulpTemplateContext({
    script: 'TypeScript',
    style: 'SCSS',
    markup: 'HTML',
    addNormalize: true,
    addReset: true,
  });

  const output = markupSection(context);

  assert.doesNotMatch(output, /\.pipe\(pug\(\)\)/);
  assert.match(output, /\.pipe\(plumber\(\)\)\n\s*\.pipe\(dest\('dist'\)\)/);
});
