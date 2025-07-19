'use server';

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
        username,
        code,
      }),
    }
  );
  const data = await res.json();
  const result = JSON.parse(data);
  return result;
};

export const sendCode = async (username: number | string) => {
  const res = await fetch(process.env.SITE_URL + '/api/auth/oneTimePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
    }),
  });

  const data = await res.json();
  const result = JSON.parse(data);

  return { status: res.status, result };
};
