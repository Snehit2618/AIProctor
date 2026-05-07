import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { FiBriefcase, FiUsers, FiFileText, FiCheckCircle, FiClock, FiPlus, FiArrowRight } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const JobsTable = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  padding: 1rem 1.5rem;
  background: var(--background);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  padding: 1rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--background);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const JobTitle = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const JobCompany = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
`;

const Cell = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: var(--info-light);
  color: var(--primary);
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: var(--primary);
    color: white;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);

  p {
    margin-bottom: 1rem;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionCard = styled(motion.div)`
  background: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: ${props => props.$bg || 'var(--info-light)'};
  color: ${props => props.$color || 'var(--primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const ActionDesc = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
`;

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployerData();
  }, []);

  const fetchEmployerData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch('http://localhost:5001/api/admin/jobs', { credentials: 'include' }),
        fetch('http://localhost:5001/api/employer/applications', { credentials: 'include' })
      ]);

      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();

      if (jobsRes.ok && Array.isArray(jobsData)) {
        setJobs(jobsData);
      }
      if (appsRes.ok && Array.isArray(appsData)) {
        setApplications(appsData);
      }
    } catch (err) {
      console.error('Error fetching employer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const quickActions = [
    { icon: <FiPlus size={24} />, title: 'Post New Job', desc: 'Create a new job listing', path: '/employer/jobs/new', bg: 'var(--primary-light)', color: 'var(--primary)' },
    { icon: <FiFileText size={24} />, title: 'Create Exam', desc: 'Build assessment for candidates', path: '/employer/exams/new', bg: 'var(--success-light)', color: 'var(--success)' },
    { icon: <FiUsers size={24} />, title: 'Review Candidates', desc: 'View pending applications', path: '/employer/candidates', bg: 'var(--warning-light)', color: 'var(--warning)' }
  ];

  if (loading) {
    return (
      <PageContainer>
        <NavBar user={user} role="employer" />
        <Content>
          <LoadingState>Loading dashboard...</LoadingState>
        </Content>
      </PageContainer>
    );
  }

  const stats = [
    { label: 'Active Jobs', value: jobs.filter(j => j.is_active).length, icon: <FiBriefcase size={20} />, trend: 'Currently active', color: 'var(--primary)' },
    { label: 'Total Applications', value: applications.length, icon: <FiUsers size={20} />, trend: 'All time', color: 'var(--success)' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'screening').length, icon: <FiClock size={20} />, trend: 'Needs attention', color: 'var(--warning)' },
    { label: 'Total Jobs', value: jobs.length, icon: <FiCheckCircle size={20} />, trend: 'All postings', color: 'var(--accent)' }
  ];

  return (
    <PageContainer>
      <NavBar user={user} role="employer" />
      <Content>
        <Header>
          <Title>Welcome back, {user.name || 'Employer'}</Title>
          <HeaderActions>
            <Button onClick={() => navigate('/employer/jobs/new')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <FiPlus size={18} />
              Post New Job
            </Button>
          </HeaderActions>
        </Header>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </StatsGrid>

        <QuickActions>
          {quickActions.map((action, index) => (
            <ActionCard
              key={index}
              onClick={() => navigate(action.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <ActionIcon $bg={action.bg} $color={action.color}>{action.icon}</ActionIcon>
              <ActionContent>
                <ActionTitle>{action.title}</ActionTitle>
                <ActionDesc>{action.desc}</ActionDesc>
              </ActionContent>
            </ActionCard>
          ))}
        </QuickActions>

        <Section>
          <SectionTitle>Your Job Listings</SectionTitle>
          {jobs.length === 0 ? (
            <EmptyState>
              <p>No jobs posted yet</p>
              <Button onClick={() => navigate('/employer/jobs/new')} style={{ marginTop: '1rem' }}>
                <FiPlus size={18} /> Create Your First Job
              </Button>
            </EmptyState>
          ) : (
            <JobsTable>
              <TableHeader>
                <span>Job Title</span>
                <span>Exam Code</span>
                <span>Status</span>
                <span>Posted</span>
                <span>Actions</span>
              </TableHeader>
              {jobs.map((job, index) => (
                <TableRow
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <div>
                    <JobTitle>{job.title}</JobTitle>
                    <JobCompany>Pass: {job.passing_threshold}%</JobCompany>
                  </div>
                  <Cell>{job.exam_code || 'N/A'}</Cell>
                  <Cell><StatusBadge status={job.is_active ? 'open' : 'closed'} /></Cell>
                  <Cell>{formatDate(job.created_at)}</Cell>
                  <ActionButton onClick={() => navigate(`/employer/jobs/${job.id}/candidates`)}>
                    View <FiArrowRight size={14} />
                  </ActionButton>
                </TableRow>
              ))}
            </JobsTable>
          )}
        </Section>
      </Content>
    </PageContainer>
  );
};

export default EmployerDashboard;