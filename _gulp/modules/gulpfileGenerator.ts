import { GulpTasks, UserChoices } from '../types';
import { writeFile } from '../utils/fileSystem';

function getGulpTasks(choices: UserChoices): GulpTasks {
  const styleExt = choices.style === 'Sass' ? 'sass' : 'scss';
  const scriptExt = choices.script === 'TypeScript' ? 'ts' : 'js';

  return {
    styleTask: `
function styleTask() {
  return src('src/${styleExt}/main.${styleExt}', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass({ indentedSyntax: ${choices.style === 'Sass'} }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(cssnano())
    .pipe(dest('dist/css', { sourcemaps: '.' }));
}`,
    scriptTask: choices.script === 'TypeScript' 
      ? `
function scriptTask() {
  return src('src/ts/**/*.ts', { sourcemaps: true })
    .pipe(plumber())
    .pipe(typescript())
    .pipe(terser())
    .pipe(dest('dist/js', { sourcemaps: '.' }));
}`
      : `
function scriptTask() {
  return src('src/js/**/*.js', { sourcemaps: true })
    .pipe(plumber())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist/js', { sourcemaps: '.' }));
}`,
    markupTask: choices.markup === 'Pug' 
      ? `
function pugTask() {
  return src('src/templates/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(dest('dist'));
}`
      : `
function htmlTask() {
  return src('src/html/*.html')
    .pipe(plumber())
    .pipe(dest('dist'));
}`
  };
}

export function generateGulpfile(choices: UserChoices): void {
  const tasks = getGulpTasks(choices);

  const pugImport = choices.markup === 'Pug'
    ? "const pug = require('gulp-pug');" : '';
  const tsImport = choices.script === 'TypeScript'
    ? "const typescript = require('gulp-typescript');" : '';

  const gulpfileContent = `
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
${pugImport}
${tsImport}

${tasks.styleTask}
${tasks.scriptTask}
${tasks.markupTask}

function imagesTask() {
  return src('src/img/**/*')
    .pipe(cache(imagemin()))
    .pipe(dest('dist/img'));
}

function browserSyncServe(cb) {
  browserSync.init({ server: { baseDir: 'dist/' } });
  cb();
}

function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

function watchTask() {
  watch('src/${choices.style === 'Sass' ? 'sass' : 'scss'}/**/*.${choices.style === 'Sass' ? 'sass' : 'scss'}',
    series(styleTask, browserSyncReload));
  watch('src/${choices.script === 'TypeScript' ? 'ts' : 'js'}/**/*.${choices.script === 'TypeScript' ? 'ts' : 'js'}',
    series(scriptTask, browserSyncReload));
  watch('src/${choices.markup === 'Pug' ? 'templates/**/*.pug' : 'html/**/*.html'}',
    series(${choices.markup === 'Pug' ? 'pugTask' : 'htmlTask'}, browserSyncReload));
  watch('src/img/**/*', series(imagesTask, browserSyncReload));
}

function clean() {
  return del(['dist']);
}

exports.default = series(
  clean,
  parallel(
    styleTask,
    scriptTask,
    ${choices.markup === 'Pug' ? 'pugTask' : 'htmlTask'},
    imagesTask
  ),
  browserSyncServe,
  watchTask
);

exports.build = series(
  clean,
  parallel(
    styleTask,
    scriptTask,
    ${choices.markup === 'Pug' ? 'pugTask' : 'htmlTask'},
    imagesTask
  )
);`;

  writeFile('gulpfile.js', gulpfileContent);
}