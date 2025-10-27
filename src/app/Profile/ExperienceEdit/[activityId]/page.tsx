//1027 업데이트 완료

'use client';

import 'react-datepicker/dist/react-datepicker.css';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FormInput from '@/components/Input/CustomInput';
import { useInputValue } from '@/hooks/useInputValue';
import Dropdown from '@/components/Dropdown/Dropdown';
import MypageHeader from '@/app/Profile/_components/MypageHeader/MypageHeader';
import ImageUploader from '@/app/Profile/_components/ImageUploader/ImageUploader';
import DaumPostcode from 'react-daum-postcode';
import TimeSlots, {
  TimeSlot,
} from '@/app/Profile/_components/TimeSlots/TimeSlots';
import ConfirmModal from '@/components/Modal/ConfirmModal';

interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
}

interface ExperienceData {
  title: string;
  category: string;
  content?: string;
  price: number;
  address: string;
  description: string;
  bannerImageUrl?: string;
  subImageUrls: string[];
  schedules: Schedule[];
}

export default function ExperienceEdit() {
  const router = useRouter();
  //const params = useParams();
  //const experienceId = params.id;
  const { activityId } = useParams();

  const [form, setForm, handleChange] = useInputValue({
    title: '',
    category: '',
    content: '',
    price: '',
    address: '',
    description: '',
  });

  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [introImages, setIntroImages] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [initialData, setInitialData] = useState<ExperienceData | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  //const [accessToken, setAccessToken] = useState<string | null>(null);

  const categoryOptions = [
    '문화 · 예술',
    '식음료',
    '스포츠',
    '투어',
    '관광',
    '웰빙',
  ];

  //GET
  useEffect(() => {
    if (!activityId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/myactivities/${activityId}`);
        if (!res.ok) throw new Error(`데이터 불러오기 실패 (${res.status})`);

        const data: ExperienceData = await res.json();

        setForm({
          title: data.title,
          category: data.category,
          content: data.content || '',
          price: data.price.toString(),
          address: data.address,
          description: data.description,
        });

        setBannerImages(data.bannerImageUrl ? [data.bannerImageUrl] : []);
        setIntroImages(data.subImageUrls || []);

        const slots: TimeSlot[] = (data.schedules || []).map((s, i) => ({
          id: i,
          date: new Date(s.date),
          startTime: new Date(`${s.date}T${s.startTime}`),
          endTime: new Date(`${s.date}T${s.endTime}`),
        }));
        setSelectedSlots(slots);
        setInitialData(data);
      } catch (err) {
        console.error(err);
        alert('데이터를 불러오지 못했습니다.');
      }
    };

    fetchData();
  }, [activityId]);

  const handleAddressComplete = (data: { address: string }) => {
    setForm((prev) => ({ ...prev, address: data.address }));
    setIsPostcodeOpen(false);
  };

  const handleBannerImages: React.Dispatch<React.SetStateAction<string[]>> = (
    imgs
  ) => {
    setBannerImages((prev) =>
      typeof imgs === 'function' ? imgs(prev).slice(0, 1) : imgs.slice(0, 1)
    );
  };

  const handleIntroImages: React.Dispatch<React.SetStateAction<string[]>> = (
    imgs
  ) => {
    setIntroImages((prev) => {
      const newImgs = typeof imgs === 'function' ? imgs(prev) : imgs;
      const combined = [...prev, ...newImgs];
      const unique = Array.from(new Set(combined));
      return unique.slice(0, 3);
    });
  };

  //PATCH
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!activityId) return alert('체험 정보가 없습니다.');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    const schedules: Schedule[] = selectedSlots
      .filter((slot) => slot.date && slot.startTime && slot.endTime)
      .filter((slot) => {
        const slotDate = new Date(slot.date!);
        slotDate.setHours(0, 0, 0, 0);

        //오늘 이전 날짜 제외
        if (slotDate < today) return false;
        //오늘 날짜인데 종료 시간이 현재 시간 이전이면 제외
        if (slotDate.getTime() === today.getTime() && slot.endTime! < now)
          return false;
        return true;
      })
      .map((slot) => ({
        date: slot.date!.toISOString().split('T')[0],
        startTime: `${slot.startTime!.getHours().toString().padStart(2, '0')}:${slot.startTime!.getMinutes().toString().padStart(2, '0')}`,
        endTime: `${slot.endTime!.getHours().toString().padStart(2, '0')}:${slot.endTime!.getMinutes().toString().padStart(2, '0')}`,
      }));

    if (schedules.length === 0) {
      alert('오늘 이전 또는 이미 지난 시간대는 예약할 수 없슷비낟.');
      return;
    }

    const body = {
      title: form.title,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      address: form.address,
      bannerImageUrl: bannerImages[0] || '',
      subImageUrls: introImages,
      schedules,
    };

    try {
      const res = await fetch(`/api/myactivities/${activityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`수정 실패: ${text}`);
      }
      setIsConfirmOpen(true);
    } catch (err) {
      console.error('수정 실패:', err);
      alert('체험 수정에 실패했습니다.');
    }
  };

  const isFormChanged = useMemo(() => {
    if (!initialData) return false;
    return (
      form.title !== initialData.title ||
      form.category !== initialData.category ||
      form.description !== initialData.description ||
      form.address !== initialData.address ||
      Number(form.price) !== initialData.price ||
      JSON.stringify(bannerImages) !==
        JSON.stringify(
          initialData.bannerImageUrl ? [initialData.bannerImageUrl] : []
        ) ||
      JSON.stringify(introImages) !==
        JSON.stringify(initialData.subImageUrls || []) ||
      JSON.stringify(
        selectedSlots.map((s) => ({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
        }))
      ) !== JSON.stringify(initialData.schedules)
    );
  }, [form, bannerImages, introImages, selectedSlots, initialData]);

  return (
    <div className="w-[100%] lg:w-[792px]">
      <form onSubmit={handleSubmit}>
        <MypageHeader
          title="내 체험 수정"
          type="button"
          buttonText="수정하기"
          onClick={handleSubmit}
          disabled={!isFormChanged}
        />

        <FormInput
          id="title"
          name="title"
          type="text"
          placeholder="제목"
          value={form.title}
          onChange={handleChange}
        />
        <Dropdown
          onSelect={(value) =>
            setForm((prev) => ({ ...prev, category: value }))
          }
        >
          <Dropdown.Button color="dropdownPrimary">
            {form.category || '카테고리'}
          </Dropdown.Button>
          <Dropdown.Content color="dropdownPrimary">
            {categoryOptions.map((item) => (
              <Dropdown.Item key={item} color="dropdownPrimary" value={item}>
                {item}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown>

        <FormInput
          id="description"
          name="description"
          variant="textarea"
          placeholder="설명"
          value={form.description}
          onChange={handleChange}
        />

        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">가격</h1>
        <FormInput
          id="price"
          name="price"
          type="text"
          placeholder="가격"
          value={form.price}
          onChange={handleChange}
        />

        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">주소</h1>
        <div className="relative">
          <FormInput
            id="address"
            name="address"
            type="text"
            placeholder="주소를 입력해주세요"
            value={form.address}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setIsPostcodeOpen(true)}
            className="absolute right-3 top-[50%] -translate-y-[50%] bg-gray-100 border border-gray-300 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition"
          >
            주소 검색
          </button>
        </div>

        {isPostcodeOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl shadow-lg w-[90%] max-w-[480px] relative">
              <button
                onClick={() => setIsPostcodeOpen(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-black"
              >
                x
              </button>
              <DaumPostcode onComplete={handleAddressComplete} />
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-[16px]">예약 가능한 시간대</h1>
        <TimeSlots
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
        />

        <ImageUploader
          title="배너이미지"
          images={bannerImages}
          setImages={handleBannerImages}
        />
        <ImageUploader
          title="소개이미지"
          images={introImages}
          setImages={handleIntroImages}
        />
        <p>이미지는 배너 1장, 소개 최대 3장까지 등록 가능합니다.</p>
      </form>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        message="체험 수정이 완료되었습니다"
        className="bg-white"
        onConfirm={() => {
          setIsConfirmOpen(false);
          router.push('/Profile/ExperienceSet');
        }}
      />
    </div>
  );
}
