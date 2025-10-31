// 서버 클라이언트
import { Suspense } from 'react';
import KakaoCallbackClient from './CallbackClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense
      fallback={<main className="mx-auto max-w-sm p-6">처리 중...</main>}
    >
      <KakaoCallbackClient />
    </Suspense>
  );
}
