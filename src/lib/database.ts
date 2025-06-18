import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

interface User {
  id: string;
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
  id: string;
  user_id: string;
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  website?: string;
  updated_at: string;
}

interface CreateUserData {
  id: string;
  email: string;
  password: string;
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  website?: string;
}

interface UpdateProfileData {
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  website?: string;
}

export const initDatabase = async () => {
  console.log('Initializing database...');
  if (!db) {
    console.log('Loading SQL.js...');
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
    console.log('SQL.js loaded');

    console.log('Setting up database...');
    // Try to load existing database from localStorage
    const savedDb = localStorage.getItem('visualflow-db');
    if (savedDb) {
      console.log('Loading existing database from localStorage...');
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
      // Check if migration is needed
      await checkAndMigrateDatabase();
      console.log('Existing database loaded and migrated');
    } else {
      console.log('Creating new database...');
      db = new SQL.Database();
      await initializeTables();
      console.log('New database created');
    }
  }

  console.log('Database ready');
  return db;
};

const checkAndMigrateDatabase = async () => {
  console.log('Checking database migration...');
  // Check if website_url column exists in threads table
  try {
    const stmt = db.prepare("PRAGMA table_info(threads)");
    const columns = [];
    while (stmt.step()) {
      columns.push(stmt.getAsObject());
    }
    stmt.free();
    
    console.log('Threads table columns:', columns);
    const hasWebsiteUrl = columns.some((col: { name: string }) => col.name === 'website_url');
    if (!hasWebsiteUrl) {
      console.log('Adding website_url column to threads table...');
      db.run('ALTER TABLE threads ADD COLUMN website_url TEXT');
      saveDatabase();
      console.log('website_url column added');
    } else {
      console.log('website_url column already exists');
    }
  } catch (error) {
    console.log('Error checking/migrating database:', error);
  }

  // Add default user if not exists
  try {
    console.log('Checking for default user...');
    db.run(`
      INSERT INTO users (id, username, email) 
      VALUES (1, 'default_user', 'default@example.com')
    `);
    saveDatabase();
    console.log('Default user added');
  } catch (error) {
    // User already exists, ignore error
    console.log('Default user already exists or error adding it:', error);
  }
  console.log('Database migration completed');
};

const initializeTables = async () => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT,
      full_name TEXT,
      gender TEXT,
      bio TEXT,
      website TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Migration: add password column if missing
  try {
    db.run('ALTER TABLE users ADD COLUMN password TEXT');
  } catch (error) {
    if (!(error instanceof Error && error.message.includes('duplicate column name'))) {
      console.log('Error adding password column:', error);
    }
  }

  // Profiles table
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      username TEXT UNIQUE,
      full_name TEXT,
      gender TEXT,
      avatar_url TEXT,
      bio TEXT,
      website TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Add default user if not exists
  try {
    db.run(`
      INSERT INTO users (id, username, email) 
      VALUES (1, 'default_user', 'default@example.com')
    `);
    
    // Add default profile
    db.run(`
      INSERT INTO profiles (user_id, username, full_name, gender) 
      VALUES (1, 'default_user', 'Default User', 'prefer-not-to-say')
    `);
  } catch (error) {
    // User already exists, ignore error
    console.log('Default user already exists or error adding it:', error);
  }

  // Todos table
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      priority TEXT DEFAULT 'medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Flow data table
  db.run(`
    CREATE TABLE IF NOT EXISTS flows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      flow_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Community threads table
  db.run(`
    CREATE TABLE IF NOT EXISTS threads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT,
      website_url TEXT,
      upvotes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Add website_url column to existing threads table if it doesn't exist
  try {
    db.run('ALTER TABLE threads ADD COLUMN website_url TEXT');
  } catch (error) {
    // Column already exists, ignore error
    console.log('website_url column already exists or error adding it:', error);
  }

  // Studio announcements table
  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT,
      published BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDatabase();
};

export const saveDatabase = () => {
  if (db) {
    const data = db.export();
    localStorage.setItem('visualflow-db', JSON.stringify(Array.from(data)));
  }
};

export const getDatabase = () => db;

