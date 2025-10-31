import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/oauth/env.server';
import type { SignInBody } from '@/types/kakao/oauth';
import { assertIsSignOk } from '@/types/kakao/guards';

export async function POST(req: NextRequest) {
  // 1) Body 파싱/검증
  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  if (
    typeof bodyUnknown !== 'object' ||
    bodyUnknown === null ||
    typeof (bodyUnknown as Record<string, unknown>).code !== 'string'
  ) {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }
  const { code } = bodyUnknown as SignInBody;

  // 2) 현재 요청 origin 기준으로 redirect_uri 생성 (프리뷰/프로덕션/로컬 모두 안전)
  const redirectUri = new URL('/oauth/kakao', req.nextUrl.origin).toString();

  // 3) 백엔드 토큰 교환
  const r = await fetch(`${API_BASE}/oauth/sign-in/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ redirectUri, token: code }),
  });

  if (r.status === 404) {
    // 미가입 시그널 그대로 반환
    return NextResponse.json({ message: 'not found' }, { status: 404 });
  }

  if (!r.ok) {
    // 한 번만 읽어 에러 메시지 파싱
    let raw = '';
    try {
      raw = await r.text();
    } catch {}
    console.error('[KAKAO SIGNIN ERROR]', r.status, raw);

    let msg = 'signin failed';
    try {
      const j = JSON.parse(raw);
      if (j && typeof j.message === 'string') msg = j.message;
    } catch {
      if (raw) msg = raw;
    }
    return NextResponse.json({ message: msg }, { status: r.status });
  }

  // 4) 성공 처리
  const rawOk: unknown = await r.json();
  assertIsSignOk(rawOk);
  const data = rawOk as { accessToken: string; refreshToken: string };

  // 5) httpOnly 쿠키 설정
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === 'production';

  res.cookies.set('accessToken', data.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
    maxAge: 60 * 60, // 1h
  });
  res.cookies.set('refreshToken', data.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
    maxAge: 60 * 60 * 24 * 14, // 14d
  });

  return res;
}
