import { resolveProjectPaths } from './pathConfig';
import { UserChoices } from '../types';
import { copyFile, createDirectory, writeFile } from '../utils/fileSystem';

export function createProjectStructure(choices: UserChoices): void {
  const paths = resolveProjectPaths(choices);

  const dirs = [
    'src',
    `src/${paths.scriptFolder}`,
    `src/${paths.styleBaseFolder}`,
    `src/${paths.markupFolder}`,
    'src/img',
    'dist/css'
  ];

  dirs.forEach(createDirectory);
}

export function createProjectFiles(choices: UserChoices): void {
  const paths = resolveProjectPaths(choices);

  const scriptContent = choices.script === 'JavaScript'
    ? 'console.log("Hello, World!");'
    : 'console.log("Hello, TypeScript!");';
  writeFile(`src/${paths.scriptFolder}/main.${paths.scriptExtension}`, scriptContent);

  let styleContent = `// Main ${choices.style} file\n`;
  if (choices.addNormalize) styleContent += choices.style === 'Sass' ? "@import 'base/normalize'\n" : "@import 'base/normalize';\n";
  if (choices.addReset) styleContent += choices.style === 'Sass' ? "@import 'base/reset'\n" : "@import 'base/reset';\n";
  writeFile(`src/${paths.styleFolder}/main.${paths.styleExtension}`, styleContent);

  const markupContent = choices.markup === 'HTML' ? getHtmlTemplate() : getPugTemplate();
  writeFile(`src/${paths.markupFolder}/index.${paths.markupExtension}`, markupContent);
  writeFile('src/favicon.ico', '');
}

export function copyVendorCSS(choices: UserChoices): void {
  const paths = resolveProjectPaths(choices);

  const vendorFiles = [
    { type: 'Normalize', src: `_gulp/vendors/normalize.${paths.styleExtension}` },
    { type: 'Reset', src: `_gulp/vendors/reset.${paths.styleExtension}` }
  ];

  vendorFiles.forEach(file => {
    if (choices[`add${file.type}` as keyof UserChoices]) {
      const dest = `src/${paths.styleBaseFolder}/_${file.type.toLowerCase()}.${paths.styleExtension}`;
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
