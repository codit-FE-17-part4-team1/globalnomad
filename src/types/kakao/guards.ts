import type { OAuthUser, SignOk } from '@/types/kakao/oauth';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function assertIsOAuthUser(u: unknown): asserts u is OAuthUser {
  if (!isRecord(u)) throw new Error('Invalid user: not an object');
  if (typeof u.id !== 'number') throw new Error('Invalid user.id');
  if ('email' in u && !(u.email === null || typeof u.email === 'string')) {
    throw new Error('Invalid user.email');
  }
  if (typeof u.nickname !== 'string') throw new Error('Invalid user.nickname');
  if (
    'profileImageUrl' in u &&
    !(u.profileImageUrl === null || typeof u.profileImageUrl === 'string')
  ) {
    throw new Error('Invalid user.profileImageUrl');
  }
  if (typeof u.createdAt !== 'string')
    throw new Error('Invalid user.createdAt');
  if (typeof u.updatedAt !== 'string')
    throw new Error('Invalid user.updatedAt');
}

export function assertIsSignOk(v: unknown): asserts v is SignOk {
  if (!isRecord(v)) throw new Error('Invalid response: not an object');
  if (typeof v.accessToken !== 'string') throw new Error('Invalid accessToken');
  if (typeof v.refreshToken !== 'string')
    throw new Error('Invalid refreshToken');
  assertIsOAuthUser(v.user);
}
