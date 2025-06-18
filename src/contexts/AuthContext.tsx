import React, { createContext, useContext, useEffect, useState } from 'react';
import { userService } from '@/lib/database';

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
    // Get initial session from localStorage (for persistence across page reloads)
    const getInitialSession = async () => {
      try {
        const currentUserId = localStorage.getItem('currentUserId');
        if (currentUserId) {
          const { user } = userService.getUserById(currentUserId);
          if (user) {
            setUser(user);
            setSession({ user });
            await loadProfile(user.id);
          }
        }
      } catch (error) {
        console.error('Error loading initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { profile, error } = userService.getUserProfile(userId);
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
      const { success, error } = userService.updateProfile(userId, {
        username: `user_${userId.slice(0, 8)}`,
        full_name: '',
        bio: '',
        website: ''
      });
      
      if (success) {
        const { profile } = userService.getUserProfile(userId);
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      // Check if user already exists
      const exists = userService.userExists(email);
      if (exists) {
        return { data: null, error: { message: 'User with this email already exists' } };
      }

      // Create new user
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const { success, error } = userService.createUser({
        id: userId,
        email,
        password,
        username: userData?.username,
        full_name: userData?.full_name,
        gender: userData?.gender,
        bio: userData?.bio,
        website: userData?.website
      });

      if (success) {
        const { user } = userService.getUserById(userId);
        const { profile } = userService.getUserProfile(userId);
        
        setUser(user);
        setSession({ user });
        setProfile(profile);
        
        // Store current user ID in localStorage for persistence
        localStorage.setItem('currentUserId', userId);
        
        return { 
          data: { 
            user, 
            session: { user } 
          }, 
          error: null 
        };
      } else {
        return { data: null, error };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user, error } = userService.authenticateUser(email, password);
      if (user) {
        setUser(user);
        setSession({ user });
        await loadProfile(user.id);
        
        // Store current user ID in localStorage for persistence
        localStorage.setItem('currentUserId', user.id);
        
        return { 
          data: { 
            user, 
            session: { user } 
          }, 
          error: null 
        };
      } else {
        return { data: null, error };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    // OAuth not supported in SQLite auth, return error
    return { data: null, error: { message: 'OAuth not supported in SQLite authentication mode' } };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem('currentUserId');
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    // For SQLite auth, we'll just return success (in real app, you'd send email)
    return { data: { message: 'Password reset email sent' }, error: null };
  };

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('No user logged in');
    try {
      const { success, error } = userService.updateProfile(user.id, updates);
      if (success) {
        const { profile } = userService.getUserProfile(user.id);
        setProfile(profile);
        return { data: profile, error: null };
      } else {
        return { data: null, error };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
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