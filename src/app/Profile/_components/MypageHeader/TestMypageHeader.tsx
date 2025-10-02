import MypageHeader from '@/app/Profile/_components/MypageHeader/MypageHeader';

export default function TestMypageHeader() {
  return (
    <div>
      {/* 기본형: 타이틀만 있는 경우 title 한개만 써줌*/}
      <MypageHeader title="마이페이지 타이틀" />

      {/* 버튼형: 버튼과 타이틀 있는 경우 */}
      {/* title써주고 type="button"으로 지정,  buttonText에 버튼에 들어갈 텍스트 적어줌, onClick에 기능 작성  */}
      <MypageHeader
        title="마이페이지 타이틀"
        type="button"
        buttonText="버튼"
        onClick={() => {}}
      />
      {/* filter의 경우 이후 개발 예정 */}
    </div>
  );
}
