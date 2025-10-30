// /app/api/auth/kakao/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE, KAKAO_REDIRECT_URI } from '@/lib/oauth/env.server';
import type { SignInBody } from '@/types/kakao/oauth';
import { assertIsSignOk } from '@/types/kakao/guards';

export async function POST(req: NextRequest) {
  // 1) 요청 바디 파싱/검증
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

  // 디버그: 콜백에서 받은 code 확인 (1회성)
  console.log('[SIGNIN CODE]', code);

  // 2) 백엔드 토큰 교환 호출
  const r = await fetch(`${API_BASE}/oauth/sign-in/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ redirectUri: KAKAO_REDIRECT_URI, token: code }),
  });

  // 3) 404는 가입 미완성 시그널로 그대로 전달
  if (r.status === 404) {
    return NextResponse.json({ message: 'not found' }, { status: 404 });
  }

  // 4) 에러 처리(단 한 번만) + 원문 로그 남기기
  if (!r.ok) {
    let raw = '';
    try {
      raw = await r.text(); // 원문을 먼저 한 번만 읽는다
    } catch {
      // ignore
    }
    console.error('[KAKAO SIGNIN ERROR]', r.status, raw);

    // 사람이 읽기 좋은 메시지 추출
    let msg = 'signin failed';
    try {
      const j = JSON.parse(raw);
      if (j && typeof j.message === 'string') msg = j.message;
    } catch {
      if (raw) msg = raw;
    }
    return NextResponse.json({ message: msg }, { status: r.status });
  }

  // 5) 성공 처리 (여기서는 r.body를 처음 읽는다)
  const rawOk: unknown = await r.json();
  assertIsSignOk(rawOk);
  const data = rawOk; // { user, accessToken, refreshToken }

  // 6) httpOnly 쿠키 설정은 응답 객체에서
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
