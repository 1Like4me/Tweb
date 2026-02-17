import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast: Toast = { id, message, variant };
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast]
  );

  const value = useMemo<ToastContextType>(
    () => ({
      toasts,
      showToast,
      dismissToast
    }),
    [dismissToast, showToast, toasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-0 top-4 z-50 flex flex-col items-center space-y-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-md w-full rounded-lg border px-4 py-3 text-sm shadow-lg shadow-black/40 backdrop-blur-sm transition ${
              toast.variant === 'success'
                ? 'bg-emerald-900/80 border-emerald-600 text-emerald-50'
                : toast.variant === 'error'
                ? 'bg-red-900/80 border-red-600 text-red-50'
                : 'bg-slate-900/80 border-slate-600 text-slate-50'
            }`}
          >
            <div className="flex items-start justify-between space-x-3">
              <span>{toast.message}</span>
              <button
                type="button"
                className="text-xs text-slate-300 hover:text-white"
                onClick={() => dismissToast(toast.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return ctx;
};

