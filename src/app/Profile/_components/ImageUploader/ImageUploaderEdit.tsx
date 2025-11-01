'use client';
import Image from 'next/image';
import { useState, useRef } from 'react';

interface ImageUploaderEditProps<
  T extends string | { id?: number; url: string },
> {
  title: string;
  //images: string[] | { id?: number; url: string }[];
  //setImages: (urls: any) => void;
  images: T[];
  setImages: React.Dispatch<React.SetStateAction<T[]>>;
  maxCount?: number;
}

export default function ImageUploaderEdit<
  T extends string | { id?: number; url: string },
>({ title, images, setImages, maxCount = 4 }: ImageUploaderEditProps<T>) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (loading) return;

    if (images.length >= maxCount) {
      alert(`이미지는 최대 ${maxCount}장까지 가능합니다.`);
      return;
    }
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setLoading(true);
    const uploadedUrls: string[] = [];

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

        uploadedUrls.push(data.url);
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        alert('이미지 업로드에 실패했습니다');
      }
    }

    if (typeof images[0] === 'string') {
      setImages(
        (prev) =>
          [...(prev as string[]), ...uploadedUrls].slice(0, maxCount) as T[]
      );
    } else {
      const newImages = uploadedUrls.map((url) => ({ url })) as T[];
      setImages([...images, ...newImages].slice(0, maxCount));
    }

    setLoading(false);
  };

  return (
    <div className="mt-[24px]">
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
          className="relative aspect-square w-[48%] float-left mr-[3%] mb-[8px] lg:w-[180px] lg:mr-[24px] lg:mb-[24px] cursor-pointer"
          onClick={handleClick}
        >
          <Image
            src="/icon/btn/img.svg"
            alt="이미지추가"
            fill
            className="object-cover"
          />
        </li>

        {images.map((img, i) => {
          const url = typeof img === 'string' ? img : img.url;
          return (
            <li
              key={i}
              className={`relative aspect-square w-[48%] mb-[8px] lg:w-[180px] lg:mb-[24px] rounded-3xl overflow-hidden float-left ${
                i % 3 === 2 ? 'lg:mr-0' : 'lg:mr-[24px]'
              }
                ${i === 1 || i === 3 ? 'mr-[3%]' : ''}
              }`}
            >
              <Image
                src={url}
                alt={`image-${i}`}
                fill
                className="w-20 h-20 object-cover rounded"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
