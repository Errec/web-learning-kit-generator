import autoprefixer from 'gulp-autoprefixer';
import beeper from 'beeper';
import sync from 'browser-sync';
const { init, reload } = sync;
import cache from 'gulp-cache';
import cleanCSS from 'gulp-clean-css';
import gconcat from 'gulp-concat';
import gulp from 'gulp';
const { src, dest, series, watch: gulpWatch } = gulp;
import util from 'gulp-util';
const { log, colors } = util;
import imagemin from 'gulp-imagemin';
import { onError as _onError } from 'gulp-notify';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import rename from "gulp-rename";

// gulp-sass 5 does not have a default Sass compiler; please set one yourself
// https://stackoverflow.com/a/69066757/7769052
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass)

import sourcemaps from 'gulp-sourcemaps';
const { init: _init, write } = sourcemaps;
import uglify from 'gulp-uglify';
// sudo npm install gulp-uglify browser-sync gulp-plumber gulp-autoprefixer gulp-sass gulp-pug gulp-imagemin gulp-cache gulp-clean-css gulp-sourcemaps gulp-concat beeper gulp-util gulp-rename gulp-notify --save-dev
var jsVendorFiles      = [];             // Holds the js vendor files to be concatenated
var myJsFiles          = ['js/*.js'];    // Holds the js files to be concatenated
import { existsSync, readFileSync, writeFile } from 'fs';  // ExistsSync var to check if font directory patch exist
var bowerDirectory     = getBowerDirectory();
var bootstrapJSPath    = bowerDirectory + "bootstrap/dist/js/bootstrap.min.js";
var bootstrapCSSPath   = bowerDirectory + "bootstrap/dist/css/bootstrap.min.css";
var bootstrapFontsPath = bowerDirectory + "bootstrap/dist/fonts/**.*";
var jqueryPath         = bowerDirectory + "jquery/dist/jquery.min.js";
var bootstrapExist     = false;
var onError            = function(err) { // Custom error msg with beep sound and text color
    _onError({
      title:    "Gulp error in " + err.plugin,
      message:  err.toString()
    })(err);
    beeper(3);
    this.emit('end');
    log(colors.red(err));
};

function getBowerDirectory() {
  var bowerComponents = "./bower_components";
  if(existsSync('.bowerrc')) {
    var bowerrc = JSON.parse(readFileSync('.bowerrc').toString());
    return bowerrc.directory;
  } else if (existsSync(bowerComponents)) {
    return bowerComponents + '/';
  } else {
    return '';
  }
}

function setupJquery(data) {
  var jqueryCDN = '    script(src="https://code.jquery.com/jquery-{{JQUERY_VERSION}}.min.js" integrity="{{JQUERY_SRI_HASH}}" crossorigin="anonymous")';
  var jqueryLocalFallback = "    <script>window.jQuery || document.write(" + "'<script src=" + '"js/vendor/jquery/dist/jquery/jquery.min.js"' + "><\\/script>')</script>";
  src(jqueryPath)
  .pipe(dest('./build/js/vendor/jquery/dist/jquery'));
  data.splice(data.length, 0, jqueryCDN);
  data.splice(data.length, 0, jqueryLocalFallback);
}

function setupBootstrap(data) {
  bootstrapExist = true;
  setupJquery(data);
  var bootstrapCSSCDN = '    link(href="https://maxcdn.bootstrapcdn.com/bootstrap/{{BOOTSTRAP_VERSION}}/css/bootstrap.min.css", rel="stylesheet", integrity="{{BOOTSTRAP_SRI_HASH}}", crossorigin="anonymous")';
  var bootstrapCSSLocalFallback = '    div(id="bootstrapCssTest" class="hidden")\n' + "    <script>$(function(){if ($('#bootstrapCssTest').is(':visible')){$('head').prepend('<link rel=" + '"stylesheet" href="/js/vendor/bootstrap/dist/css/bootstrap.min.css">' + "');}});</script>";
  var bootstrapJSCDN = '    script(src="https://maxcdn.bootstrapcdn.com/bootstrap/{{BOOTSTRAP_VERSION}}/js/bootstrap.min.js", integrity="{{BOOTSTRAP_SRI_HASH}}", crossorigin="anonymous")';
  var bootstrapJSLocalFallback = "    <script>if(typeof($.fn.modal) === 'undefined'" + ") {document.write('<script src=" + '"/js/vendor/bootstrap/dist/js/bootstrap.min.js"' + "><\\/script>')}</script>";
  src(bootstrapFontsPath)
  .pipe(dest('./build/js/vendor/bootstrap/dist/fonts'));
  src(bootstrapJSPath)
  .pipe(dest('./build/js/vendor/bootstrap/dist/js'));
  src(bootstrapCSSPath)
  .pipe(dest('./build/js/vendor/bootstrap/dist/css'));

  data.splice(8, 0, bootstrapCSSCDN);
  data.splice(data.length, 0, bootstrapJSCDN);
  data.splice(data.length, 0, bootstrapJSLocalFallback);
  data.splice(data.length, 0, bootstrapCSSLocalFallback);
}

function findKeyText(data, txt) {
  for (var i = 0; i < data.length; i++) {
    if(data[i].indexOf(txt) > -1) {
      return true;
    }
  }
  return false;
}

function styles(done) {
  src('styles/*.scss')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(_init())
  .pipe(sass({indentedSyntax: true}))
  .pipe(autoprefixer({
    cascade: false}))
  .pipe(cleanCSS())
  .pipe(write())
  .pipe(rename({ suffix: '.min'}))
  .pipe(dest('build/css'));

  done();
}

function templates(done) {
  src('./*.pug')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(pug())
  .pipe(dest('build/'));

  done();
}

function scripts(done) {
  return src(myJsFiles.concat(jsVendorFiles))
  .pipe(plumber({ errorHandler: onError }))
  .pipe(_init())
  .pipe(gconcat('bundle.js'))
  .pipe(uglify())
  .pipe(write())
  .pipe(rename({ suffix: '.min'}))
  .pipe(dest('build/js'));

  done();
}

function images(done) {
  src('img/**/*')
  .pipe(cache(imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true})))
  .pipe(dest('build/img/'));

  done();
}

function setupSrc(done) {
  var data = readFileSync('./index.pug').toString().split("\n");

  if(data[data.length - 1] === '') {
    data.pop();
  }

  if(data[data.length - 1].indexOf('script(src="js/bundle.min.js")') > -1) {
    data.pop();
  }

  if(bowerDirectory) {
    if(existsSync(bootstrapJSPath) && !findKeyText(data, 'bootstrap.min.css')) {
      setupBootstrap(data);
    }

    if(existsSync(jqueryPath) && !bootstrapExist  && !findKeyText(data, 'jquery.min.js')) {
      setupJquery(data);
    }
  }

  if(!findKeyText(data, 'bundle.min.js')) {
    data.splice(data.length, 0, '    script(src="js/bundle.min.js")');
  }

  var text = data.join("\n");
  writeFile('./index.pug', text, function (err) {
    if (err) throw err;
  });

  done();
}

function watchTask() {
  gulpWatch('styles/**/*', styles);
  gulpWatch(['templates/**/*', './*.pug'], templates);
  gulpWatch('js/*.js', scripts);
  gulpWatch('img/**/*', images);

    init.init({
      server: {
        baseDir: "build/"
      }
    });

  gulpWatch(['build/**'], reload);
}

// The 'setup' task that runs all the tasks in series
export const setup = series(styles, templates, scripts, images, setupSrc);
export const watch = series(watchTask);
