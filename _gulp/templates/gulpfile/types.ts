import { UserChoices } from '../../types';

export interface GulpTemplateContext {
  choices: UserChoices;
  styleFolder: 'sass' | 'scss';
  styleExtension: 'sass' | 'scss';
  scriptFolder: 'js' | 'ts';
  scriptExtension: 'js' | 'ts';
  markupFolder: 'html' | 'pug';
  markupExtension: 'html' | 'pug';
}

export function createGulpTemplateContext(choices: UserChoices): GulpTemplateContext {
  return {
    choices,
    styleFolder: choices.style === 'Sass' ? 'sass' : 'scss',
    styleExtension: choices.style === 'Sass' ? 'sass' : 'scss',
    scriptFolder: choices.script === 'TypeScript' ? 'ts' : 'js',
    scriptExtension: choices.script === 'TypeScript' ? 'ts' : 'js',
    markupFolder: choices.markup === 'Pug' ? 'pug' : 'html',
    markupExtension: choices.markup === 'Pug' ? 'pug' : 'html',
  };
}
