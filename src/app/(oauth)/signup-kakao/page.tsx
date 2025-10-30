// /app/(auth)/signup-kakao/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AFTER_LOGIN_PATH } from '@/lib/oauth/env.public';
import { kakaoAuthUrl } from '@/lib/oauth/auth.client';
import MyButton from '@/components/Button/Button';

export default function SignupKakaoPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const code = sp.get('code') ?? '';
  const [nickname, setNickname] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const reauth = () => {
    // 가입 의도로 재인증
    sessionStorage.setItem('oauth_after', '/signup-kakao');
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);
    window.location.href = kakaoAuthUrl(state);
  };

  if (!code) {
    // code가 없으면 재인증 유도
    return (
      <main className="mx-auto max-w-sm p-6 space-y-3">
        <h1 className="text-xl font-semibold">카카오 회원가입</h1>
        <p className="text-sm text-gray-600">카카오 인증이 필요합니다.</p>
        <MyButton onClick={reauth}>카카오로 다시 인증</MyButton>
      </main>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const res = await fetch('/api/auth/kakao/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, nickname }),
    });
    const raw = await res.text().catch(() => '');
    let message = raw;
    try {
      const j = JSON.parse(raw);
      if (typeof j?.message === 'string') message = j.message;
    } catch {}
    setLoading(false);

    if (res.ok) {
      window.location.href = AFTER_LOGIN_PATH;
      return;
    }

    // code 무효/소진 등
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      setErr(message || '코드가 유효하지 않습니다. 다시 인증해주세요.');
      return;
    }
    setErr(message || '회원가입 실패');
  };

  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-xl font-semibold">카카오 회원가입</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="text"
          required
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
          className="w-full rounded-lg border px-3 py-2"
        />
        {err && (
          <div className="space-y-2">
            <p className="text-sm text-red-600">{err}</p>
            <MyButton onClick={reauth} className="w-full py-2">
              카카오로 다시 인증
            </MyButton>
          </div>
        )}
        <MyButton className="w-full py-3" disabled={loading}>
          {loading ? '가입 중...' : '가입 완료'}
        </MyButton>
      </form>
    </main>
  );
}
