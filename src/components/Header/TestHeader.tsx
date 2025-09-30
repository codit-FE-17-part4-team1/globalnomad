'use client';

import { useState } from 'react';
import Header from './Header';

export default function TestHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => {
    setIsLoggedIn((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header
        isLoggedIn={isLoggedIn}
        userName={isLoggedIn ? '코드잇' : undefined}
        userImage={isLoggedIn ? '/images/user.png' : undefined}
        onNotificationClick={() => alert('알림 버튼 클릭!')}
      />

      {/* 테스트 버튼 */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={toggleLogin}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          {isLoggedIn ? '로그아웃 상태 보기' : '로그인 상태 보기'}
        </button>
      </div>

      {/* 상태 안내 */}
      <div className="mt-4 text-center text-gray-700">
        현재 상태: {isLoggedIn ? '로그인됨' : '로그인되지 않음'}
      </div>
    </div>
  );
}
