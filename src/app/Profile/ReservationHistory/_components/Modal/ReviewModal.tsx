'use client';
import Image from 'next/image';
import Modal from '@/components/Modal/BaseModal';
import StarButton from '@/app/Profile/ReservationHistory/_components/StarButton';
import CustomInput from '@/components/Input/CustomInput';

type ModalType = {
  isRawOpen: boolean;
  setRawOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ReviewModal({ isRawOpen, setRawOpen }: ModalType) {
  const REVIEWSTAR = 5;
  return (
    <Modal
      isOpen={isRawOpen}
      onClose={() => setRawOpen(false)}
      size="md"
      title="후기작성"
      className="bg-white"
    >
      <div className="p-6 relative">
        <div className="sticky top-6 flex justify-between items-center mb-10">
          {/* <h2 className="text-xl font-semibold">후기 작성</h2> */}
          <button onClick={() => setRawOpen(false)}>
            <Image
              src="/icon/btn/X_lg.svg"
              width={40}
              height={40}
              alt="모달 닫기"
            />
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex">
            <Image
              src="/images/street_dance.png"
              width={126}
              height={126}
              alt="체험 사진"
              className="rounded-xl"
            />
            <div className="flex flex-col gap-3 flex-auto pl-6 ">
              <h3 className="text-[20px] font-bold">
                함께 배우면 즐거운 스트릿 댄스
              </h3>
              <p className="text-2lg">날짜</p>
              <hr className=" opacity-20" />
              <p className="text-3xl font-bold">10000</p>
            </div>
          </div>
          <div className="flex gap-2 justify-center items-center">
            {[...Array(REVIEWSTAR)].map((_, i) => (
              <StarButton key={i} />
            ))}
          </div>
          <CustomInput
            id="description"
            name="description"
            variant="textarea"
            labelText=""
            placeholder="후기를 작성해주세요"
            // value={form.description}
            // onChange={handleChange}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setRawOpen(false)}
            className="w-full h-12 rounded bg-[var(--color-green-dark)] text-white"
          >
            작성하기
          </button>
        </div>
      </div>
    </Modal>
  );
}
