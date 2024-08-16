import del from 'del';

export function cleanTask() {
  return del(['dist']);
}