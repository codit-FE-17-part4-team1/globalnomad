import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import DatePicker from './DatePicker';

const meta = {
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
