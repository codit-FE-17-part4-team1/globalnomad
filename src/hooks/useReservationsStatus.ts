import { useEffect, useState } from 'react';

// 3. 전달한 체험명을 클릭했을 때 해당 체험명에 해당하는 예약 정보(신청,승인,거절)가 전달되어야 함 (각 모달에 내려주기?)
// 3-1. 예약 정보에 날짜, 시간의 데이터도 전달되어야 함
// 3-2. 신청: 승인하기/거절하기 클릭 시 업데이트가 되어야 함

export default function useReservationsDashboard() {
  const [reservations, setReservations] = useState([]);
}
