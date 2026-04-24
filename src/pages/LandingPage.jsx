import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiShield, FiBriefcase, FiChevronRight, FiCheck, FiZap, FiEye, FiLock, FiUsers, FiTrendingUp } from 'react-icons/fi';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 1.75rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  ${props => {
    const styles = {
      jobseeker: 'background: var(--surface); color: var(--text-primary); border: 1px solid var(--border);',
      employer: 'background: var(--primary); color: white;',
      admin: 'background: var(--secondary); color: white;',
      primary: 'background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: white;'
    };
    return styles[props.$type] || styles.primary;
  }}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;

const HeroSection = styled.section`
  padding: 8rem 4rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--info-light);
  color: var(--primary);
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.2;

  span {
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.7;
`;

const RoleCards = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1000px;
  margin: 3rem auto 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RoleCard = styled(motion.div)`
  background: var(--surface);
  border-radius: 1.25rem;
  padding: 2rem;
  text-align: left;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary);
  }
`;

const RoleIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: ${props => props.$bg || 'var(--info-light)'};
  color: ${props => props.$color || 'var(--primary)'};
`;

const RoleTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const RoleDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const RoleFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const FeatureDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
`;

const CTAButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }
`;

const StatsSection = styled.section`
  background: var(--surface);
  padding: 4rem;
  margin-top: 4rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
`;

const StatValue = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const FooterSection = styled.footer`
  background: var(--secondary);
  color: white;
  padding: 3rem 4rem;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const LandingPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      type: 'jobseeker',
      icon: <FiUser size={28} />,
      title: 'Job Seekers',
      description: 'Find your dream job, upload your resume, pass AI-screening, and ace exams to get hired.',
      features: ['Browse thousands of jobs', 'AI resume screening', 'Take proctored exams', 'Track application status'],
      bg: 'var(--success-light)',
      color: 'var(--success)',
      path: '/jobseeker-login'
    },
    {
      type: 'employer',
      icon: <FiBriefcase size={28} />,
      title: 'Employers',
      description: 'Post jobs, create exams, review candidates with AI-powered screening and analytics.',
      features: ['Post jobs instantly', 'Create custom exams', 'AI candidate matching', 'Real-time analytics'],
      bg: 'var(--info-light)',
      color: 'var(--primary)',
      path: '/employer-login'
    },
    {
      type: 'admin',
      icon: <FiShield size={28} />,
      title: 'Administrators',
      description: 'Monitor all exams in real-time, manage users, and ensure system integrity.',
      features: ['Live exam monitoring', 'System analytics', 'User management', 'Security controls'],
      bg: 'var(--warning-light)',
      color: 'var(--warning)',
      path: '/admin-login'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Job Seekers' },
    { value: '500+', label: 'Companies Hiring' },
    { value: '50K+', label: 'Exams Proctored' },
    { value: '95%', label: 'Satisfaction Rate' }
  ];

  return (
    <LandingContainer>
      <NavBar>
        <Logo>ProctorAI</Logo>
        <NavButtons>
          <NavButton $type="jobseeker" onClick={() => navigate('/jobseeker-login')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FiUser size={18} />
            Job Seeker
          </NavButton>
          <NavButton $type="employer" onClick={() => navigate('/employer-login')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FiBriefcase size={18} />
            Employer
          </NavButton>
          <NavButton $type="admin" onClick={() => navigate('/admin-login')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FiShield size={18} />
            Admin
          </NavButton>
        </NavButtons>
      </NavBar>

      <HeroSection>
        <HeroContent>
          <Badge
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FiZap size={16} />
            AI-Powered Hiring Platform
          </Badge>

          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Transform Your <span> hiring process</span> with AI
          </Title>

          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Connect employers with top talent through intelligent screening,
            secure proctored exams, and data-driven hiring decisions.
          </Subtitle>

          <RoleCards
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {roles.map((role, index) => (
              <RoleCard
                key={role.type}
                onClick={() => navigate(role.path)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -8 }}
              >
                <RoleIcon $bg={role.bg} $color={role.color}>
                  {role.icon}
                </RoleIcon>
                <RoleTitle>{role.title}</RoleTitle>
                <RoleDescription>{role.description}</RoleDescription>
                <RoleFeatures>
                  {role.features.map((feature, i) => (
                    <FeatureItem key={i}>
                      <FeatureDot />
                      {feature}
                    </FeatureItem>
                  ))}
                </RoleFeatures>
              </RoleCard>
            ))}
          </RoleCards>

          <CTAButton
            onClick={() => navigate('/jobseeker-login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
            <FiChevronRight size={20} />
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsGrid>
      </StatsSection>

      <FooterSection>
        <Logo style={{ fontSize: '2rem', marginBottom: '1rem' }}>ProctorAI</Logo>
        <FooterText>Building the future of hiring with AI-powered proctoring</FooterText>
      </FooterSection>
    </LandingContainer>
  );
};

export default LandingPage;