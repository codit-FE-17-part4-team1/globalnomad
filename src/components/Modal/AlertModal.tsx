// overlay 적용 안됨 이슈
// BaseModal 과 분리해봄 아예 따로 구현

'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export type Alert = {
  id: number;
  title: string;
  time: string;
  status: '승인' | '거절';
  createdAt: string;
};

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts?: Alert[];
  onDelete: (id: number) => void;
  // onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  error?: string;
  lastElementRef: (node: HTMLElement | null) => void;
}

export default function AlertModal({
  isOpen,
  onClose,
  alerts = [],
  onDelete,
  // onLoadMore,  // 무한스크롤 훅이 자동으로 내려가기 때문에 더보기 버튼이 의미가 없어짐..!
  hasMore,
  isLoading,
  error,
  lastElementRef,
}: AlertModalProps) {
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(alerts);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalAlerts(alerts);
  }, [alerts]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // 딜레이로 열림 클릭과 겹치지 않도록 (추가해줌)
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleRemoveAlerts = async (id: number) => {
    setLocalAlerts((prev) => prev.filter((a) => a.id !== id));
    await onDelete(id);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  // '몇분 전' 이런식으로 떠야해서 추가
  const getTimeAgo = (timestamp: string | Date): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      // 7일 이상이면 날짜 표시
      return past.toLocaleDateString('ko-KR');
    }
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 md:absolute md:top-15 md:right-0 md:inset-auto bg-orange-light rounded-none md:rounded-lg shadow-xl h-screen md:h-auto md:max-h-[400px] overflow-auto [&::-webkit-scrollbar]:hidden z-[9999] w-screen md:w-[375px]"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold">알림 {localAlerts.length}개</h2>
        <Image
          className="cursor-pointer"
          src="/icon/btn/X_lg.svg"
          alt="닫기"
          width={24}
          height={24}
          onClick={handleCloseClick}
        />
      </div>

      {/* 에러 상태 */}
      {error && (
        <div className="p-4 text-sm text-[var(--color-red)]">{error}</div>
      )}

      {/* 로딩 상태 */}
      {isLoading && localAlerts.length === 0 && (
        <div className="p-4 text-center text-[var(--color-gray-500)]">
          Loading ...
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && localAlerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 ">
          <Image
            src="/images/loading.png"
            alt="예약 내역 없음"
            width={100}
            height={100}
          />
          <p className="text-[var(--color-gray-700)] pt-5">알림이 없습니다.</p>
        </div>
      )}

      {/* 알림 목록 */}
      <div className="p-4 space-y-2">
        {localAlerts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-4 relative hover:shadow-md transition-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상태 표시 점 */}
            <div
              className={`absolute top-4 left-4 w-2 h-2 rounded-full ${
                item.status === '승인'
                  ? 'bg-[var(--color-blue)]'
                  : item.status === '거절'
                    ? 'bg-[var(--color-red)]'
                    : 'bg-[var(--color-gray-400)]'
              }`}
            />

            {/* 내용 */}
            <div className="pl-6 pr-8">
              <p className="text-sm text-gray-800">
                {item.title} ({item.time}) 예약이{' '}
                <span
                  className={`font-semibold ${
                    item.status === '승인'
                      ? 'text-[var(--color-blue)]'
                      : item.status === '거절'
                        ? 'text-[var(--color-red)]'
                        : ''
                  }`}
                >
                  {item.status}
                </span>
                되었습니다.
              </p>
              <p className="text-xs text-[var(--color-gray-400)] mt-1">
                {getTimeAgo(item.createdAt)}
              </p>
            </div>

            {/* 삭제 버튼 */}
            <button
              onClick={() => handleRemoveAlerts(item.id)}
              className="absolute top-3 right-3 text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)] transition-colors"
              aria-label="알림 삭제"
            >
              <Image
                src="/icon/btn/X_md.svg"
                alt="닫기"
                width={20}
                height={20}
              />
            </button>
          </div>
        ))}
      </div>

      {/* 여기에 무한스크롤을 적용 */}
      {hasMore && (
        <div ref={lastElementRef} className="p-4 border-t border-gray-200">
          {isLoading && (
            <div className="text-xs text-[var(--color-gray-500)]">
              로딩 중...
            </div>
          )}
        </div>
      )}

      {/* 모든 알림 확인 완료 */}
      {!hasMore && alerts.length > 0 && (
        <div className="p-4 text-center mb-4 text-md text-[var(--color-gray-700)]">
          모든 알림을 확인했습니다.
        </div>
      )}
    </div>
  );
}
