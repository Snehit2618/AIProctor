import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5001/api';
const socket = io('http://localhost:5001');

// Session ID from localStorage
const getSessionId = () => localStorage.getItem('sessionId');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'x-session-id': getSessionId()
  }
});

// Add request interceptor to always get latest session
api.interceptors.request.use((config) => {
  config.headers['x-session-id'] = getSessionId();
  return config;
});

// Auth services
export const authService = {
  signupStudent: async (email, password, name) => {
    const response = await api.post('/signup/student', { email, password, name });
    if (response.data.sessionId) {
      localStorage.setItem('sessionId', response.data.sessionId);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  signupEmployer: async (email, password, name, company_name) => {
    const response = await api.post('/signup/employer', { email, password, name, company_name });
    if (response.data.sessionId) {
      localStorage.setItem('sessionId', response.data.sessionId);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  signupAdmin: async (email, password, name) => {
    const response = await api.post('/signup/admin', { email, password, name });
    if (response.data.sessionId) {
      localStorage.setItem('sessionId', response.data.sessionId);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  loginStudent: async (email, password) => {
    const response = await api.post('/login/student', { email, password });
    if (response.data.sessionId) {
      localStorage.setItem('sessionId', response.data.sessionId);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  loginEmployer: async (email, password) => {
    const response = await api.post('/login/employer', { email, password });
    if (response.data.sessionId) {
      localStorage.setItem('sessionId', response.data.sessionId);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  loginAdmin: async (email, password) => {
    const response = await api.post('/login/admin', { email, password });
    if (response.data.sessionId) {
      localStorage.setItem('sessionId', response.data.sessionId);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  }
};

// Job services
export const jobService = {
  getJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  getEmployerJobs: async () => {
    const response = await api.get('/employer/jobs');
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getJobApplications: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
  }
};

// Application services
export const applicationService = {
  applyToJob: async (jobId, applicationData) => {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/my-applications');
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.put(`/applications/${applicationId}/status`, { status });
    return response.data;
  }
};

// Exam services
export const examService = {
  getExams: async () => {
    const response = await api.get('/exams');
    return response.data;
  },

  getExamById: async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  startExamSession: async (examId) => {
    const response = await api.post('/exams/sessions', { examId });
    return response.data;
  },

  submitAnswer: async (sessionId, questionId, optionId) => {
    const response = await api.post('/exams/answers', { sessionId, questionId, optionId });
    return response.data;
  },

  submitExam: async (sessionId) => {
    const response = await api.post(`/exams/sessions/${sessionId}/submit`);
    return response.data;
  },

  createExam: async (jobId, examData) => {
    const response = await api.post(`/jobs/${jobId}/exam`, examData);
    return response.data;
  },

  getExamByJob: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/exam`);
    return response.data;
  },

  getEmployerExams: async () => {
    const response = await api.get('/employer/exams');
    return response.data;
  }
};

// Proctoring services
export const proctoringService = {
  logEvent: async (sessionId, eventType, details = {}, screenshot = null) => {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('eventType', eventType);
    formData.append('details', JSON.stringify(details));

    if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    const response = await api.post('/proctoring/log', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data;
  },

  verifyFace: async (sessionId, faceImage) => {
    const formData = new FormData();
    formData.append('faceImage', faceImage);

    const response = await api.post(`/proctoring/sessions/${sessionId}/verify-face`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data;
  },

  getSessionLogs: async (sessionId) => {
    const response = await api.get(`/proctoring/sessions/${sessionId}/logs`);
    return response.data.data;
  },

  getExamSessions: async (examId) => {
    const response = await api.get(`/proctoring/exams/${examId}/sessions`);
    return response.data.data;
  },

  joinExamSession: (sessionId) => {
    socket.emit('join-exam-session', sessionId);
  },

  joinProctorRoom: (examId) => {
    socket.emit('join-proctor-room', examId);
  },

  onProctoringEvent: (callback) => {
    socket.on('proctoring-event', callback);
    return () => socket.off('proctoring-event', callback);
  }
};

export default {
  jobs: jobService,
  applications: applicationService,
  exams: examService,
  proctoring: proctoringService,
  socket
};