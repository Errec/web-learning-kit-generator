import browserify from 'browserify';
import { dest, TaskFunction } from 'gulp';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import tsify from 'tsify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import { UserChoices } from '../types';

export function scriptTask(choices: UserChoices): TaskFunction {
  return function() {
    const b = browserify({
      entries: `src/${choices.script === 'TypeScript' ? 'ts' : 'js'}/main.${choices.script === 'TypeScript' ? 'ts' : 'js'}`,
      debug: true,
    });

    if (choices.script === 'TypeScript') {
      b.plugin(tsify);
    }

    return b.bundle()
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(dest('dist/js'))
      .pipe(uglify())
      .pipe(rename('main.min.js'))
      .pipe(sourcemaps.write('./'))
      .pipe(dest('dist/js'));
  };
}