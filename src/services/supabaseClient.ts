
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder-project')
  );
};

if (!isSupabaseConfigured()) {
  console.warn(
    'Supabase chưa được cấu hình. Kiểm tra file .env.local.'
  );
}

// Không tạo client với URL giả.
// Nếu thiếu cấu hình, các hàm sử dụng Supabase cần kiểm tra
// isSupabaseConfigured() trước khi truy vấn.
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  : createClient(
    'https://placeholder-project.supabase.co',
    'placeholder-anon-key',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
