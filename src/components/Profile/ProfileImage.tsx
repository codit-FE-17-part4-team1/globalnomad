'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { myprofileimage } from '@/lib/myprofileimage/api';
import { useMyInfoModify, useMyInfo } from '@/app/Profile/MyInfo/useMyInfo';

export default function ProfileImage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateMyInfo } = useMyInfoModify();
  const { getMyInfo } = useMyInfo();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setLoading(true);
    setError(null);

    try {
      const uploadedUrl = await myprofileimage(file);
      await updateMyInfo({
        nickname: getMyInfo?.nickname || '',
        profileImageUrl: uploadedUrl,
      });
      setImage(uploadedUrl);
    } catch (err) {
      setError('이미지 업로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  return (
    <div className="relative mx-auto mb-6 h-28 w-28">
      <Image
        src={image || '/images/zootopia_asloth.jpg'}
        alt="프로필"
        fill
        className="rounded-full object-cover"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        aria-label="프로필 사진 수정"
        onClick={handleClick}
        disabled={loading}
        className="absolute -bottom-1 -right-1 grid h-10 w-10 z-10 place-items-center rounded-full bg-white/80 hover:bg-white cursor-pointer"
      >
        <Image src="/icon/edit.svg" alt="프로필 수정" width={30} height={30} />
      </button>

      {loading && (
        <p className="mt-2 text-sm text-gray-500 text-center">업로드 중...</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
