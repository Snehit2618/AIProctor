import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { FiActivity, FiUsers, FiShield, FiAlertTriangle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const Content = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--success-light);
  border-radius: 9999px;
  font-size: 0.85rem;
  color: var(--success);
  font-weight: 600;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: var(--success);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--background-alt);
    color: var(--text-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-top: 0.5rem;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const SessionsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const SessionItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
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

const SessionAvatar = styled.div`
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

const SessionInfo = styled.div`
  flex: 1;
`;

const SessionName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const SessionMeta = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  gap: 1rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$status === 'active' ? 'var(--success)' : props.$status === 'warning' ? 'var(--warning)' : 'var(--text-muted)'};
`;

const AlertItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  background: ${props => props.$severity === 'high' ? 'var(--danger-light)' : props.$severity === 'medium' ? 'var(--warning-light)' : 'var(--info-light)'};
  border-radius: ${props => props.$first ? '0.5rem' : '0'};
  margin-bottom: ${props => props.$first ? '0.5rem' : '0'};

  &:last-child {
    border-bottom: none;
  }
`;

const AlertIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$severity === 'high' ? 'var(--danger)' : props.$severity === 'medium' ? 'var(--warning)' : 'var(--info)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const AlertDesc = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const AlertTime = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
`;

const ExamCard = styled(motion.div)`
  background: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-light);
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ExamTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const ExamMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const ExamMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  border-radius: 4px;
  width: ${props => props.$value}%;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--danger);
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    activeSessions: 0,
    totalCandidates: 0,
    examsToday: 0,
    alerts: 0
  });
  const [activeSessions, setActiveSessions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [applications, setApplications] = useState([]);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const res = await fetch('http://localhost:5001/api/admin/dashboard-stats', {
        credentials: 'include',
        headers
      });

      let data = { stats: {}, exams: [], activeSessions: [], recentApplications: [] };

      if (res.ok) {
        data = await res.json();
      }

      setStats({
        activeSessions: data.stats?.activeSessions || 0,
        totalCandidates: data.stats?.totalCandidates || 0,
        examsToday: data.stats?.examsCreated || 0,
        alerts: data.stats?.alerts || 0
      });

      setRecentExams((data.exams || []).slice(0, 5).map(exam => ({
        id: exam.id,
        title: exam.title || 'Untitled Exam',
        candidates: (data.recentApplications || []).filter(a => a.job_id === exam.job_id).length,
        completed: (data.recentApplications || []).filter(a => a.job_id === exam.job_id && a.status === 'completed').length,
        avgScore: exam.avg_score || 0
      })));

      setActiveSessions((data.activeSessions || []).slice(0, 5).map((session, index) => ({
        id: session.id || index,
        name: session.name || 'Unknown',
        email: session.email || '',
        exam: exam.title || 'Exam',
        progress: session.progress || 0,
        status: session.status === 'active' ? 'active' : 'completed',
        time: session.start_time ? `${Math.floor((Date.now() - new Date(session.start_time).getTime()) / 60000)} min ago` : 'Just now'
      })));

      const alertsCount = data.stats?.alerts || 0;
      const newAlerts = [];
      if (alertsCount > 0) {
        newAlerts.push({ severity: 'high', title: 'Flagged Applications', desc: `${alertsCount} application(s) flagged`, time: 'Just now', first: true });
      }
      if ((data.stats?.activeSessions || 0) > 0) {
        newAlerts.push({ severity: 'medium', title: 'Active Sessions', desc: `${data.stats.activeSessions} exam session(s) in progress`, time: 'Live', first: newAlerts.length === 0 });
      }
      if (newAlerts.length === 0) {
        newAlerts.push({ severity: 'low', title: 'System Normal', desc: 'All systems operating normally', time: 'Now', first: true });
      }
      setAlerts(newAlerts);
      setApplications(data.recentApplications || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (loading) {
    return (
      <PageContainer>
        <NavBar user={user} role="admin" />
        <Content>
          <LoadingState>Loading dashboard...</LoadingState>
        </Content>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <NavBar user={user} role="admin" />
        <Content>
          <ErrorState>{error}</ErrorState>
        </Content>
      </PageContainer>
    );
  }

  const statCards = [
    { label: 'Active Sessions', value: stats.activeSessions.toString(), icon: <FiActivity size={20} />, trend: 'Live now', color: 'success' },
    { label: 'Total Candidates', value: stats.totalCandidates.toString(), icon: <FiUsers size={20} />, trend: '+0 today', color: 'primary' },
    { label: 'Exams Created', value: stats.examsToday.toString(), icon: <FiShield size={20} />, trend: 'All time', color: 'accent' },
    { label: 'Alerts', value: stats.alerts.toString(), icon: <FiAlertTriangle size={20} />, trend: stats.alerts > 0 ? 'Need attention' : 'All clear', color: stats.alerts > 0 ? 'warning' : 'success' }
  ];

  return (
    <PageContainer>
      <NavBar user={user} role="admin" />
      <Content>
        <Header>
          <div>
            <Title>
              Admin Dashboard
              <LiveIndicator>LIVE</LiveIndicator>
            </Title>
            <Subtitle>Real-time exam proctoring and system analytics</Subtitle>
          </div>
          <RefreshButton onClick={handleRefresh} disabled={refreshing}>
            <FiRefreshCw size={16} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </RefreshButton>
        </Header>

        <StatsGrid>
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </StatsGrid>

        <Grid>
          <Card>
            <CardHeader>
              <CardTitle>Active Exam Sessions</CardTitle>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {activeSessions.length} session(s)
              </span>
            </CardHeader>
            <SessionsList>
              {activeSessions.length === 0 ? (
                <EmptyState>No active sessions</EmptyState>
              ) : (
                activeSessions.map((session, index) => (
                  <SessionItem
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SessionAvatar>
                      {session.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </SessionAvatar>
                    <SessionInfo>
                      <SessionName>{session.name}</SessionName>
                      <SessionMeta>
                        <span>{session.exam}</span>
                        <span>{session.time}</span>
                      </SessionMeta>
                    </SessionInfo>
                    <StatusDot $status={session.status} />
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {session.progress}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>complete</div>
                    </div>
                  </SessionItem>
                ))
              )}
            </SessionsList>
          </Card>

          <div>
            <Card style={{ marginBottom: '2rem' }}>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
              </CardHeader>
              <CardBody>
                {alerts.length === 0 ? (
                  <EmptyState>No alerts</EmptyState>
                ) : (
                  alerts.map((alert, index) => (
                    <AlertItem key={index} $severity={alert.severity} $first={alert.first}>
                      <AlertIcon $severity={alert.severity}>
                        <FiAlertTriangle size={16} />
                      </AlertIcon>
                      <AlertContent>
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDesc>{alert.desc}</AlertDesc>
                      </AlertContent>
                      <AlertTime>{alert.time}</AlertTime>
                    </AlertItem>
                  ))
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Performance</CardTitle>
              </CardHeader>
              <CardBody>
                {recentExams.length === 0 ? (
                  <EmptyState>No exams created yet</EmptyState>
                ) : (
                  recentExams.map((exam, index) => (
                    <ExamCard
                      key={exam.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <ExamHeader>
                        <ExamTitle>{exam.title}</ExamTitle>
                        <StatusBadge status="open" />
                      </ExamHeader>
                      <ExamMeta>
                        <ExamMetaItem><FiUsers size={14} /> {exam.candidates} candidates</ExamMetaItem>
                        <ExamMetaItem><FiCheckCircle size={14} /> {exam.completed} completed</ExamMetaItem>
                      </ExamMeta>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span>Average Score: {exam.avgScore}%</span>
                      </div>
                      <ProgressBar>
                        <Progress $value={exam.candidates > 0 ? (exam.completed / exam.candidates) * 100 : 0} />
                      </ProgressBar>
                    </ExamCard>
                  ))
                )}
              </CardBody>
            </Card>
          </div>
        </Grid>
      </Content>
    </PageContainer>
  );
};

export default AdminDashboard;