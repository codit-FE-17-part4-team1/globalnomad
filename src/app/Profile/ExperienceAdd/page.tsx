'use client';

import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

import FormInput from '@/components/Input/CustomInput';
import { useInputValue } from '@/hooks/useInputValue';
import Dropdown from '@/components/Dropdown/Dropdown';
import DatePicker from '@/components/datepicker/DatePicker';
import StartTimePicker from '@/components/TimePicker/StartTimePicker';
import EndTimePicker from '@/components/TimePicker/EndTimePicker';
import Image from 'next/image';

export default function Experience() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [form, handleChange] = useInputValue({
    title: '',
    category: '',
    content: '',
    price: '',
    address: '',
  });
  const dummyImages = [
    '/images/street_dance.png',
    '/images/street_dance.png',
    '/images/street_dance.png',
    '/images/street_dance.png',
  ];

  return (
    <div className="w-[832px] p-[20px]">
      <form>
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
          id="title"
          name="title"
          type="text"
          labelText=""
          placeholder="설명"
          value={form.title}
        />
        <h1 className="text-2xl font-bold mb-[16px]">가격</h1>
        <FormInput
          id="title"
          name="title"
          type="text"
          labelText=""
          placeholder="가격"
          value={form.title}
        />
        <h1 className="text-2xl font-bold mb-[16px]">주소</h1>
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
          <ul className="flex space-x-4">
            <li className="w-[379px]">
              <p>날짜</p>
            </li>
            <li className="w-[140px]">
              <p>시작 시간</p>
            </li>
            <li></li>
            <li className="w-[140px]">
              <p>종료 시간</p>
            </li>
          </ul>
          <ul className="flex space-x-4">
            <li className="w-[379px]">
              <DatePicker />
            </li>
            <li className="w-[140px]">
              <StartTimePicker />
            </li>
            <li>
              <p>~</p>
            </li>
            <li className="w-[140px]">
              <EndTimePicker />
            </li>
            <li>
              {/*
            <Image
              src="/icon/btn/plus_time.svg"
              alt="로고"
              fill
              className="object-cover"
            />
            */}
            </li>
          </ul>
        </div>
        <h1 className="text-2xl font-bold mb-[16px] mt-[24px]">배너 이미지</h1>
        <div>
          <ul className="overflow-hidden">
            <li className="relative w-[180px] h-[180px] float-left mr-[24px]">
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

              return (
                <li
                  key={idx}
                  className={`relative w-[180px] h-[180px] float-left rounded-3xl overflow-hidden ${
                    isLastInRow ? 'mr-0 mb-0' : 'mr-[24px] mb-[24px]'
                  }`}
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
        <h1 className="text-2xl font-bold mb-[16px]">소개 이미지</h1>
        <div>
          <ul className="overflow-hidden">
            <li className="relative w-[180px] h-[180px] float-left mr-[24px]">
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

              return (
                <li
                  key={idx}
                  className={`relative w-[180px] h-[180px] float-left rounded-3xl overflow-hidden ${
                    isLastInRow ? 'mr-0 mb-0' : 'mr-[24px] mb-[24px]'
                  }`}
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
