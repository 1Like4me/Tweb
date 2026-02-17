import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  maxLength?: number;
}

export const Textarea = ({
  label,
  error,
  maxLength,
  value,
  className = '',
  ...rest
}: TextareaProps) => {
  const length = typeof value === 'string' ? value.length : 0;
  return (
    <label className="block text-sm font-medium text-slate-200">
      <span className="mb-1 inline-block">{label}</span>
      <textarea
        className={`mt-1 w-full rounded-lg border bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
          error ? 'border-red-500' : 'border-slate-700'
        } ${className}`}
        maxLength={maxLength}
        value={value}
        {...rest}
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400">
        {error && <p className="text-red-400">{error}</p>}
        {maxLength && (
          <p>
            {length}/{maxLength}
          </p>
        )}
      </div>
    </label>
  );
};

