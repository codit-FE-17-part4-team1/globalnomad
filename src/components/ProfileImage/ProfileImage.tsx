'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  imageUrl: string;
  name: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, name }) => {
  const [imgError, setImgError] = useState(false);
  const displayName = name || 'User'; // 이름이 없으면 기본값
  const initial = name.charAt(0).toUpperCase();

  if (imageUrl && !imgError) {
    return (
      <Image
        src={imageUrl}
        alt={displayName}
        width={100}
        height={100}
        className="w-full h-full rounded-full object-cover"
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }

  // fallback: 이미지 없거나 로딩 실패 시 이니셜 표시
  return (
    <div className="w-full h-full rounded-full bg-orange-400 flex items-center justify-center">
      <span className="text-lg font-medium text-white">{initial}</span>
    </div>
  );
};

export default ProfileImage;
