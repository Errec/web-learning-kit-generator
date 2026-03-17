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

export interface ResolvedWatchGlobs {
  styleGlob: string;
  scriptGlob: string;
  markupGlob: string;
  imageGlob: 'src/img/**/*';
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

export function resolveWatchGlobs(choices: UserChoices): ResolvedWatchGlobs {
  const paths = resolveProjectPaths(choices);

  return {
    styleGlob: `src/${paths.styleFolder}/**/*.${paths.styleExtension}`,
    scriptGlob: `src/${paths.scriptFolder}/**/*.${paths.scriptExtension}`,
    markupGlob: `src/${paths.markupFolder}/**/*.${paths.markupExtension}`,
    imageGlob: 'src/img/**/*',
  };
}
