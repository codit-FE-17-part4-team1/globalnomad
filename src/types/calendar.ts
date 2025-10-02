import type { Event as RBCEvent } from 'react-big-calendar';

export type ReservationStatus = 'confirmed' | 'pending' | 'canceled';

export type CalEvent = RBCEvent & {
  id: string;
  place?: string;
  tone?: 'blue' | 'beige';
  status?: ReservationStatus;
  // 필요 시 resource에 원본 객체를 넣을 수 있음 (RBC 기본 필드)
  // 이게 왜 필요함?
  resource?: unknown;
};
