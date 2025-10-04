import clsx from 'clsx';
import Image from 'next/image';

export default function Nodata() {
  return (
    <div
      className={clsx(
        'flex flex-col items-center pt-[60px]',
        'xs:pt-14',
        'md:pt-[86px]'
      )}
    >
      <Image
        width={200}
        height={200}
        src="/images/empty.svg"
        alt="데이터 없음"
        className="md:w-[240px] md:h-[240px]"
      />
      <p className="pt-5 text-2xl font-medium text-gray-700 ">
        아직 등록한 체험이 없어요
      </p>
    </div>
  );
}
