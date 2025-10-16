//유효성 검사
export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? '' : '이메일 형식으로 작성해 주세요.';
};

export const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password)
    ? ''
    : '비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.';
};

export const validateNickname = (nickname: string) => {
  return nickname.length <= 20 ? '' : '열 자 이하로 작성해주세요.';
};

export const validatePasswordConfirm = (password: string, confirm: string) => {
  return password === confirm ? '' : '비밀번호가 일치하지 않습니다.';
};
