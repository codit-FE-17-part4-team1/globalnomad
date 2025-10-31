// src/app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/global.css';

import React from 'react';
import HeaderGate from '@/components/Header/HeaderGate';
import HeaderServer from '@/components/Header/HeaderServer';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: 'globalNomad',
  description: '여행 체험을 등록하고 예약할 수 있는 플랫폼',
  icons: {
    icon: '/images/design_2/earth.png',
  },

  openGraph: {
    title: 'globalNomad',
    description:
      'GlobalNomad는 사용자가 판매자와 체험자 모두 될 수 있는 체험 예약 플랫폼입니다.',
    images: [
      {
        url: '/images/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: '5명이 으쌰으쌰',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background text-foreground">
        <HeaderGate>
          <HeaderServer />
        </HeaderGate>

        <main className="mx-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
