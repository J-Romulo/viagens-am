import React from 'react';

interface ButtonProps {
    type?: 'submit' | 'button' | 'reset';
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

export function Button({ 
    type = "submit", 
    className = "", 
    onClick, 
    disabled = false, 
    children = "Entrar" 
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`w-full bg-primary-400 text-white text-lg font-medium p-3 rounded-lg shadow-md hover:bg-primary-500 transition-all mt-8 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
