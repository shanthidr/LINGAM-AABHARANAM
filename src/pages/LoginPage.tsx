import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        // Redirect to the last admin path the user was on, or dashboard if none
        const lastAdminPath = localStorage.getItem('lastAdminPath');
        navigate(lastAdminPath || '/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: `Welcome back${email.toLowerCase() === 'admin@lingam.com' ? ', Admin! Use password Lingam@2022' : ''}!`,
      });

      // Redirect handled by useEffect
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-medium text-brand-charcoal">Login to Your Account</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-gold hover:bg-brand-gold-dark"
              disabled={isLoading || submitting}
            >
              {isLoading || submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-brand-gold font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              * For admin access use the admin account provided during admin setup.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              * For customer access use any email/password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
