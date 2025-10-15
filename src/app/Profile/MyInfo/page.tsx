'use client';

import FormInput from '@/components/Input/FormInput';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import { useMyInfoUpdate } from './useMyInfoUpdate';
export default function MyInfo() {
  const Label_Style = 'font-bold! text-2xl! mb-4! text-black!';
  const { form, handleChange, handleSubmit } = useMyInfoUpdate();
  return (
    <div>
      <Header
        title="내 정보"
        type="button"
        buttonText="저장하기"
        onClick={handleSubmit}
      />
      <form>
        <fieldset className="flex flex-col gap-4">
          <FormInput
            id="nickname"
            name="nickname"
            type="nickname"
            labelText="닉네임"
            placeholder="닉네임을 입력하세요"
            value={form.nickname}
            onChange={handleChange}
            labelClassName={Label_Style}
          />
          <FormInput
            id="email"
            name="email"
            type="email"
            labelText="이메일"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={handleChange}
            labelClassName={Label_Style}
          />
          <FormInput
            id="password"
            name="password"
            type="password"
            labelText="비밀번호"
            placeholder="8자 이상 입력해 주세요"
            value={form.password}
            onChange={handleChange}
            labelClassName={Label_Style}
          />
          <FormInput
            id="passwordConfirm"
            name="passwordConfirm"
            type="passwordConfirm"
            labelText="비밀번호 재입력"
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={form.passwordConfirm}
            onChange={handleChange}
            passwordValue={form.password}
            labelClassName={Label_Style}
          />
        </fieldset>
      </form>
    </div>
  );
}
