import { UserChoices } from '../types';

export interface ResolvedProjectPaths {
  scriptFolder: 'js' | 'ts';
  scriptExtension: 'js' | 'ts';
  styleFolder: 'sass' | 'scss';
  styleExtension: 'sass' | 'scss';
  styleBaseFolder: 'sass/base' | 'scss/base';
  markupFolder: 'html' | 'pug';
  markupExtension: 'html' | 'pug';
}

export function resolveProjectPaths(choices: UserChoices): ResolvedProjectPaths {
  const styleFolder = choices.style === 'Sass' ? 'sass' : 'scss';

  return {
    scriptFolder: choices.script === 'TypeScript' ? 'ts' : 'js',
    scriptExtension: choices.script === 'TypeScript' ? 'ts' : 'js',
    styleFolder,
    styleExtension: styleFolder,
    styleBaseFolder: choices.style === 'Sass' ? 'sass/base' : 'scss/base',
    markupFolder: choices.markup === 'Pug' ? 'pug' : 'html',
    markupExtension: choices.markup === 'Pug' ? 'pug' : 'html',
  };
}
