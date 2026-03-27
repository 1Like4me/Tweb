import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const Card = ({
  title,
  subtitle,
  actions,
  children,
  footer,
  className = ''
}: CardProps) => {
  return (
    <section className={`card overflow-hidden ${className} flex flex-col`}>
      {(title || actions) && (
        <header className="card-header flex items-start justify-between space-x-3">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-slate-50">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </header>
      )}
      <div className="card-body flex-1">{children}</div>
      {footer && <footer className="card-footer">{footer}</footer>}
    </section>
  );
};

