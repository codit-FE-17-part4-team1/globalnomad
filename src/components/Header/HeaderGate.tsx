'use client';

import { usePathname } from 'next/navigation';

const Hidden = ['/Login', '/Signup'];

export default function HeaderGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (Hidden.includes(pathname)) return null;
  return <>{children}</>;
}
