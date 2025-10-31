'use client';

import { useState } from 'react';
//import Image from 'next/image';
import DatePickerComponent from '@/components/TimePicker/DatePicker';
import StartTimePicker from '@/components/TimePicker/StartTimePicker';
import EndTimePicker from '@/components/TimePicker/EndTimePicker';
import '@/components/datepicker/datePicker.css';

export interface TimeSlot {
  id: number;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
}

interface TimeSlotsProps {
  selectedSlots: TimeSlot[];
  setSelectedSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  onChange?: (slots: TimeSlot[]) => void;
}

export default function TimeSlots({
  selectedSlots,
  setSelectedSlots,
  onChange,
}: TimeSlotsProps) {
  const [newSlot, setNewSlot] = useState<TimeSlot>({
    id: 0,
    date: null,
    startTime: null,
    endTime: null,
  });

  const handleAddTimeSlot = () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) return;
    const slotToAdd = { ...newSlot, id: Date.now() };
    const updatedSlots = [...selectedSlots, slotToAdd];
    setSelectedSlots(updatedSlots);
    onChange?.(updatedSlots);

    setNewSlot({ id: 0, date: null, startTime: null, endTime: null });
  };

  const handleDeleteTimeSlot = (id: number) => {
    const updatedSlots = selectedSlots.filter((slot) => slot.id !== id);
    setSelectedSlots(updatedSlots);
    onChange?.(updatedSlots);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    const yy = date.getFullYear().toString().slice(2);
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yy}/${mm}/${dd}`;
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  return (
    <div className="space-y-2">
      {/*
      <ul className="flex mb-2">
        <li className="w-[130px] md:w-[149px] lg:w-[379px] mr-[4px] lg:mr-[20px]">
          <p className="text-lg text-[#4b4b4b] md:text-xl">날짜</p>
        </li>
        <li className="w-[79px] md:w-[104px] lg:w-[140px] mr-[38px]">
          <p className="text-lg text-[#4b4b4b] md:text-xl">시작 시간</p>
        </li>
        <li className="hidden lg:block px-[12px]" />
        <li className="w-[79px] md:w-[104px] lg:w-[140px]">
          <p className="text-lg text-[#4b4b4b] md:text-xl">종료 시간</p>
        </li>
      </ul>

      <ul className="flex mb-4 items-center">
        <li className="w-[130px] md:w-[30%] lg:w-[379px] mr-[4px] lg:mr-[20px]">
          <DatePickerComponent
            className="w-[130px] lg:w-[379px]"
            selected={newSlot.date ?? undefined}
            onChange={(date: Date | null) =>
              setNewSlot((prev) => ({ ...prev, date }))
            }
          />
        </li>

        <li className="w-[79px] md:w-[18%] lg:w-[140px]">
          <StartTimePicker
            className="w-[79px] lg:w-[140px]"
            value={newSlot.startTime}
            onChange={(time) =>
              setNewSlot((prev) => ({ ...prev, startTime: time }))
            }
          />
        </li>

        <li className="hidden lg:block px-[12px]">
          <p className="leading-[56px]">~</p>
        </li>

        <li className="w-[79px] md:w-[18%] lg:w-[140px]">
          <EndTimePicker
            className="w-[79px] lg:w-[140px]"
            value={newSlot.endTime}
            onChange={(time) =>
              setNewSlot((prev) => ({ ...prev, endTime: time }))
            }
          />
        </li>

        <li
          className="w-[56px] h-[56px] relative ml-auto cursor-pointer"
          onClick={handleAddTimeSlot}
        >
          <Image src="/icon/btn/plus_time.svg" alt="추가" fill />
        </li>
      </ul>
       */}
      <ul className="flex items-center w-full mb-2">
        <li className="flex-[4]">
          <p className="text-lg text-[#4b4b4b] md:text-xl">날짜</p>
        </li>
        <li className="flex-[2]">
          <p className="text-lg text-[#4b4b4b] md:text-xl">시작 시간</p>
        </li>
        <li className="flex-[2]">
          <p className="text-lg text-[#4b4b4b] md:text-xl">종료 시간</p>
        </li>
        <li className="w-[56px]"></li>
      </ul>

      <ul className="flex items-center w-full gap-2 mb-4">
        <li className="flex-[4]">
          <DatePickerComponent
            className="w-full h-[56px]"
            value={newSlot.date ?? undefined}
            onChange={(date: Date | null) =>
              setNewSlot((prev) => ({ ...prev, date }))
            }
          />
        </li>

        <li className="flex-[2]">
          <StartTimePicker
            className="w-full h-[56px]"
            value={newSlot.startTime}
            onChange={(time) =>
              setNewSlot((prev) => ({ ...prev, startTime: time }))
            }
          />
        </li>

        <li className="flex-[2]">
          <EndTimePicker
            className="w-full h-[56px]"
            value={newSlot.endTime}
            onChange={(time) =>
              setNewSlot((prev) => ({ ...prev, endTime: time }))
            }
          />
        </li>

        <li
          className="w-[56px] h-[56px] flex-none cursor-pointer"
          onClick={handleAddTimeSlot}
        >
          <div className="h-full w-full flex items-center justify-center border rounded-sm bg-[#0b3d2d]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-[56px] w-[56px] text-white"
            >
              <path
                fillRule="evenodd"
                d="M12 5a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h5V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </li>
      </ul>

      {/* 
      {selectedSlots.map((slot) => (
        <ul key={slot.id} className="flex mb-3 items-center">
          <li className="w-[130px] md:w-[30%] lg:w-[379px] mr-[4px] lg:mr-[20px] py-[15px] px-[16px] border rounded-sm">
            <p>{formatDate(slot.date)}</p>
          </li>

          <li className="w-[79px] md:w-[18%] lg:w-[140px] py-[15px] border rounded-sm">
            <p>{formatTime(slot.startTime)}</p>
          </li>

          <li className="hidden lg:block px-[12px]">
            <p className="leading-[56px]">~</p>
          </li>

          <li className="w-[79px] md:w-[18%] lg:w-[140px] py-[15px] border rounded-sm">
            <p>{formatTime(slot.endTime)}</p>
          </li>

          <li
            className="w-[56px] h-[56px] relative ml-auto cursor-pointer"
            onClick={() => handleDeleteTimeSlot(slot.id)}
          >
            <Image src="/icon/btn/minus_time.svg" alt="삭제" fill />
          </li>
        </ul>
      ))}
       */}

      {selectedSlots.map((slot) => (
        <ul key={slot.id} className="flex items-center w-full gap-2 mb-3">
          <li className="flex-[4] py-[15px] px-[16px] border rounded-sm">
            <p>{formatDate(slot.date)}</p>
          </li>

          <li className="flex-[2] py-[15px] px-[8px] border rounded-sm">
            <p>{formatTime(slot.startTime)}</p>
          </li>

          <li className="flex-[2] py-[15px] px-[8px] border rounded-sm">
            <p>{formatTime(slot.endTime)}</p>
          </li>

          <li className="w-[56px] h-[56px] flex-none cursor-pointer">
            <div
              className="h-full w-full flex items-center justify-center border rounded-sm"
              onClick={() => handleDeleteTimeSlot(slot.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-[56px] w-[56px] text-[#79747e]"
              >
                <path
                  fillRule="evenodd"
                  d="M6 12a1 1 0 011-1h10a1 1 0 110 2H7a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
}
