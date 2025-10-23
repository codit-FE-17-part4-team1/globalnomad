// 공통컴포넌트 딜레마에 빠졌다는 ..
// 해당 컴포넌트는 BG가 없어야 하고, 위치도 조정되어야 하는 !!! ㅠㅠ
// 이게 결국엔 드롭다운이었다는 !!! ㅠㅠㅠ 일단 모달로 ..

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import BaseModal from '@/components/Modal/BaseModal';

export type Alert = {
  id: number;
  title: string;
  time: string;
  status: '승인' | '거절';
  createdAt: string;
};

export default function AlertModal({
  isOpen,
  onClose,
  alerts = [],
  onDelete,
  onLoadMore,
  hasNext,
  isLoading,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  alerts?: Alert[];
  onDelete: (id: number) => void;
  onLoadMore: () => void;
  hasNext: boolean;
  isLoading: boolean;
  error?: string;
}) {
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(alerts);

  useEffect(() => {
    setLocalAlerts(alerts);
  }, [alerts]);

  const handleRemoveAlerts = async (id: number) => {
    setLocalAlerts((prev) => prev.filter((a) => a.id !== id));
    await onDelete(id);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  // 전체적으로 수정 필요 - 알림 이모지 밑에 위치하도록!
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`알림 ${localAlerts.length}개`}
      variant="dropdown"
      closeOnOverlay={true}
      className="bg-[var(--color-green-light)] w-[300px] h-[300px]" // 왜 width 는 조정이 안됨?
    >
      {error && (
        <div className="p-4 test-sm test-[var(--color-red)]">{error}</div>
      )}
      {isLoading && localAlerts.length === 0 && (
        <div className="p-4 text-center text-[var(--color-gray-500)]">
          Loading ...
        </div>
      )}
      {!isLoading && localAlerts.length === 0 && (
        <div className="flex flex-col  items-center justify-center mt-17 text-[var(--color-gray-500)]">
          {/* 이건 반응형 수정 필요할 듯? 텍스트 위치 등 */}
          알림이 없습니다.
        </div>
      )}

      <Image
        className="absolute right-5 top-4 cursor-pointer"
        src="/icon/btn/X_lg.svg"
        alt="닫기"
        width={30}
        height={30}
        onClick={handleCloseClick}
      />
      {/* 1. 배경 넣기 */}
      <div className="p-6 space-y-2 rounded-lg">
        {localAlerts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-sm shadow-sm p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 2. 점 표시 (승인/거절 색상 구분) */}
            <div
              className={`absolute top-4 left-4 w-2 h-2 rounded-full ${
                item.status === '승인'
                  ? 'bg-[var(--color-blue)]'
                  : item.status === '거절'
                    ? 'bg-[var(--color-red)]'
                    : 'bg-[var(--color-gray-400)]'
              }`}
            />

            {/* 3. 내용 넣기 */}
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

            {/* 4. x 버튼 추가 */}
            <button
              onClick={() => handleRemoveAlerts(item.id)}
              className="absolute top-3 right-3 text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)]"
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
    </BaseModal>
  );
}
