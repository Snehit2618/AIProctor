import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import os from 'os';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
// Session setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://eewfdhzumbnadnkkmrjg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVld2ZkaHp1bWJuYWRua2ttcmpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ0NjQxNiwiZXhwIjoyMDkwMDIyNDE2fQ.0HKEAPv98YerJJmaHTnnYjA3M83UJe2FbI0be5ppye4'
);


// Session setup
app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

const uploadDir = path.join(os.tmpdir(), 'aiproctor-uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

// Passport strategies
passport.use('student', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, data.password);
    if (!valid) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    return done(null, { id: data.id, role: 'student', email: data.email });
  } catch (error) {
    return done(error);
  }
}));

passport.use('admin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, data.password);
    if (!valid) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    return done(null, { id: data.id, role: data.role || 'employer', email: data.email, name: data.name, company_name: data.company_name });
  } catch (error) {
    return done(error);
  }
}));

// Note: employer routes removed - using admins table instead

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Auth routes
app.post('/api/signup/student', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data: existingUser } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('students')
      .insert([{ email, password: hashedPassword, name }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      user: { id: data.id, email: data.email, role: 'student' }
    });
  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({ error: 'Error creating student account' });
  }
});

app.post('/api/signup/admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('admins')
      .insert([{ email, password: hashedPassword, name }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      user: { id: data.id, email: data.email, role: 'admin' }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ error: 'Error creating admin account' });
  }
});

// Admin login
app.post('/api/login/admin', (req, res, next) => {
  passport.authenticate('admin', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info.message || 'Authentication failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ success: true, user });
    });
  })(req, res, next);
});

// Employer signup (uses admins table with role indicator)
app.post('/api/signup/employer', async (req, res) => {
  try {
    const { email, password, name, company_name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const { data: existingUser } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('admins')
      .insert([{
        email,
        password: hashedPassword,
        name,
        role: 'employer',
        company_name: company_name || null
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
        role: 'employer',
        name: data.name
      }
    });
  } catch (error) {
    console.error('Employer signup error:', error);
    res.status(500).json({ error: 'Error creating employer account' });
  }
});

// Employer login (uses admins table)
app.post('/api/login/employer', (req, res, next) => {
  passport.authenticate('admin', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info.message || 'Authentication failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        success: true,
        user: { ...user, role: user.role || 'employer' }
      });
    });
  })(req, res, next);
});

// Student login with exam_code support
app.post('/api/login/student', async (req, res, next) => {
  const { email, password, exam_code } = req.body;

  passport.authenticate('student', async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info.message || 'Authentication failed' });
    }
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }

      // If exam_code provided, check for matching job
      if (exam_code) {
        const { data: job, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('exam_code', exam_code.toUpperCase())
          .eq('is_active', true)
          .single();

        if (jobError || !job) {
          return res.status(400).json({ error: 'Invalid exam code' });
        }

        return res.json({
          success: true,
          user,
          job: { id: job.id, title: job.title },
          needsExamCode: false
        });
      }

      return res.json({
        success: true,
        user,
        needsExamCode: false
      });
    });
  })(req, res, next);
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.json({ success: true });
  });
});

app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// Protected endpoints
app.get('/api/protected/student', (req, res) => {
  if (req.isAuthenticated() && req.user.role === 'student') {
    res.json({ allowed: true });
  } else {
    res.status(401).json({ allowed: false });
  }
});

app.get('/api/protected/admin', (req, res) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    res.json({ allowed: true, user: req.user });
  } else {
    res.status(401).json({ allowed: false });
  }
});

app.get('/api/protected/employer', (req, res) => {
  if (req.isAuthenticated() && (req.user.role === 'employer' || req.user.role === 'admin')) {
    res.json({ allowed: true, user: { ...req.user, role: 'employer' } });
  } else {
    res.status(401).json({ allowed: false });
  }
});

// ============ JOB MANAGEMENT ROUTES ============

// Get all active jobs (public)
app.get('/api/jobs', async (req, res) => {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, title, description, exam_code, passing_threshold, is_active, created_at, admins(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

// Get single job details
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: job, error } = await supabase
      .from('jobs')
      .select('*, admins(name)')
      .eq('id', id)
      .single();

    if (error || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Error fetching job' });
  }
});

// Create job (admin/employer only)
app.post('/api/jobs', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'employer')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, exam_code, jd_text, passing_threshold, jd_keywords } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const { data: job, error } = await supabase
      .from('jobs')
      .insert([{
        admin_id: req.user.id,
        title,
        description: description || '',
        exam_code: exam_code || uuidv4().substring(0, 8).toUpperCase(),
        jd_text: jd_text || '',
        jd_keywords: jd_keywords || '',
        passing_threshold: passing_threshold || 70,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Error creating job' });
  }
});

