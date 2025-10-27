import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUser } from '@/actions/user.action';

const BASE_URL = 'https://sp-globalnomad-api.vercel.app/17-1';

// DELETE /api/activities/[id] — 로그인 유저와 작성자 일치 시 삭제
export async function DELETE(req: NextRequest) {
  try {
    // 1) URL에서 activityId 추출
    const segments = req.nextUrl.pathname.split('/');
    const activityId = segments[segments.length - 1];

    // 2) 로그인 유저 정보 확인 (user.action.ts 활용하여)
    const currentUser = await getUser().catch(() => null);
    if (!currentUser) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 3) 체험 상세 정보 가져오기
    const activityRes = await fetch(`${BASE_URL}/activities/${activityId}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!activityRes.ok) {
      return NextResponse.json(
        { message: '체험 정보를 불러오지 못했습니다.' },
        { status: activityRes.status }
      );
    }

    const activity = await activityRes.json();

    // 4) 작성자와 로그인 유저 ID 비교
    if (activity.userId !== currentUser.id) {
      return NextResponse.json(
        { message: '삭제 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 5) 쿠키에서 accessToken 가져오기
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: '인증 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    // 6) 외부 API로 삭제 요청
    const deleteRes = await fetch(`${BASE_URL}/my-activities/${activityId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 7) 삭제 성공 시 처리
    if (deleteRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // 실패 할 경우 응답 전달
    const deleteData = await deleteRes.json();
    return NextResponse.json(deleteData, { status: deleteRes.status });
  } catch (error) {
    console.error('❌ 체험 삭제 검증 API 에러:', error);
    return NextResponse.json(
      { message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
