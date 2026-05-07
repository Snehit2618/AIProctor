-- AIProctor 3-Role Hiring Platform Database Schema
-- Migration: Employer, Jobs, Applications tables

-- ============================================
-- EMPLOYERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  company_description TEXT,
  company_website VARCHAR(255),
  company_logo TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  location VARCHAR(255),
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(10) DEFAULT 'USD',
  job_type VARCHAR(50) DEFAULT 'full-time', -- full-time, part-time, contract
  experience_level VARCHAR(50), -- entry, mid, senior
  remote_status VARCHAR(50), -- remote, hybrid, onsite
  skills_required TEXT[], -- array of required skills
  jd_keywords JSONB, -- AI-extracted keywords from JD
  status VARCHAR(50) DEFAULT 'open', -- draft, open, paused, closed
  exam_id UUID, -- linked exam (will reference exams table)
  application_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  resume_url TEXT,
  cover_letter TEXT,
  resume_match_score DECIMAL(5,2), -- percentage 0-100
  resume_match_details JSONB, -- detailed matching info from AI
  status VARCHAR(50) DEFAULT 'applied', -- applied, screening, exam_sent, exam_completed, review, shortlisted, accepted, rejected
  exam_session_id UUID, -- if exam was taken
  exam_score INTEGER,
  employer_notes TEXT,
  interview_scheduled_at TIMESTAMP WITH TIME ZONE,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, student_id)
);

-- ============================================
-- LINK EXAMS TO JOBS
-- ============================================
ALTER TABLE exams ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE SET NULL;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS employer_id UUID REFERENCES employers(id) ON DELETE SET NULL;

-- ============================================
-- JOB SEEKER PROFILES (enhanced student info)
-- ============================================
CREATE TABLE IF NOT EXISTS job_seeker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  phone VARCHAR(50),
  location VARCHAR(255),
  headline VARCHAR(255),
  summary TEXT,
  skills TEXT[],
  experience_years INTEGER,
  education_level VARCHAR(100),
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  preferred_job_types TEXT[],
  preferred_locations TEXT[],
  willing_to_relocate BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_type VARCHAR(50) NOT NULL, -- student, employer, admin
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
  is_read BOOLEAN DEFAULT false,
  link VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ADMIN PROFILES
-- ============================================
ALTER TABLE admins ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'proctor'; -- super_admin, proctor, viewer

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_jobs_employer ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employers_updated_at
    BEFORE UPDATE ON employers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================
-- Insert sample employer
INSERT INTO employers (email, password, name, company_name, company_description)
VALUES (
  'demo@company.com',
  '$2a$10$rqV5JKw5O5vJ5z5z5z5z5u2t1t1t1t1t1t1t1t1t1t1t1t1t1t1', -- hashed 'password123'
  'Sarah Johnson',
  'TechCorp Solutions',
  'Leading technology solutions provider specializing in AI and cloud computing.'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample job
INSERT INTO jobs (employer_id, title, description, requirements, location, salary_min, salary_max, skills_required, status)
SELECT
  e.id,
  'Senior Full Stack Developer',
  'We are looking for an experienced Full Stack Developer to join our growing team. You will work on cutting-edge web applications using React and Node.js.',
  '5+ years of experience in web development. Strong proficiency in React, Node.js, and PostgreSQL. Experience with cloud services (AWS/GCP).',
  'San Francisco, CA',
  120000,
  180000,
  ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'],
  'open'
FROM employers e WHERE e.email = 'demo@company.com'
ON CONFLICT DO NOTHING;