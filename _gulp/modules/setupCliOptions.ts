import { UserChoices } from '../types';
import { assertUserChoices } from './userChoicesValidation';

const scriptAliases: Record<string, UserChoices['script']> = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
};

const styleAliases: Record<string, UserChoices['style']> = {
  sass: 'Sass',
  scss: 'SCSS',
};

const markupAliases: Record<string, UserChoices['markup']> = {
  html: 'HTML',
  pug: 'Pug',
};

export interface ParsedSetupOptions {
  choices?: UserChoices;
  shouldPrompt: boolean;
  autoConfirm: boolean;
}

function readFlagValue(argv: string[], flagName: string): string | undefined {
  const flagPrefix = `${flagName}=`;
  const inline = argv.find((arg) => arg.startsWith(flagPrefix));
  if (inline) {
    return inline.slice(flagPrefix.length);
  }

  const index = argv.indexOf(flagName);
  if (index === -1) {
    return undefined;
  }

  const next = argv[index + 1];
  if (!next || next.startsWith('--')) {
    throw new Error(`Missing value for ${flagName}.`);
  }

  return next;
}

function normalizeFlagValue(value: string | undefined): string | undefined {
  return value?.trim().toLowerCase();
}

export function parseSetupOptions(argv: string[]): ParsedSetupOptions {
  const rawScript = normalizeFlagValue(readFlagValue(argv, '--script'));
  const rawStyle = normalizeFlagValue(readFlagValue(argv, '--style'));
  const rawMarkup = normalizeFlagValue(readFlagValue(argv, '--markup'));
  const autoConfirm = argv.includes('--yes') || argv.includes('-y');

  const hasChoiceFlag = rawScript !== undefined || rawStyle !== undefined || rawMarkup !== undefined;
  if (!hasChoiceFlag) {
    return {
      shouldPrompt: true,
      autoConfirm,
    };
  }

  if (!rawScript || !rawStyle || !rawMarkup) {
    throw new Error('When using non-interactive flags, provide --script, --style, and --markup together.');
  }

  const candidateChoices = {
    script: scriptAliases[rawScript],
    style: styleAliases[rawStyle],
    markup: markupAliases[rawMarkup],
    addNormalize: argv.includes('--normalize'),
    addReset: argv.includes('--reset'),
  };

  const choices = assertUserChoices(candidateChoices);
  return {
    choices,
    shouldPrompt: false,
    autoConfirm,
  };
}
