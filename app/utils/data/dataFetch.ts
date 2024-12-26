export async function dataFetch(qs: string, tag?: string[]) {
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
  };
  tag && Object.assign(options, { next: { tags: tag } });

  try {
    const apiData = await fetch(process.env.BACKEND_PATH + qs, options);
    const data = await apiData.json();
    return data.data;
  } catch (error) {
    throw new Error('حطای ارتباط با سرور');
  }
}
