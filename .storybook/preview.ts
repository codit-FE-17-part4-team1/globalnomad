import '@/styles/global.css';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport';
import type { Preview } from '@storybook/nextjs-vite';
import StorybookTemplate from './StorybookTemplate';

const preview: Preview = {
  parameters: {
    docs: {
      page: StorybookTemplate,
    },
    viewport: {
      viewport: { ...INITIAL_VIEWPORTS, ...MINIMAL_VIEWPORTS },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      manual: true,
    },
  },
};

export default preview;
