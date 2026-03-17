import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildGulpfileTemplate } from '../templates/gulpfile';
import { UserChoices } from '../types';

interface MatrixCase {
  name: string;
  choices: UserChoices;
  snapshotFile: string;
}

const cases: MatrixCase[] = [
  {
    name: 'JavaScript + Sass + HTML',
    choices: { script: 'JavaScript', style: 'Sass', markup: 'HTML', addNormalize: false, addReset: false },
    snapshotFile: 'js-sass-html.gulpfile.snap',
  },
  {
    name: 'JavaScript + Sass + Pug',
    choices: { script: 'JavaScript', style: 'Sass', markup: 'Pug', addNormalize: false, addReset: false },
    snapshotFile: 'js-sass-pug.gulpfile.snap',
  },
  {
    name: 'JavaScript + SCSS + HTML',
    choices: { script: 'JavaScript', style: 'SCSS', markup: 'HTML', addNormalize: false, addReset: false },
    snapshotFile: 'js-scss-html.gulpfile.snap',
  },
  {
    name: 'JavaScript + SCSS + Pug',
    choices: { script: 'JavaScript', style: 'SCSS', markup: 'Pug', addNormalize: false, addReset: false },
    snapshotFile: 'js-scss-pug.gulpfile.snap',
  },
  {
    name: 'TypeScript + Sass + HTML',
    choices: { script: 'TypeScript', style: 'Sass', markup: 'HTML', addNormalize: false, addReset: false },
    snapshotFile: 'ts-sass-html.gulpfile.snap',
  },
  {
    name: 'TypeScript + Sass + Pug',
    choices: { script: 'TypeScript', style: 'Sass', markup: 'Pug', addNormalize: false, addReset: false },
    snapshotFile: 'ts-sass-pug.gulpfile.snap',
  },
  {
    name: 'TypeScript + SCSS + HTML',
    choices: { script: 'TypeScript', style: 'SCSS', markup: 'HTML', addNormalize: false, addReset: false },
    snapshotFile: 'ts-scss-html.gulpfile.snap',
  },
  {
    name: 'TypeScript + SCSS + Pug',
    choices: { script: 'TypeScript', style: 'SCSS', markup: 'Pug', addNormalize: false, addReset: false },
    snapshotFile: 'ts-scss-pug.gulpfile.snap',
  },
];

for (const scenario of cases) {
  test(`buildGulpfileTemplate snapshot: ${scenario.name}`, () => {
    const actual = `${buildGulpfileTemplate(scenario.choices)}\n`;
    const snapshotPath = path.join('_gulp', 'templates', 'gulpfile', '__snapshots__', scenario.snapshotFile);
    const expected = fs.readFileSync(snapshotPath, 'utf8');

    assert.equal(actual, expected);
  });
}
