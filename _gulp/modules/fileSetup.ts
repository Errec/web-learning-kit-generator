import path from 'path';
import { UserChoices } from '../types';
import { copyFile, createDirectory, writeFile } from '../utils/fileSystem';

export function createProjectStructure(choices: UserChoices): void {
  const dirs = [
    'src',
    `src/${choices.script === 'JavaScript' ? 'js' : 'ts'}`,
    `src/${choices.style === 'Sass' ? 'sass' : 'scss'}/_base`,
    `src/${choices.markup === 'HTML' ? 'html' : 'templates'}`,
    'src/img',
    'dist/css'
  ];

  dirs.forEach(createDirectory);
}

export function createProjectFiles(choices: UserChoices): void {
  const scriptExt = choices.script === 'JavaScript' ? 'js' : 'ts';
  const styleExt = choices.style === 'Sass' ? 'sass' : 'scss';

  const scriptContent = choices.script === 'JavaScript'
    ? 'console.log("Hello, World!");'
    : 'console.log("Hello, TypeScript!");';
  writeFile(`src/${scriptExt}/main.${scriptExt}`, scriptContent);

  let styleContent = `/* Main ${choices.style} file */`;
  if (choices.addNormalize) styleContent = `@import '_base/normalize'${choices.style === 'Sass' ? '' : ';'}\n${styleContent}`;
  if (choices.addReset) styleContent = `@import '_base/reset'${choices.style === 'Sass' ? '' : ';'}\n${styleContent}`;
  writeFile(`src/${styleExt}/main.${styleExt}`, styleContent);

  const markupContent = choices.markup === 'HTML' ? getHtmlTemplate() : getPugTemplate();
  const markupFilePath = choices.markup === 'HTML' ? 'src/html/index.html' : 'src/templates/index.pug';

  writeFile(markupFilePath, markupContent);
  writeFile('src/favicon.ico', '');
}

export function copyVendorCSS(choices: UserChoices): void {
  const vendorFiles = [
    { type: 'Normalize', src: '_gulp/vendors/normalize.css' },
    { type: 'Reset', src: '_gulp/vendors/reset.css' }
  ];

  vendorFiles.forEach(file => {
    if (choices[`add${file.type}` as keyof UserChoices]) {
      const dest = `src/${choices.style === 'Sass' ? 'sass' : 'scss'}/_base/${file.type.toLowerCase()}.css`;
      copyFile(file.src, dest);
    }
  });
}

function getHtmlTemplate(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML-Sass Boilerplate</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
  <h1>Hello, World!</h1>
  <script src="js/main.js"></script>
</body>
</html>`;
}

function getPugTemplate(): string {
  return `
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Pug-Sass Boilerplate
    link(rel="stylesheet" href="css/main.css")
    link(rel="icon" href="favicon.ico" type="image/x-icon")
  body
    h1 Hello, World!
    script(src="js/main.js")`;
}