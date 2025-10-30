'use client';

import 'react-datepicker/dist/react-datepicker.css';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import FormInput from '@/components/Input/CustomInput';
import { useInputValue } from '@/hooks/useInputValue';
import Dropdown from '@/components/Dropdown/Dropdown';
import MypageHeader from '@/app/Profile/_components/MypageHeader/MypageHeader';
//import ImageUploader from '@/app/Profile/_components/ImageUploader/ImageUploader';
import ImageUploaderAdd from '@/app/Profile/_components/ImageUploader/ImageUploaderAdd';
import DaumPostcode from 'react-daum-postcode';
import TimeSlots, {
  TimeSlot,
} from '@/app/Profile/_components/TimeSlots/TimeSlots';
import ConfirmModal from '@/components/Modal/ConfirmModal';

export default function ExperienceAdd() {
  const router = useRouter();
  const [form, setForm, handleChange] = useInputValue({
    title: '',
    category: '',
    content: '',
    price: '',
    address: '',
    description: '',
  });

  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [subImages, setSubImages] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleAddressComplete = (data: { address: string }) => {
    setForm((prev) => ({ ...prev, address: data.address }));
    setIsPostcodeOpen(false);
  };

  const isFormValid = useMemo(() => {
    /*
    const { title, category, price, address, description } = form;

    const baseValid =
      title.trim() &&
      category.trim() &&
      price.trim() &&
      address.trim() &&
      description.trim();

    const imagesValid = bannerImages.length > 0 && subImages.length > 0;
    const timeValid = selectedSlots.length > 0;

    return !!(baseValid && imagesValid && timeValid);
    */

    return !!(
      form.title &&
      form.category &&
      form.description &&
      form.price &&
      form.address &&
      bannerImages.length &&
      //subImages.length &&
      selectedSlots.length
    );
  }, [form, bannerImages, selectedSlots]);

  const handleSubmit = async (e?: React.FormEvent) => {
    //if (e) e.preventDefault();
    e?.preventDefault();
    if (!isFormValid) return alert('필수 항목을 입력해주세요');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    let hasInvalidTime = false;

    const schedules = selectedSlots
      .filter((slot) => slot.date && slot.startTime && slot.endTime)
      /*
      .filter((slot) => {
        const slotDate = new Date(slot.date!);
        slotDate.setHours(0, 0, 0, 0);
        if (slotDate < today) return false;
        if (slotDate.getTime() === today.getTime() && slot.endTime! < now)
          return false;
        return true;
      })
        */
      .map((slot) => {
        //const date = slot.date!.toISOString().split('T')[0];
        /*
        const date = `${slot.date!.getFullYear()}-${(slot.date!.getMonth() + 1)
          .toString()
          .padStart(
            2,
            '0'
          )}-${slot.date!.getDate().toString().padStart(2, '0')}`;
        const formatTime = (d: Date) =>
          `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        return {
          date,
          startTime: formatTime(slot.startTime!),
          endTime: formatTime(slot.endTime!),
        };*/

        const slotDate = new Date(slot.date!);
        slotDate.setHours(0, 0, 0, 0);

        const startTime = slot.startTime!;
        const endTime = slot.endTime!;

        if (slotDate < today) {
          hasInvalidTime = true;
          return null;
        }

        if (
          slotDate.getTime() === today.getTime() &&
          (endTime.getHours() < now.getHours() ||
            (endTime.getHours() === now.getHours() &&
              endTime.getMinutes() <= now.getMinutes()))
        ) {
          hasInvalidTime = true;
          return null;
        }

        const formatTime = (d: Date) =>
          `${d.getHours().toString().padStart(2, '0')}:${d
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;

        return {
          date: `${slot.date!.getFullYear()}-${(slot.date!.getMonth() + 1)
            .toString()
            .padStart(
              2,
              '0'
            )}-${slot.date!.getDate().toString().padStart(2, '0')}`,
          startTime: formatTime(startTime),
          endTime: formatTime(endTime),
        };
      })
      .filter(Boolean) as {
      date: string;
      startTime: string;
      endTime: string;
    }[];

    if (hasInvalidTime) {
      alert('오늘 이전 또는 이미 지난 시간대는 등록할 수 없음');
      return;
    }

    /*
    if (schedules.length === 0) {
      alert('오늘 이전 또는 이미 지난 시간대는 예약할 수 없슷비낟.');
      return;
    }
    */

    if (!schedules.length) return alert('예약 가능한 시간대를 선택해주세요');

    /*
    const getValidUrl = (url: string) =>
      url.startsWith('blob:')
        ? 'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/default.png'
        : url;
    */

    console.log('bannerImages:', bannerImages);
    console.log('subImages:', subImages);

    const body = {
      title: form.title,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      address: form.address,
      //bannerImageUrl: getValidUrl(bannerImages[0] || ''),
      bannerImageUrl: bannerImages[0] || '',
      //subImages: subImages.map((url) => ({ imageUrl: getValidUrl(url) })),
      subImageUrls: subImages,
      schedules,
    };

    try {
      const res = await fetch('/api/myactivities-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //credentials: 'include',
        body: JSON.stringify(body),
      });
      /*
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`서버 오류 (${res.status})\n${text}`);
      }
        */
      if (!res.ok) throw new Error(await res.text());
      setIsConfirmOpen(true);
    } catch (err) {
      console.error('체험등록실패:', err);
      alert('체험 등록에 실패했습니다');
    }
  };

  const categoryOptions = [
    '문화 · 예술',
    '식음료',
    '스포츠',
    '투어',
    '관광',
    '웰빙',
  ];

  return (
    <div className="w-[100%] lg:w-[792px]">
      <form onSubmit={handleSubmit}>
        <MypageHeader
          title="내 체험 등록"
          type="button"
          buttonText="등록하기"
          onClick={handleSubmit}
          disabled={!isFormValid}
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
                <>{item}</>
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
          placeholder="가격 (특수문자 사용 불가)"
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
        <ImageUploaderAdd
          title=""
          images={bannerImages}
          setImages={setBannerImages}
          maxCount={1}
        />
        <p className="mb-[16px]">배너 이미지는 1개까지 등록 가능합니다.</p>
        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">
          소개이미지(선택)
        </h1>
        <ImageUploaderAdd
          title=""
          images={subImages}
          setImages={setSubImages}
          maxCount={4}
        />
        <p>소개 이미지는 최대 4개까지 등록 가능합니다.</p>
      </form>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        message="체험 등록이 완료되었습니다"
        className="bg-white"
        onConfirm={() => {
          setIsConfirmOpen(false);
          router.push('/Profile/ExperienceSet');
        }}
      />
    </div>
  );
}
