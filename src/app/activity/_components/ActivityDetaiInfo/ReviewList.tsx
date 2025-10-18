'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Review from '@/components/Review/Review';
import Pagination from '@/components/Pagination/Pagination';
import type { ReviewList } from '@/types/review';

export interface ReviewListProps {
  data: ReviewList;
}

const ReviewList: React.FC<ReviewListProps> = ({ data }) => {
  const { averageRating, totalCount, reviews } = data;

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  const ratingText =
    averageRating >= 4.5
      ? '매우 만족'
      : averageRating >= 3.5
        ? '만족'
        : averageRating >= 2.5
          ? '보통'
          : averageRating >= 1.5
            ? '불만족'
            : '매우 불만족';

  return (
    <div className="w-full flex flex-col">
      <div className="w-full">
        <h2 className="text-xl lg:text-2lg font-bold text-black-nomad mb-3">
          후기
        </h2>
        <div className="flex items-center gap-4">
          <p className="text-[50px] font-semibold text-black-nomad leading-[100%]">
            {averageRating.toFixed(1)}
          </p>
          <div className="flex flex-col">
            <span className="text-2lg font-medium text-black-nomad mb-[8px]">
              {ratingText}
            </span>
            <div className="flex items-center gap-[6px]">
              <Image
                src="/icon/star_on.svg"
                alt="평점 아이콘"
                width={16}
                height={16}
              />
              <span className="text-md font-medium text-black">
                {totalCount.toLocaleString()}개 후기
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 리뷰 리스트 */}
      <ul className="w-full flex flex-col">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <li key={review.id}>
              <Review
                userImage={review.user.profileImageUrl}
                name={review.user.nickname}
                date={new Date(review.createdAt).toLocaleDateString()}
                content={review.content}
              />
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-lg">아직 후기가 없습니다.</p>
        )}

        {/* 페이지네이션 */}
        {totalCount > reviewsPerPage && (
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalItems={totalCount}
              itemsPerPage={reviewsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </ul>
    </div>
  );
};

export default ReviewList;
