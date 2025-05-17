
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { User, AuthContextType } from './types';
import { buildUser } from './userUtils';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const NavigationWrapper = ({ children }: { children: ReactNode }) => {
  return children;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Store the current path to localStorage when it changes via regular DOM API instead of useLocation
  useEffect(() => {
    const storeAdminPath = () => {
      const currentPath = window.location.hash.substring(1); // Get path from hash router
      if (currentPath.startsWith('/admin') && user?.role === 'admin') {
        localStorage.setItem('lastAdminPath', currentPath);
      }
    };

    // Call once on mount
    storeAdminPath();

    // Set up listener for hash changes
    window.addEventListener('hashchange', storeAdminPath);
    return () => {
      window.removeEventListener('hashchange', storeAdminPath);
    };
  }, [user?.role]);

  useEffect(() => {
    // Initial check - get session first
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // First check for hardcoded admin in localStorage
        const storedAdminEmail = localStorage.getItem('adminEmail');
        if (storedAdminEmail === 'admin@lingam.com') {
          console.log('[AuthContext] Restoring hardcoded admin from localStorage');
          setUser({
            id: 'hardcoded-admin',
            email: 'admin@lingam.com',
            role: 'admin',
          });
          setSession(null);
          setIsLoading(false);
          return;
        }

        // Otherwise, check for Supabase session
        const { data } = await supabase.auth.getSession();
        console.log('[AuthContext] Initial getSession:', data.session);
        setSession(data.session);
        
        if (data.session?.user) {
          const currentUser = await buildUser(data.session.user);
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[AuthContext] onAuthStateChange event:', _event, 'session:', session);
      setSession(session);
      if (session?.user) {
        setUser(null);
        setIsLoading(true);
        setTimeout(async () => {
          try {
            const currentUser = await buildUser(session.user);
            setUser(currentUser);
          } catch (error) {
            console.error('[AuthContext] Error building user:', error);
            setUser(null);
          } finally {
            setIsLoading(false);
          }
        }, 0);
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
        // Clear stored admin data on explicit sign out
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('lastAdminPath');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('[AuthContext] login attempt for:', email);

    // For hardcoded admin email, skip supabase login and mock user
    if (email.toLowerCase() === 'admin@lingam.com' && password === 'Lingam@2022') {
      console.log('[AuthContext] Hardcoded admin login success for:', email);
      // Store admin email in localStorage for persistence
      localStorage.setItem('adminEmail', email.toLowerCase());
      // No session, but set user state directly for admin to let app behave normally
      setUser({
        id: 'hardcoded-admin',
        email: email,
        role: 'admin',
      });
      setSession(null);
      setIsLoading(false);
      return;
    }

    // Regular Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('[AuthContext] login error:', error.message);
      setIsLoading(false);
      if (error.message.includes('Invalid login credentials') || error.message.includes('No user found')) {
        throw new Error('Invalid email or password.');
      }
      throw error;
    }

    if (data.session?.user) {
      const loggedUser = await buildUser(data.session.user);
      setUser(loggedUser);
      setSession(data.session);
    }

    setIsLoading(false);
  };

  const signup = async (email: string, password: string, name?: string, phone?: string) => {
    setIsLoading(true);
    
    try {
      // Create the user in Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || null,
            phone: phone || null,
          },
        },
      });

      if (error) {
        console.error('[AuthContext] signup error:', error.message);
        throw error;
      }

      // Create or update the user's profile in the profiles table
      if (data.user) {
        console.log('[AuthContext] Creating profile for user:', data.user.id, 'with phone:', phone);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email,
            full_name: name || null,
            phone: phone || null,
            role: 'user',
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('[AuthContext] Error creating user profile:', profileError);
        }
      }
    } catch (error) {
      console.error('[AuthContext] Signup process failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    // Clear any stored admin data
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('lastAdminPath');
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsLoading(false);
    
    // Use window.location instead of navigate
    window.location.href = '/#/';
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        session,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
