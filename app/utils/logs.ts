'use server';

export default async function (
  log: string,
  type?: 'error' | 'log' | 'warn' | 'info'
) {
  if (type) {
    console[type](log);
  } else console.log(log);
}
