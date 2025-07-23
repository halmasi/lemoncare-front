export async function GET() {
  const fileContent = '';
  const fileBuffer = Buffer.from(fileContent, 'utf-8');

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename=".txt"',
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}
