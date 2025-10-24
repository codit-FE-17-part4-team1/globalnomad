'use client';

type RefreshStatus = { promise: Promise<boolean> | null };
const refreshState: RefreshStatus = { promise: null };

export async function ensureRefreshed(): Promise<boolean> {
  console.log('🔄 ensureRefreshed 호출'); // ✅ 추가
  if (!refreshState.promise) {
    refreshState.promise = (async () => {
      console.log('📡 /api/auth/refresh 요청 시작'); // ✅ 추가
      const r = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('📊 refresh 응답:', r.status, r.ok); // ✅ 추가
      return r.ok;
    })().finally(() => {
      refreshState.promise = null;
    });
  }
  return refreshState.promise;
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  let res = await fetch(input, { ...init, credentials: 'include' });

  if (res.status === 401) {
    const ok = await ensureRefreshed();
    if (ok) {
      res = await fetch(input, { ...init, credentials: 'include' });
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      location.href = '/Login';
    }
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}
