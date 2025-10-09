'use client';

import Image from 'next/image';
import BaseModal from '@/components/Modal/BaseModal';

type Alert = {
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
}: {
  isOpen: boolean;
  onClose: () => void;
  alerts?: Alert[];
}) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="알림 `${n}`개"
      className="bg-[var(--color-green-light)] relative"
    >
      <Image
        className="absolute right-5 top-4 cursor-pointer"
        src="/icon/btn/X_lg.svg"
        alt="닫기"
        width={30}
        height={30}
      />
      {/*  -------------------------------------------  */}
      {/* 1. 배경 넣기 */}
      <div className="p-6 space-y-4 rounded-lg">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-sm shadow-sm p-4 relative"
          >
            {/* <Image src="/icon/btn/X_lg.svg" alt="닫기" width={20} height={20} /> */}
            {/* 2. 점 표시 (승인/거절 색상 구분) */}
            <div
              className={`absolute top-4 left-4 w-2 h-2 rounded-full ${
                item.status === '승인'
                  ? 'bg-[var(--color-blue)]'
                  : item.status === '거절'
                    ? 'bg-[var(--color-red)]'
                    : 'bg-[var(--color-gray-400)]'
              }`}
            ></div>

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

            {/* 4. x 버튼 */}
            <button className="absolute top-3 right-3 text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)]">
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
