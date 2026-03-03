import { ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
}

export const Modal = ({
  isOpen,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default'
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="neu-modal-surface w-full max-w-md">
        <header className="border-b border-slate-800/80 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-50">{title}</h2>
        </header>
        <div className="px-5 py-4 text-sm text-slate-200">{children}</div>
        <footer className="flex justify-end space-x-2 border-t border-slate-800/80 px-5 py-3">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              size="sm"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
};

