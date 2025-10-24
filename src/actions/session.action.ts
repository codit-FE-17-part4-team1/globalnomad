'use server';

import { cookies } from 'next/headers';

type TokenPair = { accessToken: string; refreshToken: string };
const BASE_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

function isPromiseLike<T>(v: unknown): v is Promise<T> {
  return typeof (v as { then?: unknown }).then === 'function';
}
type CookieStoreResolved =
  ReturnType<typeof cookies> extends Promise<infer P>
    ? P
    : ReturnType<typeof cookies>;

async function cookieStore(): Promise<CookieStoreResolved> {
  const c = cookies() as unknown;
  return isPromiseLike<CookieStoreResolved>(c)
    ? await c
    : (c as CookieStoreResolved);
}

function cookieOpts(maxAgeSeconds: number) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

async function setAuthCookies(accessToken: string, refreshToken: string) {
  const c = await cookieStore();
  // access 1h / refresh 14d
  c.set('accessToken', accessToken, cookieOpts(60 * 60));
  c.set('refreshToken', refreshToken, cookieOpts(60 * 60 * 24 * 14));
}

async function clearAuthCookies() {
  const c = await cookieStore();
  c.delete('accessToken');
  c.delete('refreshToken');
}

/*
 * (1) 토큰 재발급 서버 액션
 *  - 401 발생 시, 혹은 수동으로 호출 가능
 */
export async function reissueTokens(): Promise<{ ok: boolean }> {
  const c = await cookieStore();
  const accessToken = c.get('accessToken')?.value ?? '';
  const refreshToken = c.get('refreshToken')?.value ?? '';

  if (!refreshToken) {
    await clearAuthCookies();
    return { ok: false };
  }

  const res = await fetch(`${BASE_URL}/auth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken, accessToken }),
    cache: 'no-store',
  });

  if (!res.ok) {
    await clearAuthCookies();
    return { ok: false };
  }

  const data = (await res.json()) as TokenPair;
  await setAuthCookies(data.accessToken, data.refreshToken);
  return { ok: true };
}

/*
 * (2) 서버 전용 보호 API 호출 래퍼
 *  - Authorization 자동 주입
 *  - 401이면 reissueTokens() 실행 후 1회 재시도
 *  - 서버 액션/서버 라우트/서버 컴포넌트에서 사용
 */
export async function fetchWithAuth(
  url: string,
  init: RequestInit = {}
): Promise<Response> {
  const c = await cookieStore();
  const accessToken = c.get('accessToken')?.value ?? '';

  const headers = new Headers(init.headers);
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
  if (!headers.has('content-type') && init.body)
    headers.set('content-type', 'application/json');

  let res = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
    redirect: 'manual',
  });

  // 401 → refresh → retry(1번)
  if (res.status === 401) {
    const { ok } = await reissueTokens();
    if (ok) {
      const h2 = new Headers(init.headers);
      const newAccess = (await cookieStore()).get('accessToken')?.value ?? '';
      if (newAccess) h2.set('authorization', `Bearer ${newAccess}`);
      if (!h2.has('content-type') && init.body)
        h2.set('content-type', 'application/json');

      res = await fetch(url, {
        ...init,
        headers: h2,
        cache: 'no-store',
        redirect: 'manual',
      });
    }
  }

  return res;
}

/*
 * (3) 서버 JSON 헬퍼
 *  - 바로 JSON이 필요한 경우에만 사용
 */
export async function fetchJsonWithAuth<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetchWithAuth(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

/*
 * (4) 수동 세션 갱신 버튼용 액션
 *  - 클라이언트 컴포넌트에서 import 후 호출 가능
 */
export async function refreshSession(): Promise<{ ok: boolean }> {
  return reissueTokens();
}
