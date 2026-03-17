import { resolveProjectPaths, ResolvedProjectPaths, resolveWatchGlobs, ResolvedWatchGlobs } from '../../modules/pathConfig';
import { UserChoices } from '../../types';

export interface GulpTemplateContext extends ResolvedProjectPaths, ResolvedWatchGlobs {
  choices: UserChoices;
}

export function createGulpTemplateContext(choices: UserChoices): GulpTemplateContext {
  return {
    choices,
    ...resolveProjectPaths(choices),
    ...resolveWatchGlobs(choices),
  };
}
