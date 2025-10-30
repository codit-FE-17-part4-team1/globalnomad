export async function getUser() {
  const response = await fetch('/api/users/me');
  if (!response.ok) throw new Error('사용자 정보를 불러올 수 없습니다.');
  return response.json();
}

export async function updateUser(data: {
  nickname: string;
  newPassword?: string;
}) {
  const response = await fetch('/api/users/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('사용자 정보 수정에 실패했습니다.');
  return response.json();
}
