import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import { FiBriefcase, FiFileText, FiSave, FiArrowLeft } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const Content = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;

  &:hover {
    color: var(--primary);
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
`;

const FormCard = styled(motion.div)`
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--background);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--background);
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-light);
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    &:hover {
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  ` : `
    background: var(--surface);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    &:hover {
      background: var(--background);
    }
  `}
`;

const ErrorMessage = styled.div`
  background: var(--danger-light);
  color: var(--danger);
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled.div`
  background: var(--success-light);
  color: var(--success);
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CreateJob = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jd_text: '',
    exam_code: '',
    passing_threshold: 50,
    jd_keywords: ''
  });

  const [skillsInput, setSkillsInput] = useState('');
  const [skills, setSkills] = useState([]);

  const addSkill = () => {
    const skill = skillsInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setFormData({ ...formData, jd_keywords: skills.join(',') });
    }
    setSkillsInput('');
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = skills.filter(s => s !== skillToRemove);
    setSkills(newSkills);
    setFormData({ ...formData, jd_keywords: newSkills.join(',') });
  };
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.title) {
      setError('Job title is required');
      return;
    }

    if (!formData.exam_code) {
      setError('Exam code is required');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && (data.id || data.success)) {
        setSuccess(true);
        setTimeout(() => navigate('/employer/dashboard'), 2000);
      } else {
        setError(data.error || 'Error creating job');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <NavBar user={user} role="employer" />
      <Content>
        <BackButton onClick={() => navigate('/employer/dashboard')}>
          <FiArrowLeft size={18} /> Back to Dashboard
        </BackButton>

        <Header>
          <Title>Create New Job</Title>
          <Subtitle>Define the position details and requirements</Subtitle>
        </Header>

        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>Job created successfully! Redirecting...</SuccessMessage>}

          <form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle><FiBriefcase size={18} /> Basic Information</SectionTitle>
              <FormGroup>
                <Label>Job Title *</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="e.g. Senior React Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>Exam Code *</Label>
                  <Input
                    type="text"
                    name="exam_code"
                    placeholder="e.g. REACT-2024"
                    value={formData.exam_code}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Passing Threshold (%)</Label>
                  <Input
                    type="number"
                    name="passing_threshold"
                    placeholder="e.g. 50"
                    min="0"
                    max="100"
                    value={formData.passing_threshold}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>

            <FormSection>
              <SectionTitle><FiFileText size={18} /> Job Details</SectionTitle>
              <FormGroup>
                <Label>Short Description</Label>
                <Input
                  type="text"
                  name="description"
                  placeholder="Brief overview of the role"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Full Job Description</Label>
                <Textarea
                  name="jd_text"
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  value={formData.jd_text}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle><FiFileText size={18} /> Required Skills</SectionTitle>
              <FormGroup>
                <Label>Add Skills (Press Enter or click Add)</Label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Input
                    type="text"
                    placeholder="e.g. React, Node.js, Python"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    style={{ flex: 1 }}
                  />
                  <Button type="button" onClick={addSkill} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ padding: '0 1rem' }}>
                    Add
                  </Button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {skills.map((skill, i) => (
                    <span key={i} style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {skill}
                      <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '1rem', lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
              </FormGroup>
            </FormSection>

            <ButtonGroup>
              <Button type="button" onClick={() => navigate('/employer/dashboard')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                $primary
                disabled={isLoading || success}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSave size={18} />
                {isLoading ? 'Creating...' : 'Create Job'}
              </Button>
            </ButtonGroup>
          </form>
        </FormCard>
      </Content>
    </PageContainer>
  );
};

export default CreateJob;