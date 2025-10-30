'use client';

import { useEffect, useState, ChangeEvent, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { signupAction } from '@/actions/signup.action';
import type { AuthResult } from '@/types/auth';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import FormInput from '@/components/Input/FormInput';
import MyButton from '@/components/Button/Button';

const initialState: AuthResult = { ok: false, message: '' };

export default function SignupPage() {
  const router = useRouter();

  // 폼 값
  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirmation: '',
  });

  // 로컬에서만 관리하는 에러 (닉네임 / 비밀번호확인)
  const [nicknameError, setNicknameError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  // 서버 액션 상태
  const [state, formAction] = useActionState(signupAction, initialState);

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // 이용약관
  const [termsAgreed, setTermsAgreed] = useState(false);

  // 버튼 disabled (약관 체크까지 포함)
  const disabled =
    !form.email ||
    !form.nickname ||
    !form.password ||
    !form.passwordConfirmation ||
    !termsAgreed;

  // 인풋 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    // 체크박스 처리
    if (type === 'checkbox' && name === 'termsAgreed') {
      setTermsAgreed(checked);
      return;
    }

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      // 닉네임 에러: 10자 제한
      if (name === 'nickname') {
        if (value.length > 10) {
          setNicknameError('열 자 이하로 작성해주세요.');
        } else {
          setNicknameError('');
        }
      }

      // 비밀번호 확인 에러: password와 passwordConfirmation 비교
      if (name === 'password' || name === 'passwordConfirmation') {
        if (
          next.password &&
          next.passwordConfirmation &&
          next.password !== next.passwordConfirmation
        ) {
          setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
        } else {
          setPasswordConfirmError('');
        }
      }

      return next;
    });
  };

  // 서버 응답 처리 (모달)
  useEffect(() => {
    if (state?.message) {
      setModalMsg(state.message);
      setIsModalOpen(true);
    }
  }, [state]);

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (state.ok) router.push('/'); // 성공 시 메인으로 이동
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

        {/* 서버 액션으로 제출 */}
        <form action={formAction} autoComplete="off" className="space-y-4">
          {/* 이메일 */}
          <FormInput
            id="email"
            name="email"
            type="email"
            labelText="이메일"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={handleChange}
          />
          {/* 서버에서 온 이메일 에러 */}
          {!state.ok && state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.email}
            </p>
          )}

          {/* 닉네임 */}
          <FormInput
            id="nickname"
            name="nickname"
            type="nickname"
            labelText="닉네임"
            placeholder="닉네임을 입력하세요"
            value={form.nickname}
            onChange={handleChange}
            // 로컬 닉네임 에러 override
            errorOverride={nicknameError}
          />
          {/* 서버 닉네임 에러 */}
          {!state.ok && state.fieldErrors?.nickname && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.nickname}
            </p>
          )}

          {/* 비밀번호 */}
          <FormInput
            id="password"
            name="password"
            type="password"
            labelText="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={handleChange}
          />
          {!state.ok && state.fieldErrors?.password && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.password}
            </p>
          )}

          {/* 비밀번호 확인 */}
          <FormInput
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="passwordConfirm"
            labelText="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            value={form.passwordConfirmation}
            onChange={handleChange}
            passwordValue={form.password}
            // 로컬 비번확인 에러 override
            errorOverride={passwordConfirmError}
          />
          {!state.ok && state.fieldErrors?.passwordConfirmation && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.passwordConfirmation}
            </p>
          )}

          {/* 이용약관 동의 */}
          <div className="flex items-center gap-2 mt-2">
            <input
              id="termsAgreed"
              name="termsAgreed"
              type="checkbox"
              checked={termsAgreed}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="termsAgreed" className="text-sm text-gray-700">
              이용약관 및 개인정보 처리방침에 동의합니다.
            </label>
          </div>

          <SubmitButton disabled={disabled} />
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/Login" className="text-[#0b3b2d] hover:underline">
            로그인 하기
          </Link>
        </p>

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
      {pending ? '회원가입 중...' : '회원가입 하기'}
    </MyButton>
  );
}