// Update job (admin/employer only, own jobs)
app.put('/api/jobs/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'employer')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.admin_id;

    const { data: job, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Error updating job' });
  }
});

// Delete/close job (admin/employer only)
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'employer')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('jobs')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Job closed successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Error closing job' });
  }
});

// Get admin's/employer's jobs
app.get('/api/admin/jobs', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'employer')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('admin_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

// ============ APPLICATION MANAGEMENT ROUTES ============

// Apply to job (job seeker)
app.post('/api/jobs/:id/apply', upload.single('resume'), async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: jobId } = req.params;
    const { cover_letter } = req.body;

    // Check if job exists
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check for existing application
    const { data: existingApp } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('student_id', req.user.id)
      .single();

    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    // Process resume file if uploaded
    let resumeText = '';
    if (req.file) {
      try {
        const fileContent = await fsPromises.readFile(req.file.path, 'utf-8');
        resumeText = fileContent;
        await fsPromises.unlink(req.file.path);
      } catch (e) {
        console.error('Error reading resume file:', e);
      }
    }

    const { data: application, error } = await supabase
      .from('applications')
      .insert([{
        job_id: jobId,
        student_id: req.user.id,
        cover_letter: cover_letter || '',
        resume_text: resumeText,
        status: 'screening'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ error: 'Error applying to job' });
  }
});

// Get applications for a job (admin/employer only)
app.get('/api/jobs/:id/applications', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'employer')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: jobId } = req.params;

    const { data: applications, error } = await supabase
      .from('applications')
      .select('*, students(name, email)')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// Send exam to candidate
app.post('/api/applications/:id/send-exam', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'employer')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: appId } = req.params;

    // Verify application belongs to admin's job
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*, jobs(admin_id)')
      .eq('id', appId)
      .single();

    if (appError || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.jobs?.admin_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { error } = await supabase
      .from('applications')
      .update({ status: 'exam_sent' })
      .eq('id', appId);

    if (error) throw error;

    res.json({ success: true, message: 'Exam sent to candidate' });
  } catch (error) {
    console.error('Error sending exam:', error);
    res.status(500).json({ error: 'Error sending exam' });
  }
});

// Update application status
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: appId } = req.params;
    const { status, resume_score, test_score, final_score } = req.body;

    const updateData = { status };
    if (resume_score !== undefined) updateData.resume_score = resume_score;
    if (test_score !== undefined) updateData.test_score = test_score;
    if (final_score !== undefined) updateData.final_score = final_score;
    if (status === 'completed') updateData.completed_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', appId)
      .select()
      .single();

    if (error) throw error;

    res.json(updated);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Error updating application' });
  }
});

