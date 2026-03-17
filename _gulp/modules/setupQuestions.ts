import inquirer from 'inquirer';
import { UserChoices } from '../types';
import { markupChoices, scriptChoices, styleChoices } from './userChoicesValidation';

export const questions = [
  { type: 'list', name: 'script', message: 'Choose JavaScript or TypeScript:', choices: [...scriptChoices] },
  { type: 'list', name: 'style', message: 'Choose Sass or SCSS:', choices: [...styleChoices] },
  { type: 'list', name: 'markup', message: 'Choose HTML or Pug:', choices: [...markupChoices] },
  { type: 'confirm', name: 'addNormalize', message: 'Add normalize.css?', default: false },
  { type: 'confirm', name: 'addReset', message: 'Add reset.css?', default: false }
];

export async function promptUser(): Promise<UserChoices> {
  return inquirer.prompt(questions);
}

export async function confirmProjectDeletion(): Promise<boolean> {
  const { deleteProject } = await inquirer.prompt([
    { type: 'confirm', name: 'deleteProject', message: 'DELETE existing project and start new?', default: false }
  ]);
  return deleteProject;
}
