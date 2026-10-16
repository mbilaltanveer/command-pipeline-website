// Pipeline Studio page: uploads a visitor's file straight to Vercel Blob (the token comes from /api/studio).
import { upload } from '@vercel/blob/client'

window.studioUpload = async (file, email, onProgress) => {
  const name = (file.name || 'file').replace(/[^\w.-]+/g, '_').slice(-80)
  const blob = await upload(`studio/uploads/${name}`, file, {
    access: 'public',
    handleUploadUrl: '/api/studio?action=upload',
    clientPayload: JSON.stringify({ email }),
    multipart: file.size > 20 * 1024 * 1024,
    onUploadProgress: e => onProgress && onProgress(e.percentage / 100),
  })
  return blob.url
}
