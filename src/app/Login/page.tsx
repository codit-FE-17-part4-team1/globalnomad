'use client';

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import FormInput from '@/components/Input/FormInput';
import MyButton from '@/components/Button/Button';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('로그인 정보:', form);
    //로그인 API 연동
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-[640px] min-w-[350px] px-6">
        <div className="flex justify-center mb-[54px]">
          <Image
            src="/icon/logo/logo_big.svg"
            alt="메인 로고"
            width={340}
            height={0}
            className="w-[340px] max-w-[270px] h-auto"
            priority
          />
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <FormInput
            id="email"
            name="email"
            type="email"
            labelText="이메일"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={handleChange}
            labelClassName="text-black"
            labelUnstyled
          />

          <FormInput
            id="password"
            name="password"
            type="password"
            labelText="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={handleChange}
            labelClassName="text-black"
            labelUnstyled
          />

          <MyButton
            className="w-full py-3 mt-4"
            disabled={!form.email || !form.password}
            onClick={() => {}}
          >
            로그인 하기
          </MyButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          아직 계정이 없으신가요?{' '}
          <Link href="/Signup" className="text-[#0b3b2d] hover:underline">
            회원가입 하기
          </Link>
        </p>

        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-500 text-sm">
            SNS 계정으로 로그인하기
          </span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <div className="flex justify-center gap-4">
          <MyButton
            className="w-12 h-12 rounded-full flex items-center justify-center bg-transparent border-none"
            onClick={() => alert('카카오 로그인')}
          >
            <Image
              src="/icon/social/kakao.svg"
              alt="Kakao"
              width={72}
              height={72}
            />
          </MyButton>
        </div>
      </div>
    </div>
  );
}
