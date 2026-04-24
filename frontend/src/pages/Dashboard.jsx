import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Target, CheckCircle, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/roadmap/progress/');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-4 rounded-md border border-error/20 flex items-center space-x-3">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const cards = [
    { 
      label: 'Overall Progress', 
      value: `${stats?.overall_completion_percentage || 0}%`, 
      icon: TrendingUp, 
      color: 'text-primary',
      bg: 'bg-primary-container/20'
    },
    { 
      label: 'Skills to Learn', 
      value: stats?.total_skills_to_learn || 0, 
      icon: Target, 
      color: 'text-secondary',
      bg: 'bg-secondary-container/20'
    },
    { 
      label: 'Skills Completed', 
      value: stats?.completed_skills || 0, 
      icon: CheckCircle, 
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display">Dashboard</h2>
        <p className="text-on-surface-variant">Overview of your skill development journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-surface-container p-5 sm:p-6 rounded-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`${card.bg} p-2.5 sm:p-3 rounded-full ${card.color}`}>
                  <Icon size={20} className="sm:w-6 sm:h-6" />
                </div>
              </div>
              <p className="text-on-surface-variant text-xs sm:text-sm font-medium uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Progress Chart Mockup / Summary */}
      <div className="bg-surface-container p-8 rounded-lg border border-outline-variant">
        <h3 className="text-xl font-bold mb-6 font-display">Current Status</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Roadmap Completion</span>
              <span className="text-sm font-bold text-primary">{stats?.overall_completion_percentage || 0}%</span>
            </div>
            <div className="h-4 bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${stats?.overall_completion_percentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
