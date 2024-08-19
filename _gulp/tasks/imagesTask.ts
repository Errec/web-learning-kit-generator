import { dest, src } from 'gulp';
import imagemin from 'gulp-imagemin';

export function imagesTask() {
  return src('src/img/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/img'));
}