import { create as createBrowserSync } from 'browser-sync';
import { series, TaskFunction, watch } from 'gulp';
import { UserChoices } from '../types';

const bs = createBrowserSync();

export function browserSyncServe(cb: () => void): void {
  bs.init({
    server: { baseDir: 'dist/' },
    open: false,
    notify: false
  });
  cb();
}

export function browserSyncReload(cb: () => void): void {
  bs.reload();
  cb();
}

interface Tasks {
  styleTask: TaskFunction;
  scriptTask: TaskFunction;
  markupTask: TaskFunction;
  imagesTask: TaskFunction;
}

export function createWatchTask(choices: UserChoices, tasks: Tasks) {
  return function watchTask(): void {
    const stylePath = `src/${choices.style === 'Sass' ? 'sass' : 'scss'}/**/*.${choices.style === 'Sass' ? 'sass' : 'scss'}`;
    const scriptPath = `src/${choices.script === 'TypeScript' ? 'ts' : 'js'}/**/*.${choices.script === 'TypeScript' ? 'ts' : 'js'}`;
    const markupPath = `src/${choices.markup === 'Pug' ? 'pug' : 'html'}/**/*.${choices.markup === 'Pug' ? 'pug' : 'html'}`;
    const imgPath = 'src/img/**/*';

    watch(stylePath, series(tasks.styleTask, browserSyncReload));
    watch(scriptPath, series(tasks.scriptTask, browserSyncReload));
    watch(markupPath, series(tasks.markupTask, browserSyncReload));
    watch(imgPath, series(tasks.imagesTask, browserSyncReload));
  };
}