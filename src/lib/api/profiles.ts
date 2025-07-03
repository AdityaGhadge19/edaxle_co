import { supabase } from '../supabase'
import type { Database } from '../supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const profileApi = {
  // Get profile by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Get profile by email
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error
    return data
  },

  // Create profile
  async create(profile: ProfileInsert) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update profile
  async update(id: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get teachers
  async getTeachers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'teacher')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Search teachers
  async searchTeachers(query: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'teacher')
      .or(`name.ilike.%${query}%,bio.ilike.%${query}%`)
      .order('is_verified', { ascending: false })

    if (error) throw error
    return data
  },

  // Get user stats
  async getStats(userId: string) {
    const { data, error } = await supabase.rpc('get_user_stats', {
      user_uuid: userId
    })

    if (error) throw error
    return data?.[0] || {
      follower_count: 0,
      following_count: 0,
      video_count: 0,
      total_views: 0
    }
  }
}