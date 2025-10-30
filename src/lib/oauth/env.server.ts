// /lib/oauth/env.server.ts
function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function mustBeUrl(name: string, value: string): string {
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`Invalid URL in env: ${name}`);
  }
}

export const API_BASE = mustBeUrl(
  'NEXT_PUBLIC_API_SERVER_URL', // 네이밍은 유지하되 서버에서만 사용
  mustGet('NEXT_PUBLIC_API_SERVER_URL')
);

export const KAKAO_REDIRECT_URI = mustBeUrl(
  'NEXT_PUBLIC_KAKAO_REDIRECT_URI',
  mustGet('NEXT_PUBLIC_KAKAO_REDIRECT_URI')
);

export const AFTER_LOGIN_PATH = process.env.NEXT_PUBLIC_AFTER_LOGIN_PATH || '/';
