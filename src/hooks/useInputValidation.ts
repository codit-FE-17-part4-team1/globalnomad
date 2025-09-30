//에러 상태 관리
import { useState } from 'react';

import {
  validateEmail,
  validatePassword,
  validateNickname,
  validatePasswordConfirm,
} from '@/utils/validators';

type InputType =
  | 'email'
  | 'password'
  | 'nickname'
  | 'passwordConfirm'
  | 'text'
  | 'number';

export function useInputValidation(type: InputType, passwordValue?: string) {
  const [error, setError] = useState('');

  const validate = (value: string) => {
    let errorMessage = '';
    switch (type) {
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      case 'nickname':
        errorMessage = validateNickname(value);
        break;
      case 'passwordConfirm':
        errorMessage = validatePasswordConfirm(passwordValue || '', value);
        break;
      default:
        errorMessage = '';
    }
    setError(errorMessage);
    return errorMessage === '';
  };

  return { error, validate };
}
