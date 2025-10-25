import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BASE_URL = 'https://sp-globalnomad-api.vercel.app/17-1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { activityId, scheduleId, headCount } = body;

    // 예약하기에서는 쿠키 가져오기
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const res = await fetch(
      `${BASE_URL}/activities/${activityId}/reservations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ scheduleId, headCount }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { message: err.message || '예약 실패' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 예약 생성 에러:', error);
    return NextResponse.json({ message: '서버 내부 오류' }, { status: 500 });
  }
}
