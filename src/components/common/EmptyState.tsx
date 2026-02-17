import { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  icon?: ReactNode;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onActionClick,
  icon
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 px-6 py-10 text-center">
      {icon && <div className="text-3xl text-slate-500">{icon}</div>}
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      {description && (
        <p className="max-w-md text-xs text-slate-400">{description}</p>
      )}
      {actionLabel && onActionClick && (
        <Button size="sm" variant="primary" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

