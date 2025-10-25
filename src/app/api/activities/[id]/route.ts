import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 외부 API 기본 URL
const BASE_URL = 'https://sp-globalnomad-api.vercel.app/17-1';

// GET /api/activities/[id] 체험 상세 조회
export async function GET(req: NextRequest) {
  // URL에서 마지막 세그먼트가 체험 ID
  const segments = req.nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];

  try {
    // 외부 API로 GET 요청
    const res = await fetch(`${BASE_URL}/activities/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    // 요청 실패 시 에러 메시지 반환
    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { message: error.message || '체험 상세 조회 실패' },
        { status: res.status }
      );
    }

    // 성공 시 JSON 데이터 반환
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 체험 상세 조회 에러:', error);
    return NextResponse.json({ message: '서버 내부 오류' }, { status: 500 });
  }
}

// DELETE /api/activities/[id] 내 체험 삭제
export async function DELETE(req: NextRequest) {
  // URL에서 마지막 세그먼트 추출
  const segments = req.nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];

  try {
    // 쿠키에서 accessToken 가져오기
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    // 토큰 없으면 401 Unauthorized 반환
    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 외부 API로 DELETE 요청
    const res = await fetch(`${BASE_URL}/my-activities/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 삭제 성공 시 204 No Content 반환
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // 다른 상태 코드인 경우, 외부 API 응답 그대로 반환
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('❌ 체험 삭제 에러:', error);
    return NextResponse.json({ message: '서버 내부 오류' }, { status: 500 });
  }
}
