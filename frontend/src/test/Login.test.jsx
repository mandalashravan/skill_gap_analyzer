import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import api from '../api/axios';

// Mock axios
vi.mock('../api/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  it('renders login form correctly', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { detail: 'Invalid username or password' } }
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    api.post.mockResolvedValueOnce({
      data: { access: 'fake-token', user: { username: 'testuser' } }
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/accounts/login/', {
        username: 'testuser',
        password: 'password123',
      });
    });
  });
});
