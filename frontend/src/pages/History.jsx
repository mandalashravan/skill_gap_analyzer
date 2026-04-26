import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Clock, TrendingUp, ChevronRight, FileText, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/analysis/history/');
        setHistory(response.data);
      } catch (err) {
        setError('Failed to fetch your analysis history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display tracking-tight">Analysis History</h2>
        <p className="text-on-surface-variant">Track your readiness scores and skill development over time</p>
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/20 flex items-center space-x-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-surface-container p-12 rounded-2xl border border-outline-variant text-center space-y-4">
          <FileText size={48} className="mx-auto text-on-surface-variant/20" />
          <p className="text-on-surface-variant">No analysis reports yet. Analyze your resume to see your first report!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((report) => (
            <div 
              key={report.id} 
              className="bg-surface-container p-6 rounded-2xl border border-outline-variant hover:border-primary/50 transition-all group shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                      {report.job_role_name || 'Job Analysis'}
                    </h4>
                    <div className="flex items-center text-sm text-on-surface-variant space-x-3">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {format(new Date(report.created_at), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {format(new Date(report.created_at), 'hh:mm a')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant">Readiness Score</p>
                    <p className="text-2xl font-bold text-primary">{report.readiness_score}%</p>
                  </div>
                  <div className="bg-surface-container-highest p-2 rounded-full text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {report.matched_skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold uppercase">
                    {skill}
                  </span>
                ))}
                {report.matched_skills.length > 3 && (
                  <span className="text-[10px] text-on-surface-variant font-medium">
                    +{report.matched_skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
