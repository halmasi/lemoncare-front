'use server';

import { logs } from '../miniFunctions';
import { MetaProps } from '../schema/metaProps';

export async function dataFetch({
  qs,
  method = 'GET',
  tag,
  cache = 'no-store',
}: {
  qs: string;
  method?: string;
  tag?: string[];
  cache?: 'no-store' | 'force-cache';
}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    cache,
  };

  if (tag) Object.assign(options, { next: { tags: tag } });

  try {
    const apiData = await fetch(process.env.BACKEND_PATH + qs, options);

    if (apiData.status == 204) {
      return {
        data: { data: 'op was 204,theres no result' },
        status: 204,
        meta: {
          pagination: {
            page: 0,
            pageCount: 0,
            pageSize: 0,
            total: 0,
          },
        },
      };
    }

    const data = await apiData.json();
    const meta: MetaProps = data.meta;
    return { data: data.data, meta, fullData: data };
  } catch (e) {
    logs.error("'خطای ارتباط با سرور\n" + e);
    throw new Error('خطای ارتباط با سرور\n');
  }
}

export async function requestData({
  qs,
  method,
  body = {},
  token,
  tag,
  cache = 'no-store',
}: {
  qs: string;
  method: string;
  body?: object;
  token?: string;
  tag?: string[];
  cache?: 'no-store' | 'force-cache';
}) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token || `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    cache,
  };
  if (Object.keys(body).length)
    Object.assign(options, { body: JSON.stringify(body) });

  if (tag) Object.assign(options, { next: { tags: tag } });

  try {
    const apiData = await fetch(process.env.BACKEND_PATH + qs, options);

    if (apiData.status == 204) {
      return {
        data: { data: 'op was 204,theres no result' },
        status: 204,
      };
    }

    const data = await apiData.json();
    const result = {
      data: JSON.parse(JSON.stringify(data)),
      status: apiData.status,
    };
    return result;
  } catch (e) {
    logs.error("'خطای ارتباط با سرور\n" + e);
    throw new Error('خطای ارتباط با سرور\n');
  }
}
