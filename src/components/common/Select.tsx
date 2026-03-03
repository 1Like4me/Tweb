import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  iconLeft?: ReactNode;
}

export const Select = ({
  label,
  error,
  iconLeft,
  className = '',
  children,
  ...rest
}: SelectProps) => {
  return (
    <label className="block">
      <span className="neu-field-label">{label}</span>
      <div className={`neu-input-shell ${error ? 'ring-1 ring-red-500/60 border-red-500/60' : ''}`}>
        {iconLeft && <span className="mr-2 text-slate-400">{iconLeft}</span>}
        <select
          className={`w-full bg-transparent text-slate-50 focus:outline-none ${className}`}
          {...rest}
        >
          {children}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
};

