import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const ServerErrorPage = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Simulate retry by going back
    navigate(-1);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <Card className="border-red-500/40">
          <div className="py-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-4xl font-bold text-slate-50 mb-2">500</h1>
            <h2 className="text-xl font-semibold text-slate-200 mb-4">
              Internal Server Error
            </h2>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              Something went wrong on our end. We're working to fix it. Please try again in a moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="lg" onClick={handleRetry}>
                Try Again
              </Button>
              <Link to="/">
                <Button variant="ghost" size="lg">
                  Go Home
                </Button>
              </Link>
            </div>
            <p className="text-xs text-slate-500 mt-6">
              Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
