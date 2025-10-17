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
      // 예시: 수정 페이지로 이동
      router.push(`/my-activities/${activityId}`);
    } catch (error: any) {
      alert(error?.message || '수정할 수 없습니다.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('체험을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/my-activities/${activityId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || '삭제할 수 없습니다.');
        return;
      }

      alert('체험이 삭제되었습니다.');
      router.refresh(); // 삭제 후 목록 갱신
    } catch (error: any) {
      alert(error?.message || '삭제 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* 더보기 버튼 */}
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

      {/* 드롭다운 모달 */}
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
