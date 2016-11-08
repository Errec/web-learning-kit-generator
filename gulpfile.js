var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var browserSync  = require('browser-sync');
var plumber      = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var sass         = require('gulp-sass');
var jade         = require('gulp-jade');
var imagemin     = require('gulp-imagemin');
var del          = require('del');
// sudo npm install gulp-uglify browser-sync gulp-plumber gulp-autoprefixer gulp-sass gulp-jade gulp-imagemin del --save-dev
gulp.task('styles', function(){
  return sass({
      indentedSyntax: true,
      includePaths: require('node-bourbon').includePaths})
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false}))
    .pipe(plumber())
    .pipe(gulp.dest('dev/css'));
});

gulp.task('templates', function(){
  return gulp.src('jade/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('dev/'));
});

gulp.task('scripts', function(){
  return gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(plumber())
    .pipe(gulp.dest('dev/js'));
});

gulp.task('images', function(){
  return gulp.src('img/**/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true}))
    .pipe(gulp.dest('dev/img/'));
});

gulp.task('cleanup', function() {
  return del(['dev/css', 'dev/js', 'dev/img']);
});

gulp.task('default', ['cleanup'], function() {
  gulp.start('styles', 'templates', 'scripts', 'images');
});

gulp.task('watch', function(){
  gulp.watch('jade/*.jade', ['templates']);
  gulp.watch('sass/*.scss', ['styles']);
  gulp.watch('js/*.js', ['scripts']);
  gulp.watch('img/**/*', ['images']);

// init server
  browserSync.init({
    server: {
      proxy: "local.dev",
      baseDir: "dev/"
    }
  });

  gulp.watch(['dev/**'], browserSync.reload);
});
