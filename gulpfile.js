var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var browserSync  = require('browser-sync');
var plumber      = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var changed      = require('gulp-changed');
var sass         = require('gulp-sass');
var jade         = require('gulp-jade');
var imagemin     = require('gulp-imagemin');

var reload = browserSync.reload; // just to simplify method call

gulp.task('templates', function(){
  gulp.src('jade/*.jade')
  .pipe(plumber())
  .pipe(jade())
  .pipe(gulp.dest('dev/'));
});

gulp.task('sass', function(){
  gulp.src('sass/*.scss')
  .pipe(plumber())
  .pipe(sass({
      indentedSyntax: true,
      includePaths: require('node-bourbon').includePaths
    }))
  .pipe(gulp.dest('dev/css'));
});

gulp.task('scripts', function(){
  gulp.src('img/*')
    .pipe(changed('img/*'))
    .pipe(imagemin())
    .pipe(gulp.dest('dev/img/'));

  gulp.src('js/*.js')
      .pipe(plumber())
      .pipe(uglify())
      .pipe(gulp.dest('dev/js'));

  gulp.src('dev/css/main.css')
    .pipe(autoprefixer({
        browsers: ['last 5 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('dev/css'));
});

gulp.task('watch', ['browserSync'], function(){
  gulp.watch('jade/*.jade', ['templates']);
  gulp.watch('sass/*.scss', ['sass']);
  gulp.watch('dev/js/*.js', reload);
  gulp.watch('dev/index.html', reload);
  gulp.watch('dev/css/*.css', reload);
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      proxy: "local.dev",
      baseDir: "dev/"
    }
  });
});

gulp.task('default', ['scripts', 'watch']);
