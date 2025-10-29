'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import BaseModal from '@/components/Modal/BaseModal';
import { useRouter } from 'next/navigation';

interface MoreDropdownProps {
  activityId: number;
  onDeleted?: () => void; // 삭제 성공 시 체험 상세 페이지에서 콜백을 전달받아 호출
}

const MoreDropdown: React.FC<MoreDropdownProps> = ({
  activityId,
  onDeleted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // 상세 유저 아이디=유저 아이디 확인
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 베이스 모달 상태
  const [modalState, setModalState] = useState<{
    open: boolean;
    message: string;
    type: 'confirm' | 'alert';
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    open: false,
    message: '',
    type: 'alert',
  });

  // 상세 페이지 접속 시 권한 확인
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const res = await fetch(`/api/activities/${activityId}/verify`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.status === 200) {
          setHasPermission(true); // 작성자 일치
        } else {
          setHasPermission(false); // 작성자 불일치 또는 인증 실패
        }
      } catch (err) {
        console.error('권한 확인 실패:', err);
        setHasPermission(false);
      }
    };

    checkPermission();
  }, [activityId]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 권한 없음 -> 더보기 버튼 자체를 렌더링 안함
  if (hasPermission === false) return null;
  if (hasPermission === null) return null; // 로딩 중에도 렌더링 안함

  // 수정하기
  const handleEdit = async () => {
    try {
      // 1) 수정 권한 검증 API 호출
      const res = await fetch(`/api/activities/${activityId}/verify`, {
        method: 'GET',
        credentials: 'include', // 쿠키 전달
      });

      // 2) 인증 실패 시
      if (res.status === 401) {
        setModalState({
          open: true,
          type: 'alert',
          message: '로그인이 필요합니다.',
          onConfirm: () => router.push('/Login'),
        });
        return;
      }

      // 3) 권한 없음 (작성자가 아님)
      if (res.status === 403) {
        setModalState({
          open: true,
          type: 'alert',
          message: '내 체험만 수정할 수 있습니다.',
        });
        return;
      }

      // 4) 기타 오류
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ 수정 검증 실패:', errorText);
        setModalState({
          open: true,
          type: 'alert',
          message: '수정 권한 확인 중 오류가 발생했습니다.',
        });
        return;
      }

      // 검증 성공 시 수정 페이지로 이동
      router.push(`/Profile/ExperienceEdit/${activityId}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : '수정 페이지로 이동할 수 없습니다.';
      setModalState({ open: true, type: 'alert', message });
      console.error(error);
    }
  };

  // 삭제하기
  const handleDelete = async () => {
    setModalState({
      open: true,
      type: 'confirm',
      message: '체험을 삭제하시겠습니까?',
      onConfirm: async () => {
        try {
          // 1) 우선 verify API로 권한 검증
          const verifyRes = await fetch(
            `/api/activities/${activityId}/verify`,
            {
              method: 'GET',
              credentials: 'include',
            }
          );

          if (verifyRes.status === 401) {
            setModalState({
              open: true,
              type: 'alert',
              message: '로그인이 필요합니다.',
              onConfirm: () => router.push('/Login'),
            });
            return;
          }

          if (verifyRes.status === 403) {
            setModalState({
              open: true,
              type: 'alert',
              message: '본인의 체험만 삭제할 수 있습니다.',
            });
            return;
          }

          // 2) 권한 확인 후 삭제 요청
          const res = await fetch(`/api/activities/${activityId}/delete`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          // 성공 처리 (204 No Content)
          if (res.status === 204) {
            setModalState({
              open: true,
              type: 'alert',
              message: '체험이 삭제되었습니다.',
              onConfirm: () => onDeleted?.(),
            });
            return;
          }

          // 에러 응답 처리 (400, 404 등)
          if (!res.ok) {
            const errorData = await res.json();
            setModalState({
              open: true,
              type: 'alert',
              message:
                errorData?.message || '삭제 처리 중 오류가 발생했습니다.',
            });
            console.error('❌ 삭제 오류:', {
              status: res.status,
              data: errorData,
            });
            return;
          }

          // 기타 성공 응답 (200 OK 등)
          const data = await res.json();
          setModalState({
            open: true,
            type: 'alert',
            message: data?.message || '삭제 처리 완료',
            onConfirm: () => onDeleted?.(),
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : '삭제 처리 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.';
          setModalState({ open: true, type: 'alert', message });
          console.error(error);
        }
      },
    });
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition"
        aria-label="더보기 메뉴"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Image
          src="/icon/btn/meatball.svg"
          alt="더보기"
          width={30}
          height={30}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="flex flex-col">
            <li
              className="flex items-center justify-center w-full p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={handleEdit}
            >
              수정하기
            </li>
            <li
              className="flex items-center justify-center w-full p-4 hover:bg-gray-100 cursor-pointer"
              onClick={handleDelete}
            >
              삭제하기
            </li>
          </ul>
        </div>
      )}

      {/* 베이스 모달 */}
      <BaseModal
        isOpen={modalState.open}
        onClose={() => setModalState((prev) => ({ ...prev, open: false }))}
      >
        <div className="w-[540px] h-[250px] rounded-lg bg-white p-8 relative">
          <p className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-medium text-black text-center">
            {modalState.message}
          </p>
          {modalState.type === 'confirm' ? (
            <div className="absolute bottom-8 right-8 flex gap-3">
              <button
                className="px-11 py-3 rounded-lg w-[120px] h-[48px] bg-black-nomad text-lg font-medium text-white"
                onClick={() => {
                  modalState.onConfirm?.();
                  setModalState((p) => ({ ...p, open: false }));
                }}
              >
                확인
              </button>
              <button
                className="px-11 py-3 rounded-lg w-[120px] h-[48px] bg-white border border-gray-300 text-lg font-medium text-black"
                onClick={() => {
                  modalState.onCancel?.();
                  setModalState((p) => ({ ...p, open: false }));
                }}
              >
                취소
              </button>
            </div>
          ) : (
            <div className="absolute bottom-8 right-8">
              <button
                className="px-11 py-3 rounded-lg w-[120px] h-[48px] bg-black-nomad text-lg font-medium text-white"
                onClick={() => {
                  modalState.onConfirm?.();
                  setModalState((p) => ({ ...p, open: false }));
                }}
              >
                확인
              </button>
            </div>
          )}
        </div>
      </BaseModal>
    </div>
  );
};

export default MoreDropdown;
