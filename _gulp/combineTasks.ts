import { parallel, series } from 'gulp';
import { browserSyncServe, createWatchTask } from './modules/buildEnvironment';
import { UserChoices } from './types';
import { logger } from './utils/logger';

async function loadUserChoices(): Promise<UserChoices> {
  try {
    const { readFile } = await import('fs/promises');
    const data = await readFile('_gulp/user-choices.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Failed to load user choices. Please run setup again.');
    process.exit(1);
  }
}

async function createGulpTasks() {
  const choices = await loadUserChoices();

  try {
    const { styleTask } = await import('./tasks/styleTask');
    const { scriptTask } = await import('./tasks/scriptTask');
    const { markupTask } = await import('./tasks/markupTask');
    const { imagesTask } = await import('./tasks/imagesTask');
    const { cleanTask } = await import('./tasks/cleanTask');

    const watchTask = createWatchTask(choices, {
      styleTask: styleTask(choices),
      scriptTask: scriptTask(choices),
      markupTask: markupTask(choices),
      imagesTask
    });

    const defaultTask = series(
      cleanTask,
      parallel(
        styleTask(choices),
        scriptTask(choices),
        markupTask(choices),
        imagesTask
      ),
      browserSyncServe,
      watchTask
    );

    const buildTask = series(
      cleanTask,
      parallel(
        styleTask(choices),
        scriptTask(choices),
        markupTask(choices),
        imagesTask
      )
    );

    return { defaultTask, buildTask };
  } catch (error) {
    logger.error(`Failed to create Gulp tasks: ${(error as Error).message}`);
    process.exit(1);
  }
}

export async function run() {
  try {
    const { defaultTask, buildTask } = await createGulpTasks();

    if (process.argv.includes('build')) {
      buildTask((err?: Error | null) => {
        if (err) {
          logger.error(`Build failed: ${err.message}`);
        } else {
          logger.success('Build completed successfully');
        }
      });
    } else {
      defaultTask((err?: Error | null) => {
        if (err) {
          logger.error(`Development server failed: ${err.message}`);
        } else {
          logger.success('Development server started');
        }
      });
    }
  } catch (error) {
    logger.error(`An error occurred during execution: ${(error as Error).message}`);
    process.exit(1);
  }
}

run().catch(error => {
  logger.error(`An error occurred: ${(error as Error).message}`);
  process.exit(1);
});