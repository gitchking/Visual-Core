import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth as localAuth } from '@/lib/localAuth';

interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  website?: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  profile: Profile | null;
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
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { user } = await localAuth.getCurrentUser();
      const { session } = await localAuth.getCurrentSession();
      
      setSession(session);
      setUser(user);
      
      if (user) {
        await loadProfile(user.id);
      }
      
      setLoading(false);
    };

    getInitialSession();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { profile, error } = await localAuth.getUserProfile(userId);
      if (error) {
        console.error('Error loading profile:', error);
        // If profile doesn't exist, create one
        await createDefaultProfile(userId);
      } else {
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const createDefaultProfile = async (userId: string) => {
    try {
      const { profile, error } = await localAuth.updateProfile(userId, {
        username: `user_${userId.slice(0, 8)}`,
        full_name: '',
        bio: '',
        website: ''
      });
      
      if (!error && profile) {
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const result = await localAuth.signUp(email, password, userData);
    if (result.data?.user) {
      setUser(result.data.user);
      setSession(result.data.session);
      await loadProfile(result.data.user.id);
    }
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await localAuth.signIn(email, password);
    if (result.data?.user) {
      setUser(result.data.user);
      setSession(result.data.session);
      await loadProfile(result.data.user.id);
    }
    return result;
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    // OAuth not supported in local auth, return error
    return { data: null, error: { message: 'OAuth not supported in local authentication mode' } };
  };

  const signOut = async () => {
    const result = await localAuth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    return result;
  };

  const resetPassword = async (email: string) => {
    // For local auth, we'll just return success (in real app, you'd send email)
    return { data: { message: 'Password reset email sent' }, error: null };
  };

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('No user logged in');
    const { profile, error } = await localAuth.updateProfile(user.id, updates);
    if (!error && profile) {
      setProfile(profile);
    }
    return { data: profile, error };
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