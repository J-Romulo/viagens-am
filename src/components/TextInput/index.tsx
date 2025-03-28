interface TextInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    ringColor?: string;
}
  
export function TextInput({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    ringColor = 'primary-400',
}: TextInputProps) {
    return (
      <div>
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
          className={`w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-${ringColor}`}
          required={required}
        />
      </div>
    );
}