'use client';

import { useState, useMemo } from 'react'; // useEffect 제거
import clsx from 'clsx';
import Image from 'next/image';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import Button from '@/components/Button/Button';
import Nodata from '@/app/Profile/_components/Nodata/Nodata';
import CancelModal from '@/app/Profile/ReservationHistory/_components/Modal/CancelModal';
import ReviewModal from '@/app/Profile/ReservationHistory/_components/Modal/ReviewModal';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

type ReservationItem = {
  id: number;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  headCount: number;
  totalPrice: number;
  reviewSubmitted: boolean;
  activity: {
    title: string;
    bannerImageUrl: string;
  };
};
type ReservationData = {
  totalCount: number;
  reservations: Array<ReservationItem>;
  cursorId: null | string;
};
const statusList = {
  confirmed: '예약 승인',
  canceled: '예약 취소',
  declined: '예약 거절',
  completed: '체험 완료',
  pending: '예약 대기',
} as const;
const reverseStatusList: Record<string, keyof typeof statusList> = {
  '예약 취소': 'canceled',
  '예약 승인': 'confirmed',
  '예약 거절': 'declined',
  '체험 완료': 'completed',
  '예약 대기': 'pending',
} as const;
const selectList = [
  '전체',
  '예약 대기',
  '예약 취소',
  '예약 승인',
  '예약 거절',
  '체험 완료',
];

