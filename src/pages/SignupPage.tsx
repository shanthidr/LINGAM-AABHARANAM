
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Mail, Phone } from 'lucide-react';

// Define safer country codes with proper validation
const countryCodes = [
  { code: '+1', label: 'USA/Canada (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+86', label: 'China (+86)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+7', label: 'Russia (+7)' },
];

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // default +1
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { signup, isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Function to sanitize phone input to only include digits
  const sanitizePhoneInput = (input: string) => {
    return input.replace(/\D/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const sanitized = sanitizePhoneInput(e.target.value);
    setPhoneNumber(sanitized);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters with a mix of letters, numbers, and special characters
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast({
        title: 'Password mismatch',
        description: 'Please make sure both passwords match.',
        variant: 'destructive',
      });
      return;
    }

    // Validate password strength
    if (!validatePassword(password)) {
      toast({
        title: 'Password too weak',
        description: 'Password must be at least 8 characters with letters, numbers, and special characters.',
        variant: 'destructive',
      });
      return;
    }

    // Compose full phone number with country code
    const fullPhone = phoneNumber ? `${countryCode}${phoneNumber}` : '';
    setSubmitting(true);

    try {
      await signup(email, password, name, fullPhone);
      toast({
        title: 'Signup successful',
        description: 'Account created successfully! Please log in to continue.',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.message || 'Please check your details and try again.',
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
            <h1 className="text-2xl font-serif font-medium text-brand-charcoal">Create a New Account</h1>
            <p className="text-gray-600 mt-2">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex">
                <select
                  aria-label="Country code"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-gray-100 border border-gray-300 rounded-l px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  {countryCodes.map((cc) => (
                    <option key={cc.code} value={cc.code}>
                      {cc.label}
                    </option>
                  ))}
                </select>
                <div className="relative flex-grow">
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="123 456 7890"
                    required
                    className="rounded-l-none pl-10"
                    inputMode="tel"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>

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
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters with letters, numbers, and special characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
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
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing up...
                </span>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-brand-gold font-semibold hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
