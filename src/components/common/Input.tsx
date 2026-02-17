import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  iconLeft?: ReactNode;
}

export const Input = ({ label, error, iconLeft, className = '', ...rest }: InputProps) => {
  return (
    <label className="block text-sm font-medium text-slate-200">
      <span className="mb-1 inline-block">{label}</span>
      <div
        className={`flex items-center rounded-lg border bg-slate-900/70 px-3 py-2 text-sm shadow-inner shadow-black/40 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 ${
          error ? 'border-red-500' : 'border-slate-700'
        }`}
      >
        {iconLeft && <span className="mr-2 text-slate-400">{iconLeft}</span>}
        <input
          className={`w-full bg-transparent text-slate-50 placeholder:text-slate-500 focus:outline-none ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
};

