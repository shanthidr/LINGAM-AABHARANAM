
import { supabase } from '@/integrations/supabase/client';
import type { User } from './types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export const fetchUserRole = async (userId: string, email?: string): Promise<'user' | 'admin'> => {
  console.log('[AuthContext] fetchUserRole called for userId:', userId, 'email:', email);

  if (!userId) return 'user';

  // For admin email, directly assign admin role without querying profiles for demo purposes
  if (email?.toLowerCase() === 'admin@lingam.com') {
    console.log('[AuthContext] Assigning admin role for hardcoded admin email:', email);
    return 'admin';
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('[AuthContext] Error fetching role from profiles:', error.message);
      return 'user';
    }

    return data?.role === 'admin' ? 'admin' : 'user';
  } catch (err) {
    console.error('[AuthContext] Exception while fetching role:', err);
    return 'user';
  }
};

export const fetchUserPhone = async (userId: string): Promise<string | undefined> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', userId)
      .single();
    if (error || !data) {
      console.warn('[AuthContext] No phone or error fetching phone:', error?.message);
      return undefined;
    }
    return data.phone ?? undefined;
  } catch (err) {
    console.error('[AuthContext] Exception while fetching phone:', err);
    return undefined;
  }
};

export const buildUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
  if (!supabaseUser) return null;

  const role = await fetchUserRole(supabaseUser.id, supabaseUser.email ?? '');
  const phone = await fetchUserPhone(supabaseUser.id);

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: supabaseUser.user_metadata?.full_name ?? undefined,
    phone,
    role,
  };
};
