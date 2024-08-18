import { dest, src } from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import plumber from 'gulp-plumber';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'sass';

const sassCompiler = gulpSass(sass);

export function styleTask() {
  return src('src/scss/main.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sassCompiler())
    .pipe(autoprefixer('last 5 versions'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'));
}