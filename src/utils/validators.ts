export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? '' : '이메일 형식으로 작성해 주세요.';
};

export function validatePassword(password: string) {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
}

export const validateNickname = (nickname: string) => {
  return nickname.length <= 10 ? '' : '열 자 이하로 작성해주세요.';
};

export const validatePasswordConfirm = (password: string, confirm: string) => {
  return password === confirm ? '' : '비밀번호가 일치하지 않습니다.';
};
