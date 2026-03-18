import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Thiếu cấu hình supabase trong file")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)