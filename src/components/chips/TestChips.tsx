import Chips from '@/components/Chips/Chips';

export default function ChipTest() {
  // color옵션 'white' 이 기본 'blue' | 'gray' | 'orange' | 'red'중 선택 사용
  // variant옵션 'normal'이 기본, round 선택 가능
  <>
    <Chips color="white">선택</Chips>
    <Chips color="blue">선택</Chips>
    <Chips color="gray">선택</Chips>
    <Chips color="orange">선택</Chips>
    <Chips color="orange" variant="round">
      예약확정
    </Chips>
    <Chips color="red" variant="round">
      예약거절
    </Chips>
  </>;
}
