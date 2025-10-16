import 'server-only';
import { cookies } from 'next/headers';
import Header from '@/components/Header/Header';
import { getMe } from '@/lib/auth/api';
import Link from 'next/link';

export default async function HeaderServer() {
  const cookieStore = await cookies();
  const access = cookieStore.get('accessToken')?.value;
  if (!access) return <Header isLoggedIn={false} />;

  try {
    const me = await getMe(access);
    return (
      <Header
        isLoggedIn
        userName={me.nickname}
        userImage={me.profileImageUrl ?? undefined}
      />
    );
  } catch {
    return <Header isLoggedIn={false} />;
  }
}
