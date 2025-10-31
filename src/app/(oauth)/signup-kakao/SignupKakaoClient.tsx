'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AFTER_LOGIN_PATH } from '@/lib/oauth/env.public';
import { kakaoAuthUrl } from '@/lib/oauth/auth.client';
import MyButton from '@/components/Button/Button';

function buildAutoNickname() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const y = now.getFullYear(),
    M = pad(now.getMonth() + 1),
    d = pad(now.getDate());
  const h = pad(now.getHours()),
    m = pad(now.getMinutes()),
    s = pad(now.getSeconds());
  const rand = Math.random().toString(36).slice(2, 5);
  return `kakao_${y}${M}${d}${h}${m}${s}_${rand}`;
}

export default function SignupKakaoClient() {
  const sp = useSearchParams();
  const code = sp.get('code') ?? '';
  const wantAuto =
    typeof window !== 'undefined' &&
    sessionStorage.getItem('oauth_autonick') === '1';
  const autoNickname = useMemo(buildAutoNickname, []);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const submittedRef = useRef(false);

  const reauth = () => {
    sessionStorage.setItem('oauth_after', '/signup-kakao');
    sessionStorage.setItem('oauth_autonick', '1');
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);
    window.location.href = kakaoAuthUrl(state);
  };

  useEffect(() => {
    if (!wantAuto || !code || submittedRef.current) return;
    submittedRef.current = true;

    (async () => {
      setLoading(true);
      setErr('');
      const res = await fetch('/api/auth/kakao/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, nickname: autoNickname }),
      });

      const raw = await res.text().catch(() => '');
      let message = raw;
      try {
        const j = JSON.parse(raw);
        if (typeof j?.message === 'string') message = j.message;
      } catch {}

      setLoading(false);

      if (res.ok) {
        sessionStorage.removeItem('oauth_autonick');
        window.location.href = AFTER_LOGIN_PATH; // 전체 리로드
        return;
      }

      if (res.status === 400 || res.status === 401 || res.status === 403) {
        setErr(message || '코드가 유효하지 않습니다. 다시 인증해주세요.');
        return;
      }
      setErr(message || '회원가입 실패');
    })();
  }, [wantAuto, code, autoNickname]);

  if (!code) {
    return (
      <main className="mx-auto max-w-sm p-6 space-y-3">
        <h1 className="text-xl font-semibold">카카오 회원가입</h1>
        <p className="text-sm text-gray-600">카카오 인증이 필요합니다.</p>
        <MyButton onClick={reauth}>카카오로 다시 인증</MyButton>
      </main>
    );
  }

  if (wantAuto) {
    return (
      <main className="mx-auto max-w-sm p-6 space-y-4">
        <h1 className="text-xl font-semibold">카카오 회원가입</h1>
        {err ? (
          <div className="space-y-2">
            <p className="text-sm text-red-600">{err}</p>
            <MyButton onClick={reauth} className="w-full py-2">
              카카오로 다시 인증
            </MyButton>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            {loading ? '가입 처리 중...' : '잠시만 기다려주세요...'}
          </p>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-xl font-semibold">카카오 회원가입</h1>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <MyButton onClick={reauth} className="w-full py-2">
        카카오로 다시 인증
      </MyButton>
    </main>
  );
}
