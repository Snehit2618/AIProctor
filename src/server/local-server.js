import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use(cors());

// JSON file for data storage
const DATA_FILE = './data.json';

// Initialize data file
function initData() {
  if (!existsSync(DATA_FILE)) {
    const initialData = {
      students: [],
      employers: [],
      admins: [],
      jobs: [],
      applications: [],
      exams: [],
      examSessions: [],
      responses: [],
      notifications: []
    };
    writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readData() {
  return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// In-memory session store (simple auth simulation)
const sessions = {};

// Auth middleware
function authMiddleware(roles = []) {
  return (req, res, next) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !sessions[sessionId]) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = sessions[sessionId];
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// ============ AUTH ROUTES ============

app.post('/api/signup/student', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const data = readData();

    if (data.students.find(s => s.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      created_at: new Date().toISOString()
    };

    data.students.push(student);
    writeData(data);

    const sessionId = uuidv4();
    sessions[sessionId] = { id: student.id, role: 'student', email: student.email };

    res.status(201).json({
      success: true,
      user: { id: student.id, email: student.email, role: 'student' },
      sessionId
    });
  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({ error: 'Error creating student account' });
  }
});

app.post('/api/signup/employer', async (req, res) => {
  try {
    const { email, password, name, company_name } = req.body;
    const data = readData();

    if (data.employers.find(e => e.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employer = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      company_name: company_name || '',
      created_at: new Date().toISOString()
    };

    data.employers.push(employer);
    writeData(data);

    const sessionId = uuidv4();
    sessions[sessionId] = { id: employer.id, role: 'employer', email: employer.email, name: employer.name };

    res.status(201).json({
      success: true,
      user: { id: employer.id, email: employer.email, role: 'employer', name: employer.name },
      sessionId
    });
  } catch (error) {
    console.error('Employer signup error:', error);
    res.status(500).json({ error: 'Error creating employer account' });
  }
});

app.post('/api/signup/admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const data = readData();

    if (data.admins.find(a => a.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      created_at: new Date().toISOString()
    };

    data.admins.push(admin);
    writeData(data);

    const sessionId = uuidv4();
    sessions[sessionId] = { id: admin.id, role: 'admin', email: admin.email };

    res.status(201).json({
      success: true,
      user: { id: admin.id, email: admin.email, role: 'admin' },
      sessionId
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ error: 'Error creating admin account' });
  }
});

app.post('/api/login/student', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = readData();

    const student = data.students.find(s => s.email === email);
    if (!student) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, student.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const sessionId = uuidv4();
    sessions[sessionId] = { id: student.id, role: 'student', email: student.email };

    res.json({
      success: true,
      user: { id: student.id, email: student.email, role: 'student' },
      sessionId
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/login/employer', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = readData();

    const employer = data.employers.find(e => e.email === email);
    if (!employer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, employer.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const sessionId = uuidv4();
    sessions[sessionId] = { id: employer.id, role: 'employer', email: employer.email, name: employer.name };

    res.json({
      success: true,
      user: { id: employer.id, email: employer.email, role: 'employer', name: employer.name },
      sessionId
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/login/admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = readData();

    const admin = data.admins.find(a => a.email === email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const sessionId = uuidv4();
    sessions[sessionId] = { id: admin.id, role: 'admin', email: admin.email };

    res.json({
      success: true,
      user: { id: admin.id, email: admin.email, role: 'admin' },
      sessionId
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/me', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (sessionId && sessions[sessionId]) {
    res.json({ user: sessions[sessionId] });
  } else {
    res.status(401).json({ user: null });
  }
});

app.post('/api/logout', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (sessionId) {
    delete sessions[sessionId];
  }
  res.json({ success: true });
});

// ============ JOB ROUTES ============

app.get('/api/jobs', (req, res) => {
  try {
    const data = readData();
    const jobs = data.jobs
      .filter(j => j.status === 'open')
      .map(j => ({
        ...j,
        employer: data.employers.find(e => e.id === j.employer_id)
      }));
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

app.get('/api/jobs/:id', (req, res) => {
  try {
    const data = readData();
    const job = data.jobs.find(j => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    job.employer = data.employers.find(e => e.id === job.employer_id);
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching job' });
  }
});

app.post('/api/jobs', authMiddleware(['employer']), (req, res) => {
  try {
    const data = readData();
    const job = {
      id: uuidv4(),
      employer_id: req.user.id,
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
      location: req.body.location,
      salary_min: req.body.salary_min,
      salary_max: req.body.salary_max,
      job_type: req.body.job_type || 'full-time',
      experience_level: req.body.experience_level,
      remote_status: req.body.remote_status,
      skills_required: req.body.skills_required || [],
      status: 'open',
      application_count: 0,
      created_at: new Date().toISOString()
    };

    data.jobs.push(job);
    writeData(data);

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Error creating job' });
  }
});

app.get('/api/employer/jobs', authMiddleware(['employer']), (req, res) => {
  try {
    const data = readData();
    const jobs = data.jobs.filter(j => j.employer_id === req.user.id);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

app.delete('/api/jobs/:id', authMiddleware(['employer']), (req, res) => {
  try {
    const data = readData();
    const jobIndex = data.jobs.findIndex(j => j.id === req.params.id && j.employer_id === req.user.id);
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }
    data.jobs[jobIndex].status = 'closed';
    writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error closing job' });
  }
});

// ============ APPLICATION ROUTES ============

app.post('/api/jobs/:id/apply', authMiddleware(['student']), (req, res) => {
  try {
    const data = readData();
    const jobId = req.params.id;

    const existingApp = data.applications.find(
      a => a.job_id === jobId && a.student_id === req.user.id
    );
    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const application = {
      id: uuidv4(),
      job_id: jobId,
      student_id: req.user.id,
      resume_url: req.body.resume_url || null,
      cover_letter: req.body.cover_letter || '',
      status: 'applied',
      applied_at: new Date().toISOString()
    };

    data.applications.push(application);

    const job = data.jobs.find(j => j.id === jobId);
    if (job) {
      job.application_count = (job.application_count || 0) + 1;
    }

    writeData(data);
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Error applying to job' });
  }
});

app.get('/api/jobs/:id/applications', authMiddleware(['employer']), (req, res) => {
  try {
    const data = readData();
    const job = data.jobs.find(j => j.id === req.params.id && j.employer_id === req.user.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const applications = data.applications
      .filter(a => a.job_id === req.params.id)
      .map(a => ({
        ...a,
        student: data.students.find(s => s.id === a.student_id)
      }));

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

app.put('/api/applications/:id/status', authMiddleware(['employer']), (req, res) => {
  try {
    const data = readData();
    const appIndex = data.applications.findIndex(a => a.id === req.params.id);
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    data.applications[appIndex].status = req.body.status;
    data.applications[appIndex].updated_at = new Date().toISOString();

    writeData(data);
    res.json(data.applications[appIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating application' });
  }
});

app.get('/api/my-applications', authMiddleware(['student']), (req, res) => {
  try {
    const data = readData();
    const applications = data.applications
      .filter(a => a.student_id === req.user.id)
      .map(a => ({
        ...a,
        job: data.jobs.find(j => j.id === a.job_id),
        employer: data.employers.find(e => e.id === data.jobs.find(j => j.id === a.job_id)?.employer_id)
      }));
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// ============ EXAM ROUTES ============

app.post('/api/jobs/:jobId/exam', authMiddleware(['employer']), (req, res) => {
  try {
    const data = readData();
    const examCode = uuidv4().substring(0, 8).toUpperCase();

    const exam = {
      id: uuidv4(),
      job_id: req.params.jobId,
      employer_id: req.user.id,
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration || 60,
      passing_score: req.body.passing_score || 70,
      exam_code: examCode,
      status: 'active',
      created_at: new Date().toISOString()
    };

    data.exams.push(exam);
    writeData(data);

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Error creating exam' });
  }
});

app.get('/api/jobs/:jobId/exam', (req, res) => {
  try {
    const data = readData();
    const exam = data.exams.find(e => e.job_id === req.params.jobId);
    if (!exam) {
      return res.status(404).json({ error: 'No exam found for this job' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exam' });
  }
});

app.post('/api/exams/sessions', authMiddleware(['student']), (req, res) => {
  try {
    const data = readData();
    const sessionId = uuidv4();

    const session = {
      id: uuidv4(),
      session_id: sessionId,
      student_id: req.user.id,
      exam_id: req.body.examId,
      status: 'active',
      start_time: new Date().toISOString()
    };

    data.examSessions.push(session);
    writeData(data);

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: 'Error starting exam' });
  }
});

app.post('/api/exams/answers', authMiddleware(['student']), (req, res) => {
  try {
    const data = readData();
    const { sessionId, questionId, optionId } = req.body;

    // Check for existing answer
    const existingIndex = data.responses.findIndex(
      r => r.session_id === sessionId && r.question_id === questionId
    );

    if (existingIndex !== -1) {
      data.responses[existingIndex].answer = optionId;
    } else {
      data.responses.push({
        session_id: sessionId,
        question_id: questionId,
        answer: optionId,
        score: 0
      });
    }

    writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting answer' });
  }
});

app.post('/api/exams/sessions/:sessionId/submit', authMiddleware(['student']), (req, res) => {
  try {
    const data = readData();
    const session = data.examSessions.find(s => s.session_id === req.params.sessionId);
    if (session) {
      session.status = 'completed';
      session.end_time = new Date().toISOString();
      writeData(data);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting exam' });
  }
});

app.get('/api/exams/:id', (req, res) => {
  try {
    const data = readData();
    const exam = data.exams.find(e => e.id === req.params.id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exam' });
  }
});

app.get('/api/employer/exams', authMiddleware(['employer']), (req, res) => {
  try {
    const data = readData();
    const exams = data.exams.filter(e => e.employer_id === req.user.id);
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exams' });
  }
});

// ============ STATS ROUTES ============

app.get('/api/stats/overview', authMiddleware(['admin', 'employer']), (req, res) => {
  try {
    const data = readData();
    const stats = {
      totalJobs: data.jobs.filter(j => j.status === 'open').length,
      totalApplications: data.applications.length,
      totalStudents: data.students.length,
      totalEmployers: data.employers.length,
      pendingApplications: data.applications.filter(a => a.status === 'applied').length,
      shortlisted: data.applications.filter(a => a.status === 'shortlisted').length
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

// Initialize and start
initData();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Local server running on port ${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
