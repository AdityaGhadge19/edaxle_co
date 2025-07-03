import { supabase } from '../supabase'
import type { Database } from '../supabase'

type Video = Database['public']['Tables']['videos']['Row']
type VideoInsert = Database['public']['Tables']['videos']['Insert']
type VideoUpdate = Database['public']['Tables']['videos']['Update']

export const videoApi = {
  // Get all published videos with author info
  async getAll() {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url,
          is_verified
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get video by ID with author info
  async getById(id: string) {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url,
          is_verified,
          bio,
          subjects
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) throw error
    return data
  },

  // Get videos by author
  async getByAuthor(authorId: string) {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url,
          is_verified
        )
      `)
      .eq('author_id', authorId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get videos by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url,
          is_verified
        )
      `)
      .eq('category', category)
      .eq('is_published', true)
      .order('views', { ascending: false })

    if (error) throw error
    return data
  },

  // Search videos
  async search(query: string) {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url,
          is_verified
        )
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_published', true)
      .order('views', { ascending: false })

    if (error) throw error
    return data
  },

  // Create new video
  async create(video: VideoInsert) {
    const { data, error } = await supabase
      .from('videos')
      .insert(video)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update video
  async update(id: string, updates: VideoUpdate) {
    const { data, error } = await supabase
      .from('videos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete video
  async delete(id: string) {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Increment video views
  async incrementViews(videoId: string, userId?: string) {
    const { error } = await supabase.rpc('increment_video_views', {
      video_uuid: videoId,
      user_uuid: userId || null
    })

    if (error) throw error
  },

  // Get trending videos (most views in last 7 days)
  async getTrending() {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url,
          is_verified
        )
      `)
      .eq('is_published', true)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('views', { ascending: false })
      .limit(20)

    if (error) throw error
    return data
  },

  // Get featured videos (high views and recent)
  async getFeatured() {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          avatar_url,
          is_verified
        )
      `)
      .eq('is_published', true)
      .gte('views', 1000)
      .order('created_at', { ascending: false })
      .limit(12)

    if (error) throw error
    return data
  }
}