export const validateEmail = (value: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? '' : '이메일 형식으로 작성해 주세요.';
};

export const validatePassword = (value: string) => {
  return value.length >= 8 ? '' : '8자 이상 입력해주세요.';
};

export const validateNickname = (value: string) => {
  return value.length <= 10 ? '' : '열 자 이하로 작성해주세요.';
};

export const validatePasswordConfirm = (password: string, confirm: string) => {
  return password === confirm ? '' : '비밀번호가 일치하지 않습니다.';
};
