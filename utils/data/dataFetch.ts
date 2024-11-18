export async function dataFetch(qs: string) {
  try {
    const apiData = await fetch(process.env.BACKEND_PATH + qs, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
    });
    const data = await apiData.json();
    return data.data;
  } catch (error) {
    throw new Error('حطای ارتباط با سرور');
  }
}
