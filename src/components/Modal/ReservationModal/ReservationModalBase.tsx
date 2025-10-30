'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { TimeOption } from '@/app/Profile/ReservationStatus/_components/TimeDropdown';
// import BaseModal from '@/components/Modal/BaseModal';
import type { ReservationStatus } from '@/types/calendar';
import Button from '@/components/Button/Button';
import Chips from '@/components/chips/Chips';
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
    id: number; // reservationId
  }[];
  onApprove?: (reservationId: number) => void;
  onReject?: (reservationId: number) => void;
  position?: { top: number; left: number }; // 모달을 달력 옆에 두도록 구현하고자 함
}

export default function ReservationModalBase({
  isOpen,
  onClose,
  status,
  date,
  reservations,
  onApprove,
  onReject,
  position,
}: ReservationModalBaseProps) {
  const [activeTab, setActiveTab] = useState<ReservationStatus>(status);
  const [selectedTime, setSelectedTime] = useState<string>('all');
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때마다 탭과 시간 상태를 초기화
  useEffect(() => {
    if (isOpen) {
      setActiveTab(status);
      const initialReservations = reservations.filter(
        (item) => item.status === status
      );
      const firstTime = initialReservations[0]?.time;
      setSelectedTime(firstTime || 'all');
    }
  }, [isOpen, status, reservations]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 2. 현재 활성화된 탭(신청/승인/거절)에 해당하는 예약 목록
  const reservationsByStatus = reservations.filter((item) => {
    if (activeTab === 'pending') {
      return item.status === 'pending';
    }
    if (activeTab === 'confirmed') {
      return item.status === 'confirmed';
    }
    if (activeTab === 'canceled') {
      return item.status === 'declined';
    }
    return item.status === activeTab;
  });

  // 시간 선택 드롭다운에 표시할 옵션 목록 생성
  const timeOptions: TimeOption[] = [
    { value: 'all', label: '시간 전체' },
    ...Array.from(new Set(reservationsByStatus.map((r) => r.time))).map(
      (t) => ({ value: t, label: t })
    ),
  ];

  const tabs: { key: ReservationStatus; label: string }[] = [
    { key: 'pending', label: '신청' },
    { key: 'confirmed', label: '승인' },
    { key: 'declined', label: '거절' },
  ];

  // 선택된 탭과 시간에 따라 최종적으로 보여줄 예약 목록 필터링
  const filteredReservations = reservationsByStatus.filter((item) =>
    selectedTime === 'all' ? true : item.time === selectedTime
  );

  const getTabCount = (tabKey: ReservationStatus) => {
    if (tabKey === 'confirmed') {
      return reservations.filter((r) => r.status === 'confirmed').length;
    }
    if (tabKey === 'declined') {
      return reservations.filter(
        (r) => r.status === 'declined' || r.status === 'canceled'
      ).length;
    }
    return reservations.filter((r) => r.status === tabKey).length;
  };

  return (
    // BaseModal 을 쓰면 안될 듯 ㅠ
    // <BaseModal
    //   isOpen={isOpen}
    //   onClose={onClose}
    //   title="예약 정보"
    //   className="lg:w-[430px] md:w-[430px] xs:w-[375px] bg-white"
    // >
    <div className="fixed inset-0 z-40">
      <div
        ref={modalRef}
        className="absolute z-50 bg-white rounded-lg shadow-xl w-full max-w-[430px] lg:w-[430px] md:w-[430px] xs:w-[375px] max-h-[calc(100vh-100px)] overflow-y-auto"
        style={{
          top: `${position?.top}px`,
          left: `${position?.left}px`,
        }}
      >
        <div className="p-6 relative">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">예약 정보</h2>
            <Image
              className="absolute right-5 top-4 cursor-pointer"
              src="/icon/btn/X_lg.svg"
              alt="닫기"
              width={30}
              height={30}
              onClick={onClose}
            />
          </div>

          {/* 탭 */}
          <div className="flex space-x-4 border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  const newTab = tab.key;
                  setActiveTab(newTab);
                  // 새로 선택된 탭의 첫 번째 예약 시간을 찾아 기본 선택값으로 설정 --> 수정
                  const reservationsInNewTab = reservations.filter((item) => {
                    if (newTab === 'confirmed') {
                      return (
                        item.status === 'confirmed' ||
                        item.status === 'completed'
                      );
                    }
                    if (newTab === 'canceled') {
                      return (
                        item.status === 'declined' || item.status === 'canceled'
                      );
                    }
                    return item.status === newTab;
                  });
                  setSelectedTime(reservationsInNewTab[0]?.time || 'all');
                }}
                className={`pb-2 pr-4 flex justify-evenly font-semibold ${
                  activeTab === tab.key
                    ? 'text-[var(--color-green-dark)] border-b-3 border-[var(--color-green-dark)]'
                    : 'text-gray-400'
                }`}
              >
                {tab.label}
                {getTabCount(tab.key)}
                {/* {reservations.filter((r) => r.status === tab.key).length} */}
              </button>
            ))}
          </div>

          {/* 날짜 */}
          <div className="mb-4">
            <p className="text-lg font-semibold mb-2">예약 날짜</p>
            <p className="mb-1">{date}</p>
            {/* 시간 - button & dropdown 으로 구현 필요할 듯 -> Dropdown 모달 생성해서 추가 완료!*/}
            {/* 시간 옵션이 '전체' 외에 더 있을 때만 드롭다운 표시 */}
            {timeOptions.length > 1 && (
              <TimeDropdown
                className="mt-2"
                value={selectedTime}
                options={timeOptions}
                onChange={setSelectedTime}
                placeholder="예약 시간"
                closeOnOverlay={true}
                closeOnEsc={true}
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
                {activeTab === 'pending' && onApprove && onReject && (
                  <div className="flex space-x-2">
                    <Button
                      className="bg-[var(--color-green-dark)] p-2 text-white text-sm hover:bg-[var(--color-green-dark)]"
                      onClick={() => onApprove(item.id)}
                    >
                      승인하기
                    </Button>
                    <Button
                      className="p-2 !text-black border-[var(--color-gray-400)] text-sm bg-white hover:bg-[var(--color-gray-200)] "
                      onClick={() => onReject(item.id)}
                    >
                      거절하기
                    </Button>
                  </div>
                )}
                {activeTab === 'confirmed' && (
                  <>
                    {item.status === 'confirmed' && (
                      <Chips color="orange" variant="round">
                        예약 승인
                      </Chips>
                    )}
                    {item.status === 'completed' && (
                      <Chips color="orange" variant="round">
                        체험 완료{' '}
                        {/* 예약 지난 것들이 갑자기 베이지 색으로 변경되어 확인해서 추가했는데.. 결론은 백엔드에서 주지 않아서.. 안되는 듯? */}
                      </Chips>
                    )}
                  </>
                )}
                {activeTab === 'canceled' && (
                  <Chips color="red" variant="round">
                    예약 거절
                  </Chips>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* // </BaseModal> */}
      </div>
    </div>
  );
}
