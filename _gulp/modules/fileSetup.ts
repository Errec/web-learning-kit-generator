import { UserChoices } from '../types';
import { copyFile, createDirectory, writeFile } from '../utils/fileSystem';

export function createProjectStructure(choices: UserChoices): void {
  const dirs = [
    'src',
    `src/${choices.script === 'JavaScript' ? 'js' : 'ts'}`,
    `src/${choices.style === 'Sass' ? 'sass/base' : 'scss/base'}`,  // Updated path for base
    `src/${choices.markup === 'HTML' ? 'html' : 'pug'}`,
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

  let styleContent = `// Main ${choices.style} file\n`;
  if (choices.addNormalize) styleContent += choices.style === 'Sass' ? "@import 'base/normalize'\n" : "@import 'base/normalize';\n";
  if (choices.addReset) styleContent += choices.style === 'Sass' ? "@import 'base/reset'\n" : "@import 'base/reset';\n";
  writeFile(`src/${styleExt}/main.${styleExt}`, styleContent);

  const markupContent = choices.markup === 'HTML' ? getHtmlTemplate() : getPugTemplate();
  const markupFilePath = choices.markup === 'HTML' ? 'src/html/index.html' : 'src/pug/index.pug';

  writeFile(markupFilePath, markupContent);
  writeFile('src/favicon.ico', '');
}

export function copyVendorCSS(choices: UserChoices): void {
  const vendorFiles = [
    { type: 'Normalize', src: `_gulp/vendors/normalize.${choices.style === 'Sass' ? 'sass' : 'scss'}` },
    { type: 'Reset', src: `_gulp/vendors/reset.${choices.style === 'Sass' ? 'sass' : 'scss'}` }
  ];

  vendorFiles.forEach(file => {
    if (choices[`add${file.type}` as keyof UserChoices]) {
      const dest = `src/${choices.style === 'Sass' ? 'sass/base' : 'scss/base'}/_${file.type.toLowerCase()}.${choices.style === 'Sass' ? 'sass' : 'scss'}`;  // Save in base folder
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
