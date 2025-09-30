import React from 'react';

export interface ActivityCardProps {
  imageUrl:        string;
  title: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency?: string; // 기본 ₩
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  imageUrl,
  title,
  rating,
  reviewCount,
  price,
  currency = '₩',
}) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden w-[168px] sm:w-[221px] lg:w-[283px]">
      {/* 이미지 */}
      <div className="w-full h-[168px] sm:h-[221px] lg:h-[283px] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-t-xl"
        />
      </div>

      {/* 내용 */}
      <div className="p-4 flex flex-col gap-2">
        {/* 평점 */}
        <div className="flex items-center text-yellow-400 text-sm font-medium">
          <span>★ {rating.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">({reviewCount})</span>
        </div>

        {/* 제목 */}
        <h3 className="text-black-nomad font-semibold text-lg leading-6">
          {title}
        </h3>

        {/* 가격 */}
        <p className="text-black-nomad font-bold text-lg">
          {currency} {price.toLocaleString()} /인
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;
