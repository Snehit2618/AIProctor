import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StatCardContainer = styled(motion.div)`
  background: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || 'var(--info-light)'};
  color: ${props => props.color || 'var(--primary)'};
`;

const Trend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.$positive ? 'var(--success)' : 'var(--danger)'};
`;

const Value = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
`;

const Label = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: var(--background-alt);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
  border-radius: 3px;
`;

const StatCard = ({
  icon,
  label,
  value,
  trend,
  trendValue,
  progress,
  color = 'primary',
  bgColor,
}) => {
  const colors = {
    primary: { bg: 'var(--info-light)', color: 'var(--primary)' },
    success: { bg: 'var(--success-light)', color: 'var(--success)' },
    warning: { bg: 'var(--warning-light)', color: 'var(--warning)' },
    danger: { bg: 'var(--danger-light)', color: 'var(--danger)' },
  };

  const colorScheme = colors[color] || colors.primary;

  return (
    <StatCardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <IconBox bgColor={bgColor || colorScheme.bg} color={colorScheme.color}>
          {icon}
        </IconBox>
        {trend && (
          <Trend $positive={trend === 'up'}>
            {trend === 'up' ? '+' : '-'}{trendValue}
          </Trend>
        )}
      </Header>
      <div>
        <Value>{value}</Value>
        <Label>{label}</Label>
      </div>
      {progress !== undefined && (
        <ProgressBar>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </ProgressBar>
      )}
    </StatCardContainer>
  );
};

export default StatCard;