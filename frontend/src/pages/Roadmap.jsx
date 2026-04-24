import { useState, useEffect } from 'react';
import api from '../api/axios';
import { CheckCircle2, Circle, Clock, Loader2, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchRoadmap = async () => {
    try {
      const response = await api.get('/roadmap/');
      setRoadmap(response.data);
    } catch (err) {
      setError('Failed to fetch your learning roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleUpdateProgress = async (skillId, currentStatus, currentProgress) => {
    setUpdating(skillId);
    let nextStatus = currentStatus;
    let nextProgress = currentProgress;

    // Simple cycle: Not Started -> In Progress -> Completed
    if (currentStatus === 'Not Started') {
      nextStatus = 'In Progress';
      nextProgress = 10;
    } else if (currentStatus === 'In Progress') {
      nextStatus = 'Completed';
      nextProgress = 100;
    } else {
      nextStatus = 'Not Started';
      nextProgress = 0;
    }

    try {
      await api.post('/roadmap/update-progress/', {
        skill_id: skillId,
        status: nextStatus,
        progress_percentage: nextProgress
      });
      await fetchRoadmap(); // Refresh
    } catch (err) {
      alert('Failed to update progress');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status, skillId) => {
    if (updating === skillId) return <Loader2 className="animate-spin text-primary" size={24} />;
    switch (status) {
      case 'Completed': return <CheckCircle2 className="text-emerald-500" size={24} />;
      case 'In Progress': return <Clock className="text-amber-400" size={24} />;
      default: return <Circle className="text-on-surface-variant" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-display">Your Roadmap</h2>
          <p className="text-on-surface-variant">Step-by-step guide to bridge your skill gaps</p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchRoadmap(); }}
          className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
          title="Refresh Roadmap"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container p-4 rounded-md border border-error/20 flex items-center space-x-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : roadmap.length === 0 ? (
        <div className="bg-surface-container p-12 rounded-lg border border-outline-variant text-center space-y-4">
          <p className="text-on-surface-variant">No skills in your roadmap yet. Go to the Analyzer to generate one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {roadmap.map((item) => (
            <div 
              key={item.id} 
              className="bg-surface-container p-6 rounded-lg border border-outline-variant hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => handleUpdateProgress(item.skill, item.status, item.progress_percentage)}
                  className="mt-1 transition-transform active:scale-90"
                  disabled={updating !== null}
                >
                  {getStatusIcon(item.status, item.skill)}
                </button>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold">{item.skill_name || `Skill ${item.skill}`}</h4>
                      <p className="text-sm text-on-surface-variant">
                        Week {item.week} • {item.estimated_hours} hours estimated
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                        item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        item.status === 'In Progress' ? 'bg-amber-400/10 text-amber-400' :
                        'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-on-surface-variant">
                      <span>Progress</span>
                      <span>{item.progress_percentage}%</span>
                    </div>
                    <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          item.status === 'Completed' ? 'bg-emerald-500' :
                          item.status === 'In Progress' ? 'bg-amber-400' :
                          'bg-primary'
                        }`}
                        style={{ width: `${item.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={20} className="text-on-surface-variant" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roadmap;
