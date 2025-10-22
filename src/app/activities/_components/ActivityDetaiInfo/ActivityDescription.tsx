'use client';

import React from 'react';
import type { ActivityDetailInfo } from '@/types/activity';

export interface ActivityDescriptionProps {
  description: ActivityDetailInfo['description'];
}

const ActivityDescription: React.FC<ActivityDescriptionProps> = ({
  description,
}) => {
  return (
    <div className="w-full flex flex-col gap-5">
      <h2 className="text-xl font-bold text-black-nomad leading-[32px]">
        체험 설명
      </h2>
      <p className="text-lg text-black font-normal leading-[26px] whitespace-pre-line">
        {description}
      </p>
    </div>
  );
};

export default ActivityDescription;
