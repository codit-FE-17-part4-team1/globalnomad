'use server';

import { cookies } from 'next/headers';
import { signupRequest, loginRequest } from '@/lib/auth/api';
import {
  validateEmail,
  validatePassword,
  validateNickname,
  validatePasswordConfirm,
} from '@/utils/validators';
import { redirect } from 'next/navigation';

export type ActionState = {
  status: boolean;
  fetchErrorText: string;
  isError: {
    email: boolean;
    password: boolean;
    nickname: boolean;
    passwordConfirmation: boolean;
  };
  errors: Record<string, string>;
};

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
  c.set('accessToken', accessToken, cookieOpts(60 * 60)); // 1h
  c.set('refreshToken', refreshToken, cookieOpts(60 * 60 * 24 * 14)); // 14d
}

async function clearAuthCookies() {
  const c = await cookieStore();
  c.delete('accessToken');
  c.delete('refreshToken');
}

const BASE_URL = process.env.NEXT_PUBLIC_API_SERVER_URL as string;
type TokenPair = { refreshToken: string; accessToken: string };

export async function signupAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const errors: Record<string, string> = {};
  const isError = {
    email: false,
    password: false,
    nickname: false,
    passwordConfirmation: false,
  };

  const email = formData.get('email')?.toString() ?? '';
  const nickname = formData.get('nickname')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';
  const passwordConfirmation =
    formData.get('passwordConfirmation')?.toString() ?? '';

  let msg = validateEmail(email);
  if (!email) {
    errors.email = '이메일은 필수입력입니다.';
    isError.email = true;
  } else if (msg) {
    errors.email = msg;
    isError.email = true;
  }

  msg = validateNickname(nickname);
  if (!nickname) {
    errors.nickname = '닉네임은 필수입력입니다.';
    isError.nickname = true;
  } else if (msg) {
    errors.nickname = msg;
    isError.nickname = true;
  }

  msg = validatePassword(password);
  if (!password) {
    errors.password = '비밀번호는 필수입력입니다.';
    isError.password = true;
  } else if (msg) {
    errors.password = msg;
    isError.password = true;
  }

  msg = validatePasswordConfirm(password, passwordConfirmation);
  if (!passwordConfirmation) {
    errors.passwordConfirmation = '비밀번호를 입력해주세요.';
    isError.passwordConfirmation = true;
  } else if (msg) {
    errors.passwordConfirmation = msg;
    isError.passwordConfirmation = true;
  }

  if (Object.keys(errors).length > 0) {
    return { status: false, fetchErrorText: '', isError, errors };
  }

  try {
    await signupRequest({ email, nickname, password, passwordConfirmation });
    const { accessToken, refreshToken } = await loginRequest({
      email,
      password,
    });
    await setAuthCookies(accessToken, refreshToken);
  } catch (err) {
    await clearAuthCookies();
    const msg2 = err instanceof Error ? err.message : '회원가입 실패';
    return { status: false, fetchErrorText: msg2, isError, errors };
  }

  redirect('/');
}
