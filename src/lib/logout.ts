'use client'

import { supabase } from './supabaseClient'

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
