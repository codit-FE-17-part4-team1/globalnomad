import { cookies } from 'next/headers';
import type { z, ZodType } from 'zod';
import { CustomError } from './custom-error';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type Options = Omit<RequestInit, 'method' | 'headers'> & {
  method?: HttpMethod;
  headers?: Record<string, string>;
  accessTokenOverride?: string; // 서버 액션에서 직접 주입하고 싶을 때
  acceptJson?: boolean; // 기본 true
  parseJsonOn204?: boolean; // 기본 false
};

export default async function customFetch<T>(
  url: string,
  schema: ZodType<T>,
  {
    method = 'GET',
    headers = {},
    body,
    accessTokenOverride,
    acceptJson = true,
    parseJsonOn204 = false,
    ...rest
  }: Options = {}
): Promise<T> {
  let token: string | undefined;
  if (accessTokenOverride) {
    token = accessTokenOverride;
  } else {
    try {
      token = cookies().get('accessToken')?.value;
    } catch (error) {}
  }

  const finalHeaders: Record<string, string> = {
    ...(acceptJson ? { Accept: 'application/json' } : {}),
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body,
    ...rest,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new CustomError({
      status: res.status,
      message: text || `HTTP ${res.status}`,
      method,
      url,
    });
  }

  // 204 No Content
  if (res.status === 204) {
    if (parseJsonOn204) {
      // 204 응답은 body가 없으므로, undefined를 파싱하도록 시도합니다.
      // 호출부의 스키마가 z.undefined() 등을 통해 이를 허용해야 합니다.
      return schema.parse(undefined);
    }
    // parseJsonOn204가 false이면 undefined를 반환합니다.
    // 이 경우, 호출부에서 T가 void | undefined 등을 포함해야 합니다.
    return undefined as unknown as T;
  }

  // JSON 응답만 상정 (파일/텍스트가 필요하면 분기 추가)
  const json = await res.json();
  return schema.parse(json); // Zod 런타임 검증 + 타입 보장
}
