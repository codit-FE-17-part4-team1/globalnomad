'use client';

import { ChangeEvent } from 'react';
import Label from './Label';

type TextAreaProps = {
  id: string;
  name: string;
  labelText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextArea({
  id,
  name,
  labelText,
  placeholder,
  value,
  onChange,
}: TextAreaProps) {
  return (
    <div className="w-full mb-4">
      {labelText && <Label id={id} text={labelText} />}
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-4 rounded-md border
          border-gray-700 focus:outline-none min-h-[200px]"
      />
    </div>
  );
}
