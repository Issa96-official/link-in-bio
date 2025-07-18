import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.join(__dirname, 'skappa.db');

// Create database connection
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize database with tables
export const initializeDatabase = () => {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or already exists.');
      
      // Check if admin user exists, if not create default admin
      db.get('SELECT * FROM users WHERE email = ?', ['admin@skappa.com'], (err, row) => {
        if (err) {
          console.error('Error checking for admin user:', err.message);
        } else if (!row) {
          // Create default admin user
          const hashedPassword = bcrypt.hashSync('admin123', 10);
          db.run('INSERT INTO users (email, password) VALUES (?, ?)', 
            ['admin@skappa.com', hashedPassword], 
            function(err) {
              if (err) {
                console.error('Error creating default admin user:', err.message);
              } else {
                console.log('Default admin user created with ID:', this.lastID);
              }
            }
          );
        }
      });
    }
  });

  // Create profile table
  db.run(`CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bio TEXT,
    image_path TEXT,
    theme TEXT DEFAULT 'light',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating profile table:', err.message);
    } else {
      console.log('Profile table created or already exists.');
      
      // Check if profile exists, if not create default profile
      db.get('SELECT * FROM profile WHERE id = 1', [], (err, row) => {
        if (err) {
          console.error('Error checking for profile:', err.message);
        } else if (!row) {
          // Create default profile
          db.run('INSERT INTO profile (id, name, bio, image_path) VALUES (?, ?, ?, ?)', 
            [1, 'Skappa', 'Connect with me on all platforms', '/profile.jpg'], 
            function(err) {
              if (err) {
                console.error('Error creating default profile:', err.message);
              } else {
                console.log('Default profile created with ID:', this.lastID);
              }
            }
          );
        }
      });
    }
  });

  // Create links table
  db.run(`CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT DEFAULT '#7C41F5',
    order_num INTEGER NOT NULL,
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating links table:', err.message);
    } else {
      console.log('Links table created or already exists.');
      
      // Check if links exist, if not create default links
      db.get('SELECT COUNT(*) as count FROM links', [], (err, row) => {
        if (err) {
          console.error('Error checking for links:', err.message);
        } else if (row.count === 0) {
          // Create default links
          const defaultLinks = [
            { title: 'Instagram', url: 'https://instagram.com/skappa', icon: 'FaInstagram', color: '#E1306C', order_num: 1 },
            { title: 'Twitter', url: 'https://twitter.com/skappa', icon: 'FaTwitter', color: '#1DA1F2', order_num: 2 },
            { title: 'YouTube', url: 'https://youtube.com/skappa', icon: 'FaYoutube', color: '#FF0000', order_num: 3 },
            { title: 'TikTok', url: 'https://tiktok.com/@skappa', icon: 'FaTiktok', color: '#000000', order_num: 4 },
            { title: 'LinkedIn', url: 'https://linkedin.com/in/skappa', icon: 'FaLinkedin', color: '#0077B5', order_num: 5 },
            { title: 'My Website', url: 'https://skappa.com', icon: 'FaGlobe', color: '#7C41F5', order_num: 6 },
            { title: 'Contact Me', url: 'mailto:hello@skappa.com', icon: 'FaEnvelope', color: '#3C98F5', order_num: 7 }
          ];
          
          const stmt = db.prepare('INSERT INTO links (title, url, icon, color, order_num) VALUES (?, ?, ?, ?, ?)');
          
          defaultLinks.forEach(link => {
            stmt.run(link.title, link.url, link.icon, link.color, link.order_num, function(err) {
              if (err) {
                console.error(`Error creating default link ${link.title}:`, err.message);
              }
            });
          });
          
          stmt.finalize();
          console.log('Default links created');
        }
      });
    }
  });
};

// Helper function to run queries with promises
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Helper function to get a single row
export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

// Helper function to get all rows
export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};
