import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  copyFile,
  createDirectory,
  deleteDirectory,
  fileExists,
  writeFile,
} from './fileSystem';

test('createDirectory/writeFile/fileExists/deleteDirectory lifecycle', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wlk-'));
  const nestedDir = path.join(tmpRoot, 'src', 'sass');
  const filePath = path.join(nestedDir, 'main.sass');

  createDirectory(nestedDir);
  writeFile(filePath, 'body\n  color: #222');

  assert.equal(fileExists(nestedDir), true);
  assert.equal(fileExists(filePath), true);

  deleteDirectory(path.join(tmpRoot, 'src'));
  assert.equal(fileExists(path.join(tmpRoot, 'src')), false);

  deleteDirectory(tmpRoot);
});

test('copyFile copies source content into destination path', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wlk-copy-'));
  const sourceDir = path.join(tmpRoot, 'source');
  const targetDir = path.join(tmpRoot, 'target');

  createDirectory(sourceDir);
  createDirectory(targetDir);

  const sourceFile = path.join(sourceDir, 'normalize.scss');
  const destFile = path.join(targetDir, '_normalize.scss');
  const content = 'html { line-height: 1.15; }';

  writeFile(sourceFile, content);
  copyFile(sourceFile, destFile);

  assert.equal(fs.readFileSync(destFile, 'utf8'), content);

  deleteDirectory(tmpRoot);
});
