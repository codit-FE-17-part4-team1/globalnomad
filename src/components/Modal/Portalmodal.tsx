import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

// DOM 밖에서 컴포넌트 렌더링
export default function Portal({ children }: { children: ReactNode }) {
  const element =
    typeof window !== 'undefined' && document.querySelector('#modal-portal');

  return element && children ? createPortal(children, element) : null;
}
