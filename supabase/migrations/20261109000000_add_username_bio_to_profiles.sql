-- Migration: Bổ sung cột username và bio vào bảng profiles
-- Giúp bảng profiles lưu trữ trực tiếp username và bio của người dùng
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
