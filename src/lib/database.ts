import initSqlJs from 'sql.js';

let SQL: any = null;
let db: any = null;

export const initDatabase = async () => {
  console.log('Initializing database...');
  if (!SQL) {
    console.log('Loading SQL.js...');
    SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
    console.log('SQL.js loaded');
  }

  if (!db) {
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
    const hasWebsiteUrl = columns.some((col: any) => col.name === 'website_url');
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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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
  // Create a new user
  createUser: (userData: {
    id: string;
    email: string;
    password: string;
    username?: string;
    full_name?: string;
    gender?: string;
    bio?: string;
    website?: string;
  }) => {
    const db = getDatabase();
    const now = new Date().toISOString();
    
    try {
      db.run(`
        INSERT INTO users (id, email, password, username, full_name, gender, bio, website, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userData.id,
        userData.email.toLowerCase(),
        userData.password,
        userData.username || null,
        userData.full_name || null,
        userData.gender || null,
        userData.bio || null,
        userData.website || null,
        now,
        now
      ]);

      // Create profile
      db.run(`
        INSERT INTO profiles (id, user_id, username, full_name, gender, bio, website, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'profile_' + userData.id,
        userData.id,
        userData.username || null,
        userData.full_name || null,
        userData.gender || null,
        userData.bio || null,
        userData.website || null,
        now
      ]);

      return { success: true, error: null };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    }
  },

  // Get user by email and password
  authenticateUser: (email: string, password: string) => {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare(`
        SELECT * FROM users 
        WHERE email = ? AND password = ?
      `);
      stmt.bind([email.toLowerCase(), password]);
      
      if (stmt.step()) {
        const user = stmt.getAsObject();
        stmt.free();
        return { user, error: null };
      }
      
      stmt.free();
      return { user: null, error: { message: 'Invalid email or password' } };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { user: null, error };
    }
  },

  // Get user by ID
  getUserById: (userId: string) => {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      stmt.bind([userId]);
      
      if (stmt.step()) {
        const user = stmt.getAsObject();
        stmt.free();
        return { user, error: null };
      }
      
      stmt.free();
      return { user: null, error: { message: 'User not found' } };
    } catch (error) {
      console.error('Error getting user:', error);
      return { user: null, error };
    }
  },

  // Get user profile
  getUserProfile: (userId: string) => {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare('SELECT * FROM profiles WHERE user_id = ?');
      stmt.bind([userId]);
      
      if (stmt.step()) {
        const profile = stmt.getAsObject();
        stmt.free();
        return { profile, error: null };
      }
      
      stmt.free();
      return { profile: null, error: { message: 'Profile not found' } };
    } catch (error) {
      console.error('Error getting profile:', error);
      return { profile: null, error };
    }
  },

  // Update user profile
  updateProfile: (userId: string, profileData: {
    username?: string;
    full_name?: string;
    gender?: string;
    bio?: string;
    website?: string;
  }) => {
    const db = getDatabase();
    const now = new Date().toISOString();
    
    try {
      // Update user table
      const userStmt = db.prepare(`
        UPDATE users 
        SET username = ?, full_name = ?, gender = ?, bio = ?, website = ?, updated_at = ?
        WHERE id = ?
      `);
      userStmt.run([
        profileData.username || null,
        profileData.full_name || null,
        profileData.gender || null,
        profileData.bio || null,
        profileData.website || null,
        now,
        userId
      ]);
      userStmt.free();

      // Update profile table
      const profileStmt = db.prepare(`
        UPDATE profiles 
        SET username = ?, full_name = ?, gender = ?, bio = ?, website = ?, updated_at = ?
        WHERE user_id = ?
      `);
      profileStmt.run([
        profileData.username || null,
        profileData.full_name || null,
        profileData.gender || null,
        profileData.bio || null,
        profileData.website || null,
        now,
        userId
      ]);
      profileStmt.free();

      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  },

  // Get all users (for admin purposes)
  getAllUsers: () => {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare(`
        SELECT u.*, p.username as profile_username, p.full_name as profile_full_name
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        ORDER BY u.created_at DESC
      `);
      
      const users = [];
      while (stmt.step()) {
        const user = stmt.getAsObject();
        // Don't include password in the result
        delete user.password;
        users.push(user);
      }
      stmt.free();
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  },

  // Delete user
  deleteUser: (userId: string) => {
    const db = getDatabase();
    
    try {
      // Delete user (profiles will be deleted automatically due to CASCADE)
      const stmt = db.prepare('DELETE FROM users WHERE id = ?');
      stmt.run([userId]);
      stmt.free();
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },

  // Check if user exists
  userExists: (email: string) => {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
      stmt.bind([email.toLowerCase()]);
      
      if (stmt.step()) {
        const result = stmt.getAsObject();
        stmt.free();
        return result.count > 0;
      }
      
      stmt.free();
      return false;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }
};
