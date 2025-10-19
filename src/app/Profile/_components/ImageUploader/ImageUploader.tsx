'use client';

import Image from 'next/image';
import { useRef } from 'react';

type ImageUploaderProps = {
  title: string;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  maxCount?: number;
};

export default function ImageUploader({
  title,
  images,
  setImages,
  maxCount = 4,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (images.length + files.length > maxCount) {
      alert(`${title}는 최대 ${maxCount}개까지만 업로드 가능합니다.`);
      return;
    }
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prev) => [...prev, ...newImages].slice(0, maxCount));
  };

  return (
    <div className="mt-[24px]">
      <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">{title}</h1>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleChange}
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
        {images.map((src, idx) => (
          <li
            key={idx}
            className={`relative aspect-square w-[49%] mb-[8px] lg:w-[180px] lg:mb-[24px] rounded-3xl overflow-hidden float-left ${
              idx % 3 === 2 ? 'lg:mr-0' : 'lg:mr-[24px]'
            }`}
          >
            <Image
              src={src}
              alt={`${title}-${idx}`}
              fill
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
