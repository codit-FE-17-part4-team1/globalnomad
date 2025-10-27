import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://sp-globalnomad-api.vercel.app/17-1';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const method = url.searchParams.get('method') || 'cursor';
    const page = url.searchParams.get('page') || '1';
    const size = url.searchParams.get('size') || '20';
    const category = url.searchParams.get('category') || '';
    const keyword = url.searchParams.get('keyword') || '';
    const sort = url.searchParams.get('sort') || '';

    // 외부 API URL을 생성하는 부분이라고 함
    const queryParams = new URLSearchParams();
    queryParams.set('method', method);
    queryParams.set('page', page);
    queryParams.set('size', size);
    if (category) queryParams.set('category', category);
    if (keyword) queryParams.set('keyword', keyword);
    if (sort) queryParams.set('sort', sort);

    const res = await fetch(
      `${BASE_URL}/activities?${queryParams.toString()}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: err.message || '체험 리스트 조회 실패' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 체험 리스트 조회 에러:', error);
    return NextResponse.json({ message: '서버 내부 오류' }, { status: 500 });
  }
}
