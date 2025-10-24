// GET, DELETE 같이 쓰면 될 듯?
// GET 함수
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursorId = searchParams.get('cursorId');
  const size = searchParams.get('size') || '20';

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

    // 코드잇 서버로 요청을 보낸다.
    const res = await fetch(
      `https://sp-globalnomad-api.vercel.app/17-1/my-notifications?${queryParams.toString()}`,
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

// DELETE 함수
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const notificationId = searchParams.get('notificationId');

  // 서버 측에서 쿠키 읽기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 코드잇 서버로 요청을 보낸다.
    const res = await fetch(
      `https://sp-globalnomad-api.vercel.app/17-1/my-notifications/${notificationId}`,
      {
        method: 'DELETE',
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

    if (res.status === 204) {
      return NextResponse.json({ success: true }, { status: 200 });
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
