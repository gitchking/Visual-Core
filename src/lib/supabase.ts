import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

// Get the site URL from environment or use current origin
const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

// Debug logging
console.log('🔧 Supabase Configuration Debug:');
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'missing');
console.log('VITE_SITE_URL:', siteUrl);

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl !== 'https://your-project.supabase.co' && 
                           supabaseAnonKey !== 'your-anon-key-here' &&
                           supabaseUrl.startsWith('https://') &&
                           supabaseAnonKey.startsWith('eyJ');

console.log('✅ Has valid credentials:', hasValidCredentials);

// Validate configuration
if (!hasValidCredentials) {
  console.warn('⚠️ Supabase not configured - using local storage fallback');
  console.warn('To enable full authentication, update your .env file with real Supabase credentials:');
  console.warn('1. Go to https://supabase.com and create a project');
  console.warn('2. Get your Project URL and anon key from Settings → API');
  console.warn('3. Update your .env file with the real values');
  console.warn('');
  console.warn('Current values:');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl);
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'missing');
}

export const supabase = hasValidCredentials ? createClient(supabaseUrl, supabaseAnonKey) : null;

console.log('🚀 Supabase client created:', !!supabase);

// Local storage fallback for when Supabase is not configured
const localStorageAuth = {
  getCurrentUser: () => {
    const userStr = localStorage.getItem('localUser');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  setCurrentUser: (user: any) => {
    localStorage.setItem('localUser', JSON.stringify(user));
  },
  
  clearUser: () => {
    localStorage.removeItem('localUser');
  }
};

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData?: { username?: string; full_name?: string; gender?: string }) => {
    if (!hasValidCredentials) {
      // Local fallback
      const user = {
        id: 'local_' + Date.now(),
        email,
        user_metadata: userData || {},
        created_at: new Date().toISOString()
      };
      localStorageAuth.setCurrentUser(user);
      return { data: { user }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${siteUrl}/auth/callback`
        }
      });
      
      // Handle email confirmation case
      if (data?.user && !data.session) {
        return { 
          data, 
          error: { 
            message: 'Please check your email to confirm your account before signing in.' 
          } 
        };
      }
      
      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    if (!hasValidCredentials) {
      // Local fallback - create a mock user
      const user = {
        id: 'local_' + Date.now(),
        email,
        created_at: new Date().toISOString()
      };
      localStorageAuth.setCurrentUser(user);
      return { data: { user }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // Handle email confirmation error
      if (error?.message?.includes('Email not confirmed')) {
        return { 
          data: null, 
          error: { 
            message: 'Please check your email and click the confirmation link before signing in.' 
          } 
        };
      }
      
      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  },

  // Sign in with OAuth (Google, GitHub, etc.)
  signInWithOAuth: async (provider: 'google' | 'github' | 'discord') => {
    if (!hasValidCredentials) {
      return { data: null, error: { message: 'OAuth requires Supabase configuration' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${siteUrl}/auth/callback`
        }
      });
      return { data, error };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return { data: null, error };
    }
  },

  // Sign out
  signOut: async () => {
    if (!hasValidCredentials) {
      localStorageAuth.clearUser();
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    if (!hasValidCredentials) {
      const user = localStorageAuth.getCurrentUser();
      return { user, error: null };
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error };
    }
  },

  // Get current session
  getCurrentSession: async () => {
    if (!hasValidCredentials) {
      const user = localStorageAuth.getCurrentUser();
      return { session: user ? { user } : null, error: null };
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      console.error('Get current session error:', error);
      return { session: null, error };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!hasValidCredentials) {
      // Simple local storage listener
      const checkAuth = () => {
        const user = localStorageAuth.getCurrentUser();
        callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
      };
      
      // Check immediately
      checkAuth();
      
      // Listen for storage changes
      window.addEventListener('storage', checkAuth);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => window.removeEventListener('storage', checkAuth)
          }
        }
      };
    }

    return supabase.auth.onAuthStateChange(callback);
  },

  // Reset password
  resetPassword: async (email: string) => {
    if (!hasValidCredentials) {
      return { data: null, error: { message: 'Password reset requires Supabase configuration' } };
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/reset-password`
      });
      return { data, error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  },

  // Update password
  updatePassword: async (password: string) => {
    if (!hasValidCredentials) {
      return { data: null, error: { message: 'Password update requires Supabase configuration' } };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      });
      return { data, error };
    } catch (error) {
      console.error('Update password error:', error);
      return { data: null, error };
    }
  }
};

// User profile helper functions
export const profiles = {
  // Get user profile
  getProfile: async (userId: string) => {
    if (!hasValidCredentials) {
      // Local fallback
      const profileStr = localStorage.getItem(`profile_${userId}`);
      return { data: profileStr ? JSON.parse(profileStr) : null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    } catch (error) {
      console.error('Get profile error:', error);
      return { data: null, error };
    }
  },

  // Update user profile
  updateProfile: async (userId: string, updates: any) => {
    if (!hasValidCredentials) {
      // Local fallback
      const profileStr = localStorage.getItem(`profile_${userId}`);
      const currentProfile = profileStr ? JSON.parse(profileStr) : {};
      const updatedProfile = { ...currentProfile, ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedProfile));
      return { data: updatedProfile, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  },

  // Create user profile
  createProfile: async (profile: any) => {
    if (!hasValidCredentials) {
      // Local fallback
      const newProfile = { ...profile, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      localStorage.setItem(`profile_${profile.id}`, JSON.stringify(newProfile));
      return { data: newProfile, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Create profile error:', error);
      return { data: null, error };
    }
  }
}; 