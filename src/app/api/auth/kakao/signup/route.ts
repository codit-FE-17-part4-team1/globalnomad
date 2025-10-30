import { NextRequest, NextResponse } from 'next/server';
import { API_BASE, KAKAO_REDIRECT_URI } from '@/lib/oauth/env.server';
import type { SignUpBody } from '@/types/kakao/oauth';
import { assertIsSignOk } from '@/types/kakao/guards';

export async function POST(req: NextRequest) {
  const bodyUnknown = await req.json();

  // body 검증
  if (
    typeof bodyUnknown !== 'object' ||
    bodyUnknown === null ||
    typeof (bodyUnknown as Record<string, unknown>).code !== 'string' ||
    typeof (bodyUnknown as Record<string, unknown>).nickname !== 'string'
  ) {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }
  const { code, nickname } = bodyUnknown as SignUpBody;

  const r = await fetch(`${API_BASE}/oauth/sign-up/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nickname,
      redirectUri: KAKAO_REDIRECT_URI,
      token: code,
    }),
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: text || 'signup failed' },
      { status: r.status }
    );
  }

  const raw: unknown = await r.json();
  assertIsSignOk(raw);
  const data = raw; // { user, accessToken, refreshToken }

  // 응답 객체에서 쿠키 설정
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === 'production';

  res.cookies.set('accessToken', data.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
  });
  res.cookies.set('refreshToken', data.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
  });

  return res;
}
