import { dest, src } from 'gulp';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import ts from 'gulp-typescript';

export function scriptTask() {
  return src('src/ts/**/*.ts', { sourcemaps: true })
    .pipe(plumber())
    .pipe(ts())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/js'));
}