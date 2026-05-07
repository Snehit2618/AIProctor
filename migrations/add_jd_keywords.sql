-- Add jd_keywords column to store extracted keywords from JD
-- Run this in Supabase SQL Editor

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS jd_keywords JSONB;

-- Add resume_match_details to applications for section-wise breakdown
ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_match_details JSONB;
