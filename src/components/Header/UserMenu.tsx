'use client';

import Profile from './Profile';
import NotificationButton from './NotificationButton';

export interface UserMenuProps {
  userName?: string;
  userImage?: string;
  onNotificationClick?: () => void;
}

export default function UserMenu({
  userName,
  userImage,
  onNotificationClick,
}: UserMenuProps) {
  return (
    <div className="flex items-center gap-4">
      <NotificationButton onClick={onNotificationClick} />
      {/* 세로 구분선 */}
      <span className="text-[#DDDDDD] select-none">|</span>
      <Profile userName={userName} userImage={userImage} />
    </div>
  );
}
