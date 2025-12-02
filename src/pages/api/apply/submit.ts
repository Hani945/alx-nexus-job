import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { job_id, cover_letter, cv_url, email, phone } = req.body

    // Get the current user (you'll need to implement authentication)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Insert into job_applications table
    const { data, error } = await supabase
      .from('job_applications')
      .insert([
        {
          user_id: user.id,
          job_id: job_id,
          cover_letter: cover_letter,
          cv_url: cv_url,
          status: 'pending'
        }
      ])
      .select()

    if (error) {
      console.error('Error submitting application:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ 
      success: true, 
      data: data,
      message: 'Application submitted successfully' 
    })

  } catch (error) {
    console.error('Application submission error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}