// Get student's applications
app.get('/api/student/applications', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select('*, jobs(id, title, exam_code, admins(name))')
      .eq('student_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(applications);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// Get applications for employer (all their jobs)
app.get('/api/employer/applications', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'employer')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get all jobs for this admin
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id')
      .eq('admin_id', req.user.id);

    if (!jobs || jobs.length === 0) {
      return res.json([]);
    }

    const jobIds = jobs.map(j => j.id);

    // Get applications for all their jobs with student info
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*, jobs(id, title, exam_code), students(name, email)')
      .in('job_id', jobIds)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(applications || []);
  } catch (error) {
    console.error('Error fetching employer applications:', error);
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// Get exam questions
app.get('/api/exams/:examId/questions', async (req, res) => {
  try {
    const { examId } = req.params;
    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', examId);

    if (questionError) throw questionError;

    const questionsWithOptions = await Promise.all(questions.map(async (question) => {
      const { data: options, error: optionError } = await supabase
        .from('options')
        .select('option_id, text')
        .eq('question_id', question.id);

      if (optionError) throw optionError;

      return { ...question, options: options || [] };
    }));

    res.json(questionsWithOptions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error fetching exam questions' });
  }
});

// Submit exam responses and calculate score
app.post('/api/exams/:examId/submit', async (req, res) => {
  try {
    const { examId, sessionId, answers } = req.body;

    if (!req.isAuthenticated() || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the exam session
    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(400).json({ error: 'Invalid session' });
    }

    // Update session status
    const { error: updateError } = await supabase
      .from('exam_sessions')
      .update({ status: 'completed', end_time: new Date().toISOString() })
      .eq('id', session.id);

    if (updateError) throw updateError;

    // Fetch questions to compare answers
    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('id, correct_answer, points')
      .eq('exam_id', examId);

    if (questionError) throw questionError;

    let totalScore = 0;
    const responses = [];

    // Compare answers and calculate score
    for (const question of questions) {
      const studentAnswer = answers[question.id];
      if (studentAnswer) {
        const isCorrect = studentAnswer === question.correct_answer;
        const score = isCorrect ? question.points : 0;
        totalScore += score;
        responses.push({
          session_id: session.id,
          question_id: question.id,
          answer: studentAnswer,
          score
        });
      }
    }

    // Insert responses
    const { error: responseError } = await supabase
      .from('responses')
      .insert(responses);

    if (responseError) throw responseError;

    res.json({ success: true, score: totalScore });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ error: 'Error submitting exam' });
  }
});

// Fetch students for a specific exam (for ProctorDashboard)
app.get('/api/exams/:examId/students', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { examId } = req.params;
    const { data: sessions, error: sessionError } = await supabase
      .from('exam_sessions')
      .select(`
        session_id,
        status,
        start_time,
        students (id, name, email)
      `)
      .eq('exam_id', examId);

    if (sessionError) throw sessionError;

    // Calculate warnings and progress (assuming warnings are logged elsewhere)
    const students = await Promise.all(sessions.map(async (session) => {
      const { data: responses, error: responseError } = await supabase
        .from('responses')
        .select('question_id')
        .eq('session_id', session.session_id);

      if (responseError) throw responseError;

      const { data: questionCount, error: questionCountError } = await supabase
        .from('questions')
        .select('id', { count: 'exact' })
        .eq('exam_id', examId);

      if (questionCountError) throw questionCountError;

      const progress = questionCount.length > 0
        ? Math.round((responses.length / questionCount.length) * 100)
        : 0;

      return {
        id: session.students.id,
        name: session.students.name,
        email: session.students.email,
        status: session.status,
        progress,
        warnings: 0, // Replace with actual warning count if implemented
        lastActivity: session.start_time
      };
    }));

    res.json(students);
  } catch (error) {
    console.error('Error fetching exam students:', error);
    res.status(500).json({ error: 'Error fetching exam students' });
  }
});

// Start exam session endpoint
app.post('/api/exams/sessions/start', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { examId, studentName, studentEmail } = req.body;

    // Validate exam exists
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('*')
      .eq('id', examId)
      .single();

    if (examError || !exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Check for existing active session
    const { data: existingSession } = await supabase
      .from('exam_sessions')
      .select('id')
      .eq('student_id', req.user.id)
      .eq('exam_id', examId)
      .eq('status', 'active')
      .single();

    if (existingSession) {
      return res.json({ id: existingSession.id, examId, status: 'active' });
    }

    // Create new session
    const sessionId = uuidv4();
    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .insert({
        student_id: req.user.id,
        exam_id: examId,
        session_id: sessionId,
        status: 'active'
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    res.json({ id: session.session_id, examId, status: 'active' });
  } catch (error) {
    console.error('Error starting exam session:', error);
    res.status(500).json({ error: 'Error starting exam session' });
  }
});

// Register face for exam session
app.post('/api/exams/sessions/:sessionId/face', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { sessionId } = req.params;

    // Find the session
    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Handle face image upload (multipart)
    upload.none()(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Error handling upload' });
      }

      // For now, just acknowledge the request
      res.json({ success: true, message: 'Face registered' });
    });
  } catch (error) {
    console.error('Error registering face:', error);
    res.status(500).json({ error: 'Error registering face' });
  }
});

app.get('/api/exams', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: exams, error } = await supabase
      .from('exams')
      .select('id, title, exam_code');

    if (error) throw error;

    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'Error fetching exams' });
  }
});

