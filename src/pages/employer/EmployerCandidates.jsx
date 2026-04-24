import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import StatusBadge from '../../components/common/StatusBadge';
import { FiSearch, FiFilter, FiFileText, FiSend, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const Content = styled.main`
  max-width: 1200px;
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
  margin-bottom: 1rem;

  &:hover {
    color: var(--primary);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;

  span {
    font-weight: 600;
    color: var(--primary);
  }
`;

const StatsCard = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  text-align: center;
  min-width: 80px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.$color || 'var(--primary)'};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
`;

const SearchSection = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  flex: 1;
  min-width: 250px;
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
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const FilterSelect = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  font-size: 0.9rem;
  background: var(--background);
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Table = styled.div`
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
  font-size: 0.8rem;
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
  transition: background 0.2s ease;

  &:hover {
    background: var(--background);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CandidateCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
`;

const CandidateInfo = styled.div``;

const CandidateName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const CandidateEmail = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const JobTitle = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionBtn = styled(motion.button)`
  padding: 0.4rem 0.75rem;
  background: ${props => props.$variant === 'primary' ? 'var(--primary)' :
                props.$variant === 'success' ? 'var(--success)' :
                props.$variant === 'danger' ? 'var(--danger)' : 'var(--surface)'};
  color: ${props => props.$variant ? 'white' : 'var(--text-primary)'};
  border: 1px solid ${props => props.$variant ? 'none' : 'var(--border)'};
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
`;

const EmployerCandidates = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/employer/applications', {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCandidates(data);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(c => {
    const name = c.students?.name || '';
    const email = c.students?.email || '';
    const jobTitle = c.jobs?.title || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: candidates.length,
    screening: candidates.filter(c => c.status === 'screening').length,
    exam_sent: candidates.filter(c => c.status === 'exam_sent').length,
    completed: candidates.filter(c => c.status === 'completed').length,
    accepted: candidates.filter(c => c.status === 'accepted').length,
    rejected: candidates.filter(c => c.status === 'rejected').length
  };

  const handleSendExam = async (applicationId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/applications/${applicationId}/send-exam`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        fetchCandidates();
      }
    } catch (err) {
      console.error('Error sending exam:', err);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5001/api/applications/${applicationId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchCandidates();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <PageContainer>
      <NavBar user={user} role="employer" />
      <Content>
        <BackButton onClick={() => navigate('/employer/dashboard')}>
          <FiArrowLeft size={18} /> Back to Dashboard
        </BackButton>

        <Header>
          <div>
            <Title>All Candidates</Title>
            <StatsRow>
              <StatItem><span>{statusCounts.all}</span> Total</StatItem>
              <StatItem><span>{statusCounts.screening}</span> Under Review</StatItem>
              <StatItem><span>{statusCounts.accepted}</span> Shortlisted</StatItem>
            </StatsRow>
          </div>
        </Header>

        <StatsCard>
          <StatBox>
            <StatValue $color="var(--primary)">{statusCounts.all}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue $color="var(--warning)">{statusCounts.screening}</StatValue>
            <StatLabel>Screening</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue $color="var(--info)">{statusCounts.exam_sent}</StatValue>
            <StatLabel>Exam Sent</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue $color="var(--success)">{statusCounts.completed}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue $color="var(--success)">{statusCounts.accepted}</StatValue>
            <StatLabel>Accepted</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue $color="var(--danger)">{statusCounts.rejected}</StatValue>
            <StatLabel>Rejected</StatLabel>
          </StatBox>
        </StatsCard>

        <SearchSection>
          <SearchInput>
            <SearchIcon><FiSearch size={18} /></SearchIcon>
            <Input
              type="text"
              placeholder="Search by name, email, or job..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="screening">Under Review</option>
            <option value="exam_sent">Exam Sent</option>
            <option value="completed">Completed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </FilterSelect>
        </SearchSection>

        <Table>
          <TableHeader>
            <span>Candidate</span>
            <span>Job</span>
            <span>Match</span>
            <span>Status</span>
            <span>Actions</span>
          </TableHeader>
          {loading ? (
            <EmptyState>Loading candidates...</EmptyState>
          ) : filteredCandidates.length === 0 ? (
            <EmptyState>
              <p>No candidates found</p>
            </EmptyState>
          ) : (
            filteredCandidates.map((candidate, index) => (
              <TableRow
                key={candidate.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CandidateCell>
                  <Avatar>{(candidate.students?.name || '?').split(' ').map(n => n[0]).join('').substring(0, 2)}</Avatar>
                  <CandidateInfo>
                    <CandidateName>{candidate.students?.name || 'Unknown'}</CandidateName>
                    <CandidateEmail>{candidate.students?.email || 'No email'}</CandidateEmail>
                  </CandidateInfo>
                </CandidateCell>
                <JobTitle>{candidate.jobs?.title || 'N/A'}</JobTitle>
                <span style={{ fontWeight: 600, color: (candidate.resume_score || 0) >= 70 ? 'var(--success)' : 'var(--text-secondary)' }}>
                  {candidate.resume_score || 0}%
                </span>
                <StatusBadge status={candidate.status} />
                <ActionButtons>
                  <ActionBtn onClick={() => navigate(`/employer/jobs/${candidate.job_id}/candidates`)}>
                    <FiFileText size={14} /> View
                  </ActionBtn>
                  {candidate.status === 'screening' && (
                    <ActionBtn $variant="primary" onClick={() => handleSendExam(candidate.id)}>
                      <FiSend size={14} /> Send Exam
                    </ActionBtn>
                  )}
                  {candidate.status === 'completed' && (
                    <>
                      <ActionBtn $variant="success" onClick={() => handleUpdateStatus(candidate.id, 'accepted')}>
                        <FiCheck size={14} /> Accept
                      </ActionBtn>
                      <ActionBtn $variant="danger" onClick={() => handleUpdateStatus(candidate.id, 'rejected')}>
                        <FiX size={14} /> Reject
                      </ActionBtn>
                    </>
                  )}
                </ActionButtons>
              </TableRow>
            ))
          )}
        </Table>
      </Content>
    </PageContainer>
  );
};

export default EmployerCandidates;
