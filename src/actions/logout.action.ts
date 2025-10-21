'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

async function clearAuthCookies() {
  const c = await cookieStore();
  c.delete('accessToken');
  c.delete('refreshToken');
}

export async function logoutAction(): Promise<never> {
  await clearAuthCookies();

  // 원하는 경로로 변경 가능: '/', '/Login' 등
  redirect('/');
}
