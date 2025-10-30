// /app/oauth/kakao/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AFTER_LOGIN_PATH } from '@/lib/oauth/env.public';
import { kakaoAuthUrl } from '@/lib/oauth/auth.client';

export default function KakaoCallbackPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState('처리 중...');
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = sp.get('code');
    const state = sp.get('state');
    const error = sp.get('error');

    if (error) {
      setMsg('카카오 인증 실패/취소');
      return;
    }
    if (!code) {
      setMsg('code가 없습니다.');
      return;
    }

    // state 검증
    const saved = sessionStorage.getItem('oauth_state');
    if (saved && state && saved !== state) {
      setMsg('잘못된 요청(state mismatch)');
      return;
    }

    // ✅ 가입 플로우로 되돌아올 예정이면: sign-in 호출하지 않고 바로 가입 페이지로 넘김
    const after = sessionStorage.getItem('oauth_after');
    if (after === '/signup-kakao') {
      sessionStorage.removeItem('oauth_after');
      router.replace(`/signup-kakao?code=${encodeURIComponent(code)}`);
      return;
    }

    (async () => {
      const res = await fetch('/api/auth/kakao/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const raw = await res.text().catch(() => '');
      let message = raw;
      try {
        const j = JSON.parse(raw);
        if (typeof j?.message === 'string') message = j.message;
      } catch {}

      if (res.ok) {
        window.location.href = AFTER_LOGIN_PATH; // '/' 등
        return;
      }

      // ✅ 미가입(403)인 경우: 새 code를 얻기 위해 다시 카카오 인증으로
      if (res.status === 403 || message.includes('등록되지 않은 사용자')) {
        // 가입 화면에서 자동 닉네임으로 바로 가입 제출하도록 힌트 남김
        sessionStorage.setItem('oauth_after', '/signup-kakao');
        sessionStorage.setItem('oauth_autonick', '1');
        const newState = crypto.randomUUID();
        sessionStorage.setItem('oauth_state', newState);
        window.location.href = kakaoAuthUrl(newState); // fresh code 발급
        return;
      }

      // ... 페이지 맨 위쪽 after 처리 분기에도 유지
      const after = sessionStorage.getItem('oauth_after');
      if (after === '/signup-kakao') {
        sessionStorage.removeItem('oauth_after');
        router.replace(`/signup-kakao?code=${encodeURIComponent(code)}`);
        return;
      }

      setMsg(message || '로그인 오류');
    })();
  }, [sp, router]);

  return (
    <main className="mx-auto max-w-sm p-6">
      <p className="text-center text-sm text-gray-600">{msg}</p>
    </main>
  );
}
