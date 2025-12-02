'use client'

import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

interface Props {
  onUploaded: (url: string) => void
  userId: string
}

export default function CVUploader({ userId, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false)

  const uploadCV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/cv.${fileExt}`
      const filePath = `cvs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('job_seeker_cvs')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('job_seeker_cvs')
        .getPublicUrl(filePath)

      onUploaded(data.publicUrl)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload CV (PDF only)</label>
      <input type="file" accept="application/pdf" onChange={uploadCV} />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  )
}
