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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcwNCwidGVhbUlkIjoiMTctMSIsImlhdCI6MTc2MTIyODg3MiwiZXhwIjoxNzYxMjMwNjcyLCJpc3MiOiJzcC1nbG9iYWxub21hZCJ9.JDHOwIiEOgO-eRVJdhiyv5qSrS286HHRx68MjerZNH0';

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
        <div className="relative">
          <NotificationButton onClick={handleNotificationClick} />
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
        </div>
        {/* 세로 구분선 */}
        <span className="text-[#DDDDDD] select-none">|</span>
        <Profile userName={userName} userImage={userImage} />
      </div>
    </>
  );
}
