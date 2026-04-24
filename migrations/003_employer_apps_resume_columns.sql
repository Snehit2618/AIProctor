-- Ensure applications table has all resume/screening columns
-- Run this in Supabase SQL Editor

ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_score DECIMAL(5,2);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_match_details JSONB;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_text TEXT;

-- Ensure jobs table has JD columns
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS jd_text TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS jd_keywords TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS exam_code TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS passing_threshold INTEGER DEFAULT 50;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS admin_id UUID;

-- Migrate employer_id to admin_id for jobs
UPDATE jobs SET admin_id = employer_id WHERE employer_id IS NOT NULL AND admin_id IS NULL;

-- Ensure exams table has admin_id
ALTER TABLE exams ADD COLUMN IF NOT EXISTS admin_id UUID;

-- Make resume bucket public (run in SQL Editor)
-- Note: bucket "resume" should already be created in Storage
-- If not, run: INSERT INTO storage.buckets (id, name, public) VALUES ('resume', 'resume', true) ON CONFLICT DO NOTHING;
