'use client';

import { useState } from 'react';
import ReservationCalendar from './_components/ReservationCalendar';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import AlertModal from '@/components/Modal/AlertModal';
import { mockAlerts } from '@/app/Profile/ReservationStatus/mock/AlertMockdata';
import { mockCalEvents } from '@/app/Profile/ReservationStatus/mock/CalendarMockdata';
import ExperienceSelect from '@/app/Profile/ReservationStatus/_components/ExperienceSelect';

export default function ReservationStatusPage() {
  const experiences = Array.from(new Set(mockCalEvents.map((ev) => ev.title)));
  const [isAlertOpen, setIsAlertOpen] = useState(true); // 테스트를 위해 true로 설정 (임시) 추후엔 흠 ..
  const [selectedExperience, setSelectedExperience] = useState<string>(
    experiences[0] || ''
  );

  return (
    <div className="mx-auto max-w-screen-xl ">
      {/* 임시 확인, 나중에 알림 이모티콘? 에 연결할 예정 */}
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        alerts={mockAlerts}
      />
      {/* 공통 컴포넌트 적용 - title 유선님 작업하신 거 조립 완료 */}
      <Header title="예약 현황" />
      {/* 카테고리 필터 공통 컴포넌트 적용 필요 */}
      <ExperienceSelect
        experiences={experiences}
        selectedExperience={selectedExperience}
        onSelectExperience={setSelectedExperience}
      />
      {/* <div>
        <input placeholder="카테고리 선택" className="border" />
      </div> */}
      <div className="h-[560px] md:h-[620px] lg:h-[680px]">
        <ReservationCalendar />
      </div>
    </div>
  );
}
