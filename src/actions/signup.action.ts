'use server';

import { cookies } from 'next/headers';
import { signupRequest, loginRequest } from '@/lib/auth/api';
import type { AuthResult } from '@/types/auth';

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
  c.set('accessToken', accessToken, cookieOpts(60 * 60));
  c.set('refreshToken', refreshToken, cookieOpts(60 * 60 * 24 * 14));
}

function pickPrimaryErrorMessage(fieldErrors: Record<string, string>): string {
  // 우선순위: passwordConfirmation > password > email > nickname
  return (
    fieldErrors.passwordConfirmation ||
    fieldErrors.password ||
    fieldErrors.email ||
    fieldErrors.nickname ||
    '입력 값을 확인해 주세요.'
  );
}

/** 서버 에러 메시지를 필드와 모달용 메시지로 매핑(필요 시 규칙 추가) */
function mapApiErrorToFields(msg: string): {
  message: string;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const m = msg.toLowerCase();

  // 이메일 중복
  if (
    m.includes('email') &&
    (m.includes('duplicate') || m.includes('이미') || m.includes('exists'))
  ) {
    fieldErrors.email = '이미 사용 중인 이메일입니다.';
    return { message: fieldErrors.email, fieldErrors };
  }

  // 닉네임 중복
  if (
    m.includes('nickname') &&
    (m.includes('duplicate') || m.includes('이미') || m.includes('exists'))
  ) {
    fieldErrors.nickname = '이미 사용 중인 닉네임입니다.';
    return { message: fieldErrors.nickname, fieldErrors };
  }

  // 비밀번호 불일치/약함
  if (m.includes('password')) {
    if (
      m.includes('confirm') ||
      m.includes('mismatch') ||
      m.includes('일치하지')
    ) {
      fieldErrors.passwordConfirmation = '비밀번호가 일치하지 않습니다.';
      return { message: fieldErrors.passwordConfirmation, fieldErrors };
    }
    fieldErrors.password = '비밀번호 형식을 확인해 주세요.';
    return { message: fieldErrors.password, fieldErrors };
  }

  // 그 외: 서버 메시지를 그대로 노출
  return { message: msg || '요청을 처리하지 못했습니다.', fieldErrors };
}

export async function signupAction(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = (formData.get('email') ?? '').toString().trim();
  const nickname = (formData.get('nickname') ?? '').toString().trim();
  const password = (formData.get('password') ?? '').toString();
  const passwordConfirmation = (
    formData.get('passwordConfirmation') ?? ''
  ).toString();

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = '이메일은 필수입력입니다.';
  if (!nickname) fieldErrors.nickname = '닉네임은 필수입력입니다.';
  if (!password) fieldErrors.password = '비밀번호는 필수입력입니다.';
  if (!passwordConfirmation)
    fieldErrors.passwordConfirmation = '비밀번호 확인을 입력하세요.';
  if (password && passwordConfirmation && password !== passwordConfirmation)
    fieldErrors.passwordConfirmation = '비밀번호가 일치하지 않습니다.';
  if (Object.keys(fieldErrors).length) {
    return {
      ok: false,
      message: pickPrimaryErrorMessage(fieldErrors),
      fieldErrors,
    };
  }

  try {
    // 1) 회원가입
    const signupRes = await signupRequest({
      email,
      nickname,
      password,
      passwordConfirmation,
    });

    // 2) 토큰이 응답 바디에 있으면 그걸 쓰고,
    //    없으면 자동 로그인으로 토큰 획득
    let accessToken = signupRes.accessToken;
    let refreshToken = signupRes.refreshToken;

    if (!accessToken || !refreshToken) {
      const loginRes = await loginRequest({ email, password });
      accessToken = loginRes.accessToken;
      refreshToken = loginRes.refreshToken;
    }

    await setAuthCookies(accessToken!, refreshToken!);
    return { ok: true, message: '가입이 완료되었습니다!!' };
  } catch (err) {
    const raw =
      err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.';
    const { message, fieldErrors: mapped } = mapApiErrorToFields(raw);
    // 5) 실패: 모달엔 명확한 원인(message), 인풋 아래엔 fieldErrors 표시
    return { ok: false, message, fieldErrors: mapped };
  }
}
