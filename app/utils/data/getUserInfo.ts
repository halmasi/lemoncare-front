import qs from 'qs';
import { dataFetch } from './dataFetch';

export async function getPostalInformation(documentId: string) {
  const query = qs.stringify({
    populate: {
      information: { populate: '1' },
    },
  });
  const res = await dataFetch(`/postal-informations/${documentId}?${query}`);
  return res;
}
