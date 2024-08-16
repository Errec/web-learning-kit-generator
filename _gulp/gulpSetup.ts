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
    
    // Save user choices for later use
    await writeFile('_gulp/user-choices.json', JSON.stringify(choices, null, 2));

    createProjectStructure(choices);
    createProjectFiles(choices);
    copyVendorCSS(choices);
    generateGulpfile(choices);

    logger.success('Setup complete.');
      logger.info('Starting live server...');

      exec('gulp', (err, stdout, stderr) => {
        if (err) {
          logger.error(`Error starting live server: ${err.message}`);
          return;
        }
        console.log(stdout);
      });
  } catch (error: unknown) {
    logger.error(`An error occurred during setup: ${(<Error>error).message}`);
  }
}

setup();