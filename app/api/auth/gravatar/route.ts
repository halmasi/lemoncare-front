import { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `https://0.gravatar.com/avatar/${createHash('sha256').update(body.email).digest('hex')}`;

    return Response.json(JSON.stringify({ url }), {
      status: 200,
    });
  } catch (err) {
    return Response.json({ error: 'error' + err }, { status: 200 });
  }
}
