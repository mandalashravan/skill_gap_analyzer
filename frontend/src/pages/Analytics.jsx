import { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, PieChart, LineChart } from '../components/Charts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Calendar,
  Loader2,
  AlertCircle,
  Download
} from 'lucide-react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, progressRes] = await Promise.all([
        api.get(`/analysis/analytics/?days=${timeRange}`),
        api.get('/roadmap/progress/')
      ]);
      setAnalytics(analyticsRes.data);
      setUserProgress(progressRes.data);
    } catch (err) {
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = () => {
    const data = {
      analytics,
      userProgress,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/20 flex items-center space-x-3">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  // Prepare chart data
  const roleData = analytics?.most_requested_roles?.map(role => ({
    label: role.job_role__name,
    value: role.count
  })) || [];

  const skillGapData = analytics?.most_common_skill_gaps?.map((gap, index) => ({
    label: gap.skill,
    value: gap.count,
    color: ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa'][index % 5]
  })) || [];

  const progressData = userProgress ? [
    { label: 'Completed', value: userProgress.completed_skills || 0 },
    { label: 'In Progress', value: userProgress.in_progress_skills || 0 },
    { label: 'Not Started', value: userProgress.not_started_skills || 0 }
  ] : [];

  const trendData = [
    { label: 'Week 1', value: 12 },
    { label: 'Week 2', value: 19 },
    { label: 'Week 3', value: 15 },
    { label: 'Week 4', value: 25 },
    { label: 'This Week', value: 32 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display tracking-tight">Analytics Dashboard</h2>
          <p className="text-on-surface-variant">Insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={exportAnalytics}
            className="flex items-center px-4 py-2 bg-secondary text-on-secondary rounded-xl font-bold shadow-lg shadow-secondary/25 hover:bg-secondary/90 transition-all"
          >
            <Download size={18} className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-4">
            <Users size={24} />
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Total Users</p>
          <p className="text-3xl font-bold mt-1">{analytics?.total_users_analyzed || 0}</p>
        </div>

        <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="bg-secondary/10 w-12 h-12 rounded-xl flex items-center justify-center text-secondary mb-4">
            <Target size={24} />
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Completion Rate</p>
          <p className="text-3xl font-bold mt-1">
            {userProgress ? Math.round(userProgress.overall_completion_percentage || 0) : 0}%
          </p>
        </div>

        <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Active Skills</p>
          <p className="text-3xl font-bold mt-1">{userProgress?.total_skills_to_learn || 0}</p>
        </div>

        <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-amber-500 mb-4">
            <Calendar size={24} />
          </div>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Avg. Time</p>
          <p className="text-3xl font-bold mt-1">2.5w</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          data={roleData} 
          title="Most Requested Job Roles"
          color="#adc6ff"
        />
        
        <PieChart 
          data={skillGapData}
          title="Common Skill Gaps"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={trendData}
          title="User Activity Trend"
          color="#4edea3"
        />
        
        <BarChart 
          data={progressData}
          title="Learning Progress Distribution"
          color="#ffb2b7"
        />
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-surface-container rounded-2xl border border-outline p-6">
        <h3 className="text-xl font-bold mb-6">Detailed Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline">
                <th className="text-left py-3 px-4 text-sm font-bold text-on-surface-variant">Metric</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-on-surface-variant">Value</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-on-surface-variant">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-outline-variant">
                <td className="py-3 px-4">Total Analyses</td>
                <td className="text-right py-3 px-4 font-medium">{analytics?.total_users_analyzed || 0}</td>
                <td className="text-right py-3 px-4">
                  <span className="text-emerald-500 font-medium">+12%</span>
                </td>
              </tr>
              <tr className="border-b border-outline-variant">
                <td className="py-3 px-4">Skills Completed</td>
                <td className="text-right py-3 px-4 font-medium">{userProgress?.completed_skills || 0}</td>
                <td className="text-right py-3 px-4">
                  <span className="text-emerald-500 font-medium">+8%</span>
                </td>
              </tr>
              <tr className="border-b border-outline-variant">
                <td className="py-3 px-4">Avg. Completion Rate</td>
                <td className="text-right py-3 px-4 font-medium">
                  {Math.round(userProgress?.overall_completion_percentage || 0)}%
                </td>
                <td className="text-right py-3 px-4">
                  <span className="text-amber-500 font-medium">+2%</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">Quiz Pass Rate</td>
                <td className="text-right py-3 px-4 font-medium">78%</td>
                <td className="text-right py-3 px-4">
                  <span className="text-emerald-500 font-medium">+5%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
