import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { copyVendorCSS, createProjectFiles, createProjectStructure } from './modules/fileSetup';
import { generateGulpfile } from './modules/gulpfileGenerator';
import { confirmProjectDeletion, promptUser } from './modules/setupQuestions';
import { parseSetupOptions } from './modules/setupCliOptions';
import { assertUserChoices } from './modules/userChoicesValidation';
import { UserChoices } from './types';
import { deleteDirectory, fileExists } from './utils/fileSystem';
import { logger } from './utils/logger';

async function setup(): Promise<void> {
  try {
    const parsedOptions = parseSetupOptions(process.argv.slice(2));

    const projectExists = fileExists('src') || fileExists('dist');
    if (projectExists) {
      const shouldDelete = parsedOptions.autoConfirm ? true : await confirmProjectDeletion();
      if (!shouldDelete) {
        logger.info('Project setup canceled. Exiting...');
        return;
      }
      deleteDirectory('src');
      deleteDirectory('dist');
    }

    const rawChoices = parsedOptions.shouldPrompt ? await promptUser() : parsedOptions.choices;
    const choices: UserChoices = assertUserChoices(rawChoices);

    await writeFile('_gulp/user-choices.json', JSON.stringify(choices, null, 2));

    createProjectStructure(choices);
    createProjectFiles(choices);
    copyVendorCSS(choices);
    generateGulpfile(choices);

    logger.success('Setup complete. Gulpfile has been generated.');
    logger.info('Starting development server...');

    exec('npm start', (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        logger.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(stdout);
    });
  } catch (error: unknown) {
    logger.error(`An error occurred during setup: ${(error as Error).message}`);
  }
}

setup();
