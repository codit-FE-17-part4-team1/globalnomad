'use client';

import Image from 'next/image';
import '../styles/global.css';
import MyButton from '@/components/Button/Button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/icon/logo/logo_big.svg"
          alt="GlobalNomad Logo"
          width={200}
          height={200}
          priority
        />
        <Link href="/Login">
          <MyButton
            onClick={() => console.log('로그인 성공')}
            className="py-[11px] px-[138.5px]"
          >
            로그인 하기
          </MyButton>
        </Link>
      </div>
    </div>
  );
}
