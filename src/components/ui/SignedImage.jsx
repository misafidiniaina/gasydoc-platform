'use client'

/**
 * Displays an image from private Supabase storage.
 * Generates a signed URL client-side on mount.
 */
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function SignedImage({ bucket, path, alt, className, fallback }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (!path) return

    async function load() {
      const supabase = createClient()
      const { data } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600)
      if (data) setUrl(data.signedUrl)
    }

    load()
  }, [bucket, path])

  if (!url) return fallback || null

  return <img src={url} alt={alt || ''} className={className} />
}