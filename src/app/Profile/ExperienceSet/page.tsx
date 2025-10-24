'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dropdown from '@/components/Dropdown/Dropdown';
import MypageHeader from '@/app/Profile/_components/MypageHeader/MypageHeader';
import Image from 'next/image';
import ConfirmModal from '@/components/Modal/ConfirmModal';

import { getMyActivities, deleteMyActivity } from '@/lib/myactivities/api';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getMyActivities({ accessToken });
        setActivities(data.activities);
      } catch (err) {
        console.error(err);
        alert('내 체험 목록을 불러오지 못했습니다');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!selectedActivityId || !accessToken) return;

    try {
      await deleteMyActivity({ activityId: selectedActivityId, accessToken });
      setActivities((prev) => prev.filter((a) => a.id !== selectedActivityId));
      setIsDeleteModalOpen(false);
      alert('삭제가 완료되었습니다');
    } catch (err) {
      console.error(err);
      alert('삭제에 실패했습니다');
    }
  };

  if (loading) return <p>불러오는중!!</p>;

  return (
    <div className="w-[100%] md:pl-[16px] lg:w-[800px]">
      <MypageHeader
        title="내 체험 관리"
        type="button"
        buttonText="체험 등록하기"
        onClick={() => router.push('/Profile/ExperienceAdd')}
      />
      <div>
        {activities.map((activity) => (
          <ul
            key={activity.id}
            className="bg-white rounded-3xl flex shadow-xl mb-[24px]"
          >
            <li className="relative flex w-[128px] h-[128px] md:w-[156px] md:h-[156px] lg:w-[204px] lg:h-[204px] overflow-hidden rounded-l-3xl">
              <Image
                src="/images/street_dance.png"
                alt="로고"
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
                  <span>4.9</span>
                  <span>(293)</span>
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
                        setIsDeleteModalOpen(true);
                      } else if (value === '수정하기') {
                        router.push(`/Profile/ExperienceEdit/${activity.id}`);
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
        ))}
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        message="삭제가 완료되었습니다."
        confirmLabel="확인"
        className="bg-white"
        onConfirm={handleDelete}
      />
    </div>
  );
}
