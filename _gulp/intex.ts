import { readFile } from 'fs/promises';
import { parallel, series } from 'gulp';
import { browserSyncServe, createWatchTask } from './modules/buildEnvironment';
import { UserChoices } from './types';
import { logger } from './utils/logger';

async function loadUserChoices(): Promise<UserChoices> {
  try {
    const data = await readFile('_gulp/user-choices.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Failed to load user choices. Please run setup again.');
    process.exit(1);
  }
}

async function createGulpTasks() {
  const choices = await loadUserChoices();
  
  // Import task functions dynamically based on user choices
  const { styleTask } = await import(`./tasks/${choices.style.toLowerCase()}Task`);
  const { scriptTask } = await import(`./tasks/${choices.script.toLowerCase()}Task`);
  const { markupTask } = await import(`./tasks/${choices.markup.toLowerCase()}Task`);
  const { imagesTask } = await import('./tasks/imagesTask');
  const { cleanTask } = await import('./tasks/cleanTask');

  const watchTask = createWatchTask(choices, { styleTask, scriptTask, markupTask, imagesTask });

  const defaultTask = series(
    cleanTask,
    parallel(styleTask, scriptTask, markupTask, imagesTask),
    browserSyncServe,
    watchTask
  );

  const buildTask = series(
    cleanTask,
    parallel(styleTask, scriptTask, markupTask, imagesTask)
  );

  return { defaultTask, buildTask };
}

async function run() {
  const { defaultTask, buildTask } = await createGulpTasks();

  if (process.argv.includes('build')) {
    buildTask();
  } else {
    defaultTask();
  }
}

run().catch(error => {
  logger.error(`An error occurred: ${error.message}`);
  process.exit(1);
});