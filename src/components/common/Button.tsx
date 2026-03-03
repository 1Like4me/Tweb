import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}: ButtonProps) => {
  const base =
    'inline-flex items-center justify-center rounded-2xl font-medium transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed shadow-[var(--neu-shadow-soft)] active:shadow-[var(--neu-shadow-inset)]';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 text-slate-950 hover:from-brand-300 hover:via-brand-400 hover:to-brand-600',
    secondary:
      'bg-gradient-to-br from-slate-800 to-slate-900 text-slate-50 hover:from-slate-700 hover:to-slate-900 border border-slate-600/70',
    ghost:
      'bg-transparent text-slate-100 hover:bg-slate-900/70 border border-transparent shadow-none active:shadow-[var(--neu-shadow-inset)]',
    danger:
      'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white hover:from-red-400 hover:via-red-500 hover:to-red-700'
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
      )}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

