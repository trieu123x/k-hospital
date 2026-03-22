import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Thiếu cấu hình supabase trong file")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY 
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY) 
    : null;
