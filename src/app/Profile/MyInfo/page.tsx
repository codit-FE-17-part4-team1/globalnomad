'use client';

import { useEffect, useState } from 'react';
import { getUser, updateUser } from '@/lib/users/api';
import FormInput from '@/components/Input/FormInput';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import ConfirmModal from '@/app/Profile/MyInfo/_components/ConfirmModal';
type UserType = {
  createdAt: string;
  email: string;
  id: number;
  nickname: string;
  profileImageUrl: string;
  updatedAt: string;
};

type FormType = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function MyInfo() {
  const [user, setUser] = useState<UserType | null>(null);
  const [form, setForm] = useState<FormType>({
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const Label_Style = 'font-bold! text-2xl! mb-4! text-black!';

  // 유저정보 업데이트
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
        setForm({
          nickname: data.nickname || '',
          email: data.email || '',
          password: '',
          passwordConfirm: '',
        });
      } catch (error) {
        console.error(error);
        alert('사용자 정보를 불러올 수 없습니다.');
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  //
  const handleSave = async () => {
    if (form.password && form.password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const updatedUser = await updateUser({
        nickname: form.nickname,
        newPassword: form.password || undefined,
      });

      setUser(updatedUser);
      alert('수정이 완료되었습니다.');
      setIsEdit(false);
      setForm((prev) => ({ ...prev, password: '', passwordConfirm: '' }));
    } catch (error) {
      alert(error instanceof Error ? error.message : '수정에 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>로딩 중...</p>;

  return (
    <div>
      <Header
        title="내 정보"
        type="button"
        buttonText={isEdit ? '저장하기' : '수정하기'}
        onClick={() => {
          if (isEdit) {
            handleSave();
          } else {
            setIsEdit(true);
          }
        }}
      />
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset className="flex flex-col gap-4">
          <FormInput
            id="nickname"
            name="nickname"
            type="text"
            labelText="닉네임"
            placeholder="닉네임을 입력하세요"
            value={form.nickname}
            onChange={handleChange}
            disabled={!isEdit || loading}
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
            disabled={true}
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
            disabled={!isEdit}
            labelClassName={Label_Style}
          />
          <FormInput
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            labelText="비밀번호 재입력"
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={form.passwordConfirm}
            onChange={handleChange}
            passwordValue={form.password}
            disabled={!isEdit}
            labelClassName={Label_Style}
          />
        </fieldset>
      </form>
    </div>
  );
}
