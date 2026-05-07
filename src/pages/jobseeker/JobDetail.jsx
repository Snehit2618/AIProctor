import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import StatusBadge from '../../components/common/StatusBadge';
import { FiArrowLeft, FiBriefcase, FiClock, FiFileText, FiSend, FiCheck, FiCode } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const Content = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
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
  margin-bottom: 1.5rem;

  &:hover {
    color: var(--primary);
  }
`;

const JobHeader = styled(motion.div)`
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const CompanyLogo = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
`;

const JobTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const CompanyName = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-light);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ApplyButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
  }
`;

const Section = styled.section`
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.div`
  color: var(--text-secondary);
  line-height: 1.8;
  white-space: pre-wrap;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  padding: 0.5rem 1rem;
  background: var(--info-light);
  color: var(--primary);
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SkillItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-primary);

  &::before {
    content: '✓';
    color: var(--success);
    font-weight: bold;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  background: var(--background);
  border-radius: 0.75rem;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/${id}`);
      const data = await res.json();
      if (res.ok) {
        setJob(data);
      } else {
        setError('Failed to load job');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <PageContainer>
        <NavBar user={user} role="jobseeker" />
        <Content><div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div></Content>
      </PageContainer>
    );
  }

  if (error || !job) {
    return (
      <PageContainer>
        <NavBar user={user} role="jobseeker" />
        <Content><div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>{error || 'Job not found'}</div></Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <NavBar user={user} role="jobseeker" />
      <Content>
        <BackButton onClick={() => navigate('/jobs')}>
          <FiArrowLeft size={18} /> Back to Jobs
        </BackButton>

        <JobHeader
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeaderTop>
            <div>
              <JobTitle>{job.title}</JobTitle>
              <CompanyName><FiBriefcase size={16} /> {job.admins?.name || 'Company'}</CompanyName>
            </div>
            <ApplyButton
              onClick={() => navigate(`/jobs/${job.id}/apply`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSend size={18} /> Apply Now
            </ApplyButton>
          </HeaderTop>
          <MetaRow>
            <MetaItem><FiCode size={16} /> Exam Code: {job.exam_code}</MetaItem>
            <MetaItem><FiClock size={16} /> Pass Threshold: {job.passing_threshold}%</MetaItem>
            <MetaItem><StatusBadge status={job.is_active ? 'open' : 'closed'} /></MetaItem>
          </MetaRow>
        </JobHeader>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionTitle><FiFileText size={18} /> Job Description</SectionTitle>
          <Description>{job.jd_text || job.description || 'No description provided.'}</Description>
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionTitle>Exam Information</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Exam Code</InfoLabel>
              <InfoValue>{job.exam_code}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Passing Threshold</InfoLabel>
              <InfoValue>{job.passing_threshold}%</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Status</InfoLabel>
              <InfoValue>{job.is_active ? 'Active' : 'Closed'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Posted</InfoLabel>
              <InfoValue>{formatDate(job.created_at)}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Section>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <ApplyButton
            onClick={() => navigate(`/jobs/${job.id}/apply`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
          >
            <FiCheck size={20} /> Apply for this Position
          </ApplyButton>
        </div>
      </Content>
    </PageContainer>
  );
};

export default JobDetail;