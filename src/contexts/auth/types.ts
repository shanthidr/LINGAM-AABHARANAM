
import type { Session } from '@supabase/supabase-js';

export type User = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'user' | 'admin';
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
};
