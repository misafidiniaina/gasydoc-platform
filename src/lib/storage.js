import { createClient } from "./supabase/client";

/**
 * Generates a signed URL for a private storage file.
 * @param {string} bucket - Storage bucket name ('profiles' or 'clinics')
 * @param {string} path - File path stored in the database (e.g. 'avatars/uuid.jpg')
 * @param {number} expiresIn - Expiry in seconds (default: 1 hour)
 * @returns {string|null} - Signed URL or null if failed
 */
export async function getSignedUrl(bucket, path, expiresIn = 3600) {
  if (!path) return null;

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error(`Failed to get signed URL for ${bucket}/${path}:`, error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Uploads a file to a private storage bucket.
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Destination path in storage
 * @param {File} file - File object to upload
 * @returns {string|null} - Stored path or null if failed
 */
export async function uploadFile(bucket, path, file) {
  if (!file) return null;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error(`Failed to upload file to ${bucket}/${path}:`, error);
    return null;
  }

  // Return the path only (not full URL) for secure storage in DB
  return path;
}
