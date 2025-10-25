import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursorId = searchParams.get('cursorId');
  const size = searchParams.get('size') || '20';
  const scheduleId = searchParams.get('scheduleId');
  const status = searchParams.get('status');

  // 서버 측에서 쿠키 읽기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const queryParams = new URLSearchParams();
    if (cursorId) queryParams.append('cursorId', cursorId);
    queryParams.append('size', size);
    queryParams.append('scheduleId', scheduleId || '');
    queryParams.append('status', status || '');
    const activityId = searchParams.get('activityId');

    const res = await fetch(
      `https://sp-globalnomad-api.vercel.app/17-1/my-activities/${activityId}/reservations?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { activityId, reservationId, status } = body;

    // 필수 파라미터 검증
    if (!activityId || !reservationId || !status) {
      return NextResponse.json(
        { error: 'Missing required parameters: activityId, reservationId, status' },
        { status: 400 }
      );
    }

    // status 값 검증 (승인: confirmed, 거절: declined)
    if (!['confirmed', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "confirmed" or "declined"' },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://sp-globalnomad-api.vercel.app/17-1/my-activities/${activityId}/reservations/${reservationId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
