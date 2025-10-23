'use client';

import { useState } from 'react';
import Profile from './Profile';
import NotificationButton from './NotificationButton';
import AlertModal from '@/components/Modal/AlertModal';
import useNotification from '@/hooks/useNotification';

export interface UserMenuProps {
  userName?: string;
  userImage?: string;
}

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcwNCwidGVhbUlkIjoiMTctMSIsImlhdCI6MTc2MTIyNTQ1NiwiZXhwIjoxNzYxMjI3MjU2LCJpc3MiOiJzcC1nbG9iYWxub21hZCJ9.bs1WnH2IUpx9LFH3ImqqsAgLYXdHGqe3Bk0vBbetvrA';

export default function UserMenu({ userName, userImage }: UserMenuProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const {
    notifications,
    isLoading,
    error,
    hasNext,
    loadMore,
    handleDeleteNotification,
  } = useNotification(accessToken);

  const handleNotificationClick = () => {
    setIsAlertOpen(true);
  };

  const handleNotificationClose = () => {
    setIsAlertOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <NotificationButton onClick={handleNotificationClick} />
        {/* 세로 구분선 */}
        <span className="text-[#DDDDDD] select-none">|</span>
        <Profile userName={userName} userImage={userImage} />
      </div>
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
    </>
  );
}
