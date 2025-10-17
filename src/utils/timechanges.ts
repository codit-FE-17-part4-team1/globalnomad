// 따로 빼서 관리해도 될 듯?

/**
 * 'YYYY년 MM월 DD일' 로 변환
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 'HH:mm ~ HH:mm' 로 변환
 */
export function formatTimeRange(start: Date, end: Date): string {
  const startTime = `${String(start.getHours()).padStart(2, '0')}:${String(
    start.getMinutes()
  ).padStart(2, '0')}`;
  const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(
    end.getMinutes()
  ).padStart(2, '0')}`;
  return `${startTime} ~ ${endTime}`;
}
