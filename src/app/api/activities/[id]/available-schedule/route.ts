import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://sp-globalnomad-api.vercel.app/17-1';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  const segments = req.nextUrl.pathname.split('/');
  const id = segments[segments.length - 2];

  try {
    const res = await fetch(
      `${BASE_URL}/activities/${id}/available-schedule?year=${year}&month=${month}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { message: error.message || '예약 가능 일정 조회 실패' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 예약 가능 일정 조회 에러:', error);
    return NextResponse.json({ message: '서버 내부 오류' }, { status: 500 });
  }
}
