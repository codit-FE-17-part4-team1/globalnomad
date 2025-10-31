'use client';

import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
