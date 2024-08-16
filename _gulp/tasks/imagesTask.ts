import { dest, src } from 'gulp';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';

export function imagesTask() {
  return src('src/img/**/*')
    .pipe(cache(imagemin()))
    .pipe(dest('dist/img'));
}