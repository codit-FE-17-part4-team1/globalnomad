'use client';

import { ChangeEvent, FocusEvent, useState } from 'react';
import Label from './Label';
import { useInputValidation } from '@/hooks/useInputValidation';
import Image from 'next/image';

type FormInputProps = {
  id: string;
  name: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'nickname'
    | 'passwordConfirm'
    | 'number';
  labelText: string;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  passwordValue?: string;

  // 사용자 스타일 수정 prop
  wrapperClassName?: string;
  labelClassName?: string;
  labelUnstyled?: boolean; //기본 스타일 제거
  inputClassName?: string;
  errorClassName?: string;
};

export default function FormInput({
  id,
  name,
  type,
  labelText,
  placeholder,
  value,
  disabled,
  onChange,
  passwordValue,
  wrapperClassName,
  labelClassName,
  labelUnstyled = false,
  inputClassName,
  errorClassName,
}: FormInputProps) {
  const [visible, setVisible] = useState(false);
  const changeType = (() => {
    if (type === 'password' || type === 'passwordConfirm') {
      return visible ? 'text' : 'password';
    }
    if (type === 'nickname') {
      return 'text'; //nickname 내려줌
    }
    return type; // email, text, number 내려줌
  })();

  const { error, validate } = useInputValidation(type, passwordValue);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    validate(e.target.value);
  };

  const getMaxLength = (t: string) => {
    switch (t) {
      case 'email':
        return 50;
      case 'password':
        return 20;
      case 'text':
      case 'number':
        return 30;
      default:
        return undefined;
    }
  };

  return (
    <div
      className={`w-full mb-4 flex flex-col gap-2 ${wrapperClassName || ''}`}
    >
      <Label
        id={id}
        text={labelText}
        className={labelClassName}
        unstyled={labelUnstyled}
      />
      <div className="relative">
        <input
          id={id}
          name={name}
          type={changeType}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBlur={handleBlur}
          maxLength={getMaxLength(type)}
          className={`w-full px-5 py-4 rounded-md border
            border-gray-300 focus:outline-none focus:border-gray-500
            text-lg text-black placeholder-gray-500
           disabled:text-gray-500
            ${error ? 'border-red focus:border-red' : 'border-gray-300 focus:ring-blue-500'}
            ${inputClassName || ''}`}
        />
        {(type === 'password' || type === 'passwordConfirm') && (
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Image
              src={
                visible
                  ? '/icon/btn/visibility.svg'
                  : '/icon/btn/visibility_off.svg'
              }
              alt={visible ? '숨김' : '보기'}
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
      {error && (
        <p className={`mt-1 text-xs text-red-500 ${errorClassName || ''}`}>
          {error}
        </p>
      )}
    </div>
  );
}
