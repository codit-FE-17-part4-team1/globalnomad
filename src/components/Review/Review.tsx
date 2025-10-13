'use client';

import React, { useState, useRef, useEffect } from 'react';
import ProfileImage from '../ProfileImage/ProfileImage';

export interface ReviewProps {
  userImage: string;
  name: string;
  date: string;
  content: string;
}

const Review: React.FC<ReviewProps> = ({ userImage, name, date, content }) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight
      );
      const maxHeight = lineHeight * 5;
      if (contentRef.current.scrollHeight > maxHeight) {
        setShowButton(true);
      }
    }
  }, [content]);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <div className="w-full flex flex-col">
      <div className="flex pt-6">
        {/* 프로필 이미지 */}
        <div className="w-[45px] h-[45px] mr-4 flex-shrink-0 rounded-full overflow-hidden">
          <ProfileImage imageUrl={userImage} name={name} />
        </div>

        <div className="flex-1">
          {/* 이름 | 리뷰 작성일 */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg text-black-nomad">{name}</h3>
            <span className="font-normal text-md text-black-nomad select-none">
              |
            </span>
            <span className="font-normal text-lg text-gray-500">{date}</span>
          </div>

          {/* 리뷰 내용 */}
          <p
            ref={contentRef}
            className="text-black-nomad font-normal text-lg leading-6"
            style={
              !expanded
                ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
                : {}
            }
          >
            {content}
          </p>

          {/* 리뷰 5줄 이상일 경우 더보기 버튼 노출 */}
          {showButton && (
            <button
              className="font-normal text-lg text-black-nomad mt-1 hover:underline cursor-pointer"
              onClick={toggleExpanded}
            >
              {expanded ? '접기' : '더보기'}
            </button>
          )}
        </div>
      </div>
      {/* 구분선 라인 */}
      <div className="-mx-5 md:mx-0 pt-6 border-b-[0.5px] border-black-nomad/25"></div>
    </div>
  );
};

export default Review;
