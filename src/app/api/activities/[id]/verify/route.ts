import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/actions/user.action';

const BASE_URL = 'https://sp-globalnomad-api.vercel.app/17-1';

// GET /api/activities/[id]/verify — 유저 검증용
export async function GET(req: NextRequest) {
  try {
    const segments = req.nextUrl.pathname.split('/');
    const activityId = segments[segments.length - 2]; // [id]/verify -> 마지막 -2번째가 id

    // 로그인 유저 확인
    const currentUser = await getUser().catch(() => null);
    if (!currentUser) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 체험 상세 가져오기
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

    // 작성자 일치 확인
    const isOwner = activity.userId === currentUser.id;

    if (!isOwner) {
      return NextResponse.json(
        { message: '수정 권한이 없습니다.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, userId: currentUser.id });
  } catch (error) {
    console.error('❌ 체험 수정 검증 에러:', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
