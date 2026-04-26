import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Users, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  BookOpen,
  Award,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import UserManagement from './admin/UserManagement';
import SkillsManagement from './admin/SkillsManagement';
import JobRolesManagement from './admin/JobRolesManagement';
import QuizzesManagement from './admin/QuizzesManagement';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/jobs/analytics/');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load admin analytics. Ensure you have admin privileges.');
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-error-container text-on-error-container p-6 rounded-2xl border border-error/20 flex items-center space-x-4">
          <AlertCircle size={32} />
          <div>
            <h3 className="font-bold text-lg">Access Denied</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const quickActions = [
    { title: 'User Management', desc: 'Manage system users', icon: Users, tab: 'users', color: 'bg-primary/10 text-primary' },
    { title: 'Skills Management', desc: 'Add and edit skills', icon: Target, tab: 'skills', color: 'bg-secondary/10 text-secondary' },
    { title: 'Job Roles', desc: 'Manage job roles', icon: BarChart3, tab: 'job-roles', color: 'bg-amber-500/10 text-amber-500' },
    { title: 'Quizzes', desc: 'Create assessments', icon: AlertTriangle, tab: 'quizzes', color: 'bg-emerald-500/10 text-emerald-500' },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'job-roles', label: 'Job Roles', icon: Target },
    { id: 'quizzes', label: 'Quizzes', icon: Award },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-display tracking-tight">Admin Dashboard</h2>
        <p className="text-on-surface-variant">System-wide overview and management</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-surface-container p-2 rounded-xl border border-outline">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-4">
                <Users size={24} />
              </div>
              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Total Analyses</p>
              <p className="text-3xl font-bold mt-1">{stats?.total_users_analyzed || 0}</p>
            </div>

            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
              <div className="bg-secondary/10 w-12 h-12 rounded-xl flex items-center justify-center text-secondary mb-4">
                <Target size={24} />
              </div>
              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Active Roles</p>
              <p className="text-3xl font-bold mt-1">12</p>
            </div>

            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
              <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                <TrendingUp size={24} />
              </div>
              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">System Health</p>
              <p className="text-3xl font-bold mt-1">Normal</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(action.tab)}
                  className="bg-surface-container p-6 rounded-2xl border border-outline hover:border-primary/50 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{action.title}</h3>
                  <p className="text-sm text-on-surface-variant mb-4">{action.desc}</p>
                  <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                    <span>Manage</span>
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Requested Roles */}
            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <BarChart3 size={20} className="mr-2 text-primary" /> Most Popular Roles
                </h3>
              </div>
              <div className="space-y-4">
                {stats?.most_requested_roles?.map((role, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{role.job_role__name}</span>
                      <span className="font-bold">{role.count} requests</span>
                    </div>
                    <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(role.count / stats.total_users_analyzed) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Common Skill Gaps */}
            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <AlertTriangle size={20} className="mr-2 text-amber-500" /> Critical Skill Gaps
                </h3>
              </div>
              <div className="space-y-4">
                {stats?.most_common_skill_gaps?.map((gap, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-xs">
                        {i + 1}
                      </div>
                      <span className="font-bold">{gap.skill}</span>
                    </div>
                    <span className="text-sm font-medium text-on-surface-variant">{gap.count} users missing</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <UserManagement />
      )}

      {activeTab === 'skills' && (
        <SkillsManagement />
      )}

      {activeTab === 'job-roles' && (
        <JobRolesManagement />
      )}

      {activeTab === 'quizzes' && (
        <QuizzesManagement />
      )}
    </div>
  );
};

export default AdminDashboard;
