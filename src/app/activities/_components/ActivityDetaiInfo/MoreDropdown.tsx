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
      // 수정 페이지로 이동
      router.push(`/my-activities/${activityId}`);
    } catch (error: any) {
      alert(error?.message || '수정할 수 없습니다.');
    }
  };

  // 삭제 버튼 클릭
  const handleDelete = async () => {
    const confirmDelete = confirm('체험을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const teamId = '17';

      const res = await fetch(
        `https://sp-globalnomad-api.vercel.app/${teamId}/my-activities/${activityId}`,
        {
          method: 'DELETE',
          credentials: 'include', // 쿠키 포함
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.status === 204) {
        alert('체험이 삭제되었습니다.');
        router.refresh(); // 삭제 후 목록 갱신
        return;
      }

      switch (res.status) {
        case 400:
          alert(data.message || '신청 예약이 있는 체험은 삭제할 수 없습니다.');
          break;
        case 401:
          alert(data.message || '로그인이 필요합니다.');
          break;
        case 403:
          alert(data.message || '본인의 체험만 삭제할 수 있습니다.');
          break;
        case 404:
          alert(data.message || '존재하지 않는 체험입니다.');
          break;
        default:
          alert(data.message || '삭제 처리 중 오류가 발생했습니다.');
      }
    } catch (error: any) {
      alert('삭제 처리 중 오류가 발생했습니다. 로그인 여부를 확인해주세요.');
      console.error(error);
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
