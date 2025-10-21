import clsx from 'clsx';
import Button from '@/components/Button/Button';
import ReservationFilter from './ReservationFilter';
type HeaderType = {
  title: string;
  type?: 'button' | 'filter' | null;
  buttonText?: string;
  onClick?: () => void;
  selected?: string;
  setSelected?: React.Dispatch<React.SetStateAction<string>>;
  selectList?: string[];
  disabled?: boolean;
};
export default function MypageHeader({
  title,
  type = null,
  buttonText,
  onClick,
  selected,
  setSelected,
  selectList,
  disabled = false,
}: HeaderType) {
  return (
    <div
      className={clsx(
        'flex justify-between sticky z-50 top-0 h-[50px] items-start bg-background',
        'xs:h-[62px]'
      )}
    >
      <h2 className={clsx('text-3xl font-bold')}>{title}</h2>
      {/* 기본형 null , button과 filter 타입 선택 가능 */}
      {type === 'button' ? (
        <Button
          color="buttonPrimary"
          onClick={onClick ?? (() => {})}
          disabled={disabled}
          className={clsx(
            'h-12 px-8 rounded-sm',
            disabled && 'cursor-not-allowed'
          )}
        >
          {buttonText}
        </Button>
      ) : type === 'filter' ? (
        <ReservationFilter
          selected={selected}
          setSelected={setSelected!}
          selectList={selectList}
        />
      ) : null}
    </div>
  );
}
