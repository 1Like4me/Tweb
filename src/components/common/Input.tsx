import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  iconLeft?: ReactNode;
}

export const Input = ({ label, error, iconLeft, className = '', ...rest }: InputProps) => {
  return (
    <label className="block">
      <span className="neu-field-label">{label}</span>
      <div className={`neu-input-shell ${error ? 'ring-1 ring-red-500/60 border-red-500/60' : ''}`}>
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

