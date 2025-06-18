import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { auth, profiles } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'discord') => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updateProfile: (updates: any) => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await auth.getCurrentSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await profiles.getProfile(userId);
      if (error) {
        console.error('Error loading profile:', error);
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          await createDefaultProfile(userId);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const createDefaultProfile = async (userId: string) => {
    try {
      const { data, error } = await profiles.createProfile({
        id: userId,
        username: `user_${userId.slice(0, 8)}`,
        full_name: '',
        avatar_url: '',
        bio: '',
        website: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    return await auth.signUp(email, password, userData);
  };

  const signIn = async (email: string, password: string) => {
    return await auth.signIn(email, password);
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    return await auth.signInWithOAuth(provider);
  };

  const signOut = async () => {
    return await auth.signOut();
  };

  const resetPassword = async (email: string) => {
    return await auth.resetPassword(email);
  };

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('No user logged in');
    const { data, error } = await profiles.updateProfile(user.id, updates);
    if (!error && data) {
      setProfile(data);
    }
    return { data, error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 