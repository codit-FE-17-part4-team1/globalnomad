//에러 메시지 관리

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
    let errorMsg = '';
    switch (type) {
      case 'email':
        errorMsg = validateEmail(value);
        break;
      case 'password':
        errorMsg = validatePassword(value);
        break;
      case 'nickname':
        errorMsg = validateNickname(value);
        break;
      case 'passwordConfirm':
        errorMsg = validatePasswordConfirm(passwordValue || '', value);
        break;
      default:
        errorMsg = '';
    }
    setError(errorMsg);
    return errorMsg === '';
  };

  return { error, validate };
}
