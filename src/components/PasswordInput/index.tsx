'use client';

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='relative'>
      <label className={`text-primary-400 mb-1 block font-medium`} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`focus:ring-primary-400 w-full rounded-lg border border-neutral-300 p-3 focus:ring-1 focus:outline-none`}
        required={required}
      />
      <button
        type='button'
        onClick={togglePasswordVisibility}
        className='text-primary-600 hover:text-accent-600 absolute top-11 right-3 flex cursor-pointer items-center transition-all'
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
