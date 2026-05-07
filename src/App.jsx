import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';

// Auth pages
import StudentLogin from './pages/StudentLogin';
import StudentSignIn from './pages/StudentSignIn';
import AdminLogin from './pages/AdminLogin';
import AdminSignIn from './pages/AdminSignIn';
import LandingPage from './pages/LandingPage';
import JobSeekerLogin from './pages/auth/JobSeekerLogin';
import JobSeekerSignUp from './pages/auth/JobSeekerSignUp';
import EmployerLogin from './pages/auth/EmployerLogin';
import EmployerSignUp from './pages/auth/EmployerSignUp';

// Job Seeker pages
import BrowseJobs from './pages/jobseeker/BrowseJobs';
import JobDetail from './pages/jobseeker/JobDetail';
import ApplyToJob from './pages/jobseeker/ApplyToJob';
import MyApplications from './pages/jobseeker/MyApplications';
import ResumeScreening from './pages/ResumeScreening';

// Employer pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerCandidates from './pages/employer/EmployerCandidates';
import CreateJob from './pages/employer/CreateJob';
import JobCandidates from './pages/employer/JobCandidates';
import ExamBuilder from './pages/employer/ExamBuilder';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Components
import ExamInterface from './components/exam/ExamInterface';
import ProctorDashboard from './components/dashboard/ProctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-signin" element={<StudentSignIn />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signin" element={<AdminSignIn />} />

        {/* Job Seeker Auth */}
        <Route path="/jobseeker-login" element={<JobSeekerLogin />} />
        <Route path="/jobseeker-signup" element={<JobSeekerSignUp />} />

        {/* Employer Auth */}
        <Route path="/employer-login" element={<EmployerLogin />} />
        <Route path="/employer-signup" element={<EmployerSignUp />} />

        {/* Protected Routes */}
        <Route
          path="/resume-screening"
          element={
            <ProtectedRoute role="student">
              <ResumeScreening />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam"
          element={
            <ProtectedRoute role="student">
              <ExamInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proctor"
          element={
            <ProtectedRoute role="admin">
              <ProctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Job Seeker Protected */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute role="jobseeker">
              <BrowseJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute role="jobseeker">
              <JobDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute role="jobseeker">
              <ApplyToJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="jobseeker">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Employer Protected */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/new"
          element={
            <ProtectedRoute role="employer">
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/:id/candidates"
          element={
            <ProtectedRoute role="employer">
              <JobCandidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/candidates"
          element={
            <ProtectedRoute role="employer">
              <EmployerCandidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/exams/new"
          element={
            <ProtectedRoute role="employer">
              <ExamBuilder />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;