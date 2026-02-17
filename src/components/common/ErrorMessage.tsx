interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-red-700 bg-red-950/70 px-3 py-2 text-xs text-red-100">
      {message}
    </div>
  );
};

