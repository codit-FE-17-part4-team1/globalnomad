'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface MoreDropdownProps {
  activityId: number;
}

const MoreDropdown: React.FC<MoreDropdownProps> = ({ activityId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleEdit = () => {
    try {
      router.push(`/my-activities/${activityId}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : '수정할 수 없습니다.';
      alert(message);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('체험을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        // 오류일 경우 text로 확인
        const errorText = await res.text();
        alert(`삭제 처리 중 오류가 발생했습니다: ${errorText}`);
        console.error('삭제 오류:', res.status, errorText);
        return;
      }

      // 성공 처리
      if (res.status === 204) {
        alert('체험이 삭제되었습니다.');
        router.push('/');
        router.refresh();
        return;
      }

      // 만약 200 OK라면 JSON 파싱
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
