import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context, 'GET');
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context, 'POST');
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context, 'DELETE');
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context, 'PUT');
}

async function handleProxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string
) {
  const { path } = await context.params; // ✅ await 필수
  const url = new URL(req.url);

  // ✅ 쿼리 파라미터 안전하게 인코딩
  let queryString = '';
  if (url.searchParams && url.searchParams.size > 0) {
    const params = Array.from(url.searchParams.entries())
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    queryString = `?${params}`;
  }

  const targetUrl = `https://sp-globalnomad-api.vercel.app/${path.join('/')}${queryString}`;

  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/accessToken=([^;]+)/);
  const accessToken = match ? match[1] : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  let body: string | undefined;
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    body = await req.text();
  }

  console.log(`🔹 [Proxy] ${method} → ${targetUrl}`);
  console.log(
    '🔹 Token:',
    accessToken ? accessToken.slice(0, 10) + '...' : '❌ none'
  );

  try {
    const res = await fetch(targetUrl, { method, headers, body });
    console.log(`🔸 Proxy response status: ${res.status}`);

    const text = await res.text();
    console.log('🔸 Proxy response body:', text.slice(0, 300)); // 일부만 출력

    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: res.status });
    } catch {
      return new NextResponse(text, { status: res.status });
    }
  } catch (err) {
    console.error(`❌ Proxy ${method} failed:`, err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
