'use client';

import 'react-datepicker/dist/react-datepicker.css';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FormInput from '@/components/Input/CustomInput';
import { useInputValue } from '@/hooks/useInputValue';
import Dropdown from '@/components/Dropdown/Dropdown';
import MypageHeader from '@/app/Profile/_components/MypageHeader/MypageHeader';
import ImageUploaderEdit from '@/app/Profile/_components/ImageUploader/ImageUploaderEdit';
import DaumPostcode from 'react-daum-postcode';
import TimeSlots, {
  TimeSlot,
} from '@/app/Profile/_components/TimeSlots/TimeSlots';
import ConfirmModal from '@/components/Modal/ConfirmModal';

interface Schedule {
  id?: number;
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
  subImages?: { id: number; imageUrl: string }[];
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
  //const [subImages, setSubImages] = useState<string[]>([]);
  const [subImages, setSubImages] = useState<{ id?: number; url: string }[]>(
    []
  );

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
        //setSubImages(data.subImageUrls || []);
        setSubImages(
          data.subImages
            ? data.subImages.map((img) => ({ id: img.id, url: img.imageUrl }))
            : []
        );

        const slots: TimeSlot[] = (data.schedules || []).map((s, i) => ({
          id: s.id ?? i,
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
  /*
  const handleBannerImages = (imgs: string[]) => {
    setBannerImages(imgs.slice(0, 1));
  };
  */
  const handleBannerImages: React.Dispatch<React.SetStateAction<string[]>> =
    setBannerImages;

  const handleSubImages = (urls: { id?: number; url: string }[]) => {
    setSubImages(urls);
  };

  //PATCH
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!activityId) return alert('체험 정보가 없습니다.');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    let hasInvalidTime = false;
    const schedulesToAdd: {
      date: string;
      startTime: string;
      endTime: string;
    }[] = [];
    const scheduleIdsToRemove: number[] = [];

    (initialData?.schedules || []).forEach((schedule) => {
      if (schedule.id !== undefined) scheduleIdsToRemove.push(schedule.id);
    });

    selectedSlots.forEach((slot) => {
      if (!slot.date || !slot.startTime || !slot.endTime) return;

      const dateStr = `${slot.date.getFullYear()}-${(slot.date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${slot.date.getDate().toString().padStart(2, '0')}`;
      const startTimeStr = `${slot.startTime.getHours().toString().padStart(2, '0')}:${slot.startTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      const endTimeStr = `${slot.endTime.getHours().toString().padStart(2, '0')}:${slot.endTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      const slotDate = new Date(slot.date);
      slotDate.setHours(0, 0, 0, 0);

      if (
        slotDate < today ||
        (slotDate.getTime() === today.getTime() && slot.endTime < now)
      ) {
        hasInvalidTime = true;
        return;
      }

      schedulesToAdd.push({
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
      });
    });

    if (hasInvalidTime) {
      alert('오늘 이전 또는 이미 지난 시간대는 등록할 수 없습니다.');
      return;
    }

    const subImageIdsToRemove = initialData?.subImages
      ? initialData.subImages
          .map((img) => img.id)
          .filter((id) => !subImages.find((s) => s.id === id))
      : [];
    const subImageUrlsToAdd = subImages.filter((s) => !s.id).map((s) => s.url);

    const body = {
      title: form.title,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      address: form.address,
      bannerImageUrl: bannerImages[0] || '',
      //subImageUrls: subImages,
      //schedules,
      subImageIdsToRemove,
      subImageUrlsToAdd,
      scheduleIdsToRemove,
      schedulesToAdd,
    };

    console.log('PATCH 요청 보내기 전 body:', JSON.stringify(body, null, 2));
    console.log('schedulesToAdd:', schedulesToAdd);
    console.log('scheduleIdsToRemove:', scheduleIdsToRemove);

    try {
      const res = await fetch(`/api/myactivities/${activityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());
      setIsConfirmOpen(true);
    } catch (err) {
      console.error('수정 실패:', err);
      alert('체험 수정에 실패했습니다.');
    }
  };

  const isFormChanged = useMemo(() => {
    if (!initialData) return false;
    const initialBanner = initialData.bannerImageUrl
      ? [initialData.bannerImageUrl]
      : [];
    const initialSubImages =
      initialData.subImages?.map((s) => s.imageUrl) || [];

    const currentSlots = selectedSlots.map((s) => ({
      date: s.date?.toISOString().split('T')[0] ?? '',
      startTime: s.startTime
        ? `${s.startTime.getHours().toString().padStart(2, '0')}:${s.startTime.getMinutes().toString().padStart(2, '0')}`
        : '',
      endTime: s.endTime
        ? `${s.endTime.getHours().toString().padStart(2, '0')}:${s.endTime.getMinutes().toString().padStart(2, '0')}`
        : '',
    }));
    const initialSlots = initialData.schedules.map((s) => ({
      date: s.date,
      startTime: s.startTime.padStart(5, '0'),
      endTime: s.endTime.padStart(5, '0'),
    }));
    return (
      form.title !== initialData.title ||
      form.category !== initialData.category ||
      form.description !== initialData.description ||
      form.address !== initialData.address ||
      Number(form.price) !== initialData.price ||
      JSON.stringify(bannerImages) !== JSON.stringify(initialBanner) ||
      JSON.stringify(subImages.map((s) => s.url)) !==
        JSON.stringify(initialSubImages) ||
      JSON.stringify(currentSlots) !== JSON.stringify(initialSlots)
    );
  }, [form, bannerImages, subImages, selectedSlots, initialData]);

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

        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">
          가격 <span className="text-red-600">*</span>
        </h1>
        <FormInput
          id="price"
          name="price"
          type="text"
          placeholder="가격"
          value={form.price}
          onChange={handleChange}
        />

        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">
          주소 <span className="text-red-600">*</span>
        </h1>
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

        <h1 className="text-2xl font-bold mb-[16px]">
          예약 가능한 시간대 <span className="text-red-600">*</span>
        </h1>
        <TimeSlots
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
        />

        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">
          배너이미지 <span className="text-red-600">*</span>
        </h1>
        <ImageUploaderEdit
          title=""
          images={bannerImages}
          setImages={handleBannerImages}
          maxCount={1}
        />
        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">소개이미지</h1>
        <ImageUploaderEdit
          title=""
          images={subImages}
          setImages={setSubImages}
          maxCount={4}
        />
        <p>이미지는 최대 4개까지 등록 가능합니다.</p>
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
