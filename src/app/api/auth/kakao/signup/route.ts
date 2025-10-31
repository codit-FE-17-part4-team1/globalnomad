import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/oauth/env.server';
import type { SignUpBody } from '@/types/kakao/oauth';
import { assertIsSignOk } from '@/types/kakao/guards';

export async function POST(req: NextRequest) {
  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  // body 검증 (nickname은 현재 스펙상 필수)
  if (
    typeof bodyUnknown !== 'object' ||
    bodyUnknown === null ||
    typeof (bodyUnknown as Record<string, unknown>).code !== 'string' ||
    typeof (bodyUnknown as Record<string, unknown>).nickname !== 'string'
  ) {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }
  const { code, nickname } = bodyUnknown as SignUpBody;

  // 현재 요청 origin 기준 redirect_uri
  const redirectUri = new URL('/oauth/kakao', req.nextUrl.origin).toString();

  const r = await fetch(`${API_BASE}/oauth/sign-up/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, redirectUri, token: code }),
  });

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    return NextResponse.json(
      { message: text || 'signup failed' },
      { status: r.status }
    );
  }

  const raw: unknown = await r.json();
  assertIsSignOk(raw);
  const data = raw as { accessToken: string; refreshToken: string };

  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === 'production';

  res.cookies.set('accessToken', data.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
    maxAge: 60 * 60,
  });
  res.cookies.set('refreshToken', data.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
    maxAge: 60 * 60 * 24 * 14,
  });

  return res;
}
