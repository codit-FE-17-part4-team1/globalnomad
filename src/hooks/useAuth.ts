import { ChangeEvent, useState } from 'react';

type LoginOrSignupState = {
  email: string;
  password: string;
  nickname: string;
  passwordConfirmation: string;
};

export function useLoginOrSignupInputValue(): [
  LoginOrSignupState,
  (e: ChangeEvent<HTMLInputElement>) => void,
] {
  const [input, setInput] = useState<LoginOrSignupState>({
    email: '',
    password: '',
    nickname: '',
    passwordConfirmation: '',
  });

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  }

  return [input, handleInputChange];
}
