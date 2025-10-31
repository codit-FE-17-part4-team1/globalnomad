import { fetchWithAuth } from '@/actions/session.action';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const { reservationId } = await params;
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/my-reservations/${reservationId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status: 'canceled' }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: '예약 취소에 실패했습니다.' },
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
