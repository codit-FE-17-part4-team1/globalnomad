import 'server-only';
import { cookies } from 'next/headers';
import Header from '@/components/Header/Header';
import { getMe } from '@/lib/auth/api';
//import Link from 'next/link';  ESLint 오류 해결을 위해 우선 비활성화 처리

export default async function HeaderServer() {
  const cookieStore = await cookies();
  const access = cookieStore.get('accessToken')?.value;
  if (!access)
    return (
      <Header
        isLoggedIn={false}
        userName=""
        userImage="/images/defalt_user.png"
      />
    );

  try {
    const me = await getMe(access);
    return (
      <Header
        isLoggedIn
        userName={me.nickname}
        userImage={me.profileImageUrl || '/images/defalt_user.png'}
      />
    );
  } catch {
    return (
      <Header
        isLoggedIn={false}
        userName=""
        userImage="/images/defalt_user.png"
      />
    );
  }
}
