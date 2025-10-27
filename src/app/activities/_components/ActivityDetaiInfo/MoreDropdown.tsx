'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
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
        alert('로그인이 필요합니다.');
        router.push('/Login');
        return;
      }

      // 3) 권한 없음 (작성자가 아님)
      if (res.status === 403) {
        alert('내 체험만 수정할 수 있습니다.');
        return;
      }

      // 4) 기타 오류
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ 수정 검증 실패:', errorText);
        alert('수정 권한 확인 중 오류가 발생했습니다.');
        return;
      }

      // 검증 성공 시 수정 페이지로 이동
      router.push(`/Profile/ExperienceEdit/${activityId}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : '수정 페이지로 이동할 수 없습니다.';
      alert(message);
      console.error(error);
    }
  };

  // 삭제하기
  const handleDelete = async () => {
    const confirmDelete = confirm('체험을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      // 1) 우선 verify API로 권한 검증
      const verifyRes = await fetch(`/api/activities/${activityId}/verify`, {
        method: 'GET',
        credentials: 'include',
      });

      if (verifyRes.status === 401) {
        alert('로그인이 필요합니다.');
        router.push('/Login');
        return;
      }

      if (verifyRes.status === 403) {
        alert('본인의 체험만 삭제할 수 있습니다.');
        return;
      }

      // 2) 권한 확인 후 삭제 요청
      const res = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`삭제 처리 중 오류가 발생했습니다: ${errorText}`);
        console.error('삭제 오류:', res.status, errorText);
        return;
      }

      // 성공 처리
      if (res.status === 204) {
        alert('체험이 삭제되었습니다.');
        onDeleted?.();
        return;
      }

      // 기타 응답 (200 OK)
      const data: { message?: string } = await res.json().catch(() => ({}));
      alert(data.message ?? '삭제 처리 완료');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : '삭제 처리 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.';
      alert(message);
      console.error(error);
    }
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
    </div>
  );
};

export default MoreDropdown;
