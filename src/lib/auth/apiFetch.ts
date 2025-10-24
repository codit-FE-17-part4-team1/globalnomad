'use client';

type RefreshStatus = { promise: Promise<boolean> | null };
const refreshState: RefreshStatus = { promise: null };

export async function ensureRefreshed(): Promise<boolean> {
  if (!refreshState.promise) {
    refreshState.promise = (async () => {
      const r = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
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
