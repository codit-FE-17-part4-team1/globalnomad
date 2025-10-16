import 'server-only';

type SignupPayload = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
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

type MeResponse = {
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
    // 서버에서만 호출: 클라이언트 캐시/프리패치 방지
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err?.message || '회원가입 실패');
  }
  return res.json();
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

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err?.message || '로그인 실패');
  }
  return data as AuthResponse;
}

export async function getMe(accessToken: string): Promise<MeResponse> {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    // 토큰 만료/무효 등 일 수 있음
    throw new Error(`me failed: ${res.status}`);
  }
  return res.json();
}
