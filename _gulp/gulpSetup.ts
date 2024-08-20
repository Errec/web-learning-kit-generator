import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { copyVendorCSS, createProjectFiles, createProjectStructure } from './modules/fileSetup';
import { generateGulpfile } from './modules/gulpfileGenerator';
import { confirmProjectDeletion, promptUser } from './modules/setupQuestions';
import { UserChoices } from './types';
import { deleteDirectory, fileExists } from './utils/fileSystem';
import { logger } from './utils/logger';

async function setup(): Promise<void> {
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
    generateGulpfile(choices);

    logger.success('Setup complete. Gulpfile has been generated.');
    logger.info('Starting development server...');

    exec('yarn start', (error, stdout, stderr) => {
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
