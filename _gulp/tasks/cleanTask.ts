import del from 'del';

export function cleanTask() {
  return function(cb: (error?: Error | null) => void) {
    del(['dist']).then(() => cb()).catch(cb);
  };
}