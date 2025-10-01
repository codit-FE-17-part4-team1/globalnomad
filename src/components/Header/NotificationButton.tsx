'use client';

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
      <img src="/icon/btn/notification.svg" alt="알림" className="w-5 h-5" />
    </button>
  );
}
