export const Footer = () => {
  return (
    <footer className="neu-footer-shell mt-8">
      <div className="page-container flex flex-col items-center justify-between space-y-3 py-4 text-xs text-slate-400 md:flex-row md:space-y-0">
        <p>
          © {new Date().getFullYear()} Elegance Venue. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>Contact: +40 700 000 000</span>
          <span>Email: contact@elegance-venue.com</span>
          <span className="text-slate-500">
            Designed for academic demo (React + TypeScript)
          </span>
        </div>
      </div>
    </footer>
  );
};

