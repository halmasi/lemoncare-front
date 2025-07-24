'use server';

import { cleanPhone } from '../miniFunctions';

export const validateCode = async ({
  username,
  code,
}: {
  username: string;
  code: number;
}) => {
  const res = await fetch(
    process.env.SITE_URL + '/api/auth/oneTimePassword/validateCode',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: '98' + cleanPhone(username),
        code,
      }),
    }
  );
  const data = await res.json();
  const result = JSON.parse(data);
  return result;
};

export const sendCode = async (username: string) => {
  const res = await fetch(process.env.SITE_URL + '/api/auth/oneTimePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: '98' + cleanPhone(username),
    }),
  });
  const data = await res.json();
  const result = JSON.parse(data);

  return { status: res.status, result };
};
