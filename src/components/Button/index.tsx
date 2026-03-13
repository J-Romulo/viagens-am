import React from 'react';

interface ButtonProps {
  type?: 'submit' | 'button' | 'reset';
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  size?: 'small' | 'large';
}

export function Button({
  type = 'submit',
  className = '',
  onClick,
  disabled = false,
  children = 'Entrar',
  size = 'large',
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`bg-primary-400 hover:bg-primary-500 text-md rounded-lg p-3 font-medium text-white shadow-md transition-all ${disabled ? 'opacity-50' : ''} ${className} ${size === 'small' ? 'w-fit' : 'w-full'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
