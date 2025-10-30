'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileImage from './ProfileImage';
import { logoutAction } from '@/actions/logout.action';

export default function ProfileCard() {
  const pathname = usePathname();

  const MENU = [
    {
      key: 'info',
      label: '내 정보',
      href: '/Profile/MyInfo',
      icon: '/icon/account_checkout.svg',
    },
    {
      key: 'reservations',
      label: '예약 내역',
      href: '/Profile/ReservationHistory',
      icon: '/icon/check.svg',
    },
    {
      key: 'manage',
      label: '내 체험 관리',
      href: '/Profile/ExperienceSet',
      icon: '/icon/setting.svg',
    },
    {
      key: 'status',
      label: '예약 현황',
      href: '/Profile/ReservationStatus',
      icon: '/icon/calendar_check.svg',
    },
    {
      key: 'logout',
      label: '로그아웃',
      href: '/logout',
      icon: '/icon/logout.svg',
      isLogout: true,
    },
  ];

  return (
    <div className="hidden md:block w-full rounded-2xl border border-[var(--color-gray-200)] shadow h-[470px] bg-white p-6 lg:w-[370px] md:w-[250px]">
      {/* 프로필 이미지 수정*/}
      <ProfileImage />
      {/* 메뉴 */}
      <nav className="space-y-3">
        {MENU.map((item) => {
          const isActive = pathname.startsWith(item.href);

          if (item.isLogout) {
            return (
              <form
                key={item.key}
                action={logoutAction}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-[var(--color-gray-400)] font-semibold cursor-pointer hover:bg-[var(--color-gray-100)] transition-colors"
              >
                <button
                  type="submit"
                  className="flex items-center gap-3 w-full"
                >
                  <Image
                    src={item.icon}
                    alt={`${item.label} 아이콘`}
                    width={22}
                    height={22}
                  />
                  <span>{item.label}</span>
                </button>
              </form>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              className={[
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors duration-200 hover:bg-[var(--color-gray-100)]',
                isActive
                  ? 'bg-[var(--color-green-light)] text-[var(--color-green-dark)] font-bold'
                  : 'text-[var(--color-gray-400)] font-semibold',
              ].join(' ')}
              style={{ fontSize: 'var(--text-lg)' }}
            >
              <Image
                src={item.icon}
                alt={`${item.label} 아이콘`}
                width={22}
                height={22}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
