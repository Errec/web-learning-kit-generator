import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';
import { copyVendorCSS, createProjectFiles, createProjectStructure } from './modules/fileSetup';
import { generateGulpfile } from './modules/gulpfileGenerator';
import { parseSetupOptions } from './modules/setupCliOptions';
import { confirmProjectDeletion, promptUser } from './modules/setupQuestions';
import { assertUserChoices } from './modules/userChoicesValidation';
import { UserChoices } from './types';
import { deleteProjectDirectory, fileExists } from './utils/fileSystem';
import { logger } from './utils/logger';

async function prepareProjectDirectories(autoConfirm: boolean): Promise<boolean> {
  const projectExists = fileExists('src') || fileExists('dist');
  if (!projectExists) {
    return true;
  }

  const shouldDelete = autoConfirm ? true : await confirmProjectDeletion();
  if (!shouldDelete) {
    logger.info('Project setup canceled. Exiting...');
    return false;
  }

  deleteProjectDirectory('src');
  deleteProjectDirectory('dist');
  return true;
}

async function resolveUserChoices(shouldPrompt: boolean, preselectedChoices?: UserChoices): Promise<UserChoices> {
  const rawChoices = shouldPrompt ? await promptUser() : preselectedChoices;
  return assertUserChoices(rawChoices);
}

async function scaffoldProject(choices: UserChoices): Promise<void> {
  await writeFile('_gulp/user-choices.json', JSON.stringify(choices, null, 2));

  createProjectStructure(choices);
  createProjectFiles(choices);
  copyVendorCSS(choices);
  generateGulpfile(choices);
}

function startDevServer(): void {
  const child = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (error) => {
    logger.error(`Error starting development server: ${error.message}`);
  });
}

async function setup(): Promise<void> {
  try {
    const parsedOptions = parseSetupOptions(process.argv.slice(2));

    const shouldContinue = await prepareProjectDirectories(parsedOptions.autoConfirm);
    if (!shouldContinue) {
      return;
    }

    const choices = await resolveUserChoices(parsedOptions.shouldPrompt, parsedOptions.choices);
    await scaffoldProject(choices);

    logger.success('Setup complete. Gulpfile has been generated.');
    logger.info('Starting development server...');
    startDevServer();
  } catch (error: unknown) {
    logger.error(`An error occurred during setup: ${(error as Error).message}`);
  }
}

setup();
