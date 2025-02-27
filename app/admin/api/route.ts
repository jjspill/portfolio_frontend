import { getAPIUrl } from 'config/config';
import { writeFileSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const documentData = body.documents;
  body.documents = [];

  let res = null;
  const apiUrl = getAPIUrl();

  try {
    // res = await fetch('https://preview.api.james-spillmann.com/experiences', {
    res = await fetch(`${apiUrl}/experiences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error('Failed to upload experience:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to upload experience', error }),
    );
  }

  try {
    for (const document of documentData) {
      const newDocument = {
        title: document.title,
        path: document.path,
      };

      const documentRes = await fetch(`${apiUrl}/experiences/${body.title}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        },
        body: JSON.stringify(newDocument),
      });

      const documentResult = await documentRes.json();
      if (documentResult.error) {
        console.error('Failed to upload document:', documentResult.error);
        return new Response(
          JSON.stringify({
            message: 'Failed to upload document',
            error: documentResult.error,
          }),
        );
      }
    }
  } catch (error) {
    console.error('Failed to upload experience:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to upload experience documents',
        error,
      }),
    );
  }

  // console.log('Uploading experience:', emptyBody.title);
  // for (const document of documents.data) {
  //   console.log('Uploading document:', document.title);

  //   const newDocument = {
  //     title: document.title,
  //     path: document.path,
  //   };

  //   console.log(newDocument.path);
  //   console.log(newDocument.title);

  //   console.log(`http://localhost:3001/${emptyBody.title}/documents`);

  //   const documentRes = await fetch(
  //     `https://preview.api.james-spillmann.com/experiences/${emptyBody.title}/documents`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ document: newDocument }),
  //     },
  //   );

  //   const documentResult = await documentRes.json();
  //   console.log('Document result:', documentResult);
  // }

  const result = res ? await res.json() : null;

  return new Response(JSON.stringify(result));
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
