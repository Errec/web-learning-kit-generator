import { dest, src } from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';

export function markupTask() {
  return src('src/templates/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(dest('dist'));
}