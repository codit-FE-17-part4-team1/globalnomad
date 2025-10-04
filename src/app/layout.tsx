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
  const pathname = usePathname();
  const hiddenRoutes = ['/', '/Login', '/Signup'];

  const showLayout = !hiddenRoutes.includes(pathname);

  return (
    <html lang="ko">
      <body className="min-h-screen bg-background text-foreground">
        {showLayout && <Header />}
        <main className="mx-auto">{children}</main>
        {showLayout && <Footer />}
      </body>
    </html>
  );
}
