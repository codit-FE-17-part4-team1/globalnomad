import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Chips from './Chips';

const meta = {
  component: Chips,
  argTypes: {
    color: {
      options: ['white', 'blue', 'gray', 'orange', 'red'],
    },
    variant: {
      options: ['normal', 'round'],
    },
  },
} satisfies Meta<typeof Chips>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본',
    color: 'white',
    variant: 'normal',
  },
};
