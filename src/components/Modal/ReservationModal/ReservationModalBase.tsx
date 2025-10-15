'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { TimeOption } from '@/app/Profile/ReservationStatus/_components/TimeDropdown';
import BaseModal from '@/components/Modal/BaseModal';
import type { ReservationStatus } from '@/types/calendar';
import TimeDropdown from '@/app/Profile/ReservationStatus/_components/TimeDropdown';

interface ReservationModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  status: ReservationStatus;
  date: string;
  time: string;
  reservations: {
    nickname: string;
    people: number;
    status: ReservationStatus;
    time: string;
  }[];
  renderActionButtons?: (item: {
    nickname: string;
    people: number;
  }) => React.ReactNode;
}

export default function ReservationModalBase({
  isOpen,
  onClose,
  status,
  date,
  time,
  reservations,
  renderActionButtons,
}: ReservationModalBaseProps) {
  const [activeTab, setActiveTab] = useState<ReservationStatus>(status);
  const [selectedTime, setSelectedTime] = useState<string>('all');

  // 모달이 열릴 때마다 탭과 시간 상태를 초기화합니다.
  useEffect(() => {
    if (isOpen) {
      setActiveTab(status);
      // 현재 탭의 첫 번째 예약 시간을 찾아 기본 선택값으로 설정합니다.
      const initialReservations = reservations.filter(
        (item) => item.status === status
      );
      const firstTime = initialReservations[0]?.time;
      setSelectedTime(firstTime || 'all');
    }
  }, [isOpen, status, reservations]);

  // 현재 활성화된 탭(신청/승인/거절)에 해당하는 예약 목록
  const reservationsByStatus = reservations.filter(
    (item) => item.status === activeTab
  );

  // 시간 선택 드롭다운에 표시할 옵션 목록 생성
  const timeOptions: TimeOption[] = [
    { value: 'all', label: '시간 전체' },
    // 중복된 시간을 제거하고 드롭다운 옵션 형태로 변환
    ...Array.from(new Set(reservationsByStatus.map((r) => r.time))).map(
      (t) => ({ value: t, label: t })
    ),
  ];

  const tabs: { key: ReservationStatus; label: string }[] = [
    { key: 'pending', label: '신청' },
    { key: 'confirmed', label: '승인' },
    { key: 'canceled', label: '거절' },
  ];

  // 선택된 탭과 시간에 따라 최종적으로 보여줄 예약 목록 필터링
  const filteredReservations = reservationsByStatus.filter((item) =>
    selectedTime === 'all' ? true : item.time === selectedTime
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="예약 정보"
      className="lg:w-[430px] md:w-[430px] xs:w-[375px] bg-white"
    >
      <div className="p-6">
        <Image
          className="absolute right-5 top-4 cursor-pointer"
          src="/icon/btn/X_lg.svg"
          alt="닫기"
          width={30}
          height={30}
          onClick={onClose}
        />

        {/* 탭 */}
        <div className="flex space-x-4 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedTime('all'); // 탭을 변경하면 시간 필터는 '전체'로 초기화
              }}
              className={`pb-2 pr-4 flex justify-evenly font-semibold ${
                activeTab === tab.key
                  ? 'text-[var(--color-green-dark)] border-b-3 border-[var(--color-green-dark)]'
                  : 'text-gray-400'
              }`}
            >
              {tab.label}{' '}
              {reservations.filter((r) => r.status === tab.key).length}
            </button>
          ))}
        </div>

        {/* 날짜 */}
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">예약 날짜</p>
          <p className="mb-1">{date}</p>
          {/* 시간 - button & dropdown 으로 구현 필요할 듯 */}
          {/* 시간 옵션이 '전체' 외에 더 있을 때만 드롭다운 표시 */}
          {timeOptions.length > 1 && (
            <TimeDropdown
              className="mt-2"
              value={selectedTime}
              options={timeOptions}
              onChange={setSelectedTime}
              placeholder="예약 시간"
            />
          )}
        </div>

        {/* 예약 내역 */}
        <div>
          <h3 className="font-semibold mb-2">예약 내역</h3>
          {filteredReservations.map((item, idx) => (
            <div
              key={idx}
              className="border-[var(--color-gray-500)] border  rounded-lg p-4 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-600">
                  닉네임{' '}
                  <span className="font-medium ml-2 text-black">
                    {item.nickname}
                  </span>
                </p>
                <p className="text-gray-600">
                  인원{' '}
                  <span className="font-medium ml-2 text-black">
                    {item.people}명
                  </span>
                </p>
              </div>
              {renderActionButtons && renderActionButtons(item)}
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
}
