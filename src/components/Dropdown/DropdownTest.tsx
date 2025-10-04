'use client';

import Dropdown from './Dropdown';
import Image from 'next/image';

export default function DropdownTest() {
  return (
    <div className="relative p-10">
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
      <br />
      <Dropdown>
        <Dropdown.Button color="dropdownSecondary">가격</Dropdown.Button>
        <Dropdown.Content color="dropdownSecondary">
          <Dropdown.Item color="dropdownSecondary" value="가격이 낮은 순">
            가격이 낮은 순
          </Dropdown.Item>
          <Dropdown.Item color="dropdownSecondary" value="가격이 높은 순">
            가격이 높은 순
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <br />
      <Dropdown>
        <Dropdown.Button color="dropdownTertiary">필터</Dropdown.Button>
        <Dropdown.Content color="dropdownTertiary">
          <Dropdown.Item color="dropdownTertiary" value="예약 신청">
            예약 신청
          </Dropdown.Item>
          <Dropdown.Item color="dropdownTertiary" value="예약 취소">
            예약 취소
          </Dropdown.Item>
          <Dropdown.Item color="dropdownTertiary" value="예약 승인">
            예약 승인
          </Dropdown.Item>
          <Dropdown.Item color="dropdownTertiary" value="예약 거절">
            예약 거절
          </Dropdown.Item>
          <Dropdown.Item color="dropdownTertiary" value="체험 완료">
            체험 완료
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <br />
      <Dropdown>
        <Dropdown.Button color="dropdownSet">
          <div className="relative w-[160px] h-[40px]">
            <Image src="/icon/btn/meatball.svg" alt="드롭다운셋" fill />
          </div>
        </Dropdown.Button>
        <Dropdown.Content color="dropdownSet">
          <Dropdown.Item color="dropdownSet" value="수정하기">
            수정하기
          </Dropdown.Item>
          <Dropdown.Item color="dropdownSet" value="삭제하기">
            삭제하기
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
