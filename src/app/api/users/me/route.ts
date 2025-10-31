import { fetchWithAuth } from '@/actions/session.action';

type FormType = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  profileImageUrl?: string;
};
// 유저 데이터 가져오기
export async function GET() {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/users/me`,
    {
      method: 'GET',
    }
  );
  if (!response.ok) throw new Error('유저 정보를 불러오지 못했습니다.');

  return response;
}
// 유저 데이터 수정
export async function PATCH(request: Request) {
  const data = await request.json();
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/users/me`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error('유저 정보 수정에 실패했습니다.');
  }
  return response;
}
