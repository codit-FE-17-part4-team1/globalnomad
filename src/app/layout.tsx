// app/layout.tsx
import '../styles/global.css';

import React from 'react';
import Footer from '@/components/Footer/Footer';
import HeaderGate from '@/components/Header/HeaderGate';
import HeaderServer from '@/components/Header/HeaderServer';

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
