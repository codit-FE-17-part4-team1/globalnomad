// 'use client';

// import { useState, ChangeEvent, useActionState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useFormStatus } from 'react-dom';
// import { signupAction, type ActionState } from '@/actions/signup.action';
// import FormInput from '@/components/Input/FormInput';
// import MyButton from '@/components/Button/Button';

// const initialState: ActionState = {
//   status: false,
//   fetchErrorText: '',
//   isError: {
//     email: false,
//     password: false,
//     nickname: false,
//     passwordConfirmation: false,
//   },
//   errors: {},
// };

// function SubmitButton({ disabled }: { disabled: boolean }) {
//   const { pending } = useFormStatus();
//   return (
//     <MyButton className="w-full py-3 mt-4" disabled={disabled || pending}>
//       {pending ? '처리 중...' : '회원가입 하기'}
//     </MyButton>
//   );
// }

// export default function SignupPage() {
//   const [form, setForm] = useState({
//     email: '',
//     nickname: '',
//     password: '',
//     passwordConfirmation: '',
//   });
//   const [state, formAction] = useActionState(signupAction, initialState);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const disabled =
//     !form.email ||
//     !form.nickname ||
//     !form.password ||
//     !form.passwordConfirmation ||
//     form.password !== form.passwordConfirmation;

//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <div className="w-full max-w-[640px] min-w-[350px] px-6">
//         <div className="flex justify-center mb-[54px]">
//           <Link href="/">
//             <Image
//               src="/icon/logo/logo_big.svg"
//               alt="메인 로고"
//               width={340}
//               height={0}
//               className="w-[340px] max-w-[270px] h-auto"
//               priority
//             />
//           </Link>
//         </div>

//         <form action={formAction} autoComplete="off">
//           <FormInput
//             id="email"
//             name="email"
//             type="email"
//             labelText="이메일"
//             placeholder="이메일을 입력하세요"
//             value={form.email}
//             onChange={handleChange}
//             labelClassName="text-black"
//             labelUnstyled
//           />

//           <FormInput
//             id="nickname"
//             name="nickname"
//             type="text"
//             labelText="닉네임"
//             placeholder="닉네임을 입력하세요"
//             value={form.nickname}
//             onChange={handleChange}
//             labelClassName="text-black"
//             labelUnstyled
//           />

//           <FormInput
//             id="password"
//             name="password"
//             type="password"
//             labelText="비밀번호"
//             placeholder="비밀번호를 입력하세요"
//             value={form.password}
//             onChange={handleChange}
//             labelClassName="text-black"
//             labelUnstyled
//           />

//           <FormInput
//             id="passwordConfirmation"
//             name="passwordConfirmation"
//             type="password"
//             labelText="비밀번호 확인"
//             placeholder="비밀번호를 다시 입력하세요"
//             value={form.passwordConfirmation}
//             onChange={handleChange}
//             passwordValue={form.password}
//             labelClassName="text-black"
//             labelUnstyled
//           />

//           <SubmitButton disabled={disabled} />
//         </form>

//         {state.fetchErrorText && (
//           <p className="mt-3 text-sm text-red-600">{state.fetchErrorText}</p>
//         )}

//         {state.status && (
//           <p className="mt-3 text-sm text-green-700">
//             회원가입이 완료되었습니다.
//           </p>
//         )}

//         <p className="mt-6 text-center text-sm text-gray-600">
//           이미 계정이 있으신가요?{' '}
//           <Link href="/Login" className="text-[#0b3b2d] hover:underline">
//             로그인 하기
//           </Link>
//         </p>

//         <div className="flex items-center my-8">
//           <div className="flex-1 h-px bg-gray-300" />
//           <span className="px-3 text-gray-500 text-sm">
//             SNS 계정으로 로그인하기
//           </span>
//           <div className="flex-1 h-px bg-gray-300" />
//         </div>
//         <div className="flex justify-center gap-4">
//           <MyButton
//             className="w-12 h-12 rounded-full flex items-center justify-center bg-transparent border-none"
//             onClick={() => alert('카카오 로그인')}
//           >
//             <Image
//               src="/icon/social/kakao.svg"
//               alt="Kakao"
//               width={72}
//               height={72}
//             />
//           </MyButton>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, ChangeEvent, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { signupAction } from '@/actions/signup.action';
import type { AuthResult } from '@/types/auth';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import FormInput from '@/components/Input/FormInput';
import MyButton from '@/components/Button/Button';

const initialState: AuthResult = { ok: false, message: '' };

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirmation: '',
  });
  const [state, formAction] = useActionState(signupAction, initialState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const disabled =
    !form.email ||
    !form.nickname ||
    !form.password ||
    !form.passwordConfirmation;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-[640px] min-w-[350px]">
        <h1 className="text-2xl font-semibold mb-6">회원가입</h1>

        <form action={formAction} autoComplete="off" className="space-y-4">
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
          {!state.ok && state.fieldErrors?.nickname && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.nickname}
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

          <FormInput
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            labelText="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            value={form.passwordConfirmation}
            onChange={handleChange}
            labelClassName="text-black"
            labelUnstyled
          />
          {!state.ok && state.fieldErrors?.passwordConfirmation && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.passwordConfirmation}
            </p>
          )}

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
