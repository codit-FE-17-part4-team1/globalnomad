'use client';

import { kakaoAuthUrl } from '@/lib/oauth/auth.client';
import Image from 'next/image';

type Props = {
  className?: string;
  size?: number;
};

export default function KakaoLoginButton({ className }: Props) {
  const onClick = () => {
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);
    const url = kakaoAuthUrl(state);
    console.log('[KAKAO AUTH URL]', url);
    window.location.href = kakaoAuthUrl(state);
  };

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onClick}
        className={
          className ??
          'w-12 h-12 rounded-full flex items-center justify-center bg-transparent border-none'
        }
        aria-label="카카오 로그인"
      >
        <Image
          src="/icon/social/kakao.svg"
          alt="Kakao"
          width={72}
          height={72}
        />
      </button>
    </div>
  );
}
