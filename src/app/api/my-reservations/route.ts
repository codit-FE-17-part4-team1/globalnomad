import { fetchWithAuth } from '@/actions/session.action';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/my-reservations`,
      { method: 'GET' }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: '예약 정보를 불러오지 못했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
