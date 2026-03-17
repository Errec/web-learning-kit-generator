import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { copyVendorCSS, createProjectFiles, createProjectStructure } from './fileSetup';
import { generateGulpfile } from './gulpfileGenerator';
import { UserChoices } from '../types';

function copyVendorFixtures(targetRoot: string): void {
  const sourceVendorDir = path.resolve(__dirname, '..', 'vendors');
  const targetVendorDir = path.join(targetRoot, '_gulp', 'vendors');

  fs.mkdirSync(targetVendorDir, { recursive: true });

  for (const fileName of ['normalize.sass', 'normalize.scss', 'reset.sass', 'reset.scss']) {
    fs.copyFileSync(path.join(sourceVendorDir, fileName), path.join(targetVendorDir, fileName));
  }
}

test('scaffold integration creates expected project tree and generated files', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wlk-scaffold-'));
  const previousCwd = process.cwd();

  try {
    copyVendorFixtures(tmpRoot);
    process.chdir(tmpRoot);

    const choices: UserChoices = {
      script: 'TypeScript',
      style: 'SCSS',
      markup: 'Pug',
      addNormalize: true,
      addReset: true,
    };

    createProjectStructure(choices);
    createProjectFiles(choices);
    copyVendorCSS(choices);
    generateGulpfile(choices);

    assert.equal(fs.existsSync(path.join(tmpRoot, 'src', 'ts', 'main.ts')), true);
    assert.equal(fs.existsSync(path.join(tmpRoot, 'src', 'scss', 'main.scss')), true);
    assert.equal(fs.existsSync(path.join(tmpRoot, 'src', 'scss', 'base', '_normalize.scss')), true);
    assert.equal(fs.existsSync(path.join(tmpRoot, 'src', 'scss', 'base', '_reset.scss')), true);
    assert.equal(fs.existsSync(path.join(tmpRoot, 'src', 'pug', 'index.pug')), true);
    assert.equal(fs.existsSync(path.join(tmpRoot, 'gulpfile.js')), true);

    const generatedMainStyle = fs.readFileSync(path.join(tmpRoot, 'src', 'scss', 'main.scss'), 'utf8');
    assert.match(generatedMainStyle, /@import 'base\/normalize';/);
    assert.match(generatedMainStyle, /@import 'base\/reset';/);

    const generatedGulpfile = fs.readFileSync(path.join(tmpRoot, 'gulpfile.js'), 'utf8');
    assert.match(generatedGulpfile, /src\/ts\/main\.ts/);
    assert.match(generatedGulpfile, /src\/scss\/\*\*\/\*\.scss/);
    assert.match(generatedGulpfile, /src\/pug\/\*\*\/\*\.pug/);
  } finally {
    process.chdir(previousCwd);
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});
