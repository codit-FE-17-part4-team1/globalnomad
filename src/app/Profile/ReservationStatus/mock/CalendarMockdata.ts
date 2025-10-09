export type CalStatus = 'confirmed' | 'pending' | 'canceled';

export interface CalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  time?: string;
  place?: string;
  status: CalStatus;
}

export const mockCalEvents: CalEvent[] = [
  {
    id: 'e1',
    title: '피오르 체험',
    start: new Date(2025, 9, 10, 10),
    end: new Date(2025, 9, 10, 12),
    time: '2025-11-10 10:00~12:00',
    place: '홍대 스튜디오',
    status: 'confirmed',
  },
  {
    id: 'e2',
    title: '열기구 페스티벌',
    start: new Date(2025, 9, 11, 14),
    end: new Date(2025, 9, 12, 12),
    place: '성수',
    status: 'pending',
  },
  {
    id: 'e3',
    title: '먹방',
    start: new Date(2025, 9, 15, 10),
    end: new Date(2025, 9, 15, 12),
    place: '잠실',
    status: 'canceled',
  },
];
