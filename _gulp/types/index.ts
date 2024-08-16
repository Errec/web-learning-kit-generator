export type UserChoices = {
    script: 'JavaScript' | 'TypeScript';
    style: 'Sass' | 'SCSS';
    markup: 'HTML' | 'Pug';
    addNormalize: boolean;
    addReset: boolean;
  }
  
  export type GulpTasks = {
    styleTask: string;
    scriptTask: string;
    markupTask: string;
  }