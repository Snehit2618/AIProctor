import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-light);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--background-alt);
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light);
  background: var(--background-alt);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Card = ({ children, className, ...props }) => {
  return (
    <CardContainer className={className} {...props}>
      {children}
    </CardContainer>
  );
};

Card.Header = ({ title, action, icon }) => (
  <CardHeader>
    <CardTitle>
      {icon && <span style={{ color: 'var(--primary)' }}>{icon}</span>}
      {title}
    </CardTitle>
    {action && <div>{action}</div>}
  </CardHeader>
);

Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;