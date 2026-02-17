import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const ForbiddenPage = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <Card className="border-red-500/40">
          <div className="py-8">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-4xl font-bold text-slate-50 mb-2">403</h1>
            <h2 className="text-xl font-semibold text-slate-200 mb-4">
              Access Forbidden
            </h2>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              You don't have permission to access this page. This area is restricted to administrators only.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard">
                <Button variant="primary" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="lg">
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
