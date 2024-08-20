import { dest, src, TaskFunction } from 'gulp';
import imagemin from 'gulp-imagemin';

export function imagesTask(): TaskFunction {
  return function() {
    return src('src/img/**/*')
      .pipe(imagemin())
      .pipe(dest('dist/img'));
  };
}