// Resume analysis proxy endpoint (Node -> FastAPI)
app.post(
  '/api/resume/analyze',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jd', maxCount: 1 }
  ]),
  async (req, res) => {
    const resumeFile = req.files?.resume?.[0];
    const jdFile = req.files?.jd?.[0];

    try {
      if (!resumeFile || !jdFile) {
        return res.status(400).json({ error: 'Both resume and jd PDF files are required' });
      }

      const form = new FormData();
      form.append('resume', fs.createReadStream(resumeFile.path), {
        filename: resumeFile.originalname || 'resume.pdf',
        contentType: resumeFile.mimetype || 'application/pdf'
      });
      form.append('jd', fs.createReadStream(jdFile.path), {
        filename: jdFile.originalname || 'jd.pdf',
        contentType: jdFile.mimetype || 'application/pdf'
      });

      const response = await axios.post('http://localhost:8000/analyze-resume', form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity
      });

      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      console.error('Error proxying resume analysis request:', error.message);
      return res.status(500).json({ error: 'Failed to analyze resume' });
    } finally {
      const cleanupTargets = [resumeFile?.path, jdFile?.path].filter(Boolean);
      await Promise.all(
        cleanupTargets.map(async (filePath) => {
          try {
            await fsPromises.unlink(filePath);
          } catch (cleanupError) {
            if (cleanupError.code !== 'ENOENT') {
              console.error(`Failed to clean up uploaded file: ${filePath}`, cleanupError.message);
            }
          }
        })
      );
    }
  }
);

// ============ EXAM MANAGEMENT ROUTES ============

// Get employer's exams
app.get('/api/employer/exams', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'employer' && req.user.role !== 'admin')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: exams, error } = await supabase
      .from('exams')
      .select('*')
      .eq('employer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'Error fetching exams' });
  }
});

// Create exam for a job (employer)
app.post('/api/jobs/:jobId/exam', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'employer' && req.user.role !== 'admin')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { jobId } = req.params;
    const { title, description, duration, passing_score, questions } = req.body;

    // Verify job belongs to employer (admin)
    const { data: job } = await supabase
      .from('jobs')
      .select('id, admin_id')
      .eq('id', jobId)
      .single();

    if (!job || job.admin_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create exam
    const examCode = uuidv4().substring(0, 8).toUpperCase();
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .insert([{
        job_id: jobId,
        employer_id: req.user.id,
        title,
        description,
        duration,
        passing_score,
        exam_code: examCode,
        status: 'active'
      }])
      .select()
      .single();

    if (examError) throw examError;

    // Insert questions if provided
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q, index) => ({
        exam_id: exam.id,
        question_text: q.text,
        correct_answer: q.options.find(o => o.isCorrect)?.text || q.options[0]?.text,
        points: q.points || 1,
        order_index: index
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;
    }

    res.status(201).json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'Error creating exam' });
  }
});

// Get exam for a job
app.get('/api/jobs/:jobId/exam', async (req, res) => {
  try {
    const { jobId } = req.params;

    const { data: exam, error } = await supabase
      .from('exams')
      .select('*')
      .eq('job_id', jobId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'No exam found for this job' });
    }

    res.json(exam);
  } catch (error) {
    console.error('Error fetching job exam:', error);
    res.status(500).json({ error: 'Error fetching exam' });
  }
});

// Create exam standalone (employer)
app.post('/api/exams', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user.role !== 'employer' && req.user.role !== 'admin')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, duration, passing_score, questions, job_id } = req.body;

    const examCode = uuidv4().substring(0, 8).toUpperCase();
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .insert([{
        employer_id: req.user.id,
        job_id: job_id || null,
        title,
        description,
        duration: duration || 60,
        passing_score: passing_score || 70,
        exam_code: examCode,
        status: 'active'
      }])
      .select()
      .single();

    if (examError) throw examError;

    // Insert questions
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q, index) => ({
        exam_id: exam.id,
        question_text: q.text,
        correct_answer: q.options.find(o => o.isCorrect)?.text || q.options[0]?.text,
        points: q.points || 1,
        order_index: index
      }));

      await supabase.from('questions').insert(questionsToInsert);
    }

    res.status(201).json({ success: true, exam });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'Error creating exam' });
  }
});

// Get single exam
app.get('/api/exams/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: exam, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'Error fetching exam' });
  }
});

// Get exam with questions
app.get('/api/exams/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (examError || !exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', id)
      .order('order_index');

    if (questionError) throw questionError;

    res.json({ ...exam, questions });
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    res.status(500).json({ error: 'Error fetching exam' });
  }
});

