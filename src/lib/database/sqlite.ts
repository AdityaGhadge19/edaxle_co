import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any = null;

export async function connectSQLite() {
  if (db) return db;

  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      resource_id TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT
    );

    CREATE TABLE IF NOT EXISTS video_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      watch_time INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT FALSE,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS search_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      query TEXT NOT NULL,
      results_count INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS course_enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      progress REAL DEFAULT 0,
      completed BOOLEAN DEFAULT FALSE
    );

    CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
    CREATE INDEX IF NOT EXISTS idx_video_analytics_video_id ON video_analytics(video_id);
    CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs(query);
    CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);
  `);

  return db;
}

export { db };