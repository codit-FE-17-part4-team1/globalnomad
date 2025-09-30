'use client';

import { ChangeEvent } from 'react';
import Label from './Label';

type CustomInputProps = {
  id: string;
  name: string;
  type?: 'text' | 'number';
  variant?: 'input' | 'textarea';
  labelText?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function CustomInput({
  id,
  name,
  type = 'text',
  variant = 'input',
  labelText,
  placeholder,
  value,
  onChange,
}: CustomInputProps) {
  return (
    <div className="w-full mb-4">
      {labelText && <Label id={id} text={labelText} />}
      {variant === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
          className="w-full px-5 py-4 rounded-md border
            border-gray-700 focus:outline-none
            min-h-[240px]
            text-lg text-black placeholder-gray-600"
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
          className="w-full px-5 py-4 rounded-md border
            border-gray-700 focus:outline-none
            text-lg text-black placeholder-gray-600"
        />
      )}
    </div>
  );
}
