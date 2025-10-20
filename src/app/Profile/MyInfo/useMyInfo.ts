'use client';
import { useEffect, useState } from 'react';

const API_ME_PATH = '/api/user';

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

export const useMyInfo = () => {
  const [getMyInfo, setGetMyInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const myInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        // same-origin API 호출: 브라우저가 자동으로 쿠키를 보냄 (fetch 기본 credential은 same-origin)
        const res = await fetch(API_ME_PATH, {
          method: 'GET',
          cache: 'no-store',
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Network response was not ok');
        }
        const data = await res.json();
        setGetMyInfo(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    myInfo();
  }, []);
  return { getMyInfo, loading, error };
};

export const useMyInfoModify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMyInfo = async (updateData: UpDateUserInfo) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ME_PATH, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        cache: 'no-store',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || '수정 실패');
      }
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      setError((err as Error).message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };
  return { updateMyInfo, loading, error };
};
