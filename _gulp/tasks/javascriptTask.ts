import { dest, src } from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';

export function scriptTask() {
  return src('src/js/**/*.js', { sourcemaps: true })
    .pipe(plumber())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/js'));
}