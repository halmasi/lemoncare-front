'use server';

export async function dataFetch(
  qs: string,
  method: string = 'GET',
  tag?: string[]
) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
  };
  if (tag) Object.assign(options, { next: { tags: tag } });

  try {
    const apiData = await fetch(process.env.BACKEND_PATH + qs, options);
    const data = await apiData.json();
    return data.data;
  } catch (error) {
    console.trace();
    throw new Error('خطای ارتباط با سرور\n' + error);
  }
}

export async function requestData(
  qs: string,
  method: string,
  body: object,
  token?: string,
  tag?: string[]
) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token || `Bearer ${process.env.STRAPI_TOKEN}`,
    },
  };
  if (Object.keys(body).length)
    Object.assign(options, { body: JSON.stringify(body) });
  if (tag) Object.assign(options, { next: { tags: tag } });
  try {
    const apiData = await fetch(process.env.BACKEND_PATH + qs, options);
    const data = await apiData.json();
    const result = {
      data: JSON.parse(JSON.stringify(data)),
      status: apiData.status,
    };

    return result;
  } catch (error) {
    console.trace();
    throw new Error('خطای ارتباط با سرور\n' + error);
  }
}
