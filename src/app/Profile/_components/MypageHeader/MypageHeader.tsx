import clsx from 'clsx';
import Button from '@/components/Button/Button';
type HeaderType = {
  title: string;
  type?: 'button' | 'filter' | null;
  buttonText?: string;
  onClick?: () => void;
};
export default function MypageHeader({
  title,
  type = null,
  buttonText,
  onClick,
}: HeaderType) {
  return (
    <div
      className={clsx(
        'flex justify-between sticky z-50 top-0 h-[50px] items-start',
        'xs:h-[62px]'
      )}
    >
      <h2 className={clsx('text-3xl font-bold')}>{title}</h2>
      {/* 기본형 null , button과 filter 타입 선택 가능 */}
      {type === 'button' ? (
        <Button
          color="buttonPrimary"
          onClick={onClick ?? (() => {})}
          className="h-12 px-8 rounded-sm"
        >
          {buttonText}
        </Button>
      ) : type === 'filter' ? (
        <select></select>
      ) : null}
    </div>
  );
}
