interface DateInputProps {
    id: string;
    label: string;
    value: Date;
    onChange: (value: Date) => void;
    required?: boolean;
}
  
export function DateInput({
    id,
    label,
    value,
    onChange,
    required = false,
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

    return (
      <div>
        <label
          className={`block text-primary-400 font-medium mb-1`}
          htmlFor={id}
        >
          {label}
        </label>
        <input
            type="date"
            id={id}
            name={id}
            value={value.toISOString().split('T')[0]}
            onChange={handleDateChange}
            min="1900-01-01"
            max={new Date().toISOString().split('T')[0]}
            required={required}
            className={`w-50 p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-400`}
        />
      </div>
    );
}