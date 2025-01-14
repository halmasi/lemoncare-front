export async function dataFetch(qs: string, tag?: string[]) {
  const options = {
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
    throw new Error('حطای ارتباط با سرور\n' + error);
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
    return { data, result: apiData };
  } catch (error) {
    throw new Error('حطای ارتباط با سرور\n' + error);
  }
}
