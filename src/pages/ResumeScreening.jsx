import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFileText, FiUpload } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  padding: 2rem;
`;

const ScreeningCard = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 440px;
`;

const Title = styled.h2`
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const Button = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: var(--danger);
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
`;

const InfoMessage = styled.p`
  color: var(--text-primary);
  font-size: 0.95rem;
  text-align: center;
  margin-top: 1rem;
`;

export default function ResumeScreening() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!resumeFile || !jdFile) {
      setError('Please upload both Resume PDF and Job Description PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jd', jdFile);

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Resume screening failed. Please try again.');
        return;
      }

      const score = Number(result.match_percentage || 0);

      if (score >= 60) {
        sessionStorage.setItem('screeningPassed', 'true');
        navigate('/exam', {
          state: {
            exam: location.state?.exam,
            sessionId: location.state?.sessionId
          }
        });
        return;
      }

      setMessage(`You are not eligible for this exam. Resume score: ${score.toFixed(2)}%`);
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <ScreeningCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Resume Screening</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="resume-upload">
              <FiFileText />
              Resume PDF
            </Label>
            <FileInput
              id="resume-upload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="jd-upload">
              <FiFileText />
              Job Description PDF
            </Label>
            <FileInput
              id="jd-upload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setJdFile(e.target.files?.[0] || null)}
              required
            />
          </InputGroup>

          <Button type="submit" disabled={isLoading}>
            <FiUpload />
            {isLoading ? 'Analyzing Resume...' : 'Submit for Screening'}
          </Button>
        </Form>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <InfoMessage>{message}</InfoMessage>}
      </ScreeningCard>
    </Container>
  );
}
