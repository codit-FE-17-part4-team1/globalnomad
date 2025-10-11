export type CalStatus = 'confirmed' | 'pending' | 'canceled';

export interface CalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  time?: string;
  place?: string;
  nickname?: string;
  status: CalStatus;
}

export const mockCalEvents: CalEvent[] = [
  {
    id: 'e1',
    title: '피오르 체험',
    start: new Date(2025, 9, 10, 10),
    end: new Date(2025, 9, 13, 12),
    time: '2025-11-10 10:00~12:00',
    place: '홍대 스튜디오',
    nickname: '짱구',
    status: 'pending',
  },
  {
    id: 'e2',
    title: '열기구 페스티벌',
    start: new Date(2025, 9, 16, 13),
    end: new Date(2025, 9, 16, 14),
    place: '성수',
    nickname: '짱아',
    status: 'confirmed',
  },
  {
    id: 'e3',
    title: '먹방',
    start: new Date(2025, 9, 15, 10),
    end: new Date(2025, 9, 15, 12),
    place: '잠실',
    nickname: '흰둥이',
    status: 'canceled',
  },
  {
    id: 'e4',
    title: '다이빙',
    start: new Date(2025, 9, 10, 10),
    end: new Date(2025, 9, 10, 12),
    time: '2025-11-10 10:00~12:00',
    place: '홍대 스튜디오',
    nickname: '신봉선',
    status: 'confirmed',
  },
];