// Start exam session
app.post('/api/exams/sessions', async (req, res) => {
  try {
    const { examId, studentName, studentEmail } = req.body;

    if (!req.isAuthenticated() || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check existing active session
    const { data: existingSession } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('student_id', req.user.id)
      .eq('exam_id', examId)
      .eq('status', 'active')
      .single();

    if (existingSession) {
      return res.json({ success: true, session: existingSession });
    }

    const sessionId = uuidv4();
    const { data: session, error } = await supabase
      .from('exam_sessions')
      .insert({
        student_id: req.user.id,
        exam_id: examId,
        session_id: sessionId,
        status: 'active',
        start_time: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, session });
  } catch (error) {
    console.error('Error starting exam session:', error);
    res.status(500).json({ error: 'Error starting exam session' });
  }
});

// Submit exam answers
app.post('/api/exams/answers', async (req, res) => {
  try {
    const { sessionId, questionId, optionId } = req.body;

    if (!req.isAuthenticated() || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find session
    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get question to check answer
    const { data: question } = await supabase
      .from('questions')
      .select('correct_answer, points')
      .eq('id', questionId)
      .single();

    const isCorrect = question?.correct_answer === optionId;
    const score = isCorrect ? (question?.points || 1) : 0;

    // Check for existing answer
    const { data: existingAnswer } = await supabase
      .from('responses')
      .select('id')
      .eq('session_id', session.id)
      .eq('question_id', questionId)
      .single();

    if (existingAnswer) {
      // Update existing answer
      await supabase
        .from('responses')
        .update({ answer: optionId, score })
        .eq('id', existingAnswer.id);
    } else {
      // Insert new answer
      await supabase
        .from('responses')
        .insert({
          session_id: session.id,
          question_id: questionId,
          answer: optionId,
          score
        });
    }

    res.json({ success: true, isCorrect, score });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Error submitting answer' });
  }
});

// Submit exam (mark complete)
app.post('/api/exams/sessions/:sessionId/submit', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!req.isAuthenticated() || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await supabase
      .from('exam_sessions')
      .update({
        status: 'completed',
        end_time: new Date().toISOString()
      })
      .eq('id', session.id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ error: 'Error submitting exam' });
  }
});

// Get exam results
app.get('/api/exams/sessions/:sessionId/results', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get all responses
    const { data: responses, error: responseError } = await supabase
      .from('responses')
      .select('*')
      .eq('session_id', session.id);

    if (responseError) throw responseError;

    // Get total questions
    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('id, points')
      .eq('exam_id', session.exam_id);

    if (questionError) throw questionError;

    const totalScore = questions.reduce((sum, q) => sum + q.points, 0);
    const earnedScore = responses.reduce((sum, r) => sum + (r.score || 0), 0);
    const percentage = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;

    res.json({
      session_id: sessionId,
      totalScore,
      earnedScore,
      percentage,
      status: session.status
    });
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ error: 'Error fetching results' });
  }
});

// Get student's applications (alias for /api/student/applications)
app.get('/api/my-applications', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (id, title, location, salary_min, salary_max,
              employers (company_name, company_logo))
      `)
      .eq('student_id', req.user.id)
      .order('applied_at', { ascending: false });

    if (error) throw error;

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// Get dashboard stats for admin
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const adminId = req.user.id;

    // Get all jobs for this admin
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id')
      .eq('admin_id', adminId);

    const jobIds = jobs ? jobs.map(j => j.id) : [];

    // Get exams for this admin
    const { data: exams } = await supabase
      .from('exams')
      .select('id, status, title')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })
      .limit(10);

    const examIds = exams ? exams.map(e => e.id) : [];

    // Get all applications for admin's jobs
    const { data: applications } = await supabase
      .from('applications')
      .select('id, status, test_score, resume_score, student_id')
      .in('job_id', jobIds.length > 0 ? jobIds : ['none']);

    // Calculate stats
    const activeSessions = applications ? applications.filter(a => a.status === 'in_progress' || a.status === 'started').length : 0;
    const totalCandidates = applications ? applications.length : 0;
    const examsCreated = exams ? exams.length : 0;
    const flaggedApps = applications ? applications.filter(a => a.status === 'flagged' || a.status === 'suspicious').length : 0;

    // Get exam sessions for active monitoring
    const { data: examSessions } = await supabase
      .from('exam_sessions')
      .select('*, students(name, email)')
      .in('exam_id', examIds.length > 0 ? examIds : ['none'])
      .eq('status', 'active');

    // Format active sessions
    const activeSessionsData = examSessions ? examSessions.map(session => ({
      id: session.id,
      session_id: session.session_id,
      name: session.students?.name || 'Unknown Student',
      email: session.students?.email || '',
      exam_id: session.exam_id,
      status: session.status,
      progress: session.progress || 0,
      start_time: session.start_time
    })) : [];

    res.json({
      stats: {
        activeSessions,
        totalCandidates,
        examsCreated,
        alerts: flaggedApps
      },
      exams: exams || [],
      activeSessions: activeSessionsData,
      recentApplications: applications ? applications.slice(0, 10) : []
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
});

// Get single application
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (*),
        students (id, name, email)
      `)
      .eq('id', id)
      .single();

    if (error || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Error fetching application' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));