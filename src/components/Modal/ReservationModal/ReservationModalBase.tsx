'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { TimeOption } from '@/app/Profile/ReservationStatus/_components/TimeDropdown';
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
    id: number;
  }[];
  onApprove?: (reservationId: number) => void;
  onReject?: (reservationId: number) => void;
  position?: { top: number; left: number };
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
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(status);
      const initialReservations = reservations.filter(
        (item) => item.status === status
      );
      const firstTime = initialReservations[0]?.time;
      setSelectedTime(firstTime || 'all');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
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
        if (window.innerWidth >= 1024) {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 배경 - 모바일/태블릿에서만 표시 */}
      {isMobile && (
        <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={onClose} />
      )}

      {/* 모달 */}
      <div
        ref={modalRef}
        className={`
          bg-white rounded-lg shadow-xl overflow-y-auto z-[9999]
          ${
            isMobile
              ? 'fixed bottom-0 left-0 right-0 w-full max-h-[50vh] rounded-t-2xl rounded-b-none'
              : 'absolute w-[430px] h-[600px]'
          }
        `}
        style={
          !isMobile && position
            ? {
                top: `${position.top}px`,
                left: `${position.left}px`,
              }
            : undefined
        }
      >
        <div className="p-6 relative">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">예약 정보</h2>
            <button
              onClick={onClose}
              className="absolute right-5 top-4 cursor-pointer w-[30px] h-[30px] flex items-center justify-center"
              aria-label="닫기"
            >
              <Image
                src="/icon/btn/X_lg.svg"
                alt="닫기"
                width={30}
                height={30}
              />
            </button>
          </div>

          {/* 탭 */}
          <div className="flex space-x-6 border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  const newTab = tab.key;
                  setActiveTab(newTab);
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
                className={`pb-2 px-4 flex justify-center items-center font-semibold ${
                  activeTab === tab.key
                    ? 'text-orange-dark border-b-3 border-orange-dark'
                    : 'text-gray-400'
                }`}
              >
                {tab.label}
                {getTabCount(tab.key)}
              </button>
            ))}
          </div>

          {/* 날짜 */}
          <div className="mb-4">
            <p className="text-lg font-semibold mb-2">예약 날짜</p>
            <p className="mb-1">{date}</p>
            {timeOptions.length > 0 && ( // 데이터가 없어도 드롭다운은 뜨도록 할거임
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
            {/* 데이터가 없을 경우 귀염뽀짝한 이미지를 추가해볼까 */}
            {filteredReservations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <Image
                  src="/images/design_2/empty.png"
                  alt="예약 내역 없음"
                  width={100}
                  height={100}
                />
                <p className="text-gray-500 pt-8">예약 내역이 없습니다</p>
              </div>
            )}
            {filteredReservations.map((item, idx) => (
              <div
                key={idx}
                className="border-gray-500 border rounded-lg p-4 mb-3 flex justify-between items-center"
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
                      className="bg-orange-dark p-2 border-orange-dark text-white text-sm hover:bg-orange-dark"
                      onClick={() => onApprove(item.id)}
                    >
                      승인하기
                    </Button>
                    <Button
                      className="p-2 !text-black border-gray-500 text-sm bg-white hover:bg-gray-100"
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
      </div>
    </>
  );
}
