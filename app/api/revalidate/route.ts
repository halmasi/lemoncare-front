import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // console.log(request.headers);
  //   const res = request.cookies.get("token")?.value;
  //   console.log(res);
  return new Response(request.body);
}
export async function POST(request: NextRequest) {
  //validate token
  console.log(request.headers.get('token'));

  const body = await request.json();
  let config = {};

  switch (body.model) {
    case 'post':
      config = {
        post: body.entry.basicInfo.contentCode,
        category: body.entry.category.slug,
        author: body.entry.author.username,
      };
      break;
    case 'author':
      config = {
        author: body.entry.name,
      };
      break;
    case 'category':
      config = {
        category: body.entry.slug,
      };
      break;
    case 'single-page':
      config = {
        singlePost: body.entry.slug,
      };
      break;
    case 'tag':
      config = {
        tag: body.entry.slug,
      };
      break;
    case 'footer-menu':
      config = {
        footerMenu: body.entry,
      };
      break;
    case 'main-menu':
      config = {
        mainMenu: body.entry,
      };
      break;
    case 'social-link-menu':
      config = {
        socialLinkMenu: body.entry,
      };
      break;
    default:
      console.log(body);
      break;
  }

  console.log(config);
  return new Response(body);
}
