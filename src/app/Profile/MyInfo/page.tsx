'use client';

import { useEffect, useState } from 'react';
import { getUser, patchUser } from '@/actions/user.action';
import FormInput from '@/components/Input/FormInput';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';

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
  const Label_Style = 'font-bold! text-2xl! mb-4! text-black!';

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
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (isEdit) {
        if (name === 'nickname') {
          setNicknameError(
            value.length > 10 ? '열 자 이하로 작성해주세요.' : ''
          );
        }

        if (name === 'password') {
          setPasswordError(
            value && value.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : ''
          );
          // 비번 바뀌면 확인 일치도 재검사
          setPasswordConfirmError(
            next.passwordConfirm
              ? value === next.passwordConfirm
                ? ''
                : '비밀번호가 일치하지 않습니다.'
              : ''
          );
        }

        if (name === 'passwordConfirm') {
          setPasswordConfirmError(
            value
              ? next.password === value
                ? ''
                : '비밀번호가 일치하지 않습니다.'
              : ''
          );
        }
      }

      return next;
    });
  };

  const handleSave = async () => {
    // 저장 직전 마지막 방어 (에러 있으면 중단)
    if (nicknameError || passwordError || passwordConfirmError) {
      alert('입력값을 다시 확인해 주세요.');
      return;
    }

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
      await patchUser(form);
      alert('수정이 완료되었습니다.');
      setIsEdit(false);
      setForm((prev) => ({ ...prev, password: '', passwordConfirm: '' }));
      setPasswordError('');
      setPasswordConfirmError('');
    } catch (error) {
      alert('수정에 실패했습니다.');
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
            errorOverride={isEdit ? passwordConfirmError : ''}
          />
        </fieldset>
      </form>
    </div>
  );
}
