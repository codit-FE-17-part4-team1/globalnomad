'use client';
import Image from 'next/image';
import { useState, useRef } from 'react';
interface ImageUploaderAddProps {
  title: string;
  images: string[];
  setImages: (urls: string[]) => void;
  maxCount?: number;
}

export default function ImageUploaderAdd({
  title,
  images,
  setImages,
  maxCount = 4,
}: ImageUploaderAddProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleClick = () => {
    if (loading || images.length >= maxCount) return;
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedUrls: string[] = [];
    setLoading(true);

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/activities/image', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '업로드 실패');

        uploadedUrls.push(data.url); // Add용은 string 배열
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        alert('이미지 업로드에 실패했습니다');
      }
    }

    //setImages((prev) => [...prev, ...uploadedUrls].slice(0, maxCount));
    setImages([...images, ...uploadedUrls].slice(0, maxCount));

    setLoading(false);
  };

  return (
    <div className="mt-[24px]">
      <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">{title}</h1>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={loading || images.length >= maxCount}
        className="hidden"
      />
      <ul className="overflow-hidden">
        <li
          className="relative aspect-square w-[49%] float-left mb-[8px] lg:w-[180px] lg:mr-[24px] lg:mb-[24px] cursor-pointer"
          onClick={handleClick}
        >
          <Image
            src="/icon/btn/img.svg"
            alt="이미지추가"
            fill
            className="object-cover"
          />
        </li>
        {images.map((url, i) => (
          <li
            key={i}
            className={`relative aspect-square w-[49%] mb-[8px] lg:w-[180px] lg:mb-[24px] rounded-3xl overflow-hidden float-left ${
              i % 3 === 2 ? 'lg:mr-0' : 'lg:mr-[24px]'
            }`}
          >
            <Image
              key={i}
              src={url}
              alt={`image-${i}`}
              fill
              className="w-20 h-20 object-cover rounded"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
