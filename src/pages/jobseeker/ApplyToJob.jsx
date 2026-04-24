import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import { FiArrowLeft, FiUpload, FiFile, FiCheck, FiAlertCircle } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const Content = styled.main`
  max-width: 700px;
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

const FormCard = styled(motion.div)`
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
`;

const JobPreview = styled.div`
  background: var(--background);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-light);
`;

const JobTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const JobCompany = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
`;

const UploadArea = styled.div`
  border: 2px dashed var(--border);
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--background);

  &:hover {
    border-color: var(--primary);
    background: var(--surface);
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--info-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const UploadText = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const UploadHint = styled.p`
  color: var(--text-muted);
  font-size: 0.8rem;
`;

const FileInput = styled.input`
  display: none;
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--success-light);
  border-radius: 0.75rem;
  margin-top: 1rem;
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: var(--success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const RemoveFileBtn = styled.button`
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  background: var(--background);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-primary);

  input {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: var(--danger-light);
  color: var(--danger);
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  background: var(--success-light);
  color: var(--success);
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SuccessTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  color: var(--text-secondary);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
`;

const ApplyToJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/${id}`);
      const data = await res.json();
      if (res.ok) {
        setJob(data);
      }
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
        setError('Please upload a PDF or Word document');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setResume(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resume) {
      setError('Please upload your resume');
      return;
    }

    if (!agreed) {
      setError('Please agree to the terms');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('cover_letter', coverLetter);
      formData.append('student_id', user.id);

      const res = await fetch(`http://localhost:5001/api/jobs/${id}/apply`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/my-applications'), 3000);
      } else {
        setError(data.error || 'Error submitting application');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <NavBar user={user} role="jobseeker" />
        <Content>
          <LoadingState>Loading job details...</LoadingState>
        </Content>
      </PageContainer>
    );
  }

  if (isSuccess) {
    return (
      <PageContainer>
        <NavBar user={user} role="jobseeker" />
        <Content>
          <SuccessMessage>
            <SuccessTitle><FiCheck size={24} /> Application Submitted!</SuccessTitle>
            <SuccessText>Your resume is being screened. We'll notify you once the review is complete.</SuccessText>
          </SuccessMessage>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <NavBar user={user} role="jobseeker" />
      <Content>
        <BackButton onClick={() => navigate(`/jobs/${id}`)}>
          <FiArrowLeft size={18} /> Back to Job Details
        </BackButton>

        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Apply for Position</Title>
          <Subtitle>Submit your application for {job?.title || 'this job'}</Subtitle>

          <JobPreview>
            <JobTitle>{job?.title}</JobTitle>
            <JobCompany>{job?.admins?.name || 'Company'}</JobCompany>
          </JobPreview>

          {error && (
            <ErrorMessage>
              <FiAlertCircle size={18} /> {error}
            </ErrorMessage>
          )}

          <form onSubmit={handleSubmit}>
            <FormSection>
              <SectionLabel>Upload Resume *</SectionLabel>
              <UploadArea onClick={() => document.getElementById('resume-input').click()}>
                <UploadIcon><FiUpload size={28} /></UploadIcon>
                <UploadText>Click to upload or drag and drop</UploadText>
                <UploadHint>PDF, DOC, or DOCX (max 5MB)</UploadHint>
              </UploadArea>
              <FileInput
                id="resume-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              {resume && (
                <SelectedFile>
                  <FileIcon><FiFile size={20} /></FileIcon>
                  <FileInfo>
                    <FileName>{resume.name}</FileName>
                    <FileSize>{(resume.size / 1024 / 1024).toFixed(2)} MB</FileSize>
                  </FileInfo>
                  <RemoveFileBtn onClick={() => setResume(null)}>Remove</RemoveFileBtn>
                </SelectedFile>
              )}
            </FormSection>

            <FormSection>
              <SectionLabel>Cover Letter (Optional)</SectionLabel>
              <TextArea
                placeholder="Tell us why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </FormSection>

            <FormSection>
              <CheckboxGroup>
                <Checkbox>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  I agree to the terms and conditions and consent to having my resume screened by AI
                </Checkbox>
              </CheckboxGroup>
            </FormSection>

            <ButtonGroup>
              <Button type="button" onClick={() => navigate(`/jobs/${id}`)}>
                Cancel
              </Button>
              <Button
                type="submit"
                $primary
                disabled={isLoading || !resume || !agreed}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiCheck size={18} />
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </ButtonGroup>
          </form>
        </FormCard>
      </Content>
    </PageContainer>
  );
};

export default ApplyToJob;