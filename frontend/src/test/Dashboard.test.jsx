import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../context/AuthContext';
import api from '../api/axios';

// Mock axios
vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const renderDashboard = () => {
  return render(
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders stats correctly after loading', async () => {
    const mockStats = {
      overall_completion_percentage: 45,
      total_skills_to_learn: 10,
      completed_skills: 4
    };
    
    api.get.mockResolvedValue({ data: mockStats });

    renderDashboard();

    // Wait for the data to be loaded and component to re-render
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
      expect(screen.getAllByText(/45/).length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it('shows error message on api failure', async () => {
    api.get.mockRejectedValue(new Error('Network Error'));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch dashboard stats/i)).toBeInTheDocument();
    });
  });
});
