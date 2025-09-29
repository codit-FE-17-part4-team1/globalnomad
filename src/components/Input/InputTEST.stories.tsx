import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import InputTest from './InputTEST';

const meta = {
  component: InputTest,
} satisfies Meta<typeof InputTest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};