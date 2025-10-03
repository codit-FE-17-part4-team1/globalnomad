// app/layout.tsx
'use client';

import '../styles/global.css';
import React, { useState } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <html lang="ko">
      <body>
        <div className="flex flex-col min-h-screen">
          {/* 헤더 */}
          <Header
            isLoggedIn={isLoggedIn}
            userName={isLoggedIn ? '코드잇' : undefined}
            userImage={isLoggedIn ? '/images/user.png' : undefined}
            onNotificationClick={() => alert('알림 버튼 클릭!')}
          />

          {/* 메인 콘텐츠 */}
          <main className="flex-grow">{children}</main>

          {/* 푸터 */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
