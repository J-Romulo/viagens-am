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
}: TextInputProps) {
    return (
      <div className="w-full">
        <label
          className={`block text-primary-400 font-medium mb-1`}
          htmlFor={id}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-400 ${errors && !!errors.length ? "focus:outline-none focus:ring-1 focus:ring-red-400" : ""} ${className}`}
          required={required}
        />
        {errors && !!errors.length && (
            <div className="text-red-500 text-sm mt-1">
                {errors.map((error, index) => {
                    const typedError = error as { message: string };
                    return <span key={index}>{typedError.message}</span>;
                })}
            </div>
        )}
      </div>
    );
}