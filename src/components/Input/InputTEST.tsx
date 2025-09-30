'use client';

import FormInput from '@/components/Input/FormInput';
import SearchInput from '@/components/Input/SearchInput';
import CustomInput from '@/components/Input/CustomInput';
import { useInputValue } from '@/hooks/useInputValue';

export default function InputTEST() {
  const [form, handleChange] = useInputValue({
    email: '',
    password: '',
    nickname: '',
    passwordConfirm: '',
    search: '',
    title: '',
    price: '',
    address: '',
    description: '',
    review: '',
  });

  console.log('현재 입력 값:', form);

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* ---------------- 회원가입/로그인 ---------------- */}
      <h2 className="text-lg font-bold">회원가입 / 로그인</h2>
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
        id="nickname"
        name="nickname"
        type="nickname"
        labelText="닉네임"
        placeholder="닉네임을 입력하세요"
        value={form.nickname}
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

      {/* ---------------- 검색 ---------------- */}
      <h2 className="text-lg font-bold">검색</h2>
      <SearchInput
        id="search"
        name="search"
        placeholder="주소를 검색하세요"
        value={form.search}
        onChange={handleChange}
      />

      {/* ---------------- 커스텀 입력 ---------------- */}
      <h2 className="text-lg font-bold">일반 입력</h2>
      <CustomInput
        id="title"
        name="title"
        type="text"
        labelText="제목"
        placeholder="제목을 입력하세요"
        value={form.title}
        // onChange={handleChange}
      />
      <CustomInput
        id="price"
        name="price"
        type="number"
        labelText="가격"
        placeholder="가격"
        value={form.price}
        // onChange={handleChange}
      />
      <CustomInput
        id="address"
        name="address"
        type="text"
        labelText="주소"
        placeholder="주소를 입력해주세요"
        value={form.address}
        // onChange={handleChange}
      />

      {/* ---------------- TextArea ---------------- */}
      <h2 className="text-lg font-bold">긴 텍스트 입력</h2>
      <CustomInput
        id="description"
        name="description"
        variant="textarea"
        labelText="설명"
        placeholder="설명을 입력하세요"
        value={form.description}
        // onChange={handleChange}
      />
    </div>
  );
}
