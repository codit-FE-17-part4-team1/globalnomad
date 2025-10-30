// /types/kakao/oauth.ts

// Kakao 인증 성공 후, 우리 백엔드가 내려주는 사용자 타입
export interface OAuthUser {
  id: number;
  email?: string | null;
  nickname: string;
  profileImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SignOk {
  user: OAuthUser;
  accessToken: string;
  refreshToken: string;
}

// 우리 API 라우트 바디
export interface SignInBody {
  code: string;
}
export interface SignUpBody {
  code: string;
  nickname: string;
}
