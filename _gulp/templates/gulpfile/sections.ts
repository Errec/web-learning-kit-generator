import { GulpTemplateContext } from './types';

export function importsSection({ choices }: GulpTemplateContext): string {
  return `const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const del = require('del');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const pug = ${choices.markup === 'Pug' ? "require('gulp-pug')" : 'null'};
const tsify = ${choices.script === 'TypeScript' ? "require('tsify')" : 'null'};

const production = process.env.NODE_ENV === 'production';`;
}

export function cleanSection(): string {
  return `async function clean() {
  await del(['dist']);
}`;
}

export function stylesSection({ styleFolder, styleExtension }: GulpTemplateContext): string {
  return `function styles() {
  return src('src/${styleFolder}/**/*.${styleExtension}')
    .pipe(plumber())
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulpif(!production, sourcemaps.write('.')))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}`;
}

export function scriptsSection({ choices, scriptFolder, scriptExtension }: GulpTemplateContext): string {
  return `function scripts() {
  const b = browserify({
    entries: 'src/${scriptFolder}/main.${scriptExtension}',
    debug: !production,
  })
  .transform(babelify, {
    presets: ['@babel/preset-env'],
    extensions: ['.js', '.ts']
  });

  ${choices.script === 'TypeScript' ? 'b.plugin(tsify);' : ''}

  return b.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulpif(!production, sourcemaps.init({ loadMaps: true })))
    .pipe(dest('dist/js'))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulpif(!production, sourcemaps.write('.')))
    .pipe(dest('dist/js'));
}`;
}

export function markupSection({ choices, markupFolder, markupExtension }: GulpTemplateContext): string {
  return `function markup() {
  return src('src/${markupFolder}/**/*.${markupExtension}')
    .pipe(plumber())
    ${choices.markup === 'Pug' ? '.pipe(pug())' : ''}
    .pipe(dest('dist'));
}`;
}

export function imagesSection(): string {
  return `function images() {
  return src('src/img/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/img'));
}`;
}

export function devServerSection({ styleFolder, styleExtension, scriptFolder, scriptExtension, markupFolder, markupExtension }: GulpTemplateContext): string {
  return `function serve(cb) {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    open: true
  });
  cb();
}

function watchFiles(cb) {
  watch('src/${styleFolder}/**/*.${styleExtension}', styles);
  watch('src/${scriptFolder}/**/*.${scriptExtension}', series(scripts, reload));
  watch('src/${markupFolder}/**/*.${markupExtension}', series(markup, reload));
  watch('src/img/**/*', series(images, reload));
  cb();
}

function reload(cb) {
  browserSync.reload();
  cb();
}`;
}

export function exportsSection(): string {
  return `exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.markup = markup;
exports.images = images;
exports.watch = watchFiles;

exports.build = series(clean, parallel(styles, scripts, markup, images));
exports.default = series(clean, parallel(styles, scripts, markup, images), serve, watchFiles);`;
}
