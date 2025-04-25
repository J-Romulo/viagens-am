import { InputHTMLAttributes } from 'react';

interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  id: string;
  label: string;
  value: Date;
  type?: 'date' | 'datetime-local';
  onChange: (value: Date) => void;
  required?: boolean;
  className?: string;
  errors?: unknown[];
  disabled?: boolean;
}

export function DateInput({
  id,
  label,
  value,
  onChange,
  required = false,
  type = 'date',
  className,
  errors,
  disabled = false,
  ...rest
}: DateInputProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only update if the input has a valid date value
    if (e.target.value) {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    }
  };

  const formatValue = (date: Date) => {
    if (type === 'datetime-local') {
      // Get the local date and time components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    // For date type, we can still use the ISO string since we only care about the date part
    return date.toISOString().split('T')[0];
  };

  return (
    <div className='w-full'>
      <label className={`text-primary-400 mb-1 block font-medium`} htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={formatValue(value)}
        onChange={handleDateChange}
        {...rest}
        required={required}
        disabled={disabled}
        className={`focus:ring-primary-400 w-50 rounded-lg border border-neutral-300 p-3 focus:ring-1 focus:outline-none ${errors && !!errors.length ? 'focus:ring-1 focus:ring-red-400 focus:outline-none' : ''} ${disabled ? 'bg-neutral-100' : ''} ${className}`}
      />

      {errors && !!errors.length && (
        <div className='mt-1 text-sm text-red-500'>
          {errors.map((error, index) => {
            const typedError = error as { message: string };
            return <span key={index}>{typedError.message}</span>;
          })}
        </div>
      )}
    </div>
  );
}
