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

  return (
    <Image
      src={imgError || !imageUrl ? '/images/defalt_user.png' : imageUrl}
      alt={displayName}
      width={100}
      height={100}
      className="w-full h-full rounded-full object-cover"
      onError={() => setImgError(true)}
      unoptimized
    />
  );
};

export default ProfileImage;
