// /lib/oauth/env.public.ts
// public 값은 예외 없이 NEXT_PUBLIC_ 접두사만 사용하세요.
export const AFTER_LOGIN_PATH = process.env.NEXT_PUBLIC_AFTER_LOGIN_PATH ?? '/';
