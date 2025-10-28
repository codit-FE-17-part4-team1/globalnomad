import { fetchWithAuth } from '@/actions/session.action';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { reservationId: string } }
) {
  try {
    const reviewData = await request.json();

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/my-reservations/${params.reservationId}/reviews`,
      {
        method: 'POST',
        body: JSON.stringify(reviewData),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: '후기 작성에 실패했습니다.' },
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
