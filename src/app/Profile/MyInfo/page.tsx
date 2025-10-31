'use client';

import { useEffect, useState } from 'react';
import { getUser, updateUser } from '@/lib/users/api';
import FormInput from '@/components/Input/FormInput';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import ConfirmModal from '@/components/Modal/ConfirmModal';

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

  // 추가: 로컬 에러 상태 (닉네임/비번/비번확인)
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
  });
  const Label_Style = 'font-bold! text-2xl! mb-4! text-black!';
  // 모달 열기
  const showModal = (message: string) => {
    setModal({ isOpen: true, message });
  };

  // 모달 닫기
  const closeModal = () => {
    setModal({ isOpen: false, message: '' });
  };

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
        // 초기화 시 에러도 비움
        setNicknameError('');
        setPasswordError('');
        setPasswordConfirmError('');
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
    // 저장 직전 마지막 방어 (에러 있으면 중단)
    if (nicknameError || passwordError || passwordConfirmError) {
      alert('입력값을 다시 확인해 주세요.');
      return;
    }

    if (form.password && form.password.length < 8) {
      showModal('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      showModal('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const updatedUser = await updateUser({
        nickname: form.nickname,
        newPassword: form.password || undefined,
      });

      setUser(updatedUser);
      showModal('수정이 완료되었습니다.');
      setIsEdit(false);
      setForm((prev) => ({ ...prev, password: '', passwordConfirm: '' }));
      setPasswordError('');
      setPasswordConfirmError('');
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
            type="nickname"
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
            type="passwordConfirm"
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
      {/* 확인모달 */}
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        message={modal.message}
        className="bg-white"
        onConfirm={closeModal}
      />
    </div>
  );
}
