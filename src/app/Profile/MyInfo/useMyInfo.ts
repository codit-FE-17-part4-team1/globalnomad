'use client';
import { useEffect, useState } from 'react';

const BASE_URL = 'https://sp-globalnomad-api.vercel.app/17-1/';
const path = 'users/me';
// 내정보 타입
interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpDateUserInfo {
  nickname: string;
  profileImageUrl?: string | null;
  newPassword?: string;
}

// const token = localStorage.getItem('accessToken');
// 임시 스웨거 토큰
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjY4NSwidGVhbUlkIjoiMTctMSIsImlhdCI6MTc2MDQ5Njk1NCwiZXhwIjoxNzYwNDk4NzU0LCJpc3MiOiJzcC1nbG9iYWxub21hZCJ9.AfCCJeQl3-X_FV7J8s8vPkuH46Rwr07TfZ0ahUUfQ8U';

// 내정보 가져오기
export const useMyInfo = () => {
  const [getMyInfo, setGetMyInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const myInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}${path}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          const errorDate = await res.json();
          throw new Error(errorDate.message || 'Network response was not ok');
        }
        const data = await res.json();
        setGetMyInfo(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    myInfo();
  }, []);
  return { getMyInfo, loading, error };
};

// 내정보 수정하기
export const useMyInfoModify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMyInfo = async (updateData: UpDateUserInfo) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        throw new Error('수정 실패');
      }
      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      setError((error as Error).message);
      return { success: false, error: error };
    } finally {
      setLoading(false);
    }
  };
  return { updateMyInfo, loading, error };
};
