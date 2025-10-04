'use client';
import FormInput from '@/components/Input/FormInput';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import { useInputValue } from '@/hooks/useInputValue';
// import Nodata from '@/app/Profile/_components/Nodata/Nodata';
export default function MyInfo() {
  const [form, handleChange] = useInputValue({
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  return (
    <div>
      <Header
        title="제목"
        type="button"
        buttonText="저장하기"
        onClick={() => {
          console.log('저장하기');
        }}
      />
      <form>
        <fieldset>
          <FormInput
            id="nickname"
            name="nickname"
            type="nickname"
            labelText="닉네임"
            placeholder="닉네임을 입력하세요"
            value={form.nickname}
            onChange={handleChange}
          />
          <FormInput
            id="email"
            name="email"
            type="email"
            labelText="이메일"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={handleChange}
          />
          <FormInput
            id="password"
            name="password"
            type="password"
            labelText="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={handleChange}
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
          />
        </fieldset>
      </form>
    </div>
  );
}
