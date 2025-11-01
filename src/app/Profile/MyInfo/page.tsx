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
  passwordConfirmation: string;
};

export default function MyInfo() {
  const [user, setUser] = useState<UserType | null>(null);
  const [form, setForm] = useState<FormType>({
    nickname: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  // 로컬 에러 상태 (닉네임/비번/비번확인)
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmationError, setpasswordConfirmationError] =
    useState('');

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
  });
  const Label_Style = 'font-bold! text-2xl! mb-4! text-black!';
  // 사용자가 변경했는지 체크
  const hasChanges = () => {
    if (!isEdit || !user) return false;
    return (
      form.nickname !== user.nickname ||
      form.password !== '' ||
      form.passwordConfirmation !== ''
    );
  };

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
          passwordConfirmation: '',
        });
        // 초기화 시 에러도 비움
        setNicknameError('');
        setPasswordError('');
        setpasswordConfirmationError('');
      } catch (error) {
        console.error(error);
        alert('사용자 정보를 불러올 수 없습니다.');
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

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

      // 비밀번호 에러: 8자 이상 체크
      if (name === 'password') {
        if (value.length > 0 && value.length < 8) {
          setPasswordError('비밀번호는 8자 이상이어야 합니다.');
        } else {
          setPasswordError('');
        }

        // 비밀번호 확인란이 채워져 있으면 일치 여부 체크
        if (next.passwordConfirmation) {
          if (value !== next.passwordConfirmation) {
            setpasswordConfirmationError('비밀번호가 일치하지 않습니다.');
          } else {
            setpasswordConfirmationError('');
          }
        }
      }

      // 비밀번호 확인 에러: password와 passwordConfirmation 비교
      if (name === 'passwordConfirmation') {
        if (value !== next.password) {
          setpasswordConfirmationError('비밀번호가 일치하지 않습니다.');
        } else {
          setpasswordConfirmationError('');
        }
      }

      return next;
    });
  };
  //
  const handleSave = async () => {
    // 에러 모달 생성
    if (nicknameError || passwordError || passwordConfirmationError) {
      showModal('입력값을 다시 확인해 주세요.');
      return;
    }

    if (form.password && form.password.length < 8) {
      showModal('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (form.password !== form.passwordConfirmation) {
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
      setForm((prev) => ({ ...prev, password: '', passwordConfirmation: '' }));
      setPasswordError('');
      setpasswordConfirmationError('');
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
        disabled={isEdit && !hasChanges()}
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
            errorOverride={isEdit ? nicknameError : ''}
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
            errorOverride={isEdit ? passwordError : ''}
          />
          <FormInput
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            labelText="비밀번호 재입력"
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={form.passwordConfirmation}
            onChange={handleChange}
            passwordValue={form.password}
            disabled={!isEdit}
            labelClassName={Label_Style}
            errorOverride={isEdit ? passwordConfirmationError : ''}
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
