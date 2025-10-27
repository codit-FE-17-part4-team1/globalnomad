// GET, DELETE 같이 쓰면 될 듯?  --> 적용 안됨, 동적 라우팅을 통해 적용해야 한다고 함
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
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
