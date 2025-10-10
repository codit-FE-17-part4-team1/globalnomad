'use client';

import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

import FormInput from '@/components/Input/CustomInput';
import { useInputValue } from '@/hooks/useInputValue';
import Dropdown from '@/components/Dropdown/Dropdown';
import DatePicker from '@/components/datepicker/DatePicker';
import StartTimePicker from '@/components/TimePicker/StartTimePicker';
import EndTimePicker from '@/components/TimePicker/EndTimePicker';
import MypageHeader from '@/app/Profile/_components/MypageHeader/MypageHeader';
import Image from 'next/image';

export default function Experience() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [form, handleChange] = useInputValue({
    title: '',
    category: '',
    content: '',
    price: '',
    address: '',
    description: '',
  });
  const dummyImages = [
    '/images/street_dance.png',
    '/images/street_dance.png',
    '/images/street_dance.png',
    '/images/street_dance.png',
  ];

  return (
    <div className="w-[100%] lg:w-[792px]">
      <form>
        <MypageHeader
          title="내 체험 등록"
          type="button"
          buttonText="등록하기"
          onClick={() => {}}
        />
        <FormInput
          id="title"
          name="title"
          type="text"
          labelText=""
          placeholder="제목"
          value={form.title}
        />
        <Dropdown>
          <Dropdown.Button color="dropdownPrimary">카테고리</Dropdown.Button>
          <Dropdown.Content color="dropdownPrimary">
            <Dropdown.Item color="dropdownPrimary" value="문화예술">
              문화예술
            </Dropdown.Item>
            <Dropdown.Item color="dropdownPrimary" value="식음료">
              식음료
            </Dropdown.Item>
            <Dropdown.Item color="dropdownPrimary" value="스포츠">
              스포츠
            </Dropdown.Item>
            <Dropdown.Item color="dropdownPrimary" value="투어">
              투어
            </Dropdown.Item>
            <Dropdown.Item color="dropdownPrimary" value="관광">
              관광
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
        <FormInput
          id="description"
          name="description"
          variant="textarea"
          labelText=""
          placeholder="설명"
          value={form.description}
        />
        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">가격</h1>
        <FormInput
          id="title"
          name="title"
          type="text"
          labelText=""
          placeholder="가격"
          value={form.title}
        />
        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">주소</h1>
        <FormInput
          id="title"
          name="title"
          type="text"
          labelText=""
          placeholder="주소를 입력해주세요"
          value={form.title}
        />

        <h1 className="text-2xl font-bold mb-[16px]">예약 가능한 시간대</h1>
        <div>
          <ul className="flex">
            <li className="w-[130px] md:w-[149px] lg:w-[379px] mr-[4px] pb-[8px] md:pb-[10px] lg:mr-[20px] lg:pb-[10px]">
              <p className="text-lg text-[#4b4b4b] md:text-xl lg:text-xl">
                날짜
              </p>
            </li>
            <li className="w-[79px] md:w-[104px] lg:w-[140px] pb-[8px] lg:mr-[38px] lg:pb-[10px]">
              <p className="text-lg text-[#4b4b4b] md:text-xl lg:text-xl">
                시작 시간
              </p>
            </li>
            <li></li>
            <li className="w-[79px] md:w-[104px]lg:w-[140px] pb-[8px] lg:pb-[10px]">
              <p className="text-lg text-[#4b4b4b] md:text-xl lg:text-xl">
                종료 시간
              </p>
            </li>
          </ul>
          <ul className="flex">
            <li className="w-[130px] md:w-[30%] lg:w-[379px] mr-[4px] lg:mr-[20px]">
              <DatePicker className="w-[130px] lg:w-[379px]" />
            </li>
            <li className="w-[79px] md:w-[18%] lg:w-[140px]">
              <StartTimePicker />
            </li>
            <li className="hidden lg:block px-[12px]">
              <p className="leading-[56px]">~</p>
            </li>
            <li className="w-[79px] md:w-[18%] lg:w-[140px]">
              <EndTimePicker />
            </li>
            <li className="w-[56px] h-[56px] relative ml-auto">
              <Image
                src="/icon/btn/plus_time.svg"
                alt="로고"
                fill
                className=""
              />
            </li>
          </ul>
        </div>

        <h1 className="text-xl font-bold mb-[16px] mt-[24px] lg:text-2xl">
          배너 이미지
        </h1>
        <div>
          <ul className="overflow-hidden">
            <li className="relative aspect-square w-[49%] float-left mb-[8px] lg:w-[180px] lg:mr-[24px] lg:mb-[24px]">
              <Image
                src="/icon/btn/img.svg"
                alt="로고"
                fill
                className="object-cover"
              />
            </li>

            {dummyImages.map((src, idx) => {
              const position = idx + 2;
              const isLastInRow = position % 4 === 0;
              const isEven = position % 2 === 0;

              return (
                <li
                  key={idx}
                  className={`relative aspect-square w-[49%] mb-[8px] lg:w-[180px] lg:mb-[24px] rounded-3xl overflow-hidden float-left ${
                    isEven ? 'float-right lg:float-left' : 'float-left'
                  } ${isLastInRow ? 'mr-0 mb-0' : 'lg:mr-[24px]'}`}
                >
                  <Image
                    src={src}
                    alt={`이미지-${idx}`}
                    fill
                    className="object-cover"
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <h1 className="text-xl font-bold mb-[16px] lg:text-2xl">소개 이미지</h1>
        <div>
          <ul className="overflow-hidden">
            <li className="relative aspect-square w-[49%] float-left mb-[8px] lg:w-[180px] lg:mr-[24px] lg:mb-[24px]">
              <Image
                src="/icon/btn/img.svg"
                alt="로고"
                fill
                className="object-cover"
              />
            </li>

            {dummyImages.map((src, idx) => {
              const position = idx + 2;
              const isLastInRow = position % 4 === 0;
              const isEven = position % 2 === 0;

              return (
                <li
                  key={idx}
                  className={`relative aspect-square w-[49%] mb-[8px] lg:w-[180px] lg:mb-[24px] rounded-3xl overflow-hidden float-left ${
                    isEven ? 'float-right lg:float-left' : 'float-left'
                  } ${isLastInRow ? 'mr-0 mb-0' : 'lg:mr-[24px]'}`}
                >
                  <Image
                    src={src}
                    alt={`이미지-${idx}`}
                    fill
                    className="object-cover"
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <p>이미지는 최대 4개까지 등록 가능합니다.</p>
      </form>
    </div>
  );
}
