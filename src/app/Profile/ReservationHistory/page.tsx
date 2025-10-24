'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import Button from '@/components/Button/Button';
import Nodata from '@/app/Profile/_components/Nodata/Nodata';
import CancelModal from '@/app/Profile/ReservationHistory/_components/Modal/CancelModal.tsx';
import ReviewModal from '@/app/Profile/ReservationHistory/_components/Modal/ReviewModal';
import { getMyReservations } from '@/actions/myreservations.action';

type ReservationData = {
  totalCount: number;
  reservations: Array<{
    id: number;
    status: string;
    date: string;
    startTime: string;
    endTime: string;
    headCount: number;
    totalPrice: number;
    activity: {
      title: string;
      bannerImageUrl: string;
    };
  }>;
  cursorId: null | string;
};

export default function ReservationHistory() {
  const [data, setData] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRawOpen, setRawOpen] = useState(false);
  const [modal, setModal] = useState('');
  const [selected, setSelected] = useState('');
  const [reservationId, setReservationId] = useState<number>();
  const [reservationInfo, setReservationInfo] = useState();
  console.log(data);
  const BUTTONSTYLE =
    'absolute bottom-6 right-6 rounded-md w-20 h-8 text-md md:h-11 md:w-36 xs:w-[112px] xs:h-10 xs:text-lg';

  const selectList = [
    '예약 신청',
    '예약 취소',
    '예약 승인',
    '예약 거절',
    '체험 완료',
  ];

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await getMyReservations();
        setData(reservations);
      } catch (error) {
        console.error(error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <p>로딩 중</p>;
  if (!data || !data.reservations || data.reservations.length === 0) {
    return <Nodata />;
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

      {data.reservations.map((list) => (
        <div
          key={list.id}
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
                list.status === 'cancelled' && 'text-gray-700',
                list.status === 'rejected' && 'text-red',
                list.status === 'completed' && 'text-gray-700',
                list.status === 'approved' && 'text-orange'
              )}
            >
              {list.status}
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
            <p className={clsx('font-medium', 'xs:text-[20px]', 'md:text-2xl')}>
              ₩{list.totalPrice}
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
              >
                후기작성
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
      ))}

      {modal === 'review' ? (
        <ReviewModal
          isRawOpen={isRawOpen}
          setRawOpen={setRawOpen}
          reservationInfo={reservationInfo}
          reservationId={reservationId}
        />
      ) : modal === 'cancel' ? (
        <CancelModal
          isRawOpen={isRawOpen}
          setRawOpen={setRawOpen}
          reservationId={reservationId}
          setData={setData}
        />
      ) : null}
    </div>
  );
}
