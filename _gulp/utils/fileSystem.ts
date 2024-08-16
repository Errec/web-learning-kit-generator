import fs from 'fs';
import path from 'path';

export function createDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content);
}

export function copyFile(src: string, dest: string): void {
  fs.copyFileSync(path.resolve(src), path.resolve(dest));
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function deleteDirectory(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}