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

// 백엔드 베이스
export const API_BASE = mustBeUrl(
  'NEXT_PUBLIC_API_SERVER_URL',
  mustGet('NEXT_PUBLIC_API_SERVER_URL')
);

// 로그인 성공 후 이동 경로 (없으면 /)
export const AFTER_LOGIN_PATH = process.env.NEXT_PUBLIC_AFTER_LOGIN_PATH || '/';
