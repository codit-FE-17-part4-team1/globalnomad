// src/app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GlobalNomad',
  description: 'team1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
