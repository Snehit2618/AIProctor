import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eewfdhzumbnadnkkmrjg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVld2ZkaHp1bWJuYWRua2ttcmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDY0MTYsImV4cCI6MjA5MDAyMjQxNn0.BS_PFYUYK2K5OsXiANQOLmEsMHvbL3x69K5lmAA2uZ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
