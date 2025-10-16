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

async function getMutableCookies() {
  const c = cookies();

  return typeof c?.then === 'function' ? await c : c;
}

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

  // 서버 유효성 검사
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
    //1. 외부 백엔드 로그인 호출
    await signupRequest({ email, nickname, password, passwordConfirmation });

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
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1h
    });

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7d
    });
  } catch (err) {
    return {
      status: false,
      fetchErrorText: (err as Error).message || '회원가입 실패',
      isError,
      errors,
    };
  }

  redirect('/');

  return {
    status: true,
    fetchErrorText: '',
    isError: {
      email: false,
      password: false,
      nickname: false,
      passwordConfirmation: false,
    },
    errors: {},
  };
}
