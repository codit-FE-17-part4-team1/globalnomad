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
              ? 'fixed bottom-0 left-0 right-0 w-full max-h-[85vh] rounded-t-2xl rounded-b-none'
              : 'absolute w-[430px] max-h-[700px]'
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
          <div className="flex space-x-4 border-b mb-6">
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
                className={`pb-2 pr-4 flex justify-evenly font-semibold ${
                  activeTab === tab.key
                    ? 'text-[var(--color-green-dark)] border-b-3 border-[var(--color-green-dark)]'
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
            {timeOptions.length > 0 && (
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
                className="border-[var(--color-gray-500)] border rounded-lg p-4 mb-3 flex justify-between items-center"
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
                      className="p-2 !text-black border-[var(--color-gray-400)] text-sm bg-white hover:bg-[var(--color-gray-200)]"
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

// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import type { TimeOption } from '@/app/Profile/ReservationStatus/_components/TimeDropdown';
// import type { ReservationStatus } from '@/types/calendar';
// import Button from '@/components/Button/Button';
// import Chips from '@/components/chips/Chips';
// import TimeDropdown from '@/app/Profile/ReservationStatus/_components/TimeDropdown';

// interface ReservationModalBaseProps {
//   isOpen: boolean;
//   onClose: () => void;
//   status: ReservationStatus;
//   date: string;
//   time: string;
//   reservations: {
//     nickname: string;
//     people: number;
//     status: ReservationStatus;
//     time: string;
//     id: number;
//   }[];
//   onApprove?: (reservationId: number) => void;
//   onReject?: (reservationId: number) => void;
//   position?: { top: number; left: number }; // 모달을 달력 옆에 두도록 구현하고자 함
// }

// export default function ReservationModalBase({
//   isOpen,
//   onClose,
//   status,
//   date,
//   reservations,
//   onApprove,
//   onReject,
//   position,
// }: ReservationModalBaseProps) {
//   const [activeTab, setActiveTab] = useState<ReservationStatus>(status);
//   const [selectedTime, setSelectedTime] = useState<string>('all');
//   const modalRef = useRef<HTMLDivElement>(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // 모달 반응형 추가 필요
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 1024); // lg breakpoint
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // 모달이 열릴 때마다 탭과 시간 상태를 초기화
//   useEffect(() => {
//     if (isOpen) {
//       setActiveTab(status);
//       const initialReservations = reservations.filter(
//         (item) => item.status === status
//       );
//       const firstTime = initialReservations[0]?.time;
//       setSelectedTime(firstTime || 'all');
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }

//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [isOpen, status, reservations]);

//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [isOpen, onClose]);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
//         onClose();
//       }
//     };
//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const reservationsByStatus = reservations.filter((item) => {
//     if (activeTab === 'pending') {
//       return item.status === 'pending';
//     }
//     if (activeTab === 'confirmed') {
//       return item.status === 'confirmed';
//     }
//     if (activeTab === 'canceled') {
//       return item.status === 'declined';
//     }
//     return item.status === activeTab;
//   });

//   // 시간 선택 드롭다운에 표시할 옵션 목록 생성
//   const timeOptions: TimeOption[] = [
//     { value: 'all', label: '시간 전체' },
//     ...Array.from(new Set(reservationsByStatus.map((r) => r.time))).map(
//       (t) => ({ value: t, label: t })
//     ),
//   ];

//   const tabs: { key: ReservationStatus; label: string }[] = [
//     { key: 'pending', label: '신청' },
//     { key: 'confirmed', label: '승인' },
//     { key: 'declined', label: '거절' },
//   ];

//   // 선택된 탭과 시간에 따라 최종적으로 보여줄 예약 목록 필터링
//   const filteredReservations = reservationsByStatus.filter((item) =>
//     selectedTime === 'all' ? true : item.time === selectedTime
//   );

//   const getTabCount = (tabKey: ReservationStatus) => {
//     if (tabKey === 'confirmed') {
//       return reservations.filter((r) => r.status === 'confirmed').length;
//     }
//     if (tabKey === 'declined') {
//       return reservations.filter(
//         (r) => r.status === 'declined' || r.status === 'canceled'
//       ).length;
//     }
//     return reservations.filter((r) => r.status === tabKey).length;
//   };

//   return (
//     <div className="fixed inset-0 z-[9998]">
//       <div
//         ref={modalRef}
//         className="absolute z-[9999] bg-white rounded-lg shadow-xl w-full max-w-[430px] lg:w-[430px] md:w-[430px] xs:w-[375px] max-h-[700px] overflow-y-auto "
//         style={{
//           top:
//             position?.top !== undefined && window.innerWidth >= 1024
//               ? `${position.top}px`
//               : undefined,
//           left:
//             position?.left !== undefined && window.innerWidth >= 1024
//               ? `${position.left}px`
//               : undefined,
//           // top: `${position?.top}px`,
//           // left: `${position?.left}px`,
//         }}
//       >
//         <div className="p-6 relative">
//           {/* 헤더 */}
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold">예약 정보</h2>
//             <Image
//               className="absolute right-5 top-4 cursor-pointer"
//               src="/icon/btn/X_lg.svg"
//               alt="닫기"
//               width={30}
//               height={30}
//               onClick={onClose}
//             />
//           </div>

//           {/* 탭 */}
//           <div className="flex space-x-4 border-b mb-6">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => {
//                   const newTab = tab.key;
//                   setActiveTab(newTab);
//                   // 새로 선택된 탭의 첫 번째 예약 시간을 찾아 기본 선택값으로 설정 --> 수정
//                   const reservationsInNewTab = reservations.filter((item) => {
//                     if (newTab === 'confirmed') {
//                       return (
//                         item.status === 'confirmed' ||
//                         item.status === 'completed'
//                       );
//                     }
//                     if (newTab === 'canceled') {
//                       return (
//                         item.status === 'declined' || item.status === 'canceled'
//                       );
//                     }
//                     return item.status === newTab;
//                   });
//                   setSelectedTime(reservationsInNewTab[0]?.time || 'all');
//                 }}
//                 className={`pb-2 pr-4 flex justify-evenly font-semibold ${
//                   activeTab === tab.key
//                     ? 'text-[var(--color-green-dark)] border-b-3 border-[var(--color-green-dark)]'
//                     : 'text-gray-400'
//                 }`}
//               >
//                 {tab.label}
//                 {getTabCount(tab.key)}
//               </button>
//             ))}
//           </div>

//           {/* 날짜 */}
//           <div className="mb-4">
//             <p className="text-lg font-semibold mb-2">예약 날짜</p>
//             <p className="mb-1">{date}</p>
//             {timeOptions.length > 0 && (
//               <TimeDropdown
//                 className="mt-2"
//                 value={selectedTime}
//                 options={timeOptions}
//                 onChange={setSelectedTime}
//                 placeholder="예약 시간"
//                 closeOnOverlay={true}
//                 closeOnEsc={true}
//               />
//             )}
//           </div>

//           {/* 예약 내역 */}
//           <div>
//             <h3 className="font-semibold mb-2">예약 내역</h3>
//             {filteredReservations.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="border-[var(--color-gray-500)] border  rounded-lg p-4 mb-3 flex justify-between items-center"
//               >
//                 <div>
//                   <p className="text-gray-600">
//                     닉네임{' '}
//                     <span className="font-medium ml-2 text-black">
//                       {item.nickname}
//                     </span>
//                   </p>
//                   <p className="text-gray-600">
//                     인원{' '}
//                     <span className="font-medium ml-2 text-black">
//                       {item.people}명
//                     </span>
//                   </p>
//                 </div>
//                 {activeTab === 'pending' && onApprove && onReject && (
//                   <div className="flex space-x-2">
//                     <Button
//                       className="bg-[var(--color-green-dark)] p-2 text-white text-sm hover:bg-[var(--color-green-dark)]"
//                       onClick={() => onApprove(item.id)}
//                     >
//                       승인하기
//                     </Button>
//                     <Button
//                       className="p-2 !text-black border-[var(--color-gray-400)] text-sm bg-white hover:bg-[var(--color-gray-200)] "
//                       onClick={() => onReject(item.id)}
//                     >
//                       거절하기
//                     </Button>
//                   </div>
//                 )}
//                 {activeTab === 'confirmed' && (
//                   <>
//                     {item.status === 'confirmed' && (
//                       <Chips color="orange" variant="round">
//                         예약 승인
//                       </Chips>
//                     )}
//                   </>
//                 )}
//                 {activeTab === 'canceled' && (
//                   <Chips color="red" variant="round">
//                     예약 거절
//                   </Chips>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
