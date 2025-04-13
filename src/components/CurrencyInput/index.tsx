import { moneyMask, parseCurrencyStrToNumber } from "../../utils/masks";

interface CurrencyInputProps {
    id: string;
    label: string;
    value: number | string;
    onChange: (value: { value: string, floatValue: number }) => void;
}
  
export function CurrencyInput({
    id,
    label,
    value,
    onChange,
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
      <div className="w-full">
        <label
          className={`block text-primary-400 font-medium mb-1`}
          htmlFor={id}
        >
          {label}
        </label>
        <div className="flex flex-row items-center gap-x-2">
            <span className="text-primary-500 font-bold">R$</span>
            <input
                {...rest}
                id={id}
                value={moneyMask(value.toFixed(2))}
                onChange={(e) => handleChangeValue(e.target.value)}
                className={`w-40 p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-400`}
            />
        </div>
      </div>
    );
}