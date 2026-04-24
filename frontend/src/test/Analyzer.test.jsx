import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Analyzer from '../pages/Analyzer';
import { AuthProvider } from '../context/AuthContext';
import api from '../api/axios';

// Mock axios
vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const renderAnalyzer = () => {
  return render(
    <AuthProvider>
      <Analyzer />
    </AuthProvider>
  );
};

describe('Analyzer Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders job roles in dropdown', async () => {
    api.get.mockResolvedValue({ 
      data: [{ id: 1, name: 'Frontend Engineer' }] 
    });

    renderAnalyzer();

    await waitFor(() => {
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    });
  });

  it('handles file selection validation', async () => {
    api.get.mockResolvedValue({ data: [] });
    const { container } = renderAnalyzer();

    const file = new File(['hello'], 'resume.txt', { type: 'text/plain' });
    const input = container.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Please upload a PDF file/i)).toBeInTheDocument();
    });
  });

  it('performs analysis successfully', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, name: 'Full Stack' }] });
    api.post.mockResolvedValue({}); // upload-resume
    api.post.mockResolvedValue({ // skill-gap
      data: {
        readiness_score: 75,
        matched_skills: ['React'],
        missing_skills: [{ skill: 'Node', priority: 'High' }]
      }
    });

    const { container } = renderAnalyzer();

    // Select role
    await waitFor(() => expect(screen.getByText('Full Stack')).toBeInTheDocument());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    // Upload file
    const file = new File(['(binary)'], 'resume.pdf', { type: 'application/pdf' });
    const input = container.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    // Check button is enabled
    const submitBtn = screen.getByRole('button', { name: /Analyze Skill Gap/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    // Submit
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/75%/)).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node')).toBeInTheDocument();
    });
  });
});
