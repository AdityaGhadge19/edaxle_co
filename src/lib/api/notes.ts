import { supabase } from '../supabase'
import type { Database } from '../supabase'

type UserNote = Database['public']['Tables']['user_notes']['Row']
type UserNoteInsert = Database['public']['Tables']['user_notes']['Insert']
type UserNoteUpdate = Database['public']['Tables']['user_notes']['Update']

export const notesApi = {
  // Get user notes for a video
  async getByVideo(userId: string, videoId: string) {
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .order('timestamp_seconds', { ascending: true })

    if (error) throw error
    return data
  },

  // Get all user notes
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('user_notes')
      .select(`
        *,
        videos (
          id,
          title,
          thumbnail_url,
          author_id,
          profiles:author_id (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Create note
  async create(note: UserNoteInsert) {
    const { data, error } = await supabase
      .from('user_notes')
      .insert(note)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update note
  async update(id: string, updates: UserNoteUpdate) {
    const { data, error } = await supabase
      .from('user_notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete note
  async delete(id: string) {
    const { error } = await supabase
      .from('user_notes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Search notes
  async search(userId: string, query: string) {
    const { data, error } = await supabase
      .from('user_notes')
      .select(`
        *,
        videos (
          id,
          title,
          thumbnail_url,
          author_id,
          profiles:author_id (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .or(`content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}