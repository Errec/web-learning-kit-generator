var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var beeper       = require('beeper');
var browserSync  = require('browser-sync');
var cache        = require('gulp-cache');
var cleanCSS     = require('gulp-clean-css');
var concat       = require('gulp-concat');
var del          = require('del');
var imagemin     = require('gulp-imagemin');
var jade         = require('gulp-jade');
var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var gutil        = require('gulp-util');
// sudo npm install gulp-uglify browser-sync gulp-plumber gulp-autoprefixer gulp-sass gulp-jade gulp-imagemin del gulp-cache gulp-clean-css gulp-sourcemaps gulp-concat beeper gulp-util --save-dev

var onError = function (err) {
    beeper(3);
    gutil.log(gutil.colors.green(err));
};

gulp.task('styles', function(){
  gulp.src('styles/*.scss')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(sourcemaps.init())
  .pipe(sass({indentedSyntax: true}))
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false}))
  .pipe(cleanCSS())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('build/css'));
});

gulp.task('templates', function(){
  gulp.src('templates/*.jade')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(jade())
  .pipe(gulp.dest('build/'));
});

gulp.task('scripts', function(){
  return gulp.src(['js/index.js', 'js/vendor/file1.js', 'js/vendor/file2.js'])
  .pipe(plumber({ errorHandler: onError }))
  .pipe(sourcemaps.init())
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('build/js'));
});

gulp.task('images', function(){
  gulp.src('img/**/*')
  .pipe(cache(imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true})))
  .pipe(gulp.dest('build/img/'));
});

gulp.task('cleanup', function() {
  del(['build/css', 'build/js', 'build/img']);
});

gulp.task('default', ['cleanup'], function() {
  gulp.start('styles', 'templates', 'scripts', 'images');
});

gulp.task('watch', function(){
  gulp.watch('styles/**/*',      ['styles']);
  gulp.watch('templates/*.jade', ['templates']);
  gulp.watch('js/*.js',          ['scripts']);
  gulp.watch('img/**/*',         ['images']);

// init server
  browserSync.init({
    server: {
      proxy: "local.build",
      baseDir: "build/"
    }
  });

  gulp.watch(['build/**'], browserSync.reload);
});
