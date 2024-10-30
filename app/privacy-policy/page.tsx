import React from 'react';

export default async function privacypolicy() {
  const apiData = await fetch(
    process.env.BACKEND_PATH + '/single-pages?populate=1'
  );
  const parsedData = await apiData.json();
  const privacyItems = parsedData.data[0].content;
  return (
    <main className="container max-w-screen-xl py-5 px-10">
      {privacyItems.map((e: any) => {
        if (e.type == 'heading' && e.children[0].bold)
          return <h1 key={e.indexOf}>{e.children[0].text}</h1>;
        if (e.type == 'heading')
          return <h5 key={e.indexOf}>{e.children[0].text}</h5>;
        return <p key={e.indexOf}>{e.children[0].text}</p>;
      })}
    </main>
  );
}
