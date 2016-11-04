var gulp         = require('gulp'),
    uglify       = require('gulp-uglify'),
    browserSync  = require('browser-sync'),
    plumber      = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    changed      = require('gulp-changed'),
    sass         = require('gulp-sass'),
    jade         = require('gulp-jade'),
    imagemin     = require('gulp-imagemin');

  var reload = browserSync.reload;

gulp.task('templates', function(){
  gulp.src('jade/*.jade')
  .pipe(plumber())
  .pipe(jade())
  .pipe(gulp.dest('development/'));
});

gulp.task('sass', function(){
  gulp.src('sass/*.scss')
  .pipe(plumber())
  .pipe(sass({
      indentedSyntax: true,
      includePaths: require('node-bourbon').includePaths
    }))
  .pipe(gulp.dest('development/css'));
});

gulp.task('scripts', function(){
  gulp.src('img')
    .pipe(changed('img'))
    .pipe(imagemin())
    .pipe(gulp.dest('development/img/**/*'));

  gulp.src('js/*.js')
      .pipe(plumber())
      .pipe(uglify())
      .pipe(gulp.dest('development/js'));

  gulp.src('development/css/main.css')
    .pipe(autoprefixer({
        browsers: ['last 5 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('development/css'));
});

gulp.task('watch', ['browserSync'], function(){
  gulp.watch('jade/*.jade', ['templates']);
  gulp.watch('sass/*.scss', ['sass']);
  gulp.watch('development/js/*.js', reload);
  gulp.watch('development/index.html', reload);
  gulp.watch('development/css/*.css', reload);
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      proxy: "local.dev",
      baseDir: "development/"
    }
  });
});

gulp.task('default', ['scripts', 'watch']);
