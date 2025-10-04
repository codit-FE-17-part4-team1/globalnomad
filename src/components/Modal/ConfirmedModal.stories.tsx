'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

// 스토리에서 편하게 열고 닫도록 하는 래퍼
function Controller(props: React.ComponentProps<typeof ConfirmModal>) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ minHeight: 300, display: 'grid', placeItems: 'center' }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border px-3 py-2"
      >
        모달 열기
      </button>

      <ConfirmModal
        {...props}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          props.onConfirm?.();
          setOpen(false);
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Components/Modal/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    message: { control: 'text', description: '본문 메시지' },
    confirmLabel: { control: 'text', description: '확인 버튼 라벨' },
    size: {
      control: 'radio',
      options: ['md', 'lg', 'xl'],
      description: 'BaseModal로 전달되는 사이즈',
    },
    onConfirm: { action: 'confirm clicked' },
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본
export const Default: Story = {
  render: (args) => <Controller {...args} />,
  args: {
    message: '가입이 완료되었습니다!',
    confirmLabel: '확인',
    size: 'lg',
  },
};
