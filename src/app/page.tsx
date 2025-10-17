// app/page.tsx
'use client';

import MainBanner from './main/_components/MainBanner';
import SearchBar from './main/_components/SearchBar';
import PopularExperiences from './main/_components/PopularActivities';
import AllExperiences from './main/_components/AllActivities';

const SectionContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <section className={`w-full flex justify-center ${className}`}>
    <div className="w-full min-w-[375px] max-w-[1240px]">{children}</div>
  </section>
);

const MainPage: React.FC = () => {
  return (
    <>
      <main className="w-full flex flex-col items-center">
        {/* 배너 + 검색 영역 */}
        <div className="relative w-full">
          <MainBanner />
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-2/3 z-10 w-full max-w-[1240px]">
            <SearchBar />
          </div>
        </div>

        {/* 인기 체험 영역 */}
        <SectionContainer className="mt-30 md:mt-40">
          <PopularExperiences />
        </SectionContainer>

        {/* 모든 체험 영역 */}
        <SectionContainer className="my-20">
          <AllExperiences />
        </SectionContainer>
      </main>
    </>
  );
};

export default MainPage;
