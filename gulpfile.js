var autoprefixer       = require('gulp-autoprefixer');
var beeper             = require('beeper');
var browserSync        = require('browser-sync');
var cache              = require('gulp-cache');
var cleanCSS           = require('gulp-clean-css');
var gconcat            = require('gulp-concat');
var gulp               = require('gulp');
var gutil              = require('gulp-util');
var imagemin           = require('gulp-imagemin');
var notify             = require('gulp-notify');
var plumber            = require('gulp-plumber');
var pug                = require('gulp-pug');
var rename             = require("gulp-rename");
var sass               = require('gulp-sass');
var sourcemaps         = require('gulp-sourcemaps');
var uglify             = require('gulp-uglify');
// sudo npm install gulp-uglify browser-sync gulp-plumber gulp-autoprefixer gulp-sass gulp-pug gulp-imagemin gulp-cache gulp-clean-css gulp-sourcemaps gulp-concat beeper gulp-util gulp-rename gulp-notify --save-dev
var jsVendorFiles      = [];             // Holds the js vendor files to be concatenated
var myJsFiles          = ['js/*.js'];    // Holds the js files to be concatenated
var fs                 = require('fs');  // ExistsSync var to check if font directory patch exist
var bowerDirectory     = getBowerDirectory();
var bootstrapJSPath    = bowerDirectory + "bootstrap/dist/js/bootstrap.min.js";
var bootstrapCSSPath   = bowerDirectory + "bootstrap/dist/css/bootstrap.min.css";
var bootstrapFontsPath = bowerDirectory + "bootstrap/dist/fonts/**.*";
var jqueryPath         = bowerDirectory + "jquery/dist/jquery.min.js";
var bootstrapExist     = false;
var onError            = function(err) { // Custom error msg with beep sound and text color
    notify.onError({
      title:    "Gulp error in " + err.plugin,
      message:  err.toString()
    })(err);
    beeper(3);
    this.emit('end');
    gutil.log(gutil.colors.red(err));
};

function getBowerDirectory() {
  var bowerComponents = "./bower_components";
  if(fs.existsSync('.bowerrc')) {
    var bowerrc = JSON.parse(fs.readFileSync('.bowerrc').toString());
    return bowerrc.directory;
  } else if (fs.existsSync(bowerComponents)) {
    return bowerComponents + '/';
  } else {
    return '';
  }
}

function setupJquery(data) {
  var jqueryCDN = '    script(src="https://code.jquery.com/jquery-{{JQUERY_VERSION}}.min.js" integrity="{{JQUERY_SRI_HASH}}" crossorigin="anonymous")';
  var jqueryLocalFallback = "    <script>window.jQuery || document.write(" + "'<script src=" + '"js/vendor/jquery/dist/jquery/jquery.min.js"' + "><\\/script>')</script>";
  gulp.src(jqueryPath)
  .pipe(gulp.dest('./build/js/vendor/jquery/dist/jquery'));
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
  gulp.src(bootstrapFontsPath)
  .pipe(gulp.dest('./build/js/vendor/bootstrap/dist/fonts'));
  gulp.src(bootstrapJSPath)
  .pipe(gulp.dest('./build/js/vendor/bootstrap/dist/js'));
  gulp.src(bootstrapCSSPath)
  .pipe(gulp.dest('./build/js/vendor/bootstrap/dist/css'));

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

gulp.task('setup-src', function() {
  var data = fs.readFileSync('./index.pug').toString().split("\n");

  if(data[data.length - 1] === '') {
    data.pop();
  }

  if(data[data.length - 1].indexOf('script(src="js/bundle.min.js")') > -1) {
    data.pop();
  }

  if(bowerDirectory) {
    if(fs.existsSync(bootstrapJSPath) && !findKeyText(data, 'bootstrap.min.css')) {
      setupBootstrap(data);
    }

    if(fs.existsSync(jqueryPath) && !bootstrapExist  && !findKeyText(data, 'jquery.min.js')) {
      setupJquery(data);
    }
  }

  if(!findKeyText(data, 'bundle.min.js')) {
    data.splice(data.length, 0, '    script(src="js/bundle.min.js")');
  }

  var text = data.join("\n");
  fs.writeFile('./index.pug', text, function (err) {
    if (err) throw err;
  });
});

gulp.task('default', function() {
  console.log("Use 'gulp setup' command to initialize the project files");
});

gulp.task('setup', function() {
  gulp.start('styles', 'templates', 'scripts', 'images', 'setup-src');
});

gulp.task('watch', function() {
  gulp.watch('styles/**/*',                        ['styles']);
  gulp.watch(['templates/**/*', './*.pug'],        ['templates']);
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
