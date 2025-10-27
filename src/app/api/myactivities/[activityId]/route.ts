import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_SERVER_URL || '';

interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
}

interface ActivityData {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  bannerImageUrl?: string;
  subImageUrls: string[];
  schedules: Schedule[];
}

function getActivityIdFromUrl(url: string) {
  const segments = new URL(url).pathname.split('/');
  return segments[segments.length - 1];
}

// GET
export async function GET(req: NextRequest) {
  const activityId = getActivityIdFromUrl(req.url);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const res = await fetch(`${API_BASE}/activities/${activityId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    const data: ActivityData = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH
export async function PATCH(req: NextRequest) {
  const activityId = getActivityIdFromUrl(req.url);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();

    const schedules = (body.schedules || []).map((s: Schedule) => ({
      date: new Date(s.date).toISOString().split('T')[0],
      startTime: s.startTime,
      endTime: s.endTime,
    }));

    const patchBody = { ...body, schedules };

    const res = await fetch(`${API_BASE}/my-activities/${activityId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(patchBody),
    });

    const text = await res.text();
    if (!res.ok)
      return NextResponse.json({ error: text }, { status: res.status });

    const updatedData: ActivityData = JSON.parse(text);
    return NextResponse.json(updatedData);
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  const activityId = getActivityIdFromUrl(req.url);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const res = await fetch(`${API_BASE}/my-activities/${activityId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
