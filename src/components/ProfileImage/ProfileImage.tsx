'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  imageUrl: string;
  name: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, name }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Image
      src={imageUrl && !imgError ? imageUrl : '/images/defalt_user.png'}
      alt={name ?? 'user'}
      width={100}
      height={100}
      className="w-full h-full rounded-full object-cover"
      onError={() => setImgError(true)}
      unoptimized
    />
  );
};

export default ProfileImage;
