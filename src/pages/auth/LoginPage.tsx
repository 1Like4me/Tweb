import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Mock authentication - check against mock users
      const mockUsers = [
        { email: 'admin@venue.com', password: 'admin123', role: 'admin', name: 'Admin User' },
        { email: 'user@venue.com', password: 'user123', role: 'user', name: 'John Doe' }
      ];

      const user = mockUsers.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Store in localStorage
        localStorage.setItem('auth_token', 'mock-jwt-token');
        localStorage.setItem('current_user', JSON.stringify(user));
        
        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setErrorMessage('Invalid email or password');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md">
        <Card title="Sign In" subtitle="Access your event management dashboard">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="rounded-lg bg-red-900/30 border border-red-600/50 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1.5">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input w-full"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1.5">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input w-full"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-2 text-slate-400">Demo Credentials</span>
              </div>
            </div>

            <div className="space-y-2 rounded-lg bg-slate-800/50 p-3 text-xs text-slate-300">
              <p className="font-semibold text-slate-100">Test Accounts:</p>
              <div className="space-y-1">
                <p><span className="text-brand-400">Admin:</span> admin@venue.com / admin123</p>
                <p><span className="text-brand-400">User:</span> user@venue.com / user123</p>
              </div>
            </div>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
