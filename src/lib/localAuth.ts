// SQLite-based Authentication Service
// This provides simple email/password authentication using SQLite

import { getDatabase, initDatabase, saveDatabase } from './database';

interface User {
  id: number;
  email: string;
  password: string;
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: number;
  user_id: number;
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  website?: string;
  updated_at: string;
}

class SQLiteAuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadCurrentUser();
  }

  private async ensureDatabase() {
    await initDatabase();
    return getDatabase();
  }

  private loadCurrentUser() {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }

  private saveCurrentUser() {
    try {
      if (this.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string, userData?: { username?: string; full_name?: string; gender?: string }) {
    try {
      const db = await this.ensureDatabase();
      
      // Check if user already exists
      const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');
      checkStmt.bind([email.toLowerCase()]);
      if (checkStmt.step()) {
        checkStmt.free();
        return { data: null, error: { message: 'User with this email already exists' } };
      }
      checkStmt.free();

      // Create new user
      const insertStmt = db.prepare(`
        INSERT INTO users (email, password, username, full_name, gender, bio, website) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      insertStmt.run([
        email.toLowerCase(),
        password, // In a real app, hash this password
        userData?.username || `user_${Date.now()}`,
        userData?.full_name || '',
        userData?.gender || '',
        '',
        ''
      ]);
      insertStmt.free();

      // Get the created user
      const getUserStmt = db.prepare('SELECT * FROM users WHERE email = ?');
      getUserStmt.bind([email.toLowerCase()]);
      const newUser = getUserStmt.step() ? getUserStmt.getAsObject() : null;
      getUserStmt.free();

      if (!newUser) {
        return { data: null, error: { message: 'Failed to create user' } };
      }

      // Create profile
      const profileStmt = db.prepare(`
        INSERT INTO profiles (user_id, username, full_name, gender) 
        VALUES (?, ?, ?, ?)
      `);
      profileStmt.run([
        newUser.id,
        userData?.username || `user_${Date.now()}`,
        userData?.full_name || '',
        userData?.gender || ''
      ]);
      profileStmt.free();

      saveDatabase();

      // Auto-login the user
      this.currentUser = newUser as User;
      this.saveCurrentUser();

      return { 
        data: { 
          user: newUser, 
          session: { user: newUser } 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: { message: 'Failed to create account' } };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const db = await this.ensureDatabase();
      
      const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
      stmt.bind([email.toLowerCase(), password]);
      
      const user = stmt.step() ? stmt.getAsObject() : null;
      stmt.free();

      if (!user) {
        return { data: null, error: { message: 'Invalid email or password' } };
      }

      this.currentUser = user as User;
      this.saveCurrentUser();

      return { 
        data: { 
          user, 
          session: { user } 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: { message: 'Failed to sign in' } };
    }
  }

  // Sign out
  async signOut() {
    this.currentUser = null;
    this.saveCurrentUser();
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
  async getUserProfile(userId: number) {
    try {
      const db = await this.ensureDatabase();
      
      const stmt = db.prepare('SELECT * FROM profiles WHERE user_id = ?');
      stmt.bind([userId]);
      
      const profile = stmt.step() ? stmt.getAsObject() : null;
      stmt.free();

      return { profile, error: null };
    } catch (error) {
      console.error('Get profile error:', error);
      return { profile: null, error: { message: 'Failed to get profile' } };
    }
  }

  // Update user profile
  async updateProfile(userId: number, profileData: Partial<Profile>) {
    try {
      const db = await this.ensureDatabase();
      
      // Update user table
      const userUpdateFields = [];
      const userUpdateValues = [];
      
      if (profileData.username !== undefined) {
        userUpdateFields.push('username = ?');
        userUpdateValues.push(profileData.username);
      }
      if (profileData.full_name !== undefined) {
        userUpdateFields.push('full_name = ?');
        userUpdateValues.push(profileData.full_name);
      }
      if (profileData.gender !== undefined) {
        userUpdateFields.push('gender = ?');
        userUpdateValues.push(profileData.gender);
      }
      if (profileData.bio !== undefined) {
        userUpdateFields.push('bio = ?');
        userUpdateValues.push(profileData.bio);
      }
      if (profileData.website !== undefined) {
        userUpdateFields.push('website = ?');
        userUpdateValues.push(profileData.website);
      }
      
      if (userUpdateFields.length > 0) {
        userUpdateFields.push('updated_at = CURRENT_TIMESTAMP');
        userUpdateValues.push(userId);
        
        const userStmt = db.prepare(`UPDATE users SET ${userUpdateFields.join(', ')} WHERE id = ?`);
        userStmt.run(userUpdateValues);
        userStmt.free();
      }

      // Update profiles table
      const profileUpdateFields = [];
      const profileUpdateValues = [];
      
      if (profileData.username !== undefined) {
        profileUpdateFields.push('username = ?');
        profileUpdateValues.push(profileData.username);
      }
      if (profileData.full_name !== undefined) {
        profileUpdateFields.push('full_name = ?');
        profileUpdateValues.push(profileData.full_name);
      }
      if (profileData.gender !== undefined) {
        profileUpdateFields.push('gender = ?');
        profileUpdateValues.push(profileData.gender);
      }
      if (profileData.bio !== undefined) {
        profileUpdateFields.push('bio = ?');
        profileUpdateValues.push(profileData.bio);
      }
      if (profileData.website !== undefined) {
        profileUpdateFields.push('website = ?');
        profileUpdateValues.push(profileData.website);
      }
      
      if (profileUpdateFields.length > 0) {
        profileUpdateFields.push('updated_at = CURRENT_TIMESTAMP');
        profileUpdateValues.push(userId);
        
        const profileStmt = db.prepare(`UPDATE profiles SET ${profileUpdateFields.join(', ')} WHERE user_id = ?`);
        profileStmt.run(profileUpdateValues);
        profileStmt.free();
      }

      saveDatabase();

      // Get updated profile
      const { profile } = await this.getUserProfile(userId);
      return { profile, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { profile: null, error: { message: 'Failed to update profile' } };
    }
  }

  // Get all users (for admin purposes)
  async getAllUsers() {
    try {
      const db = await this.ensureDatabase();
      
      const stmt = db.prepare('SELECT id, email, username, full_name, gender, bio, website, created_at, updated_at FROM users');
      const users = [];
      
      while (stmt.step()) {
        const user = stmt.getAsObject();
        users.push({
          ...user,
          password: undefined // Don't expose passwords
        });
      }
      stmt.free();

      return users;
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  }

  // Delete user (for admin purposes)
  async deleteUser(userId: number) {
    try {
      const db = await this.ensureDatabase();
      
      // Delete from profiles first (due to foreign key)
      const profileStmt = db.prepare('DELETE FROM profiles WHERE user_id = ?');
      profileStmt.run([userId]);
      profileStmt.free();

      // Delete from users
      const userStmt = db.prepare('DELETE FROM users WHERE id = ?');
      userStmt.run([userId]);
      userStmt.free();

      saveDatabase();

      // If this was the current user, sign them out
      if (this.currentUser?.id === userId) {
        this.currentUser = null;
        this.saveCurrentUser();
      }

      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }

  // Reset password (simple implementation)
  async resetPassword(email: string, newPassword: string) {
    try {
      const db = await this.ensureDatabase();
      
      const stmt = db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?');
      stmt.run([newPassword, email.toLowerCase()]);
      stmt.free();

      saveDatabase();

      // Get updated user
      const getUserStmt = db.prepare('SELECT * FROM users WHERE email = ?');
      getUserStmt.bind([email.toLowerCase()]);
      const user = getUserStmt.step() ? getUserStmt.getAsObject() : null;
      getUserStmt.free();

      return { data: { user }, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error: { message: 'Failed to reset password' } };
    }
  }
}

// Create singleton instance
export const localAuth = new SQLiteAuthService();

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