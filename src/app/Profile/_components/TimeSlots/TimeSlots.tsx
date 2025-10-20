'use client';

import { useState } from 'react';
import Image from 'next/image';
import DatePickerComponent from '@/components/datepicker/DatePicker';
import StartTimePicker from '@/components/TimePicker/StartTimePicker';
import EndTimePicker from '@/components/TimePicker/EndTimePicker';

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

  return (
    <div>
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

      {selectedSlots.map((slot) => (
        <ul key={slot.id} className="flex mb-3 items-center">
          <li className="w-[130px] md:w-[30%] lg:w-[379px] mr-[4px] lg:mr-[20px] py-[15px] px-[16px] border rounded-sm">
            <p>
              {slot.date
                ? `${slot.date.getFullYear().toString().slice(2)}/${(
                    slot.date.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, '0')}/${slot.date
                    .getDate()
                    .toString()
                    .padStart(2, '0')}`
                : '-'}
            </p>
          </li>

          <li className="w-[79px] md:w-[18%] lg:w-[140px] py-[15px] border rounded-sm">
            <p>
              {slot.startTime?.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </p>
          </li>

          <li className="hidden lg:block px-[12px]">
            <p className="leading-[56px]">~</p>
          </li>

          <li className="w-[79px] md:w-[18%] lg:w-[140px] py-[15px] border rounded-sm">
            <p>
              {slot.endTime?.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </p>
          </li>

          <li
            className="w-[56px] h-[56px] relative ml-auto cursor-pointer"
            onClick={() => handleDeleteTimeSlot(slot.id)}
          >
            <Image src="/icon/btn/minus_time.svg" alt="삭제" fill />
          </li>
        </ul>
      ))}
    </div>
  );
}
