import { NextResponse } from 'next/server';
import { reissueTokens } from '@/actions/session.action';

export async function POST() {
  const { ok } = await reissueTokens();
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}
