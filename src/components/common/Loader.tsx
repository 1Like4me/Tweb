interface LoaderProps {
  fullScreen?: boolean;
  label?: string;
}

export const Loader = ({ fullScreen, label = 'Loading...' }: LoaderProps) => {
  const spinner = (
    <div className="flex items-center space-x-3 text-sm text-slate-300">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <span>{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

