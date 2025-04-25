import { moneyMask, parseCurrencyStrToNumber } from '../../utils/masks';

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: { value: string; floatValue: number }) => void;
  disabled?: boolean;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  disabled = false,
  ...rest
}: CurrencyInputProps) {
  if (typeof value === 'string') {
    value = parseCurrencyStrToNumber(value);
  }

  function handleChangeValue(input: string) {
    const value = moneyMask(input);
    const floatValue = parseCurrencyStrToNumber(value);

    onChange({ value, floatValue });
  }

  return (
    <div className='w-full'>
      <label className={`text-primary-400 mb-1 block font-medium`} htmlFor={id}>
        {label}
      </label>
      <div className='flex flex-row items-center gap-x-2'>
        <span className='text-primary-500 font-bold'>R$</span>
        <input
          {...rest}
          id={id}
          value={moneyMask(value.toFixed(2))}
          onChange={(e) => handleChangeValue(e.target.value)}
          className={`focus:ring-primary-400 w-40 rounded-lg border border-neutral-300 p-3 focus:ring-1 focus:outline-none ${disabled ? 'bg-neutral-100' : ''}`}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
