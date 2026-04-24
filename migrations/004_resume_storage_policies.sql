-- Enable public access to resume bucket
-- Run this in Supabase SQL Editor

-- Make bucket fully public (disable RLS)
ALTER STORAGE bucket 'resume' SET PUBLIC true;

-- Add storage policies for resume bucket
DROP POLICY IF EXISTS "Anyone can upload to resume" ON storage.objects;
CREATE POLICY "Anyone can upload to resume" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resume');

DROP POLICY IF EXISTS "Anyone can read resume" ON storage.objects;
CREATE POLICY "Anyone can read resume" ON storage.objects
  FOR SELECT USING (bucket_id = 'resume');

DROP POLICY IF EXISTS "Users can update their own resume" ON storage.objects;
CREATE POLICY "Users can update their own resume" ON storage.objects
  FOR UPDATE USING (bucket_id = 'resume' AND (auth.uid()::text = owner));

DROP POLICY IF EXISTS "Users can delete their own resume" ON storage.objects;
CREATE POLICY "Users can delete their own resume" ON storage.objects
  FOR DELETE USING (bucket_id = 'resume' AND (auth.uid()::text = owner));
