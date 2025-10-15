'use server';

import { cookies } from 'next/headers';
import { loginRequest } from '@/lib/auth/api';

export type LoginState = {
  status: boolean;
  fetchErrorText: string;
  isError: { email: boolean; password: boolean };
  errors: Record<string, string>;
};

async function getMutableCookies() {
  const c = cookies();

  return typeof c?.then === 'function' ? await c : c;
}

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
    //1. 외부 백엔드 로그인 호출
    const { accessToken, refreshToken } = await loginRequest({
      email,
      password,
    });

    //2. 서버 액션에서 httpOnly 쿠키 설정
    const cookieStore = await getMutableCookies();
    const isProd = process.env.NODE_ENV === 'production';

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1h
    });

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7d
    });

    return {
      status: true,
      fetchErrorText: '',
      isError: { email: false, password: false },
      errors: {},
    };
  } catch (e) {
    return {
      status: false,
      fetchErrorText: (e as Error).message || '로그인 실패',
      isError,
      errors,
    };
  }
}
