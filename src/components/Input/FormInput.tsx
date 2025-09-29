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
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  passwordValue?: string; // passwordConfirm 검증용
};

export default function FormInput({
  id,
  name,
  type,
  labelText,
  placeholder,
  value,
  onChange,
  passwordValue,
}: FormInputProps) {
  //비밀번호 토글
  const [visible, setVisible] = useState(false);
  const changeType =
    type === 'password' || type === 'passwordConfirm'
      ? visible
        ? 'text'
        : 'password'
      : type;

  const { error, validate } = useInputValidation(type, passwordValue);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    validate(e.target.value);
  };

  //Input 최대 길이
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
    <div className="w-full mb-4">
      <Label id={id} text={labelText} />
      <div className="relative">
        <input
          id={id}
          name={name}
          type={changeType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          maxLength={getMaxLength(type)}
          className={`w-full px-5 py-4 rounded-md border
          border-gray-300 focus:outline-none focus:border-gray-500
          text-lg text-black
          placeholder-gray-500
            ${error ? 'border-red focus:outline-none focus:border-red' : 'border-gray-300 focus:ring-blue-500'}
          `}
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
