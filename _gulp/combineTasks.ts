import { readFile, writeFile } from 'fs/promises';
import { parallel, series, TaskFunction } from 'gulp';
import { browserSyncServe, createWatchTask } from './modules/buildEnvironment';
import { copyVendorCSS, createProjectFiles, createProjectStructure } from './modules/fileSetup';
import { confirmProjectDeletion, promptUser } from './modules/setupQuestions';
import { UserChoices } from './types';
import { deleteDirectory, fileExists } from './utils/fileSystem';
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

  try {
    const { styleTask } = await import('./tasks/styleTask');
    const { scriptTask } = await import('./tasks/scriptTask');
    const { markupTask } = await import('./tasks/markupTask');
    const { imagesTask } = await import('./tasks/imagesTask');
    const { cleanTask } = await import('./tasks/cleanTask');

    const watchTask = createWatchTask(choices, {
      styleTask: styleTask(choices) as TaskFunction,
      scriptTask: scriptTask(choices) as TaskFunction,
      markupTask: markupTask(choices) as TaskFunction,
      imagesTask: imagesTask() as TaskFunction
    });

    const defaultTask: TaskFunction = (done) => {
      return series(
        cleanTask(),
        parallel(
          styleTask(choices),
          scriptTask(choices),
          markupTask(choices),
          imagesTask()
        ),
        browserSyncServe,
        watchTask
      )(done);
    };

    const buildTask: TaskFunction = (done) => {
      return series(
        cleanTask(),
        parallel(
          styleTask(choices),
          scriptTask(choices),
          markupTask(choices),
          imagesTask()
        )
      )(done);
    };

    return { defaultTask, buildTask };
  } catch (error) {
    logger.error(`Failed to create Gulp tasks: ${(error as Error).message}`);
    process.exit(1);
  }
}

export async function setup(): Promise<void> {
  try {
    const projectExists = fileExists('src') || fileExists('dist');
    if (projectExists) {
      const shouldDelete = await confirmProjectDeletion();
      if (!shouldDelete) {
        logger.info('Project setup canceled. Exiting...');
        return;
      }
      deleteDirectory('src');
      deleteDirectory('dist');
    }

    const choices: UserChoices = await promptUser();
    
    await writeFile('_gulp/user-choices.json', JSON.stringify(choices, null, 2));

    createProjectStructure(choices);
    createProjectFiles(choices);
    copyVendorCSS(choices);

    logger.success('Setup complete. Gulpfile has been generated.');
    logger.info('Starting development server...');

    const { defaultTask } = await createGulpTasks();
    defaultTask((err?: Error | null) => {
      if (err) {
        logger.error(`Development server failed: ${err.message}`);
      } else {
        logger.success('Development server started');
      }
    });
  } catch (error: unknown) {
    logger.error(`An error occurred during setup: ${(error as Error).message}`);
  }
}

setup().catch(error => {
  logger.error(`An error occurred: ${(error as Error).message}`);
  process.exit(1);
});