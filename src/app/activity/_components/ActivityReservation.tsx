'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ActivityReservationProps {
  startContainerId: string; // 체험 설명부터
  endContainerId: string; // 리뷰 섹션까지
}

const ActivityReservation: React.FC<ActivityReservationProps> = ({
  startContainerId,
  endContainerId,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuStyle, setMenuStyle] = useState<{
    position: 'absolute' | 'fixed';
    top: number;
  }>({
    position: 'absolute',
    top: 0,
  });

  const [isMobile, setIsMobile] = useState(false);

  // 모바일 여부 체크
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 스크롤 위치에 따른 플로팅 메뉴 위치 계산
  useEffect(() => {
    const startEl = document.getElementById(startContainerId);
    const endEl = document.getElementById(endContainerId);
    if (!startEl || !endEl) return;

    const handleScroll = () => {
      if (isMobile) return; // 모바일에서는 스크롤 로직 무시

      const scrollY = window.scrollY;
      const menuHeight = menuRef.current?.offsetHeight || 0;
      const startTop = startEl.offsetTop;
      const endTop = endEl.offsetTop + endEl.offsetHeight - menuHeight;

      if (scrollY < startTop) {
        setMenuStyle({ position: 'absolute', top: startTop });
      } else if (scrollY >= startTop && scrollY <= endTop) {
        setMenuStyle({ position: 'fixed', top: 20 });
      } else {
        setMenuStyle({ position: 'absolute', top: endTop });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 위치 체크

    return () => window.removeEventListener('scroll', handleScroll);
  }, [startContainerId, endContainerId, isMobile]);

  return (
    <div
      ref={menuRef}
      className={`
        ${isMobile ? 'fixed inset-0 z-50 w-full h-screen' : ''}
        md:static md:w-[251px] md:h-[431px]
        lg:w-[384px] lg:h-[746px]
        md:border md:border-[#DDDDDD] md:rounded-[12px] md:shadow-[0_4px_16px_0_rgba(17,34,17,0.05)]
        md:transition-all md:duration-300 md:overflow-hidden
        bg-white
      `}
      style={{
        position: isMobile ? 'fixed' : menuStyle.position,
        top: isMobile ? 0 : menuStyle.top,
      }}
    >
      {/* 내부 콘텐츠 */}
    </div>
  );
};

export default ActivityReservation;
