'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
// import { getUser, patchUser, uploadProfileImage } from '@/actions/user.action';

type MyInfoType = {
  createdAt: string;
  email: string;
  id: number;
  nickname: string;
  profileImageUrl: string;
  updatedAt: string;
};

export default function ProfileImage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [getMyInfo, setGetMyInfo] = useState<MyInfoType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log('프로필 이미지', image);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        setGetMyInfo(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadResponse = await fetch('/api/users/me/image', {
        method: 'POST',
        body: formData,
      });
      const result = await uploadResponse.json();
      const uploadedUrl = result.profileImageUrl;

      setImage(uploadedUrl);

      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: getMyInfo?.nickname || '',
          profileImageUrl: uploadedUrl,
        }),
      });

      const userResponse = await fetch('/api/users/me');
      const updatedData = await userResponse.json();
      setGetMyInfo(updatedData);
      setImage(uploadedUrl);

      alert('프로필 이미지가 업데이트되었습니다.');
    } catch (err) {
      alert('이미지 업로드 실패');
      setImage(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative mx-auto mb-6 h-28 w-28">
      <Image
        src={
          image || getMyInfo?.profileImageUrl || '/images/zootopia_asloth.jpg'
        }
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
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="absolute -bottom-1 -right-1 grid h-10 w-10 z-10 place-items-center rounded-full bg-white/80 hover:bg-white cursor-pointer disabled:opacity-50"
      >
        <Image src="/icon/edit.svg" alt="프로필 수정" width={30} height={30} />
      </button>

      {loading && (
        <p className="mt-2 text-sm text-gray-500 text-center">업로드 중</p>
      )}
    </div>
  );
}
