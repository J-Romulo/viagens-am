import { InputHTMLAttributes } from "react";

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    id: string;
    label: string;
    value: Date;
    type?: "date" | "datetime-local";
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
    type = "date",
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
        if (type === "datetime-local") {
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
      <div className="w-full">
        <label
          className={`block text-primary-400 font-medium mb-1`}
          htmlFor={id}
        >
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
            className={`w-50 p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-400 ${errors && !!errors.length ? "focus:outline-none focus:ring-1 focus:ring-red-400" : ""} ${disabled ? "bg-neutral-100 cursor-not-allowed" : ""} ${className}`}
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