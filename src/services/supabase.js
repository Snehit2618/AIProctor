import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xsajyowogczrntzqlnxk.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYWp5b3dvZ2N6cm50enFsbnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMDM1NzksImV4cCI6MjA4MDU3OTU3OX0.pprYujlUPSvF2e9uWXkdUk4vscIo4ulE5SyZEc9aW6g'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
