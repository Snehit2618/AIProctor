import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiBell, FiUser, FiLogOut, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  cursor: pointer;

  span {
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.$active ? 'var(--primary)' : 'var(--text-secondary)'};
  background: ${props => props.$active ? 'var(--info-light)' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background: var(--background-alt);
    color: var(--text-primary);
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--text-secondary);
  position: relative;

  &:hover {
    background: var(--background-alt);
    color: var(--text-primary);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: var(--danger);
  border-radius: 50%;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-inverse);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: var(--surface);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-light);
  min-width: 200px;
  padding: 0.5rem;
  z-index: 100;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  background: transparent;
  text-align: left;

  &:hover {
    background: var(--background-alt);
    color: var(--text-primary);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: var(--border-light);
  margin: 0.5rem 0;
`;

const UserInfo = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 0.5rem;
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
`;

const UserRole = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const NavBar = ({ user, role = 'jobseeker' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Monitoring', path: '/admin/monitoring' },
          { label: 'Reports', path: '/admin/reports' },
        ];
      case 'employer':
        return [
          { label: 'Dashboard', path: '/employer/dashboard' },
          { label: 'Create Job', path: '/employer/jobs/new' },
          { label: 'Create Exam', path: '/employer/exams/new' },
          { label: 'Candidates', path: '/employer/candidates' },
        ];
      default:
        return [
          { label: 'Browse Jobs', path: '/jobs' },
          { label: 'My Applications', path: '/my-applications' },
          { label: 'Resume', path: '/my-resume' },
        ];
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const links = getLinks();

  return (
    <NavContainer>
      <NavLeft>
        <Logo onClick={() => navigate('/')}>
          <span>ProctorAI</span>
        </Logo>
        <NavLinks>
          {links.map(link => (
            <NavLink
              key={link.path}
              $active={location.pathname === link.path}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>
      </NavLeft>

      <NavRight>
        <IconButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FiSearch size={20} />
        </IconButton>
        <IconButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FiBell size={20} />
          <Badge />
        </IconButton>

        <Dropdown>
          <Avatar onClick={() => setShowDropdown(!showDropdown)}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          {showDropdown && (
            <DropdownMenu
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowDropdown(false)}
            >
              <UserInfo>
                <UserName>{user?.name || 'User'}</UserName>
                <UserRole>{role === 'employer' ? 'Employer' : role === 'admin' ? 'Admin' : 'Job Seeker'}</UserRole>
              </UserInfo>
              <DropdownItem onClick={() => navigate(`/${role}/profile`)}>
                <FiUser size={18} />
                Profile Settings
              </DropdownItem>
              <Divider />
              <DropdownItem onClick={handleLogout}>
                <FiLogOut size={18} />
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          )}
        </Dropdown>
      </NavRight>
    </NavContainer>
  );
};

export default NavBar;