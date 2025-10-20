import 'server-only';

export type SignupPayload = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
  refreshToken: string;
  accessToken: string;
};

export type MeResponse = {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_SERVER_URL!;

export async function signupRequest(
  payload: SignupPayload
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  const json = (await res.json().catch(() => ({}))) as Partial<AuthResponse> & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(json?.message || '회원가입 실패');
  }
  if (!json.accessToken || !json.refreshToken) {
    throw new Error('회원가입 응답에 토큰이 없습니다.');
  }
  return json as AuthResponse;
}

export async function loginRequest(
  payload: LoginPayload
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  const json = (await res.json().catch(() => ({}))) as Partial<AuthResponse> & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(json?.message || '로그인 실패');
  }
  if (!json.accessToken || !json.refreshToken) {
    throw new Error('로그인 응답에 토큰이 없습니다.');
  }
  return json as AuthResponse;
}

export async function getMe(accessToken: string): Promise<MeResponse> {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`me failed: ${res.status}`);
  }
  return res.json();
}
