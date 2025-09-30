'use client';

import React, { useState } from 'react';

interface ProfileImageProps {
  imageUrl?: string;
  name?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, name }) => {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={name ?? 'user'}
        className="w-full h-full rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  // fallback: 이미지 없거나 로딩 실패 시 이니셜 표시
  return (
    <div className="w-full h-full rounded-full bg-[#DDDDDD] flex items-center justify-center">
      <span className="text-lg font-medium text-[#1B1B1B]">{initial}</span>
    </div>
  );
};

export default ProfileImage;
