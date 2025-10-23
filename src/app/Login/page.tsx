'use client';

import { useEffect, useState, ChangeEvent, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { loginAction } from '@/actions/login.action';
import type { AuthResult } from '@/types/auth';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import FormInput from '@/components/Input/FormInput';
import MyButton from '@/components/Button/Button';

const initialState: AuthResult = { ok: false, message: '' };

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [state, formAction] = useActionState(loginAction, initialState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const disabled = !form.email || !form.password;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ 성공 즉시 리다이렉트
  useEffect(() => {
    if (state.ok) router.push('/');
  }, [state.ok, router]);

  // ✅ 실패 + message 있을 때만 모달 노출
  useEffect(() => {
    if (!state.ok && state.message) {
      setModalMsg(state.message);
      setIsModalOpen(true);
    }
  }, [state.ok, state.message]);

  const handleConfirm = () => setIsModalOpen(false);

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
          {!state.ok && state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.email}
            </p>
          )}

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
          {!state.ok && state.fieldErrors?.password && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.password}
            </p>
          )}

          <SubmitButton disabled={disabled} />
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

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          message={modalMsg}
          confirmLabel="확인"
          className="bg-white"
        />
      </div>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <MyButton className="w-full py-3 mt-4" disabled={disabled || pending}>
      {pending ? '로그인 중...' : '로그인 하기'}
    </MyButton>
  );
}
