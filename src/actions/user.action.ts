'use server';

import { fetchWithAuth } from '@/actions/session.action';
import { cookies } from 'next/headers';

type FormType = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  profileImageUrl?: string;
};

// 유저 데이터 가져오기
export async function getUser() {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/users/me`,
    {
      method: 'GET',
    }
  );
  if (!response.ok) throw new Error('유저 정보를 불러오지 못했습니다.');

  const data = await response.json();

  return data;
}

// 유저 데이터 수정
export async function patchUser(data: FormType) {
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
  return await response.json();
}

// 프로필 이미지 업로드
export async function uploadProfileImage(formData: FormData) {
  const file = formData.get('image');

  if (!(file instanceof File)) {
    throw new Error('파일이 없습니다.');
  }

  const fd = new FormData();
  fd.append('image', file);

  // 토큰 가져오기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/users/me/image`,
    {
      method: 'POST',
      body: fd,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`업로드 실패: ${response.status}`);
  }

  return await response.json();
}
