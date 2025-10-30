'use client';
import { useRouter } from 'next/navigation';
import ProfileImage from '../ProfileImage/ProfileImage';

export interface ProfileProps {
  userName: string;
  userImage: string;
}

export default function Profile({ userName, userImage }: ProfileProps) {
  const router = useRouter();

  const displayName = userName || 'User'; // 유저 이미지 값이 없으면 기본값으로 나옴

  const handleClick = () => {
    router.push('/Profile/MyInfo'); // 프로필 메뉴로 클릭 시, 내정보 페이지로 이동
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={handleClick}
    >
      {/* 프로필 이미지 */}
      <div className="h-8 w-8 rounded-full overflow-hidden">
        <ProfileImage imageUrl={userImage} name={userName} />
      </div>
      {/* 이름 */}
      <span className="text-black hover:text-orange font-medium text-sm leading-6 tracking-normal text-center transition-colors duration-300 whitespace-nowrap">
        {displayName}
      </span>
    </div>
  );
}
