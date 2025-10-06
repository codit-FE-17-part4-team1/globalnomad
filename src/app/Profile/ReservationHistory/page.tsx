'use client';
import { useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { data } from './mockData';
import Header from '@/app/Profile/_components/MypageHeader/MypageHeader';
import Button from '@/components/Button/Button';
import CancelModal from '@/app/Profile/ReservationHistory/_components/Modal/CancelModal.tsx';
import ReviewModal from '@/app/Profile/ReservationHistory/_components/Modal/ReviewModal';
export default function ReservationHistory() {
  const BUTTONSTYLE =
    'absolute bottom-6 right-6 rounded-md w-20 h-8 text-md md:h-11 md:w-36 xs:w-[112px] xs:h-10 xs:text-lg';
  const [isRawOpen, setRawOpen] = useState(false);
  const [modal, setModal] = useState('');
  return (
    <div>
      <Header title="예약 내역" />
      {data.reservations.map((list) => {
        return (
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
                className={clsx('object-cover')}
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
                  list.status === '예약 완료' && 'text-blue-light',
                  list.status === '예약 취소' && 'text-gray-700',
                  list.status === '예약 거절' && 'text-red',
                  list.status === '체험 완료' && 'text-gray-700',
                  list.status === '예약 승인' && 'text-orange'
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
              <p
                className={clsx('font-medium', 'xs:text-[20px]', 'md:text-2xl')}
              >
                ₩{list.totalPrice}
              </p>
              {list.status === '체험 완료' ? (
                <Button
                  color="buttonPrimary"
                  onClick={() => {
                    setRawOpen(true);
                    setModal('review');
                  }}
                  className={BUTTONSTYLE}
                >
                  후기작성
                </Button>
              ) : list.status === '예약 완료' ? (
                <Button
                  color="buttonSecondary"
                  onClick={() => {
                    setRawOpen(true);
                    setModal('cancel');
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
      {modal === 'review' ? (
        <ReviewModal isRawOpen={isRawOpen} setRawOpen={setRawOpen} />
      ) : modal === 'cancel' ? (
        <CancelModal isRawOpen={isRawOpen} setRawOpen={setRawOpen} />
      ) : null}
    </div>
  );
}
