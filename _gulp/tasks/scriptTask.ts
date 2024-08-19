import { dest, src } from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import typescript from 'gulp-typescript';
import { UserChoices } from '../types';

export function scriptTask(choices: UserChoices) {
  return function () {
    return src(`src/${choices.script.toLowerCase()}/**/*.${choices.script === 'TypeScript' ? 'ts' : 'js'}`, { sourcemaps: true })
      .pipe(plumber())
      .pipe(choices.script === 'TypeScript' ? typescript() : babel({ presets: ['@babel/preset-env'] }))
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/js'));
  };
}