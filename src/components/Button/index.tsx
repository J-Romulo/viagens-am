import React from 'react';

interface ButtonProps {
    type?: 'submit' | 'button' | 'reset';
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    size?: "small" | "large";
}

export function Button({ 
    type = "submit", 
    className = "", 
    onClick, 
    disabled = false, 
    children = "Entrar",
    size = "large"
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`bg-primary-400 text-white text-lg font-medium p-3 rounded-lg shadow-md hover:bg-primary-500 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className} ${size === "small" ? "w-fit" : "w-full"}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
