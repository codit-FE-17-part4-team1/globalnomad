//회원가입/로그인 확인 모달
export type AuthResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>; // 실패시 필드별 에러
};
