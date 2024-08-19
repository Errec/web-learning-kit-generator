export interface UserChoices {
  script: 'JavaScript' | 'TypeScript';
  style: 'Sass' | 'SCSS';
  markup: 'HTML' | 'Pug';
  addNormalize: boolean;
  addReset: boolean;
}

export interface GulpTasks {
  styleTask: string;
  scriptTask: string;
  markupTask: string;
}