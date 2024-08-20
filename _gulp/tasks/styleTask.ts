import { dest, src, TaskFunction } from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import plumber from 'gulp-plumber';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import * as sass from 'sass';
import { UserChoices } from '../types';

const sassCompiler = gulpSass(sass);

export function styleTask(choices: UserChoices): TaskFunction {
  return function() {
    return src(`src/${choices.style.toLowerCase()}/**/*.${choices.style.toLowerCase()}`, { sourcemaps: true })
      .pipe(plumber())
      .pipe(sassCompiler({ indentedSyntax: choices.style === 'Sass' }))
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/css'));
  };
}