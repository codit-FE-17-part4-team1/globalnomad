'use client';

import { useState } from 'react';
import ReservationCalendar from './_components/ReservationCalendar';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import AlertModal from '@/components/Modal/AlertModal';

export default function ReservationStatusPage() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <div className="mx-auto max-w-screen-xl ">
      {/* 임시 확인 */}
      <AlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} />
      {/* 공통 컴포넌트 적용 - title 유선님 작업하신 거 조립 완료 */}
      <Header title="예약 현황" />
      {/* 카테고리 필터 공통 컴포넌트 적용 필요 */}
      <div>
        <input placeholder="카테고리 선택" className="border" />
      </div>
      <div className="h-[560px] md:h-[620px] lg:h-[680px]">
        <ReservationCalendar />
      </div>
    </div>
  );
}
