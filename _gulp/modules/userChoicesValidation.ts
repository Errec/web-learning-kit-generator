import { UserChoices } from '../types';

const validScripts = new Set<UserChoices['script']>(['JavaScript', 'TypeScript']);
const validStyles = new Set<UserChoices['style']>(['Sass', 'SCSS']);
const validMarkups = new Set<UserChoices['markup']>(['HTML', 'Pug']);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isUserChoices(value: unknown): value is UserChoices {
  if (!isObjectRecord(value)) {
    return false;
  }

  return validScripts.has(value.script as UserChoices['script'])
    && validStyles.has(value.style as UserChoices['style'])
    && validMarkups.has(value.markup as UserChoices['markup'])
    && typeof value.addNormalize === 'boolean'
    && typeof value.addReset === 'boolean';
}

export function assertUserChoices(value: unknown): UserChoices {
  if (!isUserChoices(value)) {
    throw new Error('Invalid user choices received from prompts. Please re-run setup.');
  }

  return value;
}
