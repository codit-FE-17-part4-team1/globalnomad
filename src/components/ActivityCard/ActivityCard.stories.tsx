// src/components/ActivityCard/ActivityCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import ActivityCard, { ActivityCardProps } from './ActivityCard';

const meta: Meta<typeof ActivityCard> = {
  title: 'Components/ActivityCard',
  component: ActivityCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ActivityCard는 액티비티 이미지, 제목, 평점, 리뷰 수, 가격 정보를 표시하는 카드 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    imageUrl: { control: 'text', description: '액티비티 이미지 URL' },
    title: { control: 'text', description: '액티비티 제목' },
    rating: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description: '평점 (0~5)',
    },
    reviewCount: {
      control: { type: 'number', min: 0 },
      description: '리뷰 개수',
    },
    price: { control: { type: 'number', min: 0 }, description: '가격' },
    currency: { control: 'text', description: '통화 기호 (기본 ₩)' },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityCard>;

// 기본 예제
export const Default: Story = {
  args: {
    imageUrl:
      'https://images.unsplash.com/photo-1602526214246-cd6e78c7b986?auto=format&fit=crop&w=400&q=80',
    title: '서울 시티 투어',
    rating: 4.7,
    reviewCount: 128,
    price: 45000,
  },
};

// 통화 변경 예제
export const WithUSD: Story = {
  args: {
    imageUrl:
      'https://images.unsplash.com/photo-1602526214246-cd6e78c7b986?auto=format&fit=crop&w=400&q=80',
    title: 'New York Walking Tour',
    rating: 4.9,
    reviewCount: 75,
    price: 120,
    currency: '$',
  },
};

// 평점 낮은 예제
export const LowRating: Story = {
  args: {
    imageUrl:
      'https://images.unsplash.com/photo-1602526214246-cd6e78c7b986?auto=format&fit=crop&w=400&q=80',
    title: 'Beginner Surf Lesson',
    rating: 2.8,
    reviewCount: 12,
    price: 30000,
  },
};
