// import { cookies } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   // 여긴 필요없음
//   // const cursorId = searchParams.get('cursorId');
//   // const size = searchParams.get('size') || '20';

//   // 여긴 이 파라미터들이 필요한데,
//   const activityId = searchParams.get('activityId');
//   const year = searchParams.get('year');
//   const month = searchParams.get('month');

//   console.log('📝 파라미터:', { activityId, year, month });

//   if (!activityId || !year || !month) {
//     return NextResponse.json(
//       { error: 'activityId, year, month are required' },
//       { status: 400 }
//     );
//   }

//   // 서버 측에서 쿠키 읽기
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get('accessToken')?.value;

//   if (!accessToken) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const queryParams = new URLSearchParams();
//     // 자꾸 타입 에러가 남 -> 타입 검증?
//     queryParams.append('year', year);
//     queryParams.append('month', month);

//     const url = `https://sp-globalnomad-api.vercel.app/17-1/my-activities/${activityId}/reservation-dashboard?${queryParams.toString()}`;

//     const res = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       return NextResponse.json(errorData, { status: res.status });
//     }

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
