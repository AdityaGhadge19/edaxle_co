import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'student' | 'teacher'
          avatar_url: string | null
          bio: string
          location: string
          website: string
          subjects: string[]
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'student' | 'teacher'
          avatar_url?: string | null
          bio?: string
          location?: string
          website?: string
          subjects?: string[]
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'student' | 'teacher'
          avatar_url?: string | null
          bio?: string
          location?: string
          website?: string
          subjects?: string[]
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string
          video_url: string
          duration: number
          views: number
          author_id: string
          category: string
          tags: string[]
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url: string
          video_url: string
          duration: number
          views?: number
          author_id: string
          category: string
          tags?: string[]
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string
          video_url?: string
          duration?: number
          views?: number
          author_id?: string
          category?: string
          tags?: string[]
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string
          instructor_id: string
          category: string
          level: 'beginner' | 'intermediate' | 'advanced'
          price: number
          duration_hours: number
          tags: string[]
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url: string
          instructor_id: string
          category: string
          level?: 'beginner' | 'intermediate' | 'advanced'
          price?: number
          duration_hours?: number
          tags?: string[]
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string
          instructor_id?: string
          category?: string
          level?: 'beginner' | 'intermediate' | 'advanced'
          price?: number
          duration_hours?: number
          tags?: string[]
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_notes: {
        Row: {
          id: string
          user_id: string
          video_id: string
          content: string
          timestamp_seconds: number
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          content: string
          timestamp_seconds: number
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          content?: string
          timestamp_seconds?: number
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          title: string
          description: string
          author_id: string
          video_id: string | null
          category: string
          difficulty: 'easy' | 'medium' | 'hard'
          time_limit_minutes: number
          tags: string[]
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          author_id: string
          video_id?: string | null
          category: string
          difficulty?: 'easy' | 'medium' | 'hard'
          time_limit_minutes?: number
          tags?: string[]
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          author_id?: string
          video_id?: string | null
          category?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          time_limit_minutes?: number
          tags?: string[]
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}