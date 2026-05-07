import React from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;

  ${props => {
    const styles = {
      // Status colors
      applied: { bg: '#e0e7ff', color: '#6366f1' },
      screening: { bg: '#fef3c7', color: '#f59e0b' },
      exam_sent: { bg: '#dbeafe', color: '#3b82f6' },
      exam_completed: { bg: '#d1fae5', color: '#10b981' },
      review: { bg: '#fce7f3', color: '#ec4899' },
      shortlisted: { bg: '#d1fae5', color: '#059669' },
      accepted: { bg: '#d1fae5', color: '#059669' },
      rejected: { bg: '#fee2e2', color: '#ef4444' },
      active: { bg: '#d1fae5', color: '#059669' },
      paused: { bg: '#fef3c7', color: '#f59e0b' },
      closed: { bg: '#f1f5f9', color: '#64748b' },
      open: { bg: '#d1fae5', color: '#059669' },
      draft: { bg: '#f1f5f9', color: '#64748b' },
      // Role colors
      admin: { bg: '#fee2e2', color: '#dc2626' },
      employer: { bg: '#dbeafe', color: '#2563eb' },
      student: { bg: '#d1fae5', color: '#059669' },
      // General colors
      primary: { bg: '#dbeafe', color: '#2563eb' },
      success: { bg: '#d1fae5', color: '#059669' },
      warning: { bg: '#fef3c7', color: '#f59e0b' },
      danger: { bg: '#fee2e2', color: '#dc2626' },
      info: { bg: '#e0e7ff', color: '#6366f1' },
    };

    const style = styles[props.$variant] || styles.primary;
    return `
      background-color: ${style.bg};
      color: ${style.color};
    `;
  }}
`;

const StatusBadge = ({ children, variant, dot }) => {
  return (
    <BadgeContainer $variant={variant}>
      {dot && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor'
        }} />
      )}
      {children}
    </BadgeContainer>
  );
};

export default StatusBadge;