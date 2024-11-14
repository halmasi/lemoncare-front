export async function dataFetch(qs: string) {
  const apiData = await fetch(process.env.BACKEND_PATH + qs, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
  });
  const data = await apiData.json();
  return data.data;
}
