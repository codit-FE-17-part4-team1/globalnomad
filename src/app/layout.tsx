// src/app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/global.css';

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
        {children}
      </body>
    </html>
  );
}
