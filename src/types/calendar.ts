export type ReservationStatus = 'confirmed' | 'pending' | 'canceled';

export type CalEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: ReservationStatus;
  place?: string;
  people?: number;
  nickname?: string;
};
