'use client';

import Link from 'next/link';
import UserMenu from './UserMenu';

export interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  userImage?: string;
  onNotificationClick?: () => void;
}

export default function Header({
  isLoggedIn,
  userName,
  userImage,
  onNotificationClick,
}: HeaderProps) {
  return (
    <header className="w-full h-[70px] bg-[#ffffff]">
      <div className="flex items-center justify-between w-full max-w-[1920px] h-[70px] py-[10px] border-b border-[#DDDDDD] mx-auto px-[max(20px,5%)]">
        {/* 로고 */}
        <Link href="/">
          <img
            src="/icon/logo/header_logo_lg.svg"
            alt="logo"
            className="w-[10.75rem] h-[1.875rem]"
          />
        </Link>

        {/* 우측 영역 */}
        {!isLoggedIn ? (
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/login"
              className="text-[#1B1B1B] hover:text-[#79747E] font-medium text-sm leading-6 tracking-normal text-center transition-colors duration-300 whitespace-nowrap"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="text-[#1B1B1B] hover:text-[#79747E] font-medium text-sm leading-6 tracking-normal text-center transition-colors duration-300 whitespace-nowrap"
            >
              회원가입
            </Link>
          </div>
        ) : (
          <UserMenu
            userName={userName}
            userImage={userImage}
            onNotificationClick={onNotificationClick}
          />
        )}
      </div>
    </header>
  );
}
