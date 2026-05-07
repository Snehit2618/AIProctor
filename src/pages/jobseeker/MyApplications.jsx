import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import StatusBadge from '../../components/common/StatusBadge';
import { FiArrowRight, FiClock, FiCheck, FiX, FiMail, FiFileText } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const Content = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1rem;

  &:hover {
    color: var(--primary);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
`;

const Card = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ApplicationItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CandidateAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
`;

const CandidateInfo = styled.div`
  flex: 1;
`;

const CandidateName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const CandidateMeta = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  gap: 1rem;
`;

const MatchScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${props => props.$score >= 70 ? 'var(--success-light)' : props.$score >= 50 ? 'var(--warning-light)' : 'var(--danger-light)'};
  border-radius: 0.75rem;
  min-width: 80px;
`;

const MatchValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$score >= 70 ? 'var(--success)' : props.$score >= 50 ? 'var(--warning)' : 'var(--danger)'};
`;

const MatchLabel = styled.div`
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-transform: uppercase;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: ${props => props.$variant === 'primary' ? 'var(--primary)' : props.$variant === 'success' ? 'var(--success)' : props.$variant === 'danger' ? 'var(--danger)' : 'var(--surface)'};
  color: ${props => props.$variant ? 'white' : 'var(--text-primary)'};
  border: ${props => props.$variant ? 'none' : '1px solid var(--border)'};
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.$active ? 'var(--primary)' : 'var(--surface)'};
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$active ? 'var(--primary)' : 'var(--border)'};
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
`;

const MyApplications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/student/applications', {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setApplications(data);
      } else {
        setError('Failed to load applications');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'all', label: 'All', count: applications.length },
    { key: 'screening', label: 'Screening', count: applications.filter(a => a.status === 'screening').length },
    { key: 'resume_selected', label: 'Selected', count: applications.filter(a => a.status === 'resume_selected').length },
    { key: 'exam_sent', label: 'Exam Sent', count: applications.filter(a => a.status === 'exam_sent').length },
    { key: 'completed', label: 'Completed', count: applications.filter(a => a.status === 'completed' || a.status === 'accepted' || a.status === 'rejected').length }
  ];

  const filteredApplications = activeTab === 'all'
    ? applications
    : activeTab === 'completed'
    ? applications.filter(a => ['completed', 'accepted', 'rejected'].includes(a.status))
    : applications.filter(a => a.status === activeTab);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <FiCheck size={14} />;
      case 'rejected': return <FiX size={14} />;
      default: return <FiClock size={14} />;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <NavBar user={user} role="jobseeker" />
        <Content>
          <LoadingState>Loading applications...</LoadingState>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <NavBar user={user} role="jobseeker" />
      <Content>
        <Header>
          <Title>My Applications</Title>
          <Subtitle>Track your job application status</Subtitle>
        </Header>

        <FilterTabs>
          {tabs.map(tab => (
            <FilterTab
              key={tab.key}
              $active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} ({tab.count})
            </FilterTab>
          ))}
        </FilterTabs>

        <Card>
          <CardTitle><FiFileText size={18} /> Application History</CardTitle>
          {error && <EmptyState><p style={{ color: 'var(--danger)' }}>{error}</p></EmptyState>}
          {filteredApplications.length === 0 ? (
            <EmptyState>
              <p>No applications found</p>
              <ActionButton onClick={() => navigate('/jobs')} $variant="primary">
                Browse Jobs <FiArrowRight size={14} />
              </ActionButton>
            </EmptyState>
          ) : (
            filteredApplications.map((app, index) => (
              <ApplicationItem
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CandidateAvatar>
                  {app.students?.name?.split(' ').map(n => n[0]).join('') || '?'}
                </CandidateAvatar>
                <CandidateInfo>
                  <CandidateName>{app.students?.name || 'Candidate'}</CandidateName>
                  <CandidateMeta>
                    <span>{app.jobs?.title || 'Position'}</span>
                    <span>{app.jobs?.admins?.name || ''}</span>
                    <span>{formatDate(app.created_at)}</span>
                  </CandidateMeta>
                </CandidateInfo>
                {app.match_score && (
                  <MatchScore $score={app.match_score}>
                    <MatchValue $score={app.match_score}>{app.match_score}%</MatchValue>
                    <MatchLabel>Match</MatchLabel>
                  </MatchScore>
                )}
                <StatusBadge status={app.status} />
                <ActionButtons>
                  <ActionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <FiMail size={14} /> View
                  </ActionButton>
                </ActionButtons>
              </ApplicationItem>
            ))
          )}
        </Card>
      </Content>
    </PageContainer>
  );
};

export default MyApplications;