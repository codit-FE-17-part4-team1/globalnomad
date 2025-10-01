import type { Meta, StoryObj } from '@storybook/react';
import Header, { HeaderProps } from '@/components/Header/Header';

const meta: Meta<HeaderProps> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Header 컴포넌트는 로그인 여부에 따라 UserMenu 또는 로그인/회원가입 버튼을 보여줍니다.',
      },
    },
  },
  argTypes: {
    isLoggedIn: { control: 'boolean', description: '사용자 로그인 여부' },
    userName: { control: 'text', description: '사용자 이름' },
    userImage: { control: 'text', description: '사용자 프로필 이미지 URL' },
  },
};

export default meta;
type Story = StoryObj<HeaderProps>;

// 로그인 안 된 상태
export const LoggedOut: Story = {
  args: {
    isLoggedIn: false,
  },
};

// 로그인 된 상태
export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
    userName: '코드잇',
    userImage: '/images/user.png',
  },
};

// 로그인 된 상태 (이미지 없음)
export const LoggedInNoImage: Story = {
  args: {
    isLoggedIn: true,
    userName: '코드잇',
  },
};
