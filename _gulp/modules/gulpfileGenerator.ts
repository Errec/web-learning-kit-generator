import { UserChoices } from '../types';
import { writeFile } from '../utils/fileSystem';

export function generateGulpfile(choices: UserChoices): void {
  const gulpfileContent = `
const { src, dest, watch, series, parallel } = require('gulp');
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
const typescript = ${choices.script === 'TypeScript' ? "require('gulp-typescript')" : 'null'};
const tsify = ${choices.script === 'TypeScript' ? "require('tsify')" : 'null'};

const production = process.env.NODE_ENV === 'production';

async function clean() {
  await del(['dist']);
}

function styles() {
  return src('src/${choices.style.toLowerCase()}/**/*.${choices.style.toLowerCase()}')
    .pipe(plumber())
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulpif(!production, sourcemaps.write('.')))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  const b = browserify({
    entries: 'src/${choices.script === 'TypeScript' ? 'ts' : 'js'}/main.${choices.script === 'TypeScript' ? 'ts' : 'js'}',
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
}

function markup() {
  return src('src/${choices.markup === 'Pug' ? 'pug' : 'html'}/**/*.${choices.markup === 'Pug' ? 'pug' : 'html'}')
    .pipe(plumber())
    ${choices.markup === 'Pug' ? '.pipe(pug())' : ''}
    .pipe(dest('dist'));
}

function images() {
  return src('src/img/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/img'));
}

function serve(cb) {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    open: true
  });
  cb();
}

function watchFiles(cb) {
  watch('src/${choices.style.toLowerCase()}/**/*.${choices.style.toLowerCase()}', styles);
  watch('src/${choices.script === 'TypeScript' ? 'ts' : 'js'}/**/*.${choices.script === 'TypeScript' ? 'ts' : 'js'}', series(scripts, reload));
  watch('src/${choices.markup === 'Pug' ? 'pug' : 'html'}/**/*.${choices.markup === 'Pug' ? 'pug' : 'html'}', series(markup, reload));
  watch('src/img/**/*', series(images, reload));
  cb();
}

function reload(cb) {
  browserSync.reload();
  cb();
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.markup = markup;
exports.images = images;
exports.watch = watchFiles;

exports.build = series(clean, parallel(styles, scripts, markup, images));
exports.default = series(clean, parallel(styles, scripts, markup, images), serve, watchFiles);
`;

  writeFile('gulpfile.js', gulpfileContent);
}