export default function ReservationHistory() {
  const [isRawOpen, setRawOpen] = useState(false);
  const [modal, setModal] = useState('');
  const [selected, setSelected] = useState('전체');
  const [reservationId, setReservationId] = useState<number>();
  const [reservationInfo, setReservationInfo] =
    useState<ReservationItem | null>(null);

  const BUTTONSTYLE =
    'absolute bottom-6 right-6 rounded-md w-20 h-8 text-md md:h-11 md:w-36 xs:w-[112px] xs:h-10 xs:text-lg';

  // API 호출 함수 (데이터를 불러와야함)
  const fetchReservations = async (cursor?: string | null) => {
    const cursorParam = cursor ? `&cursorId=${cursor}` : '';
    const response = await fetch(`/api/my-reservations?size=5${cursorParam}`);
    if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');

    const result: ReservationData = await response.json();

    return {
      data: result.reservations,
      nextCursor: result.cursorId,
    };
  };

  // 무한스크롤 훅 사용
  const {
    data: reservations,
    isLoading,
    hasMore,
    lastElementRef,
    reset,
  } = useInfiniteScroll<ReservationItem>({
    fetchData: fetchReservations,
    pageSize: 5, // 한번에 보여지는 아이템 갯수
  });
  const loading = isLoading && reservations.length === 0;

  // 기존 data 형태로 변환
  const filteredCount = useMemo(() => {
    if (selected === '전체') return reservations.length;
    const statusKey = reverseStatusList[selected];
    return reservations.filter((r) => r.status === statusKey).length;
  }, [reservations, selected]);

  if (loading) return <p>로딩 중</p>;

  // 헤더 포함 데이터 없을때
  if (reservations.length === 0) {
    return (
      <div>
        <Header
          title="예약 내역"
          type="filter"
          selected={selected}
          setSelected={setSelected}
          selectList={selectList}
        />
        <Nodata />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="예약 내역"
        type="filter"
        selected={selected}
        setSelected={setSelected}
        selectList={selectList}
      />

      {/* 필터링된 결과가 없을 때 */}
      {filteredCount === 0 ? (
        <div
          className={clsx(
            'flex flex-col items-center pt-[60px]',
            'xs:pt-14',
            'md:pt-[86px]'
          )}
        >
          <Image
            width={200}
            height={200}
            src="/images/empty.svg"
            alt="데이터 없음"
            className="md:w-[240px] md:h-[240px]"
          />
          <p className="pt-5 text-2xl font-medium text-gray-700 ">
            {selected} 예약 내역이 없습니다.
          </p>
        </div>
      ) : (
        <>
          {reservations.map((list, index) => {
            const isLastElement = reservations.length === index + 1;
            if (selected !== '전체') {
              const statusKey = reverseStatusList[selected];
              if (list.status !== statusKey) {
                return isLastElement ? (
                  <div
                    key={list.id}
                    ref={lastElementRef}
                    style={{ height: 0 }}
                  />
                ) : null;
              }
            }
            return (
              <div
                key={list.id}
                ref={isLastElement ? lastElementRef : null} // 무한스크롤시 필수!!
                className="relative flex mb-4 rounded-3xl overflow-hidden w-full shadow"
              >
                <div
                  className={clsx(
                    'size-32 relative',
                    'xs:size-[156px]',
                    'md:size-[204px]'
                  )}
                >
                  <Image
                    src={list.activity.bannerImageUrl}
                    alt={list.activity.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div
                  className={clsx(
                    'bg-white px-2 py-2.5 flex-auto',
                    'xs:p-3',
                    'md:py-6 md:px-6'
                  )}
                >
                  <p
                    className={clsx(
                      'text-md font-bold',
                      'xs:text-lg',
                      'md:pb-2',
                      list.status === 'confirmed' && 'text-blue-light',
                      list.status === 'canceled' && 'text-gray-700',
                      list.status === 'declined' && 'text-red',
                      list.status === 'completed' && 'text-gray-700',
                      list.status === 'approved' && 'text-orange'
                    )}
                  >
                    {statusList[list.status as keyof typeof statusList]}
                  </p>
                  <h3
                    className={clsx(
                      'text-md font-bold',
                      'xs:pb-1 xs:text-2lg',
                      'md:pb-3 md:text-[20px]'
                    )}
                  >
                    {list.activity.title}
                  </h3>
                  <p
                    className={clsx(
                      'flex items-center gap-0.5 text-xs',
                      'xs:pb-5 xs:text-md xs:gap-1',
                      'md:pb-6 md:text-2lg md:gap-2'
                    )}
                  >
                    <span>{list.date}</span>·<span>{list.startTime}</span>~
                    <span>{list.endTime}</span>·<span>{list.headCount}명</span>
                  </p>
                  <p
                    className={clsx(
                      'font-medium',
                      'xs:text-[20px]',
                      'md:text-2xl'
                    )}
                  >
                    ₩{list.totalPrice.toLocaleString()}
                  </p>

                  {list.status === 'completed' ? (
                    <Button
                      color="buttonPrimary"
                      onClick={() => {
                        setRawOpen(true);
                        setModal('review');
                        setReservationId(list.id);
                        setReservationInfo(list);
                      }}
                      className={BUTTONSTYLE}
                      disabled={list.reviewSubmitted && true}
                    >
                      {list.reviewSubmitted ? '후기작성 완료' : '후기작성'}
                    </Button>
                  ) : list.status === 'pending' ? (
                    <Button
                      color="buttonSecondary"
                      onClick={() => {
                        setRawOpen(true);
                        setModal('cancel');
                        setReservationId(list.id);
                      }}
                      className={BUTTONSTYLE}
                    >
                      예약취소
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}

          {/* 로딩 표시 추가 */}
          {isLoading && (
            <div className="text-center py-4">
              <p>로딩 중...</p>
            </div>
          )}

          {/* 더 이상 데이터 없음 표시 추가 */}
          {!hasMore && !isLoading && (
            <div className="text-center py-4 text-gray-500">
              <p>모든 예약 내역을 불러왔습니다.</p>
            </div>
          )}
        </>
      )}

      {modal === 'review' && reservationInfo && (
        <ReviewModal
          isRawOpen={isRawOpen}
          setRawOpen={setRawOpen}
          reservationInfo={reservationInfo}
          reservationId={reservationId}
        />
      )}

      {modal === 'cancel' && (
        <CancelModal
          isRawOpen={isRawOpen}
          setRawOpen={setRawOpen}
          reservationId={reservationId}
          setData={reset}
        />
      )}
    </div>
  );
}
