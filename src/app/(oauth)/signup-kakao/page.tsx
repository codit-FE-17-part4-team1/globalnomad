import { Suspense } from 'react';
import SignupKakaoClient from './SignupKakaoClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense
      fallback={<main className="mx-auto max-w-sm p-6">처리 중...</main>}
    >
      <SignupKakaoClient />
    </Suspense>
  );
}
