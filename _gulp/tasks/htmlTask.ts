import { dest, src } from 'gulp';
import plumber from 'gulp-plumber';

export function markupTask() {
  return src('src/html/*.html')
    .pipe(plumber())
    .pipe(dest('dist'));
}