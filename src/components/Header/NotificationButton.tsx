'use client';

import Image from 'next/image';

export interface NotificationButtonProps {
  onClick?: () => void;
  hasUnreadAlerts?: boolean; // 추가
  unreadCount?: number; // 추가 (선택사항)
}

export default function NotificationButton({
  onClick,
  hasUnreadAlerts = false,
  unreadCount = 0,
}: NotificationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-full p-2 hover:bg-[#DDDDDD]"
      aria-label="알림"
    >
      <Image
        src="/icon/btn/notification.svg"
        alt="알림"
        width={20}
        height={20}
      />

      {/* 🔵 알림 Badge */}
      {hasUnreadAlerts && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--color-blue)] rounded-full border-2 border-white" />
      )}
    </button>
  );
}
