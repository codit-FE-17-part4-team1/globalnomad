'use client';

import { useState, ChangeEvent, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import FormInput from '@/components/Input/FormInput';
import MyButton from '@/components/Button/Button';
import { loginAction, type LoginState } from '@/actions/login.action';

const initialState: LoginState = {
  status: false,
  fetchErrorText: '',
  isError: { email: false, password: false },
  errors: {},
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <MyButton className="w-full py-3 mt-4" disabled={disabled || pending}>
      {pending ? '로그인 중...' : '로그인 하기'}
    </MyButton>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [state, formAction] = useActionState(loginAction, initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const disabled = !form.email || !form.password;

  useEffect(() => {
    if (state.status) router.push('/');
  }, [state.status, router]);

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

        <form action={formAction} autoComplete="off">
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

          <SubmitButton disabled={disabled} />
        </form>

        {state.fetchErrorText && (
          <p className="mt-3 text-sm text-red-600">{state.fetchErrorText}</p>
        )}

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
