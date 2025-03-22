import { GravatarProps } from '@/app/utils/schema/otherProps';
import { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await fetch(
      process.env.GRAVATAR_URI +
        createHash('sha256').update(body.email).digest('hex'),
      {
        headers: {
          Authorization: 'Bearer ' + process.env.GRAVATAR_SECRET,
        },
      }
    );
    const gravatar: GravatarProps = await data.json();
    return Response.json(
      JSON.stringify({ url: gravatar.avatar_url, data: gravatar }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return Response.json({ error: 'error' + err }, { status: 200 });
  }
}
