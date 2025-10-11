'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import BaseModal from '@/components/Modal/BaseModal';
import type { CalStatus } from '@/types/calendar';

interface ReservationModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  status: CalStatus;
  date: string;
  time: string;
  reservations: {
    nickname: string;
    people: number;
    status: CalStatus;
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
  const [activeTab, setActiveTab] = useState<CalStatus>(status);

  // 모달이 열릴 때마다 바꿔줘야 함
  useEffect(() => {
    if (isOpen) {
      setActiveTab(status);
    }
  }, [isOpen, status]);

  const tabs = [
    { key: 'pending', label: '신청' },
    { key: 'confirmed', label: '승인' },
    { key: 'canceled', label: '거절' },
  ];

  const filteredReservations = reservations.filter(
    (item) => item.status === activeTab
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="예약 정보"
      className="[w-380px] bg-white"
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
              onClick={() => setActiveTab(tab.key)}
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

        {/* 날짜 - 카테고리로 추가 필요 */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">예약 날짜</h3>
          <p>{date}</p>
          <div className="mt-2 border px-4 py-2 rounded-md">{time}</div>
        </div>

        {/* 예약 내역 */}
        <div>
          <h3 className="font-semibold mb-2">예약 내역</h3>
          {filteredReservations.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 mb-3 flex justify-between items-center"
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
