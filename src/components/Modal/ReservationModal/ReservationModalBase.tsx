'use client';

import React from 'react';
import Image from 'next/image';
import BaseModal from '@/components/Modal/BaseModal';

interface ReservationModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'confirmed' | 'canceled';
  date: string;
  time: string;
  reservations: {
    nickname: string;
    people: number;
  }[];
  // 이 prop으로 버튼을 구현
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
  const tabs = [
    { key: 'pending', label: '신청' },
    { key: 'confirmed', label: '승인' },
    { key: 'canceled', label: '거절' },
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="md" title="예약 정보">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">예약 정보</h2>
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
              className={`pb-2 font-semibold ${
                status === tab.key
                  ? 'text-green-800 border-b-2 border-green-800'
                  : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 날짜 */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">예약 날짜</h3>
          <p>{date}</p>
          <div className="mt-2 border px-4 py-2 rounded-md">{time}</div>
        </div>

        {/* 예약 내역 */}
        <div>
          <h3 className="font-semibold mb-2">예약 내역</h3>
          {reservations.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-600">
                  닉네임{' '}
                  <span className="font-medium ml-2">{item.nickname}</span>
                </p>
                <p className="text-gray-600">
                  인원 <span className="font-medium ml-2">{item.people}명</span>
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
