'use client';

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import FormInput from '@/components/Input/FormInput';
import MyButton from '@/components/Button/Button';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('회원가입 정보:', form);
    //회원가입 API 연동
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-[640px] min-w-[350px] px-6">
        <div className="flex justify-center mb-[54px]">
          <Link href="/">
            <Image
              src="/icon/logo/logo_big.svg"
              alt="메인 로고"
              width={340}
              height={0}
              className="w-[340px] max-w-[270px] h-auto"
              priority
            />
          </Link>
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
            id="nickname"
            name="nickname"
            type="text"
            labelText="닉네임"
            placeholder="닉네임을 입력하세요"
            value={form.nickname}
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

          <FormInput
            id="passwordConfirm"
            name="passwordConfirm"
            type="passwordConfirm"
            labelText="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            value={form.passwordConfirm}
            onChange={handleChange}
            passwordValue={form.password}
            labelClassName="text-black"
            labelUnstyled
          />

          <MyButton
            className="w-full py-3 mt-4"
            disabled={
              !form.email ||
              !form.nickname ||
              !form.password ||
              !form.passwordConfirm ||
              form.password !== form.passwordConfirm
            }
            onClick={() => {}}
          >
            회원가입 하기
          </MyButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/Login" className="text-[#0b3b2d] hover:underline">
            로그인 하기
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
