import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    ringColor?: string;
  }
  
export function PasswordInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    required = false,
    ringColor = "primary-400",
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    return (
      <div className="relative h-16">
        <label
          className={`block text-primary-400 font-medium mb-1`}
          htmlFor={id}
        >
          {label}
        </label>
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-${ringColor}`}
          required={required}
        />
        <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-11 flex items-center text-primary-600 hover:text-accent-600 transition-all cursor-pointer"
        >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    );
}