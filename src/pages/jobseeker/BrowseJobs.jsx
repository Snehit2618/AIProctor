import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import StatusBadge from '../../components/common/StatusBadge';
import { FiSearch, FiBriefcase, FiArrowRight, FiClock } from 'react-icons/fi';

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
  margin-bottom: 2rem;
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

const SearchSection = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--background);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const JobCard = styled(motion.div)`
  background: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary);
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CompanyLogo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
`;

const JobTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const CompanyName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: var(--info-light);
  color: var(--primary);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const JobFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
`;

const PostedTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
`;

const ApplyButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  grid-column: 1 / -1;
`;

const BrowseJobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/jobs');
      const data = await res.json();
      if (res.ok) {
        setJobs(data);
      } else {
        setError('Failed to load jobs');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <PageContainer>
        <NavBar user={user} role="jobseeker" />
        <Content>
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading jobs...</div>
        </Content>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <NavBar user={user} role="jobseeker" />
        <Content>
          <div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>{error}</div>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <NavBar user={user} role="jobseeker" />
      <Content>
        <Header>
          <Title>Find Your Dream Job</Title>
          <Subtitle>Browse {jobs.length} opportunities</Subtitle>
        </Header>

        <SearchSection>
          <SearchBar>
            <SearchInput>
              <SearchIcon><FiSearch size={20} /></SearchIcon>
              <Input
                type="text"
                placeholder="Search jobs by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInput>
          </SearchBar>
        </SearchSection>

        <JobGrid>
          {filteredJobs.length === 0 ? (
            <EmptyState>
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria</p>
            </EmptyState>
          ) : filteredJobs.map((job, index) => (
            <JobCard
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <JobHeader>
                <CompanyLogo>{job.admins?.name?.charAt(0) || 'J'}</CompanyLogo>
                <StatusBadge status={job.is_active ? 'open' : 'closed'} />
              </JobHeader>
              <JobTitle>{job.title}</JobTitle>
              <CompanyName><FiBriefcase size={14} /> {job.admins?.name || 'Company'}</CompanyName>
              <Tags>
                <Tag>Code: {job.exam_code}</Tag>
                <Tag>Pass: {job.passing_threshold}%</Tag>
              </Tags>
              <JobFooter>
                <PostedTime><FiClock size={14} /> Posted {formatDate(job.created_at)}</PostedTime>
                <ApplyButton onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}/apply`); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Apply <FiArrowRight size={14} />
                </ApplyButton>
              </JobFooter>
            </JobCard>
          ))}
        </JobGrid>
      </Content>
    </PageContainer>
  );
};

export default BrowseJobs;
