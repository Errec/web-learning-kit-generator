import { resolveProjectPaths, ResolvedProjectPaths } from '../../modules/pathConfig';
import { UserChoices } from '../../types';

export interface GulpTemplateContext extends ResolvedProjectPaths {
  choices: UserChoices;
}

export function createGulpTemplateContext(choices: UserChoices): GulpTemplateContext {
  return {
    choices,
    ...resolveProjectPaths(choices),
  };
}
