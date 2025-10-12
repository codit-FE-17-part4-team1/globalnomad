import type { Meta, StoryObj } from '@storybook/react';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onPageChange: { action: 'page changed' },
  },
};
export default meta;

type Story = StoryObj<typeof Pagination>;

// 공통 기본 args
const baseArgs = {
  totalItems: 50,
  currentPage: 1,
  itemsPerPage: 10,
};

// PC 버전
export const Desktop: Story = {
  args: {
    ...baseArgs,
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

// 모바일 버전
export const Mobile: Story = {
  args: {
    ...baseArgs,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
