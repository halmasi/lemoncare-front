import config from '@/app/utils/config';
import { createHash } from 'crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': config.adminPath || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, token',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('token');
  if (!token) {
    return new Response('invalid request', {
      status: 400,
      headers: corsHeaders,
    });
  }

  if (config.secretKey !== createHash('sha256').update(token).digest('hex')) {
    return new Response('invalid request', {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    const body: { path?: { path: string; layout: boolean }; tag?: string } =
      await request.json();

    if (body.path) {
      revalidatePath(body.path.path, body.path.layout ? 'layout' : 'page');
    }
    if (body.tag) {
      revalidateTag(body.tag);
    }

    return new Response(JSON.stringify({ message: 'revalidated' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
