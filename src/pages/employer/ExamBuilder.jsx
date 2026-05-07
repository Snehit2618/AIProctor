import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import { FiArrowLeft, FiPlus, FiTrash, FiSave, FiClock } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const Content = styled.main`
  max-width: 900px;
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
  margin-bottom: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  font-size: 1rem;
  background: var(--background);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  font-size: 1rem;
  background: var(--background);
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`;

const QuestionCard = styled(motion.div)`
  background: var(--background);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const QuestionNumber = styled.span`
  font-weight: 600;
  color: var(--primary);
`;

const DeleteButton = styled.button`
  background: var(--danger-light);
  color: var(--danger);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;

  &:hover {
    background: var(--danger);
    color: white;
  }
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const RadioButton = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--success);
`;

const OptionLabel = styled.span`
  font-size: 0.85rem;
  color: var(--success);
  font-weight: 500;
  min-width: 60px;
`;

const AddQuestionBtn = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: var(--info-light);
  color: var(--primary);
  border: 2px dashed var(--border);
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: var(--surface);
    border-color: var(--primary);
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

const ExamBuilder = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    passing_score: 70,
    questions: []
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          id: Date.now(),
          text: '',
          options: [
            { id: 1, text: '', isCorrect: true },
            { id: 2, text: '', isCorrect: false },
            { id: 3, text: '', isCorrect: false },
            { id: 4, text: '', isCorrect: false }
          ]
        }
      ]
    });
  };

  const removeQuestion = (questionId) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== questionId)
    });
  };

  const updateQuestion = (questionId, field, value) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    });
  };

  const updateOption = (questionId, optionId, field, value) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
          if (field === 'isCorrect') {
            return {
              ...q,
              options: q.options.map(o => ({ ...o, isCorrect: o.id === optionId }))
            };
          }
          return {
            ...q,
            options: q.options.map(o =>
              o.id === optionId ? { ...o, [field]: value } : o
            )
          };
        }
        return q;
      })
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title) {
      setError('Exam title is required');
      return;
    }

    if (formData.questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    const invalidQuestions = formData.questions.filter(
      q => !q.text || !q.options.some(o => o.isCorrect && o.text)
    );
    if (invalidQuestions.length > 0) {
      setError('Please complete all questions with correct answers');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        navigate('/employer/dashboard');
      } else {
        setError(data.error || 'Error creating exam');
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
          <Title>Create Exam</Title>
          <Subtitle>Build an assessment for your job candidates</Subtitle>
        </Header>

        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>Basic Information</SectionTitle>
              <FormGroup>
                <Label>Exam Title *</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="e.g. React Developer Assessment"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  name="description"
                  placeholder="What does this exam test?"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    name="duration"
                    min="5"
                    max="180"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Passing Score (%)</Label>
                  <Input
                    type="number"
                    name="passing_score"
                    min="0"
                    max="100"
                    value={formData.passing_score}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                Questions
                <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                  ({formData.questions.length} questions)
                </span>
              </SectionTitle>

              {formData.questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <QuestionHeader>
                    <QuestionNumber>Question {index + 1}</QuestionNumber>
                    <DeleteButton onClick={() => removeQuestion(question.id)}>
                      <FiTrash size={14} /> Delete
                    </DeleteButton>
                  </QuestionHeader>

                  <FormGroup>
                    <Label>Question Text</Label>
                    <Input
                      type="text"
                      placeholder="Enter your question..."
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                    />
                  </FormGroup>

                  <Label style={{ marginBottom: '0.75rem' }}>Options (select the correct answer)</Label>
                  {question.options.map((option, optIndex) => (
                    <OptionRow key={option.id}>
                      <RadioButton
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={option.isCorrect}
                        onChange={() => updateOption(question.id, option.id, 'isCorrect', true)}
                      />
                      <OptionInput
                        type="text"
                        placeholder={`Option ${optIndex + 1}`}
                        value={option.text}
                        onChange={(e) => updateOption(question.id, option.id, 'text', e.target.value)}
                      />
                      {option.isCorrect && <OptionLabel>Correct</OptionLabel>}
                    </OptionRow>
                  ))}
                </QuestionCard>
              ))}

              <AddQuestionBtn
                onClick={addQuestion}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus size={18} /> Add Question
              </AddQuestionBtn>
            </Section>

            <ButtonGroup>
              <Button type="button" onClick={() => navigate('/employer/dashboard')}>
                Cancel
              </Button>
              <Button
                type="submit"
                $primary
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSave size={18} />
                {isLoading ? 'Creating...' : 'Create Exam'}
              </Button>
            </ButtonGroup>
          </form>
        </FormCard>
      </Content>
    </PageContainer>
  );
};

export default ExamBuilder;