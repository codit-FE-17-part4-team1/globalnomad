'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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

        {/* 날짜 */}
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">예약 날짜</p>
          <p className="mb-1">{date}</p>
          {/* 시간 - button & dropdown 으로 구현 필요할 듯 */}
          <TimeDropdown
            className="mt-2"
            value={time}
            options={[]}
            onChange={() => {}}
          />
          {/* <div className="mt-2 border border-[var(--color-gray-500)] px-4 py-2 rounded-md">
            {time}
          </div> */}
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
