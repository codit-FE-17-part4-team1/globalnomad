import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('image');

  if (!(file instanceof File)) {
    throw new Error('파일이 없습니다.');
  }

  const fd = new FormData();
  fd.append('image', file);

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
    throw new Error('이미지 업로드 실패했습니다.');
  }

  return NextResponse.json(await response.json());
}
