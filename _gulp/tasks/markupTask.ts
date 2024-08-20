import { dest, src } from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import { UserChoices } from '../types';

export function markupTask(choices: UserChoices) {
  return function() {
    return src(`src/${choices.markup.toLowerCase()}/**/*.${choices.markup === 'Pug' ? 'pug' : 'html'}`)
      .pipe(plumber())
      .pipe(choices.markup === 'Pug' ? pug() : plumber())
      .pipe(dest('dist'));
  };
}