import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Dropdown from './Dropdown';

const meta = {
  component: Dropdown,
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Dropdown.Button color="dropdownPrimary">선택하세요</Dropdown.Button>
        <Dropdown.Content>
          <Dropdown.Item value="1">옵션 1</Dropdown.Item>
          <Dropdown.Item value="2">옵션 2</Dropdown.Item>
          <Dropdown.Item value="3">옵션 3</Dropdown.Item>
        </Dropdown.Content>
      </>
    ),
  },
};
