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
      router.push(`/my-activities/${activityId}`); // 수정 페이지로 이동
    } catch (error: any) {
      alert(error?.message || '수정할 수 없습니다.');
      console.error(error);
    }
  };

  // 삭제 버튼 클릭
  const handleDelete = async () => {
    const confirmDelete = confirm('체험을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/proxy/17-1/my-activities/${activityId}`, {
        method: 'DELETE',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // JSON 응답이 없을 수도 있으므로 안전하게 처리
      const data = await res.json().catch(() => ({}));

      // 상태 코드별 처리
      switch (res.status) {
        case 204:
          alert('체험이 삭제되었습니다.');
          router.push('/');
          router.refresh();
          break;

        case 401: // 로그인하지 않은 경우 , 400, 403, 404 ... 서버에서 보내주는 메세지 사용, 401은 Unauthorized 문구만 나와서 프론트에서 보내주는 메세지로 대체
          alert('로그인이 필요합니다.');
          break;

        default:
          alert(data.message ?? '삭제 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('삭제 처리 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
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
