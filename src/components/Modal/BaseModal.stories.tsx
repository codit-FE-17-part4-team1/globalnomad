'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState, PropsWithChildren } from 'react';
import BaseModal from './BaseModal';

function ModalController(
  props: PropsWithChildren<{
    title?: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  }>
) {
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

      <BaseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={props.title}
        className={props.className}
        size={props.size}
      >
        <div className="px-6 pb-6">
          {props.children ?? (
            <div className="space-y-4">
              <p>오버레이를 클릭하면 닫힙니다.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-black px-3 py-2 text-white"
                >
                  닫기
                </button>
                <button
                  onClick={() => alert('확인!')}
                  className="rounded-md border px-3 py-2"
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </BaseModal>
    </div>
  );
}

const meta = {
  title: 'Components/Modal/BaseModal',
  component: BaseModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: { control: 'text' },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description:
        '현재 스타일에 직접 반영되지 않으면 BaseModal 내부에 사이즈 매핑을 추가하세요.',
    },
    className: { control: 'text' },
  },
} satisfies Meta<typeof BaseModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ModalController {...args}>
      <p>가입이 완료되었습니다!</p>
    </ModalController>
  ),
  args: {
    size: 'md',
  },
};

export const WithTitle: Story = {
  render: (args) => (
    <ModalController {...args}>
      <p>타이틀 영역이 렌더링됩니다.</p>
    </ModalController>
  ),
  args: {
    title: '타이틀이 있는 모달',
  },
};

export const LongContent: Story = {
  render: (args) => (
    <ModalController {...args}>
      <div className="space-y-4">
        {[...Array(30)].map((_, i) => (
          <p key={i}>({i + 1}) 매우 긴 내용 — 스크롤 확인</p>
        ))}
      </div>
    </ModalController>
  ),
  args: {
    title: '스크롤 테스트',
    className: 'w-[540px]',
  },
};
