'use client';

import Image from 'next/image';

export interface NotificationButtonProps {
  onClick?: () => void;
}

export default function NotificationButton({
  onClick,
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
    </button>
  );
}
