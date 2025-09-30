'use client';

import { useState } from 'react';
import ConfirmModal from '@/components/Modal/Presets/ConfirmModal';
import BaseModal from '@/components/Modal/BaseModal';

export default function ModalPlayground() {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isRawOpen, setRawOpen] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Modal 테스트 페이지</h1>

      {/* 프리셋 확인 모달 보기 */}
      <button
        className="mr-3 px-4 py-2 rounded bg-[var(--color-green-dark)] text-white"
        onClick={() => {
          setRawOpen(false);
          setConfirmOpen(true);
        }}
      >
        Presets Modal Test
      </button>

      {/* 베이스 모달로 조립해 보기 */}
      <button
        className="mr-3 px-4 py-2 rounded bg-[var(--color-green-dark)] text-white"
        onClick={() => {
          setConfirmOpen(false);
          setRawOpen(true);
        }}
      >
        Base Modal Test
      </button>

      {/* ConfirmModal - 프리셋 */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        message="체험 등록이 완료되었습니다."
        confirmLabel="확인"
        size="md"
      />

      {/* BaseModal - children 입력해서 구현해보기 */}
      <BaseModal isOpen={isRawOpen} onClose={() => setRawOpen(false)} size="md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">후기 작성</h2>
          <p className="text-black text-center">
            내부 컨텐츠 항목 추가
            <br />
            후기 작성 별점 등등
          </p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setRawOpen(false)}
              className="w-full h-12 rounded bg-[var(--color-green-dark)] text-white"
            >
              작성하기
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
