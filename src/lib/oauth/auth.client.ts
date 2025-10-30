// /lib/oauth/auth.client.ts

function ensure(name: string, v: string | undefined): string {
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

/** 카카오 동의 페이지 URL 생성 (클라이언트 전용) */
export function kakaoAuthUrl(state?: string): string {
  const clientId = ensure(
    'NEXT_PUBLIC_KAKAO_CLIENT_ID',
    process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
  );
  const redirectUri = ensure(
    'NEXT_PUBLIC_KAKAO_REDIRECT_URI',
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI
  );
  const scope = ensure(
    'NEXT_PUBLIC_KAKAO_SCOPE',
    process.env.NEXT_PUBLIC_KAKAO_SCOPE
  );
  const prompt = process.env.NEXT_PUBLIC_KAKAO_PROMPT;
  const url = new URL('https://kauth.kakao.com/oauth/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope); // "profile_nickname profile_image"
  if (prompt) url.searchParams.set('prompt', prompt);
  if (state) url.searchParams.set('state', state);
  return url.toString();
}
