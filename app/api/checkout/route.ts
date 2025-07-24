export async function GET() {
  const res = await fetch('https://api.postex.ir/api/v1/shipping-methods', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '' + process.env.POSTEX_API_TOKEN,
    },
  });
  const result = await res.json();
  return Response.json(result, { status: 200 });
}

export async function POST(req: Request) {
  const request = await req.json();
  const sending = await fetch('https://api.postex.ir/api/v1/shipping-price', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '' + process.env.POSTEX_API_TOKEN,
    },
  });
  const result = await sending.json();
  return Response.json(result, { status: 200 });
}
