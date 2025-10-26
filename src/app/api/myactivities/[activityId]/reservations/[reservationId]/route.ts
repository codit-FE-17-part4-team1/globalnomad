import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string; reservationId: string }> }
) {
  const { activityId, reservationId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    // 필수 파라미터 검증
    if (!status || !['confirmed', 'declined'].includes(status)) {
      return NextResponse.json(
        {
          error:
            'Missing required parameters: activityId, reservationId, status',
        },
        { status: 400 }
      );
    }

    const url = `https://sp-globalnomad-api.vercel.app/17-1/my-activities/${activityId}/reservations/${reservationId}`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

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
