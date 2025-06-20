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
  
  // Check if users table has password column
  try {
    const stmt = db.prepare("PRAGMA table_info(users)");
    const columns = [];
    while (stmt.step()) {
      columns.push(stmt.getAsObject());
    }
    stmt.free();
    
    console.log('Users table columns:', columns);
    const hasPassword = columns.some((col: any) => col.name === 'password');
    if (!hasPassword) {
      console.log('Adding password column to users table...');
      db.run('ALTER TABLE users ADD COLUMN password TEXT');
      saveDatabase();
      console.log('password column added');
    } else {
      console.log('password column already exists');
    }
  } catch (error) {
    console.log('Error checking/migrating users table:', error);
  }

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
    console.log('Error checking/migrating threads table:', error);
  }

  // Add default user if not exists
  try {
    console.log('Checking for default user...');
    db.run(`
      INSERT INTO users (id, username, email, password) 
      VALUES (1, 'default_user', 'default@example.com', 'password123')
    `);
    saveDatabase();
    console.log('Default user added');
  } catch (error) {
    // User already exists, ignore error
    console.log('Default user already exists or error adding it:', error);
  }

  // Check if updated_at column exists in flows table
  try {
    const stmt = db.prepare("PRAGMA table_info(flows)");
    const columns = [];
    while (stmt.step()) {
      columns.push(stmt.getAsObject());
    }
    stmt.free();
    
    console.log('Flows table columns:', columns);
    const hasUpdatedAt = columns.some((col: any) => col.name === 'updated_at');
    if (!hasUpdatedAt) {
      console.log('Adding updated_at column to flows table...');
      db.run('ALTER TABLE flows ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP');
      saveDatabase();
      console.log('updated_at column added to flows table');
    } else {
      console.log('updated_at column already exists in flows table');
    }
  } catch (error) {
    console.log('Error checking/migrating flows table:', error);
  }

  console.log('Database migration completed');
};

const initializeTables = async () => {
  // Users table with authentication fields
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT,
      gender TEXT,
      bio TEXT,
      website TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Profiles table (for additional profile data)
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
      INSERT INTO users (id, username, email, password, full_name, gender) 
      VALUES (1, 'default_user', 'default@example.com', 'password123', 'Default User', 'prefer-not-to-say')
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
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
