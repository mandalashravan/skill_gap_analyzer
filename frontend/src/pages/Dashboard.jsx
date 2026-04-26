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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart Summary */}
        <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
          <h3 className="text-xl font-bold mb-6 font-display flex items-center">
            <TrendingUp size={20} className="mr-2 text-primary" /> Roadmap Progress
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm font-bold text-primary">{stats?.overall_completion_percentage || 0}%</span>
              </div>
              <div className="h-4 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${stats?.overall_completion_percentage || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant">In Progress</p>
                <p className="text-xl font-bold">{stats?.in_progress_skills || 0}</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant">Not Started</p>
                <p className="text-xl font-bold">{stats?.not_started_skills || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity / Analysis History Link */}
        <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6 font-display flex items-center">
              <CheckCircle size={20} className="mr-2 text-emerald-500" /> Recent Actions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant group cursor-pointer hover:border-primary/50 transition-all">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <TrendingUp size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">Resume Analysis</p>
                  <p className="text-xs text-on-surface-variant">Last check: Just now</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant group cursor-pointer hover:border-emerald-500/50 transition-all">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mr-4">
                  <CheckCircle size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold group-hover:text-emerald-500 transition-colors">Skill Validated</p>
                  <p className="text-xs text-on-surface-variant">React Core Concepts: 80%</p>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl border border-outline hover:bg-surface-container-highest transition-all">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
