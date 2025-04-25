interface TextInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  errors?: unknown[];
  maxLength?: number;
  disabled?: boolean;
}

export function TextInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className,
  errors,
  maxLength = 255,
  disabled = false,
}: TextInputProps) {
  return (
    <div className='w-full'>
      <label className={`text-primary-400 mb-1 block font-medium`} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`focus:ring-primary-400 w-full rounded-lg border border-neutral-300 p-3 focus:ring-1 focus:outline-none ${errors && !!errors.length ? 'focus:ring-1 focus:ring-red-400 focus:outline-none' : ''} ${disabled ? 'bg-neutral-100' : ''} ${className}`}
        required={required}
        disabled={disabled}
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
