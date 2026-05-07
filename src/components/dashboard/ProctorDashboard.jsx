import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiAlertTriangle, FiCheckCircle, FiClock, FiSearch, FiEye, FiMessageSquare } from 'react-icons/fi';

import Header from '../common/Header';
import Card from '../common/Card';
import Button from '../common/Button';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: var(--background);
`;

const DashboardContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.$type === 'students' ? 'rgba(67, 97, 238, 0.1)' :
    props.$type === 'warnings' ? 'rgba(255, 190, 11, 0.1)' :
    props.$type === 'completed' ? 'rgba(76, 201, 240, 0.1)' :
    'rgba(67, 97, 238, 0.1)'
  };
  color: ${props =>
    props.$type === 'students' ? 'var(--primary)' :
    props.$type === 'warnings' ? 'var(--warning)' :
    props.$type === 'completed' ? 'var(--success)' :
    'var(--primary)'
  };
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 0 16px;
  box-shadow: var(--shadow);
  width: 300px;

  input {
    border: none;
    padding: 12px 0;
    width: 100%;

    &:focus {
      outline: none;
    }
  }
`;

const ExamSelector = styled.select`
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
`;

const StudentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const StudentCard = styled(Card)`
  position: relative;
  overflow: visible;
`;

const StudentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const StudentAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--background);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.h3`
  margin-bottom: 4px;
`;

const StudentEmail = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const StudentStatus = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: ${props =>
    props.$status === 'active' ? 'rgba(76, 201, 240, 0.1)' :
    props.$status === 'warning' ? 'rgba(255, 190, 11, 0.1)' :
    props.$status === 'critical' ? 'rgba(230, 57, 70, 0.1)' :
    props.$status === 'completed' ? 'rgba(76, 201, 240, 0.1)' :
    'rgba(141, 153, 174, 0.1)'
  };
  color: ${props =>
    props.$status === 'active' ? 'var(--success)' :
    props.$status === 'warning' ? 'var(--warning)' :
    props.$status === 'critical' ? 'var(--danger)' :
    props.$status === 'completed' ? 'var(--success)' :
    'var(--text-secondary)'
  };
`;

const WarningBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: var(--danger);
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(230, 57, 70, 0.4);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  grid-column: 1 / -1;
`;

const ProctorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [examTime, setExamTime] = useState(0);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchStudents();
    } else {
      setStudents([]);
      setFilteredStudents([]);
      setLoading(false);
    }
  }, [selectedExam]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(student =>
      (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  useEffect(() => {
    const timer = setInterval(() => {
      setExamTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/exams', {
        credentials: 'include'
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setExams(data);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/exams/${selectedExam}/students`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
        setFilteredStudents(data);
      } else {
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWarning = (studentId) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, warnings: (student.warnings || 0) + 1, status: student.warnings >= 3 ? 'critical' : 'warning' }
          : student
      )
    );
  };

  if (loading && selectedExam) {
    return (
      <DashboardContainer>
        <Header />
        <DashboardContent>
          <LoadingState>Loading...</LoadingState>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  const activeStudents = Array.isArray(students) ? students.filter(s => s.status !== 'completed').length : 0;
  const totalWarnings = Array.isArray(students) ? students.reduce((sum, student) => sum + (student.warnings || 0), 0) : 0;
  const completedExams = Array.isArray(students) ? students.filter(s => s.status === 'completed').length : 0;

  return (
    <DashboardContainer>
      <Header />

      <DashboardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Exam Monitoring Dashboard</h1>
          <p style={{ marginBottom: '16px' }}>
            {selectedExam && exams.find(e => e.id === selectedExam) ? exams.find(e => e.id === selectedExam).title : 'Select an exam to monitor'}
          </p>

          <ExamSelector
            value={selectedExam || ''}
            onChange={e => setSelectedExam(e.target.value)}
            style={{ marginBottom: '24px' }}
          >
            <option value="">Select Exam</option>
            {Array.isArray(exams) && exams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.title} ({exam.exam_code})</option>
            ))}
          </ExamSelector>

          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatIcon $type="students">
                  <FiUsers size={24} />
                </StatIcon>
                <FiClock size={20} color="var(--text-secondary)" />
              </StatHeader>
              <StatValue>{activeStudents}</StatValue>
              <StatLabel>Active Students</StatLabel>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatIcon $type="warnings">
                  <FiAlertTriangle size={24} />
                </StatIcon>
                <FiClock size={20} color="var(--text-secondary)" />
              </StatHeader>
              <StatValue>{totalWarnings}</StatValue>
              <StatLabel>Total Warnings</StatLabel>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatIcon $type="completed">
                  <FiCheckCircle size={24} />
                </StatIcon>
                <FiClock size={20} color="var(--text-secondary)" />
              </StatHeader>
              <StatValue>{completedExams}</StatValue>
              <StatLabel>Completed Exams</StatLabel>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatIcon>
                  <FiClock size={24} />
                </StatIcon>
                <FiClock size={20} color="var(--text-secondary)" />
              </StatHeader>
              <StatValue>
                {Math.floor(examTime / 3600)}:{Math.floor((examTime % 3600) / 60).toString().padStart(2, '0')}
              </StatValue>
              <StatLabel>Remaining Time</StatLabel>
            </StatCard>
          </StatsGrid>

          <ControlBar>
            <SearchBar>
              <FiSearch size={20} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>

            <Button variant="primary">End Exam</Button>
          </ControlBar>

          {!selectedExam ? (
            <EmptyState>
              <p>Please select an exam from the dropdown above to view monitoring dashboard.</p>
            </EmptyState>
          ) : filteredStudents.length === 0 ? (
            <EmptyState>
              <p>No students found for this exam.</p>
            </EmptyState>
          ) : (
            <StudentGrid>
              <AnimatePresence>
                {filteredStudents.map(student => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <StudentCard>
                      {(student.warnings || 0) > 0 && (
                        <WarningBadge>{student.warnings}</WarningBadge>
                      )}

                      <StudentHeader>
                        <StudentAvatar>
                          <img src={student.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={student.name || 'Student'} />
                        </StudentAvatar>
                        <StudentInfo>
                          <StudentName>{student.name || 'Unknown Student'}</StudentName>
                          <StudentEmail>{student.email || 'No email'}</StudentEmail>
                        </StudentInfo>
                      </StudentHeader>

                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Progress:</span>
                          <div style={{
                            height: '6px',
                            background: 'var(--background)',
                            borderRadius: '3px',
                            marginTop: '6px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${student.progress || 0}%`,
                              background: 'var(--primary)',
                              borderRadius: '3px'
                            }} />
                          </div>
                        </div>

                        <StudentStatus>
                          <StatusBadge $status={student.status || 'active'}>
                            {student.status === 'active' && <FiCheckCircle size={14} />}
                            {student.status === 'warning' && <FiAlertTriangle size={14} />}
                            {student.status === 'critical' && <FiAlertTriangle size={14} />}
                            {student.status === 'completed' && <FiCheckCircle size={14} />}
                            {(student.status || 'active').charAt(0).toUpperCase() + (student.status || 'active').slice(1)}
                          </StatusBadge>

                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {student.progress || 0}% Complete
                          </span>
                        </StudentStatus>
                      </div>

                      <ActionButtons>
                        <Button
                          size="small"
                          variant="primary"
                          icon={<FiEye size={16} />}
                        >
                          View
                        </Button>

                        <Button
                          size="small"
                          variant="secondary"
                          icon={<FiMessageSquare size={16} />}
                        >
                          Message
                        </Button>

                        <Button
                          size="small"
                          variant="danger"
                          onClick={() => handleSendWarning(student.id)}
                        >
                          Send Warning
                        </Button>
                      </ActionButtons>
                    </StudentCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </StudentGrid>
          )}
        </motion.div>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default ProctorDashboard;