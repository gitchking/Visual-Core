// Local Authentication Service
// This bypasses Supabase and provides simple email/password authentication

interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be hashed
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

class LocalAuthService {
  private users: User[] = [];
  private profiles: Profile[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const usersData = localStorage.getItem('localUsers');
      const profilesData = localStorage.getItem('localProfiles');
      const currentUserData = localStorage.getItem('currentUser');

      if (usersData) {
        this.users = JSON.parse(usersData);
      }
      if (profilesData) {
        this.profiles = JSON.parse(profilesData);
      }
      if (currentUserData) {
        this.currentUser = JSON.parse(currentUserData);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('localUsers', JSON.stringify(this.users));
      localStorage.setItem('localProfiles', JSON.stringify(this.profiles));
      if (this.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string, userData?: { username?: string; full_name?: string; gender?: string }) {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return { data: null, error: { message: 'User with this email already exists' } };
    }

    // Create new user
    const newUser: User = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      password, // In a real app, hash this password
      username: userData?.username,
      full_name: userData?.full_name,
      gender: userData?.gender,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.users.push(newUser);

    // Create profile
    const newProfile: Profile = {
      id: 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      user_id: newUser.id,
      username: userData?.username,
      full_name: userData?.full_name,
      gender: userData?.gender,
      updated_at: new Date().toISOString()
    };

    this.profiles.push(newProfile);
    this.saveToStorage();

    // Auto-login the user
    this.currentUser = newUser;
    this.saveToStorage();

    return { 
      data: { 
        user: newUser, 
        session: { user: newUser } 
      }, 
      error: null 
    };
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const user = this.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      return { data: null, error: { message: 'Invalid email or password' } };
    }

    this.currentUser = user;
    this.saveToStorage();

    return { 
      data: { 
        user, 
        session: { user } 
      }, 
      error: null 
    };
  }

  // Sign out
  async signOut() {
    this.currentUser = null;
    this.saveToStorage();
    return { error: null };
  }

  // Get current user
  async getCurrentUser() {
    return { user: this.currentUser, error: null };
  }

  // Get current session
  async getCurrentSession() {
    return { session: this.currentUser ? { user: this.currentUser } : null, error: null };
  }

  // Get user profile
  async getUserProfile(userId: string) {
    const profile = this.profiles.find(p => p.user_id === userId);
    return { profile, error: null };
  }

  // Update user profile
  async updateProfile(userId: string, profileData: Partial<Profile>) {
    const profileIndex = this.profiles.findIndex(p => p.user_id === userId);
    if (profileIndex === -1) {
      return { profile: null, error: { message: 'Profile not found' } };
    }

    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...profileData,
      updated_at: new Date().toISOString()
    };

    this.saveToStorage();
    return { profile: this.profiles[profileIndex], error: null };
  }

  // Get all users (for admin purposes)
  getAllUsers() {
    return this.users.map(user => ({
      ...user,
      password: undefined // Don't expose passwords
    }));
  }

  // Delete user (for admin purposes)
  deleteUser(userId: string) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    this.profiles = this.profiles.filter(p => p.user_id !== userId);
    
    if (this.currentUser?.id === userId) {
      this.currentUser = null;
    }

    this.saveToStorage();
    return true;
  }

  // Reset password (simple implementation)
  async resetPassword(email: string, newPassword: string) {
    const userIndex = this.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      return { data: null, error: { message: 'User not found' } };
    }

    this.users[userIndex].password = newPassword;
    this.users[userIndex].updated_at = new Date().toISOString();
    this.saveToStorage();

    return { data: { user: this.users[userIndex] }, error: null };
  }
}

// Create singleton instance
export const localAuth = new LocalAuthService();

// Export auth helper functions to match Supabase interface
export const auth = {
  signUp: localAuth.signUp.bind(localAuth),
  signIn: localAuth.signIn.bind(localAuth),
  signOut: localAuth.signOut.bind(localAuth),
  getCurrentUser: localAuth.getCurrentUser.bind(localAuth),
  getCurrentSession: localAuth.getCurrentSession.bind(localAuth),
  getUserProfile: localAuth.getUserProfile.bind(localAuth),
  updateProfile: localAuth.updateProfile.bind(localAuth),
  resetPassword: localAuth.resetPassword.bind(localAuth),
  getAllUsers: localAuth.getAllUsers.bind(localAuth),
  deleteUser: localAuth.deleteUser.bind(localAuth)
}; 