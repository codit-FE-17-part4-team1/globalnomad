export type AlertStatus = '승인' | '거절';

export interface AlertItem {
  id: number;
  title: string;
  time: string;
  status: AlertStatus;
  createdAt: string;
}

export const mockAlerts: AlertItem[] = [
  {
    id: 1,
    title: '함께하면 즐거운 스트릿 댄스',
    time: '2025-10-10 10:00~11:00',
    status: '승인',
    createdAt: '1분 전',
  },
  {
    id: 2,
    title: '함께하면 즐거운 스트릿 댄스',
    time: '2025-10-30 14:00~18:00',
    status: '거절',
    createdAt: '2분 전',
  },
];
