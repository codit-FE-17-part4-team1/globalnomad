'use server';

import { cookies } from 'next/headers';
import { loginRequest } from '@/lib/auth/api';
import { redirect } from 'next/navigation';

export type LoginState = {
  status: boolean;
  fetchErrorText: string;
  isError: { email: boolean; password: boolean };
  errors: Record<string, string>;
};

// Promise인지 판별하기 위한 타입 가드 함수
function isPromiseLike<T>(v: unknown): v is Promise<T> {
  return typeof (v as { then?: unknown }).then === 'function';
}
type CookieStoreResolved =
  ReturnType<typeof cookies> extends Promise<infer P>
    ? P
    : ReturnType<typeof cookies>;
// 쿠키 객체 반환
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
  c.set('accessToken', accessToken, cookieOpts(60 * 60)); // 1h
  c.set('refreshToken', refreshToken, cookieOpts(60 * 60 * 24 * 14)); // 14d
}

async function clearAuthCookies() {
  const c = await cookieStore();
  c.delete('accessToken');
  c.delete('refreshToken');
}

const BASE_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;
type TokenPair = { refreshToken: string; accessToken: string };

export async function loginAction(
  _prev: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const errors: Record<string, string> = {};
  const isError = { email: false, password: false };

  const email = formData.get('email')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';

  if (!email) {
    errors.email = '이메일은 필수입력입니다.';
    isError.email = true;
  }
  if (!password) {
    errors.password = '비밀번호는 필수입력입니다.';
    isError.password = true;
  }

  if (Object.keys(errors).length > 0) {
    return { status: false, fetchErrorText: '', isError, errors };
  }

  try {
    const { accessToken, refreshToken } = await loginRequest({
      email,
      password,
    });
    await setAuthCookies(accessToken, refreshToken);
  } catch (e) {
    await clearAuthCookies();
    const msg = e instanceof Error ? e.message : '로그인 실패';
    return { status: false, fetchErrorText: msg, isError, errors };
  }

  redirect('/');
}
