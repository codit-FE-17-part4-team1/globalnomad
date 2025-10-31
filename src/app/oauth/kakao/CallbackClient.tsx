'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { AFTER_LOGIN_PATH } from '@/lib/oauth/env.public';
import { kakaoAuthUrl } from '@/lib/oauth/auth.client';

export default function KakaoCallbackClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('로딩 중...');
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    (async () => {
      const code = sp.get('code');
      const state = sp.get('state');
      const error = sp.get('error');

      if (error) {
        setMsg('카카오 인증 실패/취소');
        setLoading(false);
        return;
      }
      if (!code) {
        setMsg('code가 없습니다.');
        setLoading(false);
        return;
      }

      const saved = sessionStorage.getItem('oauth_state');
      if (saved && state && saved !== state) {
        setMsg('잘못된 요청(state mismatch)');
        setLoading(false);
        return;
      }

      const after = sessionStorage.getItem('oauth_after');
      if (after === '/signup-kakao') {
        sessionStorage.removeItem('oauth_after');
        router.replace(`/signup-kakao?code=${encodeURIComponent(code)}`);
        return;
      }

      try {
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
          window.location.href = AFTER_LOGIN_PATH; // 전체 리로드
          return;
        }

        if (
          res.status === 403 ||
          message.includes('등록되지 않은 사용자') ||
          res.status === 404
        ) {
          sessionStorage.setItem('oauth_after', '/signup-kakao');
          const newState = crypto.randomUUID();
          sessionStorage.setItem('oauth_state', newState);
          window.location.href = kakaoAuthUrl(newState);
          return;
        }

        setMsg(message || '로그인 오류');
      } catch {
        setMsg('네트워크 오류');
      } finally {
        setLoading(false);
      }
    })();
  }, [sp, router]);

  return (
    <main className="mx-auto max-w-sm p-6 min-h-[90vh] flex flex-col items-center justify-center">
      {loading ? (
        <>
          <Image
            src="/images/loading.png"
            alt="로딩중"
            width={100}
            height={100}
            priority
          />
          <p className="mt-3 text-center text-sm text-gray-600">{msg}</p>
        </>
      ) : (
        <p className="text-center text-sm text-gray-600">{msg}</p>
      )}
    </main>
  );
}
