import { supabase } from '../supabase'
import type { Database } from '../supabase'

type Quiz = Database['public']['Tables']['quizzes']['Row']
type QuizInsert = Database['public']['Tables']['quizzes']['Insert']

export const quizApi = {
  // Get all published quizzes
  async getAll() {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url
        ),
        quiz_questions (
          id
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(quiz => ({
      ...quiz,
      question_count: quiz.quiz_questions?.length || 0
    }))
  },

  // Get quiz by ID with questions
  async getById(id: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url
        ),
        quiz_questions (
          id,
          question,
          question_type,
          options,
          order_index
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) throw error
    return data
  },

  // Get quizzes by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url
        ),
        quiz_questions (
          id
        )
      `)
      .eq('category', category)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(quiz => ({
      ...quiz,
      question_count: quiz.quiz_questions?.length || 0
    }))
  },

  // Create quiz
  async create(quiz: QuizInsert) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert(quiz)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Submit quiz attempt
  async submitAttempt(attempt: {
    user_id: string
    quiz_id: string
    score: number
    total_questions: number
    time_spent_seconds: number
    answers: any
  }) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert(attempt)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user quiz attempts
  async getUserAttempts(userId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select(`
        *,
        quizzes (
          id,
          title,
          category,
          difficulty
        )
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (error) throw error
    return data
  }
}