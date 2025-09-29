'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileCard() {
  const pathname = usePathname(); // next.js의 App Router에서 현재 URL의 경로(path) 부분을 읽어오는 클라이언트 컴포넌트 훅이라고 하는데, 이건 다른 페이지가 생성되면 연결하면 되는걸지?

  // 경로 설정의 이름을 확인해야 할 듯 !
  const MENU = [
    {
      key: 'info',
      label: '내 정보',
      href: '/profile/info',
      icon: '/icon/account_checkout.svg',
      active: true,
    },
    {
      key: 'reservations',
      label: '예약 내역',
      href: '/profile/reservations',
      icon: '/icon/check.svg',
      active: false,
    },
    {
      key: 'manage',
      label: '내 체험 관리',
      href: '/profile/experiences',
      icon: '/icon/setting.svg',
      active: false,
    },
    {
      key: 'status',
      label: '예약 현황',
      href: '/profile/status',
      icon: '/icon/calendar_check.svg',
      active: false,
    },
  ];

  return (
    // ml은 테스트용으로 적용 (뺄 예정!)
    <div className="rounded-2xl border border-[var(--color-gray-200)] lg:w-[380px] shadow h-[430px] bg-white p-6 ml-8">
      {/* 프로필 이미지 수정*/}
      <div className="relative mx-auto mb-6 h-28 w-28">
        <Image
          src="/images/zootopia_asloth.jpg"
          alt="프로필"
          fill
          className="rounded-full object-cover"
        />
        <button
          type="button"
          aira-label="프로필 사진 수정"
          className="absolute -bottom-1 -right-1 grid h-10 w-10 z-10 place-items-center rounded-full cursor-pointer"
        >
          <Image
            src="/icon/edit.svg"
            alt="프로필 수정"
            width={30}
            height={30}
          />
        </button>
      </div>
      {/* 메뉴 */}
      <nav className="space-y-3">
        {MENU.map((item) => {
          // const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={[
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors duration-200',
                // isActive
                item.active
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
