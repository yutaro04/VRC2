/**
 * 再利用可能なボタンコンポーネント
 */

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800',
  secondary: 'bg-white border-gray-900 text-gray-900 hover:bg-gray-50',
  danger: 'bg-white border-red-500 text-red-500 hover:bg-red-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'border-2 rounded-lg font-normal transition-colors disabled:opacity-50 flex items-center gap-2';
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={styles} disabled={disabled} {...props}>
      {icon}
      {children}
    </button>
  );
}
