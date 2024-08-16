import inquirer from 'inquirer';
import { UserChoices } from '../types';

export const questions = [
  { type: 'list', name: 'script', message: 'Choose JavaScript or TypeScript:', choices: ['JavaScript', 'TypeScript'] },
  { type: 'list', name: 'style', message: 'Choose Sass or SCSS:', choices: ['Sass', 'SCSS'] },
  { type: 'list', name: 'markup', message: 'Choose HTML or Pug:', choices: ['HTML', 'Pug'] },
  { type: 'confirm', name: 'addNormalize', message: 'Add normalize.css?', default: false },
  { type: 'confirm', name: 'addReset', message: 'Add reset.css?', default: false }
];

export async function promptUser(): Promise<UserChoices> {
  return await inquirer.prompt(questions);
}

export async function confirmProjectDeletion(): Promise<boolean> {
  const { deleteProject } = await inquirer.prompt([
    { type: 'confirm', name: 'deleteProject', message: 'DELETE existing project and start new?', default: false }
  ]);
  return deleteProject;
}