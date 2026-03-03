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
    <label className="block">
      <span className="neu-field-label">{label}</span>
      <div className={`neu-input-shell items-start ${error ? 'ring-1 ring-red-500/60 border-red-500/60' : ''}`}>
        <textarea
          className={`mt-0.5 w-full resize-none bg-transparent text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none ${className}`}
          maxLength={maxLength}
          value={value}
          {...rest}
        />
      </div>
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

