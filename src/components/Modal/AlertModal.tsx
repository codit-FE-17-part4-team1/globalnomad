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
  onLoadMore: () => void;
  hasNext: boolean;
  isLoading: boolean;
  error?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  alerts = [],
  onDelete,
  onLoadMore,
  hasNext,
  isLoading,
  error,
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

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 md:absolute md:top-15 md:right-0 md:inset-auto bg-[var(--color-green-light)] rounded-none md:rounded-lg shadow-xl h-screen md:h-auto md:max-h-[400px] overflow-auto z-[9999] w-screen md:w-[375px]"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-gray-200)]">
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
        <div className="flex flex-col items-center justify-center py-12 text-[var(--color-gray-500)]">
          알림이 없습니다.
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
                {item.createdAt}
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

      {/* 더보기 버튼 (필요시) */}
      {hasNext && (
        <div className="p-4 border-t border-[var(--color-gray-200)]">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="w-full py-2 text-sm text-[var(--color-blue)] hover:bg-[var(--color-gray-50)] rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? '로딩 중...' : '더보기'}
          </button>
        </div>
      )}
    </div>
  );
}
