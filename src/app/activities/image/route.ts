import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: '이미지 파일이 없습니다.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const uploadRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/activities/image`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      }
    );

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      return NextResponse.json({ error: text }, { status: uploadRes.status });
    }

    const data = await uploadRes.json();

    if (!data.activityImageUrl || typeof data.activityImageUrl !== 'string') {
      return NextResponse.json(
        { error: '서버에서 올바른 이미지 URL을 받지 못했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.activityImageUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
