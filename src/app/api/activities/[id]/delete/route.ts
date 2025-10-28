// src/app/api/activities/[id]/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUser } from '@/actions/user.action';

const BASE_URL = 'https://sp-globalnomad-api.vercel.app/17-1';

// DELETE /api/activities/[id]/delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1) params에서 activityId 추출
    const { id: activityId } = await params;

    // 2) 로그인 유저 확인
    const currentUser = await getUser().catch(() => null);
    if (!currentUser) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 3) 체험 상세 정보 가져오기 (권한 확인용)
    const activityRes = await fetch(`${BASE_URL}/activities/${activityId}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    // 체험이 존재하는 경우에만 작성자 확인
    if (activityRes.ok) {
      const activity = await activityRes.json();

      // 4) 작성자 확인
      if (activity.userId !== currentUser.id) {
        return NextResponse.json(
          { message: '본인의 체험만 삭제할 수 있습니다.' },
          { status: 403 }
        );
      }
    }
    // 체험이 없어도 일단 삭제 시도 (서버에서 정확한 에러 반환)

    // 5) accessToken 가져오기
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
        'Content-Type': 'application/json',
      },
    });

    // 7) 204 성공 처리
    if (deleteRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // 8) 에러 응답을 그대로 프론트엔드로 전달
    const contentType = deleteRes.headers.get('content-type');

    // JSON 응답인 경우
    if (contentType?.includes('application/json')) {
      const deleteData = await deleteRes.json();
      return NextResponse.json(deleteData, { status: deleteRes.status });
    }

    // JSON이 아닌 경우
    const text = await deleteRes.text();
    return NextResponse.json(
      { message: text || `삭제 처리 실패 (${deleteRes.status})` },
      { status: deleteRes.status }
    );
  } catch (error) {
    console.error('❌ 체험 삭제 API 에러:', error);
    return NextResponse.json(
      { message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
