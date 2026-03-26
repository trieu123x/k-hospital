import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Thiếu SUPABASE_URL hoặc SUPABASE_KEY trong .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadToStorage(bucketName = "medicare", storagePath, fileBuffer) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload('analytics/' + storagePath, fileBuffer, {
      contentType: 'application/octet-stream',
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload thất bại [${storagePath}]: ${error.message}`);
  }

  return data;
}
