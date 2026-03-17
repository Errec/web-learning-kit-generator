import {
  cleanSection,
  devServerSection,
  exportsSection,
  imagesSection,
  importsSection,
  markupSection,
  scriptsSection,
  stylesSection,
} from './sections';
import { createGulpTemplateContext } from './types';
import { UserChoices } from '../../types';

export function buildGulpfileTemplate(choices: UserChoices): string {
  const context = createGulpTemplateContext(choices);

  return [
    importsSection(context),
    cleanSection(),
    stylesSection(context),
    scriptsSection(context),
    markupSection(context),
    imagesSection(),
    devServerSection(context),
    exportsSection(),
  ].join('\n\n');
}
