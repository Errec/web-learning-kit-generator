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

function assertSafeProjectDeletePath(dir: string, cwd: string): string {
  const allowedDirs = new Set(['src', 'dist']);
  const resolvedCwd = path.resolve(cwd);
  const resolvedTarget = path.resolve(cwd, dir);
  const targetBasename = path.basename(resolvedTarget);

  if (!allowedDirs.has(targetBasename)) {
    throw new Error(`Unsafe delete target: ${dir}. Only src/dist can be deleted.`);
  }

  const relative = path.relative(resolvedCwd, resolvedTarget);
  const escapesProjectRoot = relative.startsWith('..') || path.isAbsolute(relative);
  if (escapesProjectRoot) {
    throw new Error(`Unsafe delete target outside project root: ${dir}`);
  }

  return resolvedTarget;
}

export function deleteProjectDirectory(dir: string, cwd: string = process.cwd()): void {
  const safeTarget = assertSafeProjectDeletePath(dir, cwd);
  if (fs.existsSync(safeTarget)) {
    fs.rmSync(safeTarget, { recursive: true, force: true });
  }
}
