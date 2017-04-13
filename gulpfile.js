var autoprefixer = require('gulp-autoprefixer');
var beeper       = require('beeper');
var browserSync  = require('browser-sync');
var cache        = require('gulp-cache');
var cleanCSS     = require('gulp-clean-css');
var gconcat       = require('gulp-concat');
var gulp         = require('gulp');
var imagemin     = require('gulp-imagemin');
var notify       = require('gulp-notify');
var plumber      = require('gulp-plumber');
var pug          = require('gulp-pug');
var rename       = require("gulp-rename");
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var gutil        = require('gulp-util');
// sudo npm install gulp-uglify browser-sync gulp-plumber gulp-autoprefixer gulp-sass gulp-pug gulp-imagemin gulp-cache gulp-clean-css gulp-sourcemaps gulp-concat beeper gulp-util gulp-rename gulp-notify --save-dev
var jsVendorFiles = [];             // Holds the js vendor files to be concatenated
var myJsFiles     = ['js/*.js'];    // Holds the js files to be concatenated
var fs            = require('fs');  // ExistsSync var to check if font directory patch exist
var onError       = function(err) { // Custom error msg with beep sound and text color
    notify.onError({
      title:    "Gulp error in " + err.plugin,
      message:  err.toString()
    })(err);
    beeper(3);
    this.emit('end');
    gutil.log(gutil.colors.red(err));
};
var bowerDest          = "js/vendor/";
var buildPath          = "build";
var bootstrapPath      = "bootstrap/dist/js/bootstrap.min.js";
var bootstrapFontsPath = "bootstrap/dist/fonts/**.*";
var jqueryPath         = "jquery/dist/jquery.min.js";

gulp.task('styles', function() {
  gulp.src('styles/*.scss')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(sourcemaps.init())
  .pipe(sass({indentedSyntax: true}))
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false}))
  .pipe(cleanCSS())
  .pipe(sourcemaps.write())
  .pipe(rename({ suffix: '.min'}))
  .pipe(gulp.dest('build/css'));
});

gulp.task('templates', function() {
  gulp.src('./*.pug')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(pug())
  .pipe(gulp.dest('build/'));
});

gulp.task('scripts', function() {
  return gulp.src(myJsFiles.concat(jsVendorFiles))
  .pipe(plumber({ errorHandler: onError }))
  .pipe(sourcemaps.init())
  .pipe(gconcat('bundle.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(rename({ suffix: '.min'}))
  .pipe(gulp.dest('build/js'));
});

gulp.task('images', function() {
  gulp.src('img/**/*')
  .pipe(cache(imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true})))
  .pipe(gulp.dest('build/img/'));
});

gulp.task('check-bower-vendor', function() {
  if (!fs.existsSync(bowerDest + bootstrapPath)) {
    gulp.src(bowerDest + bootstrapFontsPath)
    .pipe(gulp.dest('build/js/vendor/bootstrap/dist/fonts/'));
    gulp.src(bowerDest + bootstrapPath)
    .pipe(gulp.dest('build/js/vendor/bootstrap/dist/js/'));
    // jsVendorFiles.push("js/vendor/bootstrap/dist/js/bootstrap.min.js");
  }
  if (!fs.existsSync(bowerDest + jqueryPath)) {
    gulp.src(bowerDest + jqueryPath)
    .pipe(gulp.dest('build/js/vendor/jquery/dist/jquery/'));
    // jsVendorFiles.push("js/vendor/jquery/dist/jquery.min.js");
  }
});

gulp.task('default',['check-bower-vendor'], function() {
  gulp.start('styles', 'templates', 'scripts', 'images');
});

gulp.task('watch', function() {
  gulp.start('styles', 'templates', 'scripts', 'images');
  gulp.watch('styles/**/*',                        ['styles']);
  gulp.watch(['templates/**/*.pug', './*.pug'],    ['templates']);
  gulp.watch('js/*.js',                            ['scripts']);
  gulp.watch('img/**/*',                           ['images']);

// init server
  browserSync.init({
    server: {
      proxy: "local.build",
      baseDir: "build/"
    }
  });

  gulp.watch(['build/**'], browserSync.reload);
});
