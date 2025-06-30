import mongoose from 'mongoose';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// MongoDB setup
const setupMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/learnone');
    console.log('✅ MongoDB connected successfully');
    
    // Create indexes
    const collections = ['users', 'videos', 'courses', 'communities', 'notes'];
    
    for (const collectionName of collections) {
      const collection = mongoose.connection.db.collection(collectionName);
      
      switch (collectionName) {
        case 'users':
          await collection.createIndex({ email: 1 }, { unique: true });
          await collection.createIndex({ name: 'text', bio: 'text', subjects: 'text' });
          break;
        case 'videos':
          await collection.createIndex({ title: 'text', description: 'text', tags: 'text' });
          await collection.createIndex({ author: 1 });
          await collection.createIndex({ category: 1 });
          await collection.createIndex({ createdAt: -1 });
          break;
        case 'courses':
          await collection.createIndex({ title: 'text', description: 'text', tags: 'text' });
          await collection.createIndex({ instructor: 1 });
          await collection.createIndex({ category: 1 });
          break;
        case 'communities':
          await collection.createIndex({ name: 'text', description: 'text', tags: 'text' });
          await collection.createIndex({ creator: 1 });
          await collection.createIndex({ category: 1 });
          break;
        case 'notes':
          await collection.createIndex({ content: 'text', tags: 'text' });
          await collection.createIndex({ user: 1 });
          await collection.createIndex({ video: 1 });
          break;
      }
    }
    
    console.log('✅ MongoDB indexes created');
  } catch (error) {
    console.error('❌ MongoDB setup failed:', error);
  }
};

// SQLite setup
const setupSQLite = async () => {
  try {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    // Create analytics tables
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

      CREATE TABLE IF NOT EXISTS user_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        target_user_id TEXT NOT NULL,
        interaction_type TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
      CREATE INDEX IF NOT EXISTS idx_video_analytics_video_id ON video_analytics(video_id);
      CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs(query);
      CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id);
    `);

    console.log('✅ SQLite database and tables created');
    await db.close();
  } catch (error) {
    console.error('❌ SQLite setup failed:', error);
  }
};

// Run setup
const main = async () => {
  console.log('🚀 Setting up databases...');
  await setupMongoDB();
  await setupSQLite();
  console.log('✅ Database setup complete!');
  process.exit(0);
};

main();