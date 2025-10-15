import { z } from 'zod';

// 내 알림 리스트 조회
export const notificationSchema = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string(),
});

export const notificationListSchema = z.object({
  cursorId: z.number(),
  notifications: z.array(notificationSchema),
  totalCount: z.number(),
});

// 내 알림 삭제
export const deleteNotificationPathZ = z.object({
  teamId: z.string(),
  notificationId: z.number().int(),
});

export const deleteNotificationResZ = z.unknown().optional();

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationList = z.infer<typeof notificationListSchema>;
export type DeleteNotificationRes = z.infer<typeof deleteNotificationResZ>;