// User management functions
export const userService = {
  async init() {
    if (!db) {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('nodehub_db');
      if (savedDb) {
        const uint8Array = new Uint8Array(savedDb.split(',').map(Number));
        db = new SQL.Database(uint8Array);
      } else {
        db = new SQL.Database();
        createTables();
      }
    }
  },

  createUser(userData: CreateUserData) {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const now = new Date().toISOString();
      const stmt = db.prepare(`
        INSERT INTO users (id, email, password, username, full_name, gender, bio, website, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        userData.id,
        userData.email,
        userData.password,
        userData.username || null,
        userData.full_name || null,
        userData.gender || null,
        userData.bio || null,
        userData.website || null,
        now,
        now
      ]);
      
      stmt.free();
      
      // Create profile
      const profileStmt = db.prepare(`
        INSERT INTO profiles (id, user_id, username, full_name, gender, bio, website, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      profileStmt.run([
        `profile_${userData.id}`,
        userData.id,
        userData.username || null,
        userData.full_name || null,
        userData.gender || null,
        userData.bio || null,
        userData.website || null,
        now
      ]);
      
      profileStmt.free();
      
      // Save to localStorage
      const data = db.export();
      localStorage.setItem('nodehub_db', Array.from(data).toString());
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: 'Failed to create user' } };
    }
  },

  getUserById(userId: string) {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      stmt.run([userId]);
      const result = stmt.getAsObject() as User;
      stmt.free();
      
      if (result && result.id) {
        return { user: result, error: null };
      } else {
        return { user: null, error: { message: 'User not found' } };
      }
    } catch (error) {
      return { user: null, error: { message: 'Failed to get user' } };
    }
  },

  authenticateUser(email: string, password: string) {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
      stmt.run([email, password]);
      const result = stmt.getAsObject() as User;
      stmt.free();
      
      if (result && result.id) {
        return { user: result, error: null };
      } else {
        return { user: null, error: { message: 'Invalid email or password' } };
      }
    } catch (error) {
      return { user: null, error: { message: 'Authentication failed' } };
    }
  },

  userExists(email: string) {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
      stmt.run([email]);
      const result = stmt.getAsObject() as { count: number };
      stmt.free();
      
      return result.count > 0;
    } catch (error) {
      return false;
    }
  },

  getUserProfile(userId: string) {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const stmt = db.prepare('SELECT * FROM profiles WHERE user_id = ?');
      stmt.run([userId]);
      const result = stmt.getAsObject() as Profile;
      stmt.free();
      
      if (result && result.id) {
        return { profile: result, error: null };
      } else {
        return { profile: null, error: { message: 'Profile not found' } };
      }
    } catch (error) {
      return { profile: null, error: { message: 'Failed to get profile' } };
    }
  },

  updateProfile(userId: string, updates: UpdateProfileData) {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const now = new Date().toISOString();
      const fields = Object.keys(updates).filter(key => updates[key as keyof UpdateProfileData] !== undefined);
      
      if (fields.length === 0) {
        return { success: false, error: { message: 'No updates provided' } };
      }
      
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updates[field as keyof UpdateProfileData]).concat([now, userId]);
      
      const stmt = db.prepare(`
        UPDATE profiles 
        SET ${setClause}, updated_at = ?
        WHERE user_id = ?
      `);
      
      stmt.run(values);
      stmt.free();
      
      // Also update user table if username or full_name changed
      const userFields = ['username', 'full_name'].filter(field => updates[field as keyof UpdateProfileData] !== undefined);
      if (userFields.length > 0) {
        const userSetClause = userFields.map(field => `${field} = ?`).join(', ');
        const userValues = userFields.map(field => updates[field as keyof UpdateProfileData]).concat([now, userId]);
        
        const userStmt = db.prepare(`
          UPDATE users 
          SET ${userSetClause}, updated_at = ?
          WHERE id = ?
        `);
        
        userStmt.run(userValues);
        userStmt.free();
      }
      
      // Save to localStorage
      const data = db.export();
      localStorage.setItem('nodehub_db', Array.from(data).toString());
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: 'Failed to update profile' } };
    }
  },

  getAllUsers() {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
      const results: User[] = [];
      
      while (stmt.step()) {
        results.push(stmt.getAsObject() as User);
      }
      
      stmt.free();
      return { users: results, error: null };
    } catch (error) {
      return { users: [], error: { message: 'Failed to get users' } };
    }
  },

  deleteUser(userId: string) {
    if (!db) throw new Error('Database not initialized');
    
    try {
      // Delete profile first (foreign key constraint)
      const profileStmt = db.prepare('DELETE FROM profiles WHERE user_id = ?');
      profileStmt.run([userId]);
      profileStmt.free();
      
      // Delete user
      const userStmt = db.prepare('DELETE FROM users WHERE id = ?');
      userStmt.run([userId]);
      userStmt.free();
      
      // Save to localStorage
      const data = db.export();
      localStorage.setItem('nodehub_db', Array.from(data).toString());
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: 'Failed to delete user' } };
    }
  },

  searchUsers(query: string) {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const stmt = db.prepare(`
        SELECT * FROM users 
        WHERE email LIKE ? OR username LIKE ? OR full_name LIKE ?
        ORDER BY created_at DESC
      `);
      
      const searchTerm = `%${query}%`;
      stmt.run([searchTerm, searchTerm, searchTerm]);
      
      const results: User[] = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject() as User);
      }
      
      stmt.free();
      return { users: results, error: null };
    } catch (error) {
      return { users: [], error: { message: 'Failed to search users' } };
    }
  }
};

function createTables() {
  if (!db) throw new Error('Database not initialized');
  
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT,
      full_name TEXT,
      gender TEXT,
      bio TEXT,
      website TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  
  // Create profiles table
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      username TEXT,
      full_name TEXT,
      gender TEXT,
      bio TEXT,
      website TEXT,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
  
  // Create admin user if not exists
  const adminExists = userService.userExists('admin@nodehub.com');
  if (!adminExists) {
    userService.createUser({
      id: 'admin_user',
      email: 'admin@nodehub.com',
      password: 'admin123',
      username: 'admin',
      full_name: 'Administrator',
      bio: 'System Administrator'
    });
  }
}
