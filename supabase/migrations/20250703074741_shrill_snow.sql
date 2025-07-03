/*
  # Complete EdAxle Database Schema

  1. New Tables
    - `profiles` - User profiles (extends Supabase auth.users)
    - `videos` - Video content
    - `courses` - Course collections
    - `course_videos` - Many-to-many relationship between courses and videos
    - `video_notes` - Notes attached to videos by teachers
    - `user_notes` - Personal notes by students on videos
    - `quizzes` - Quiz definitions
    - `quiz_questions` - Questions for quizzes
    - `quiz_attempts` - User quiz attempts and scores
    - `video_views` - Track video views and watch time
    - `follows` - User following relationships
    - `video_likes` - Video likes/dislikes
    - `community_posts` - Teacher community posts
    - `community_post_likes` - Likes on community posts
    - `community_post_replies` - Replies to community posts

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'teacher');
CREATE TYPE quiz_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'fill_in_blank');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url text,
  bio text DEFAULT '',
  location text DEFAULT '',
  website text DEFAULT '',
  subjects text[] DEFAULT '{}',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text NOT NULL,
  video_url text NOT NULL,
  duration integer NOT NULL, -- in seconds
  views integer DEFAULT 0,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text NOT NULL,
  instructor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  level course_level NOT NULL DEFAULT 'beginner',
  price decimal(10,2) DEFAULT 0,
  duration_hours integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Course videos relationship
CREATE TABLE IF NOT EXISTS course_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, video_id),
  UNIQUE(course_id, order_index)
);

-- Video notes (by teachers)
CREATE TABLE IF NOT EXISTS video_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  file_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User notes (by students)
CREATE TABLE IF NOT EXISTS user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  content text NOT NULL,
  timestamp_seconds integer NOT NULL, -- timestamp in video
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE SET NULL, -- null for general quizzes
  category text NOT NULL,
  difficulty quiz_difficulty NOT NULL DEFAULT 'medium',
  time_limit_minutes integer DEFAULT 30,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  question_type question_type NOT NULL,
  options jsonb, -- for multiple choice options
  correct_answer text NOT NULL,
  explanation text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  time_spent_seconds integer NOT NULL,
  answers jsonb NOT NULL, -- user's answers
  completed_at timestamptz DEFAULT now()
);

-- Video views tracking
CREATE TABLE IF NOT EXISTS video_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  watch_time_seconds integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_watched_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- User follows
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Video likes
CREATE TABLE IF NOT EXISTS video_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  is_like boolean NOT NULL, -- true for like, false for dislike
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Community posts
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community post likes
CREATE TABLE IF NOT EXISTS community_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Community post replies
CREATE TABLE IF NOT EXISTS community_post_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_replies ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Videos policies
CREATE POLICY "Published videos are viewable by everyone" ON videos
  FOR SELECT USING (is_published = true);

CREATE POLICY "Teachers can insert their own videos" ON videos
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "Teachers can update their own videos" ON videos
  FOR UPDATE USING (
    auth.uid() = author_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "Teachers can delete their own videos" ON videos
  FOR DELETE USING (
    auth.uid() = author_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- Courses policies
CREATE POLICY "Published courses are viewable by everyone" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Teachers can insert their own courses" ON courses
  FOR INSERT WITH CHECK (
    auth.uid() = instructor_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "Teachers can update their own courses" ON courses
  FOR UPDATE USING (
    auth.uid() = instructor_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- Course videos policies
CREATE POLICY "Course videos are viewable by everyone" ON course_videos
  FOR SELECT USING (true);

CREATE POLICY "Course instructors can manage course videos" ON course_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

-- Video notes policies
CREATE POLICY "Video notes are viewable by everyone" ON video_notes
  FOR SELECT USING (true);

CREATE POLICY "Video authors can manage video notes" ON video_notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM videos 
      WHERE id = video_id AND author_id = auth.uid()
    )
  );

-- User notes policies
CREATE POLICY "Users can view their own notes" ON user_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON user_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON user_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON user_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Quizzes policies
CREATE POLICY "Published quizzes are viewable by everyone" ON quizzes
  FOR SELECT USING (is_published = true);

CREATE POLICY "Teachers can insert their own quizzes" ON quizzes
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "Teachers can update their own quizzes" ON quizzes
  FOR UPDATE USING (
    auth.uid() = author_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- Quiz questions policies
CREATE POLICY "Quiz questions are viewable by everyone" ON quiz_questions
  FOR SELECT USING (true);

CREATE POLICY "Quiz authors can manage questions" ON quiz_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE id = quiz_id AND author_id = auth.uid()
    )
  );

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Video views policies
CREATE POLICY "Users can view their own video views" ON video_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video views" ON video_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video views" ON video_views
  FOR UPDATE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" ON follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Video likes policies
CREATE POLICY "Video likes are viewable by everyone" ON video_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like videos" ON video_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their likes" ON video_likes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their likes" ON video_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Community posts policies
CREATE POLICY "Community posts are viewable by everyone" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Teachers can create community posts" ON community_posts
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "Teachers can update their own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Teachers can delete their own posts" ON community_posts
  FOR DELETE USING (auth.uid() = author_id);

-- Community post likes policies
CREATE POLICY "Post likes are viewable by everyone" ON community_post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like posts" ON community_post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their post likes" ON community_post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Community post replies policies
CREATE POLICY "Post replies are viewable by everyone" ON community_post_replies
  FOR SELECT USING (true);

CREATE POLICY "Users can reply to posts" ON community_post_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" ON community_post_replies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies" ON community_post_replies
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_author_id ON videos(author_id);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);

CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_video_id ON user_notes(video_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

CREATE INDEX IF NOT EXISTS idx_video_views_user_id ON video_views(user_id);
CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON video_views(video_id);

CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

CREATE INDEX IF NOT EXISTS idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_user_id ON video_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_video_stats(video_uuid uuid)
RETURNS TABLE(
  like_count bigint,
  dislike_count bigint,
  total_views bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*) FROM video_likes WHERE video_id = video_uuid AND is_like = true), 0) as like_count,
    COALESCE((SELECT COUNT(*) FROM video_likes WHERE video_id = video_uuid AND is_like = false), 0) as dislike_count,
    COALESCE((SELECT views FROM videos WHERE id = video_uuid), 0) as total_views;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_stats(user_uuid uuid)
RETURNS TABLE(
  follower_count bigint,
  following_count bigint,
  video_count bigint,
  total_views bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*) FROM follows WHERE following_id = user_uuid), 0) as follower_count,
    COALESCE((SELECT COUNT(*) FROM follows WHERE follower_id = user_uuid), 0) as following_count,
    COALESCE((SELECT COUNT(*) FROM videos WHERE author_id = user_uuid AND is_published = true), 0) as video_count,
    COALESCE((SELECT SUM(views) FROM videos WHERE author_id = user_uuid AND is_published = true), 0) as total_views;
END;
$$ LANGUAGE plpgsql;

-- Function to increment video views
CREATE OR REPLACE FUNCTION increment_video_views(video_uuid uuid, user_uuid uuid DEFAULT NULL)
RETURNS void AS $$
BEGIN
  -- Increment the video views count
  UPDATE videos SET views = views + 1 WHERE id = video_uuid;
  
  -- If user is provided, update or insert video_views record
  IF user_uuid IS NOT NULL THEN
    INSERT INTO video_views (user_id, video_id, watch_time_seconds, last_watched_at)
    VALUES (user_uuid, video_uuid, 0, now())
    ON CONFLICT (user_id, video_id) 
    DO UPDATE SET last_watched_at = now();
  END IF;
END;
$$ LANGUAGE plpgsql;