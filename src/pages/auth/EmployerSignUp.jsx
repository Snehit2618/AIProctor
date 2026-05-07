import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiBriefcase, FiGlobe, FiArrowRight, FiCheck, FiMapPin } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const LeftSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
  }
`;

const BrandContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const WelcomeText = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  line-height: 1.7;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 0.95rem;
`;

const FeatureIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  overflow-y: auto;
`;

const FormCard = styled(motion.div)`
  background: var(--surface);
  border-radius: 1.5rem;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
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
    background: var(--surface);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  &:hover {
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SignUpLink = styled.div`
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-top: 1.5rem;

  a {
    color: var(--primary);
    font-weight: 600;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: var(--danger-light);
  color: var(--danger);
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background: var(--success-light);
  color: var(--success);
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  display: block;
`;

const EmployerSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    company_website: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/signup/employer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          company_name: formData.company_name
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/employer-login'), 2000);
      } else {
        setError(data.error || 'Error creating account');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LeftSection>
        <BrandContent>
          <Logo>ProctorAI</Logo>
          <WelcomeTitle>Start Hiring Today</WelcomeTitle>
          <WelcomeText>
            Create your employer account and connect with thousands
            of qualified candidates through AI-powered screening.
          </WelcomeText>
          <FeatureList>
            <FeatureItem>
              <FeatureIcon><FiCheck size={14} /></FeatureIcon>
              Free employer account
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon><FiCheck size={14} /></FeatureIcon>
              Post unlimited jobs
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon><FiCheck size={14} /></FeatureIcon>
              Access AI-powered screening
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon><FiCheck size={14} /></FeatureIcon>
              Real-time candidate analytics
            </FeatureItem>
          </FeatureList>
        </BrandContent>
      </LeftSection>

      <RightSection>
        <FormCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FormTitle>Create employer account</FormTitle>
          <FormSubtitle>Set up your company profile and start hiring</FormSubtitle>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && (
              <SuccessMessage>
                <FiCheck size={18} />
                Account created! Redirecting...
              </SuccessMessage>
            )}

            <Row>
              <div>
                <Label>Your Name</Label>
                <InputGroup>
                  <InputIcon><FiUser size={18} /></InputIcon>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </div>
              <div>
                <Label>Company Name</Label>
                <InputGroup>
                  <InputIcon><FiBriefcase size={18} /></InputIcon>
                  <Input
                    type="text"
                    name="company_name"
                    placeholder="Company name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </div>
            </Row>

            <div>
              <Label>Business Email</Label>
              <InputGroup>
                <InputIcon><FiMail size={18} /></InputIcon>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </div>

            <Row>
              <div>
                <Label>Password</Label>
                <InputGroup>
                  <InputIcon><FiLock size={18} /></InputIcon>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </div>
              <div>
                <Label>Confirm Password</Label>
                <InputGroup>
                  <InputIcon><FiLock size={18} /></InputIcon>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </div>
            </Row>

            <Row>
              <div>
                <Label>Company Website (optional)</Label>
                <InputGroup>
                  <InputIcon><FiGlobe size={18} /></InputIcon>
                  <Input
                    type="text"
                    name="company_website"
                    placeholder="www.company.com"
                    value={formData.company_website}
                    onChange={handleChange}
                  />
                </InputGroup>
              </div>
              <div>
                <Label>Location (optional)</Label>
                <InputGroup>
                  <InputIcon><FiMapPin size={18} /></InputIcon>
                  <Input
                    type="text"
                    name="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </InputGroup>
              </div>
            </Row>

            <SubmitButton
              type="submit"
              disabled={isLoading || success}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              <FiArrowRight size={18} />
            </SubmitButton>
          </Form>

          <SignUpLink>
            Already have an account? <a href="/employer-login">Sign in</a>
          </SignUpLink>
        </FormCard>
      </RightSection>
    </Container>
  );
};

export default EmployerSignUp;