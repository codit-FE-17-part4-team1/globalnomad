import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// 내 체험리스트 조회
export const activitySchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  address: z.string(),
  bannerImageUrl: z.string(),
  rating: z.number(),
  reviewCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const myactivitiesSchema = z.object({
  cursorId: z.number(),
  totalCount: z.number(),
  activities: z.array(activitySchema),
});

// -- 대시보드 (월별 예약현황 조회) --
export const reservationsSchema = z.object({
  completed: z.number(),
  confirmed: z.number(),
  pending: z.number(),
});

export const ISODate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요.');

export const reservationsDashboardSchema = z.object({
  date: ISODate,
  reservations: reservationsSchema,
});

export const reservationsDashboardListSchema = z.array(
  reservationsDashboardSchema
);

// -- 내 체험 예약 시간대별 예약 조회 --
// 상태 값
export const reservationStatus = z
  .enum(['confirmed', 'pending', 'declined', 'completed', 'canceled'])
  .openapi('ReservationsStatus');

export const reservationSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  userId: z.number(),
  teamId: z.string(),
  activityId: z.number(),
  scheduleId: z.number(),
  status: reservationStatus,
  reviewSubmitted: z.boolean(),
  totalPrice: z.number(),
  headCount: z.number(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const reservationsTimeSchema = z.object({
  cursorId: z.number().nullable(),
  totalCount: z.number(),
  reservations: z.array(reservationSchema),
});

// -- 내 체험 예약 상태(승인,거절) 업데이트 --
export const reservationCountSchema = z.object({
  declined: z.number(),
  confirmed: z.number(),
  pending: z.number(),
  completed: z.number(),
});

export const reservedScheduleItemSchema = z.object({
  scheduleId: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  count: reservationCountSchema,
});

export const reservedScheduleSchema = z.array(reservedScheduleItemSchema);

export const updateReservationStatusSchema = z.object({
  status: z.enum(['confirmed', 'declined']),
});

// -- 내 체험 삭제 --
export const deleteActivityPathZ = z.object({
  teamId: z.string(),
  activityId: z.number().int(),
});

export const deleteActivityResZ = z.unknown().optional();

// -- 내 체험 수정 --
export const modifyActivitySchema = z.object({
  title: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.number(),
  address: z.string(),
  bannerImageUrl: z.string(),
  subImageIdsToRemove: z.array(z.number().int()).optional().default([]),
  subImageUrlsToAdd: z.array(z.string()).optional().default([]),
  scheduleIdsToRemove: z.array(z.number().int()).optional().default([]),
  schedulesToAdd: z.array(z.unknown()).optional().default([]),
});

export type Activity = z.infer<typeof activitySchema>;
export type MyActivitiesResponse = z.infer<typeof myactivitiesSchema>;
export type ReservationDashboard = z.infer<
  typeof reservationsDashboardListSchema
>;
export type ReservedScheduleItem = z.infer<typeof reservedScheduleItemSchema>;
export type ReservedSchedule = z.infer<typeof reservedScheduleSchema>;
export type ReservationsTime = z.infer<typeof reservationsTimeSchema>;
export type ReservationStatus = z.infer<typeof reservationStatus>;
export type UpdateReservationStatus = z.infer<
  typeof updateReservationStatusSchema
>;
export type DeleteActivityRes = z.infer<typeof deleteActivityResZ>;
export type Reservation = z.infer<typeof reservationSchema>;
export type ReservationCount = z.infer<typeof reservationCountSchema>;
export type ModifyMyActivity = z.infer<typeof modifyActivitySchema>;
