'use client';

import { useState } from 'react';
import Profile from './Profile';
import NotificationButton from './NotificationButton';
import AlertModal from '@/components/Modal/AlertModal';
import useNotification from '@/hooks/useNotification';

export interface UserMenuProps {
  userName: string;
  userImage: string;
  onNotificationClick?: () => void;
}

export default function UserMenu({
  userName,
  userImage,
  onNotificationClick,
}: UserMenuProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const {
    notifications,
    isLoading,
    error,
    hasNext,
    loadMore,
    handleDeleteNotification,
  } = useNotification();

  // 알림 / 읽지 않은 알림 확인
  const hasUnreadAlerts = notifications.length > 0;
  const unreadCount = notifications.length;

  const handleNotificationClick = () => {
    onNotificationClick?.();
    setIsAlertOpen(true);
  };

  const handleNotificationClose = () => {
    setIsAlertOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative">
          <NotificationButton
            onClick={handleNotificationClick}
            hasUnreadAlerts={hasUnreadAlerts}
            unreadCount={unreadCount}
          />

          {isAlertOpen && (
            <AlertModal
              isOpen={isAlertOpen}
              onClose={handleNotificationClose}
              alerts={notifications}
              onDelete={handleDeleteNotification}
              onLoadMore={loadMore}
              hasNext={hasNext}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>

        {/* 세로 구분선 */}
        <span className="text-gray-200 select-none">|</span>

        <Profile userName={userName} userImage={userImage} />
      </div>
    </>
  );
}
