'use server';

import { fetchWithAuth } from '@/actions/session.action';

export async function getMyReservations() {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/my-reservations`,
    { method: 'GET' }
  );

  if (!response.ok) {
    throw new Error('예약 정보를 불러오지 못했습니다.');
  }

  return await response.json();
}

export async function pacthMyReservations(reservationId: number) {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/my-reservations/${reservationId}`,
    { method: 'PATCH', body: JSON.stringify({ status: 'canceled' }) }
  );

  if (!response.ok) {
    throw new Error('예약 취소에 실패했습니다.');
  }

  return await response.json();
}

export async function postReviews(
  reservationId: number,
  reviewData: { rating: number; content: string }
) {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/my-reservations/${reservationId}/reviews`,
    {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }
  );

  if (!response.ok) {
    throw new Error('후기작성에 실패했습니다.');
  }

  return await response.json();
}
