import { UserChoices } from '../types';
import { writeFile } from '../utils/fileSystem';
import { buildGulpfileTemplate } from '../templates/gulpfile';

export function generateGulpfile(choices: UserChoices): void {
  const gulpfileContent = buildGulpfileTemplate(choices);
  writeFile('gulpfile.js', `${gulpfileContent}\n`);
}
