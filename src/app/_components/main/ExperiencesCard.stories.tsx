import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ExperiencesCard, { ExperiencesCardProps } from './ExperiencesCard';

const meta: Meta<typeof ExperiencesCard> = {
  title: 'Components/ExperiencesCard',
  component: ExperiencesCard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<ExperiencesCardProps>;

// 단일 카드 스토리
export const Large: Story = {
  args: {
    type: 'lg',
    image: './images/street_dance.png',
    title:
      '함께 배우면 즐거운 스트릿댄스 함께 배우면 즐거운 스트릿댄스함께 배우면 즐거운 스트릿댄스함께 배우면 즐거운 스트릿댄스함께 배우면 즐거운 스트릿댄스함께 배우면 즐거운 스트릿댄스',
    price: 38000,
    rating: 4.9,
    reviews: 793,
  },
};

export const Small: Story = {
  args: {
    type: 'sm',
    image: './images/fjord.png',
    title:
      '피오르 체험 피오르 체험피오르 체험피오르 체험피오르 체험피오르 체험피오르 체험피오르 체험',
    price: 42000,
    rating: 3.9,
    reviews: 108,
  },
};

// 반응형 카드 그리드 예제 스토리
export const Grid: Story = {
  render: (args) => (
    <div className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ExperiencesCard {...args} type="lg" />
        <ExperiencesCard {...args} type="sm" />
        <ExperiencesCard {...args} type="lg" />
        <ExperiencesCard {...args} type="sm" />
      </div>
    </div>
  ),
  args: {
    image: './images/street_dance.png',
    title: '그리드 카드 예제',
    price: 38000,
    rating: 4.5,
    reviews: 150,
  },
};
