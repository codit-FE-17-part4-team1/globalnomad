// src/components/Review/Review.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Review from './Review';

const meta: Meta<typeof Review> = {
  title: 'Components/Review',
  component: Review,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '사용자 리뷰 카드를 표시하는 컴포넌트입니다. 프로필 이미지, 이름, 날짜, 리뷰 텍스트를 표시합니다.',
      },
    },
  },
  argTypes: {
    userImage: {
      description: '사용자 프로필 이미지 URL',
      control: 'text',
    },
    name: {
      description: '리뷰 작성자 이름',
      control: 'text',
    },
    date: {
      description: '리뷰 작성 날짜',
      control: 'text',
    },
    content: {
      description: '리뷰 내용',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Review>;

// 기본 스토리
export const Default: Story = {
  args: {
    userImage: 'https://via.placeholder.com/150/cccccc/000000?text=User', // 샘플 프로필
    name: '김태현',
    date: '2023-02-04',
    content:
      '저는 저희 스트릿 댄서 체험에 참가하게 된 지 얼마 안됐지만, 정말 즐거운 시간을 보냈습니다. 새로운 스타일과 춤추기를 좋아하는 나에게 정말 적합한 체험이었고, 전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었습니다. 강사님께서 정말 친절하게 설명해주셔서 정말 좋았고, 이번 체험을 거쳐 새로운 스타일과 춤추기에 대한 열정이 더욱 생겼습니다. 저는 이 체험을 적극 추천합니다!',
  },
};

// 이미지 로드 실패 시 fallback 확인용
export const ImageError: Story = {
  args: {
    userImage: '/broken-link.jpg',
    name: '이미지없음',
    date: '2023-02-04',
    content: '이미지가 없는 경우 회색 원형 영역이 표시됩니다.',
  },
};
