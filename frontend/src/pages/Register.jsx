import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Loader2, Lock, Mail, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/accounts/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      const { access, user } = response.data;
      login(access, user);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      const message = data ? Object.values(data).flat()[0] : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container p-8 rounded-lg border border-outline-variant shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary font-display mb-2">Create Account</h1>
          <p className="text-on-surface-variant">Start your journey to fill skill gaps</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-md mb-6 border border-error/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-on-surface-variant">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline rounded-md focus:outline-none focus:border-primary transition-colors text-on-surface"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-on-surface-variant">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline rounded-md focus:outline-none focus:border-primary transition-colors text-on-surface"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-on-surface-variant">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline rounded-md focus:outline-none focus:border-primary transition-colors text-on-surface"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-on-surface-variant">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline rounded-md focus:outline-none focus:border-primary transition-colors text-on-surface"
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-primary text-on-primary font-bold rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div className="mt-8 text-center text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
