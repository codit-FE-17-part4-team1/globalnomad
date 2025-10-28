import MainBanner from '@/app/main/_components/MainBanner';
import SearchBar from '@/app/main/_components/SearchBar';
import SearchPage from './SearchPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 배너 + 검색 영역 */}
      <section className="relative w-full">
        <MainBanner />
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-2/3 z-10 w-full max-w-[1240px]">
          <SearchBar />
        </div>
      </section>

      {/* 검색 결과 리스트 */}
      <Suspense fallback={<div>로딩 중...</div>}>
        <SearchPage />
      </Suspense>
    </div>
  );
}
