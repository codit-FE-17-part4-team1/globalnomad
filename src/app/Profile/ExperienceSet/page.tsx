'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Dropdown from '@/components/Dropdown/Dropdown';
import MypageHeader from '@/app/Profile/_components/MypageHeader/MypageHeader';
import Image from 'next/image';
import ConfirmModal from '@/components/Modal/ConfirmModal';

import { type MyActivitiesResponse } from '@/types/api/myactivities';

export default function Experience() {
  const router = useRouter();
  const [activities, setActivities] = useState<
    MyActivitiesResponse['activities']
  >([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const [deleteMessage, setDeleteMessage] = useState('정말 삭제하시겠습니까?');

  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchActivities = async (cursor?: string | null) => {
    const cursorParam = cursor ? `?cursorId=${cursor}` : '';
    const res = await fetch(`/api/myactivities${cursorParam}`);
    if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
    const data: MyActivitiesResponse = await res.json();
    return data;
  };

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const data = await fetchActivities(nextCursor);
      if (!data.activities || data.activities.length === 0) {
        setHasMore(false);
        return;
      }

      setNextCursor(data.cursorId ? String(data.cursorId) : null);

      setActivities((prev) => {
        const merged = [...prev, ...data.activities];
        return merged.filter(
          (v, i, a) => a.findIndex((x) => x.id === v.id) === i
        );
      });

      if (!data.cursorId || data.activities.length === 0) setHasMore(false);
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, nextCursor]);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold: 0.5 }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore]
  );

  useEffect(() => {
    /*
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/myactivities', {
          method: 'GET',
        });

        if (!res.ok) {
          if (res.status === 401) {
            alert('로그인이 필요합니다.');
            return;
          }
          throw new Error(`서버 응답 오류: ${res.status}`);
        }
        const data = await res.json();
        setActivities(data.activities || []);
      } catch (err) {
        console.error(err);
        alert('내 체험 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();*/
    loadMore();
  }, []);

  const handleDelete = async () => {
    if (!selectedActivityId) return;

    try {
      const res = await fetch(`/api/myactivities/${selectedActivityId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        /*
        if (res.status === 401) {
          alert('로그인 필요');
          return;
        }
        throw new Error(`삭제 실패: ${res.status}`);
        */
        setActivities((prev) =>
          prev.filter((a) => a.id !== selectedActivityId)
        );
        setDeleteMessage('삭제가 완료되었습니다.');
      } else if (res.status === 400 || res.status === 409) {
        setDeleteMessage('예약이 되어있는 체험은 삭제가 불가능합니다.');
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        return;
      } else {
        setDeleteMessage(`삭제 실패: ${res.status}`);
      }

      //setActivities((prev) => prev.filter((a) => a.id !== selectedActivityId));
      //setIsDeleteModalOpen(false);
      //alert('삭제가 완료되었습니다');
      //setDeleteMessage('삭제가 완료되었습니다.');
    } catch (err) {
      console.error(err);
      //alert('예약이 되어있는 체험은 삭제가 불가능합니다.');
      setDeleteMessage('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleteModalOpen(true);
    }
  };

  const uniqueActivities = useMemo(
    () =>
      activities.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i),
    [activities]
  );

  return (
    <div className="w-[100%] md:pl-[16px] lg:w-[800px]">
      <MypageHeader
        title="내 체험 관리"
        type="button"
        buttonText="체험 등록하기"
        onClick={() => router.push('/Profile/ExperienceAdd')}
      />
      <div>
        {uniqueActivities.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center pt-50 h-full text-2xl font-medium text-gray-700">
              <Image
                src="/images/design_2/empty.png"
                alt="체험없음"
                width={200}
                height={200}
                className="md:w-[240px] md:h-[240px]"
              />
              아직 등록한 체험이 없어요.
            </div>
            {/*
            <div className="relative w-full" style={{ height: '200px' }}>
              <Image
                src="/images/empty.svg"
                alt="등록된 체험 없음"
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-2 text-gray-500">아직 등록한 체험이 없어요</p>*/}
          </div>
        ) : (
          uniqueActivities.map((activity, index) => {
            const isLastElement = index === uniqueActivities.length - 1;
            return (
              <ul
                key={activity.id + '-' + index}
                ref={
                  isLastElement && hasMore && !isLoading ? lastElementRef : null
                }
                className="bg-white rounded-3xl flex shadow mb-[24px]"
              >
                <li className="relative flex w-[128px] h-[128px] md:w-[156px] md:h-[156px] lg:w-[204px] lg:h-[204px] overflow-hidden rounded-l-3xl">
                  <Image
                    src={activity.bannerImageUrl || '/images/street_dance.png'}
                    alt={activity.title}
                    fill
                    className=""
                  />
                </li>
                <li className="flex flex-col justify-between py-[10px] px-[8px] flex-1 lg:px-[14px] lg:pl-[24px]">
                  <div className="space-y-1">
                    <p>
                      <span className="relative w-[19px] h-[19px] inline-block">
                        <Image
                          src="/icon/star_on.svg"
                          alt="로고"
                          fill
                          className=""
                        />
                      </span>
                      <span>
                        {activity.rating > 0
                          ? activity.rating.toFixed(1)
                          : '0.0'}
                      </span>
                      <span>({activity.reviewCount})</span>
                    </p>
                    <h1 className="text-lg font-bold truncate max-w-[199px] md:text-2lg md:max-w-[355px] lg:max-w-[542px]">
                      {activity.title}
                    </h1>
                  </div>
                  <div>
                    <p className="float-left leading-[40px]">
                      ₩{activity.price.toLocaleString()} / 인
                    </p>
                    <div className="float-right">
                      <Dropdown
                        onSelect={(value) => {
                          if (value === '삭제하기') {
                            setSelectedActivityId(activity.id);
                            setDeleteMessage('정말 삭제하시겠습니까?');
                            setIsDeleteModalOpen(true);
                          } else if (value === '수정하기') {
                            router.push(
                              `/Profile/ExperienceEdit/${activity.id}`
                            );
                          }
                        }}
                      >
                        <Dropdown.Button color="dropdownSet">
                          <div>
                            <Image
                              src="/icon/btn/meatball.svg"
                              alt="드롭다운셋"
                              fill
                            />
                          </div>
                        </Dropdown.Button>
                        <Dropdown.Content
                          color="dropdownSet"
                          className="absolute right-0 mt-2 w-[160px] bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                        >
                          <Dropdown.Item color="dropdownSet" value="수정하기">
                            수정하기
                          </Dropdown.Item>
                          <Dropdown.Item color="dropdownSet" value="삭제하기">
                            삭제하기
                          </Dropdown.Item>
                        </Dropdown.Content>
                      </Dropdown>
                    </div>
                  </div>
                </li>
              </ul>
            );
          })
        )}

        <div className="h-[560px] md:h-[620px] lg:h-[680px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Image
                src="/images/loading.png"
                alt="로딩중"
                width={100}
                height={100}
              />
              <p className="text-gray-500">로딩중...</p>
            </div>
          )}
        </div>

        {!hasMore && !isLoading && uniqueActivities.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            <p>모든 체험을 불러왔습니다.</p>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        message={deleteMessage}
        confirmLabel="확인"
        className="bg-white"
        onConfirm={async () => {
          if (deleteMessage === '정말 삭제하시겠습니까?') {
            await handleDelete();
          } else {
            setIsDeleteModalOpen(false);
          }
        }}
      />
    </div>
  );
}
