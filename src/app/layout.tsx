// src/app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: 'GlobalNomad',
  description: 'team1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background text-foreground">
        {/* 헤더 */}
        <Header />
        {/* 각 페이지 */}
        <main className="mx-auto">{children}</main>
        {/* 푸터 */}
        <Footer />
      </body>
    </html>
  );
}
