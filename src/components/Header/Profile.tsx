'use client';

import ProfileImage from '../ProfileImage/ProfileImage';

export interface ProfileProps {
  userName?: string;
  userImage?: string;
  onClick?: () => void;
}

export default function Profile({
  userName,
  userImage,
  onClick,
}: ProfileProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
      {/* 프로필 이미지 */}
      <div className="h-8 w-8 rounded-full overflow-hidden">
        <ProfileImage imageUrl={userImage} name={userName} />
      </div>

      {/* 이름 */}
      <span className="text-[#1B1B1B] hover:text-[#79747E] font-medium text-sm leading-6 tracking-normal text-center transition-colors duration-300 whitespace-nowrap">
        {userName}
      </span>
    </div>
  );
}
