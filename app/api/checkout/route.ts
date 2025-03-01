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
  const res = await fetch('https://api.postex.ir/api/v1/shipping/quotes', {
    method: 'POST',
    body: JSON.stringify({
      from_city_code: 2,
    }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '' + process.env.POSTEX_API_TOKEN,
    },
  });
  const request = await req.json();
}
