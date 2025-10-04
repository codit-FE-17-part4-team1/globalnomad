// app/page.tsx
'use client';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import MainBanner from './_components/main/MainBanner';
import SearchBar from './_components/main/SearchBar';
import PopularExperiences from './_components/main/PopularExperiences';
import AllExperiences from './_components/main/AllExperiences';

const MainPage: React.FC = () => {
  return (
    <>
      <Header />
      {/* 메인 전체 컨테이너 */}
      <div className="w-full flex flex-col items-center">
        {/* 배너 영역 */}
        <div className="w-full relative">
          <MainBanner />

          {/* 검색 영역 (배너 위에 겹치도록) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 md:-bottom-16 z-10 w-full max-w-[1240px]">
            <SearchBar />
          </div>
        </div>

        {/* 인기 체험 영역 */}
        <div className="w-full flex justify-center mt-20">
          <div className="w-full max-w-[1240px]">
            <PopularExperiences />
          </div>
        </div>

        {/* 모든 체험 영역 */}
        <div className="w-full flex justify-center mt-20">
          <div className="w-full max-w-[1240px]">
            <AllExperiences />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
