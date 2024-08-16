import browserSync from 'browser-sync';
import { series, watch } from 'gulp';
import { UserChoices } from '../types';

const bs = browserSync.create();

export function browserSyncServe(cb: () => void): void {
  bs.init({ server: { baseDir: 'dist/' } });
  cb();
}

export function browserSyncReload(cb: () => void): void {
  bs.reload();
  cb();
}

export function createWatchTask(choices: UserChoices, tasks: Record<string, () => void>) {
  const stylePath = `src/${choices.style === 'Sass' ? 'sass' : 'scss'}/**/*.${choices.style === 'Sass' ? 'sass' : 'scss'}`;
  const scriptPath = `src/${choices.script === 'TypeScript' ? 'ts' : 'js'}/**/*.${choices.script === 'TypeScript' ? 'ts' : 'js'}`;
  const markupPath = `src/${choices.markup === 'Pug' ? 'templates/**/*.pug' : 'html/**/*.html'}`;
  const imgPath = 'src/img/**/*';

  return function watchTask(): void {
    watch(stylePath, series(tasks.styleTask, browserSyncReload));
    watch(scriptPath, series(tasks.scriptTask, browserSyncReload));
    watch(markupPath, series(tasks.markupTask, browserSyncReload));
    watch(imgPath, series(tasks.imagesTask, browserSyncReload));
  };
}