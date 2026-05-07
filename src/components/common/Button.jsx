import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ButtonBase = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  font-family: inherit;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const variants = {
  primary: `
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: var(--text-inverse);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  `,
  secondary: `
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border);
  `,
  outline: `
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
  `,
  ghost: `
    background: transparent;
    color: var(--text-secondary);
  `,
  danger: `
    background: var(--danger);
    color: var(--text-inverse);
  `,
  success: `
    background: var(--success);
    color: var(--text-inverse);
  `,
};

const sizes = {
  xs: { padding: '0.375rem 0.75rem', fontSize: '0.75rem' },
  sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
  lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  xl: { padding: '1.25rem 2.5rem', fontSize: '1.25rem' },
};

const StyledButton = styled(ButtonBase)`
  ${props => variants[props.$variant] || variants.primary}
  ${props => sizes[props.$size] || sizes.md}

  &:hover:not(:disabled) {
    ${props => {
      if (props.$variant === 'primary') return 'transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);';
      if (props.$variant === 'secondary') return 'background: var(--background-alt);';
      if (props.$variant === 'outline') return 'background: var(--info-light);';
      if (props.$variant === 'ghost') return 'background: var(--background-alt); color: var(--text-primary);';
      if (props.$variant === 'danger') return 'background: #dc2626; transform: translateY(-1px);';
      return '';
    }}
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </StyledButton>
  );
};

export default Button;