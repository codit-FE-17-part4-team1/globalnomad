'use server';

import { cookies } from 'next/headers';
import { loginRequest } from '@/lib/auth/api';
import type { AuthResult } from '@/types/auth';

// 쿠키 옵션
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
  const c = await cookies();
  c.set('accessToken', accessToken, cookieOpts(60 * 60)); // 1h
  c.set('refreshToken', refreshToken, cookieOpts(60 * 60 * 24 * 14)); // 14d
}

// 서버 에러 메시지를 필드/모달 메시지로 매핑
function mapApiErrorToFields(msg: string): {
  message: string;
  fieldErrors: Record<string, string>;
} {
  const m = (msg || '').toLowerCase();
  const fieldErrors: Record<string, string> = {};

  if (m.includes('not found') || m.includes('no user') || m.includes('가입')) {
    fieldErrors.email = '존재하지 않는 유저입니다';
    return { message: fieldErrors.email, fieldErrors };
  }
  if (
    m.includes('invalid password') ||
    m.includes('wrong password') ||
    m.includes('비밀번호')
  ) {
    fieldErrors.password = '비밀번호가 올바르지 않습니다.';
    return { message: fieldErrors.password, fieldErrors };
  }

  return { message: msg || '로그인에 실패했습니다.', fieldErrors };
}

export async function loginAction(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = (formData.get('email') ?? '').toString().trim();
  const password = (formData.get('password') ?? '').toString();

  // 1) 클라이언트측 1차 검증
  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = '이메일은 필수입력입니다.';
  if (!password) fieldErrors.password = '비밀번호는 필수입력입니다.';
  if (Object.keys(fieldErrors).length) {
    return { ok: false, message: '실패했습니다.', fieldErrors };
  }

  try {
    // 2) 실제 로그인 요청
    const { accessToken, refreshToken } = await loginRequest({
      email,
      password,
    });

    // 3) 토큰 쿠키 세팅
    await setAuthCookies(accessToken, refreshToken);

    // 4) 모달 확인 후 메인 페이지 이동
    return { ok: true };
  } catch (err) {
    const raw =
      err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.';
    const { message, fieldErrors: mapped } = mapApiErrorToFields(raw);

    // 실패: 모달에는 원인(message), 인풋 아래에는 fieldErrors
    return { ok: false, message, fieldErrors: mapped };
  }
}
