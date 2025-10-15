'use client';

import { useEffect } from 'react';
import { useInputValue } from '@/hooks/useInputValue';
import { useMyInfo, useMyInfoModify, UpDateUserInfo } from './useMyInfo';

export const useMyInfoUpdate = () => {
  type FormType = {
    nickname: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };

  const { getMyInfo, loading, error } = useMyInfo();
  const {
    updateMyInfo,
    loading: updateLoading,
    error: updateError,
  } = useMyInfoModify();

  const [form, setForm, handleChange] = useInputValue<FormType>({
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  // 내정보 가져오기
  useEffect(() => {
    if (getMyInfo) {
      setForm({
        nickname: getMyInfo.nickname || '',
        email: getMyInfo.email || '',
        password: '',
        passwordConfirm: '',
      });
    }
  }, [getMyInfo, setForm]);

  // 내정보 수정
  const handleSubmit = async () => {
    if (form.password && form.password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (form.password && form.password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    const updateData: UpDateUserInfo = {
      nickname: form.nickname,
      profileImageUrl: getMyInfo?.profileImageUrl || '',
    };
    if (form.password) {
      updateData.newPassword = form.password;
    }
    const result = await updateMyInfo(updateData);
    if (result?.success) {
      alert('수정이 완료되었습니다.');

      setForm({
        ...form,
        password: '',
        passwordConfirm: '',
      });
    } else {
      alert(`수정에 실패했습니다: ${result?.error}`);
    }
  };
  return { form, handleChange, handleSubmit };
};
