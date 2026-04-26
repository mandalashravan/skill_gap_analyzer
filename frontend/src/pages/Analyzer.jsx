import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Upload, FileText, Check, X, AlertCircle, Loader2, Search, Lightbulb, Target, Rocket, Download } from 'lucide-react';
import { generatePDFReport, downloadAnalysisAsJSON } from '../utils/pdfExport';

const Analyzer = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/');
        setJobs(response.data);
      } catch (err) {
        setError('Failed to load job roles');
      }
    };
    fetchJobs();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        return setError('Please upload a PDF or DOCX file');
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        return setError('File size must be less than 5MB');
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !selectedJob) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 1. Upload Resume
      setUploadProgress('Uploading resume...');
      const formData = new FormData();
      formData.append('resume', file);
      await api.post('/analysis/upload-resume/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 2. Perform Skill Gap Analysis
      setUploadProgress('Analyzing skill gap...');
      const response = await api.post('/analysis/skill-gap/', {
        job_role_id: selectedJob
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Medium': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      default: return 'bg-slate-400/10 text-slate-400 border-slate-400/20';
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    const jobName = jobs.find(j => j.id == selectedJob)?.name || 'Unknown Role';
    generatePDFReport(result, jobName, []);
  };

  const handleExportJSON = () => {
    if (!result) return;
    downloadAnalysisAsJSON(result, 'skill-gap-analysis');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display tracking-tight">Skill Gap Analyzer</h2>
        <p className="text-on-surface-variant">Upload your resume to see how you match up with your target role</p>
      </div>

      <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant shadow-sm">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Role Selection */}
            <div>
              <label className="block text-sm font-bold mb-2 text-on-surface flex items-center">
                <Search size={16} className="mr-2 text-primary" /> Target Job Role
              </label>
              <select
                required
                className="w-full p-3 bg-surface-container-low border border-outline rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-on-surface"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option value="">Select a role</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.name}</option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold mb-2 text-on-surface flex items-center">
                <Upload size={16} className="mr-2 text-primary" /> Upload Resume (PDF/DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                id="resume-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="resume-upload"
                className={`w-full flex items-center justify-center space-x-3 p-3 bg-surface-container-low border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  file ? 'border-primary bg-primary/5' : 'border-outline hover:border-primary/50'
                }`}
              >
                {file ? (
                  <>
                    <Check size={20} className="text-primary" />
                    <span className="text-on-surface font-medium truncate">{file.name}</span>
                  </>
                ) : (
                  <>
                    <FileText size={20} className="text-on-surface-variant" />
                    <span className="text-on-surface-variant">Choose PDF or DOCX</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/20 flex items-center space-x-3 animate-in fade-in zoom-in-95">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file || !selectedJob}
            className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{uploadProgress}</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Analyze Skill Gap</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant flex flex-col md:grid md:grid-cols-3 items-center gap-8 shadow-sm">
            <div className="md:col-span-2 text-center md:text-left">
              <h3 className="text-2xl font-bold font-display mb-2">Analysis Result</h3>
              <p className="text-on-surface-variant">We've compared your resume with the <strong>{jobs.find(j => j.id == selectedJob)?.name}</strong> role requirements.</p>
            </div>
            <div className="relative h-32 w-32 flex items-center justify-center shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-container-highest" />
                <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * result.readiness_score) / 100} className="text-primary transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold">{result.readiness_score}%</span>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-tighter">Ready</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant">
              <h4 className="flex items-center text-lg font-bold mb-4 text-emerald-500">
                <Check size={20} className="mr-2" /> Matched Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
                {result.matched_skills.length === 0 && (
                  <p className="text-on-surface-variant text-sm italic">No matching skills found.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant">
              <h4 className="flex items-center text-lg font-bold mb-4 text-rose-500">
                <X size={20} className="mr-2" /> Skills to Develop
              </h4>
              <div className="space-y-3">
                {result.missing_skills.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant hover:border-rose-500/30 transition-colors">
                    <span className="font-medium">{item.skill}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant">
            <h4 className="flex items-center text-lg font-bold text-primary mb-4">
              <Download size={20} className="mr-2" /> Export Report
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                <Download size={18} className="mr-2" />
                Download PDF Report
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center px-6 py-3 bg-surface-container-high text-on-surface rounded-xl font-bold border border-outline hover:bg-surface-container-highest transition-all"
              >
                <Download size={18} className="mr-2" />
                Export JSON Data
              </button>
            </div>
          </div>

          {/* Improvement Suggestions */}
          {result.suggestions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant space-y-4">
                <h4 className="flex items-center text-lg font-bold text-primary">
                  <Lightbulb size={20} className="mr-2" /> ATS Optimization Tips
                </h4>
                <ul className="space-y-3">
                  {result.suggestions.ats_tips.map((tip, i) => (
                    <li key={i} className="flex items-start text-sm text-on-surface-variant">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 mr-3 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant space-y-4">
                <h4 className="flex items-center text-lg font-bold text-secondary">
                  <Rocket size={20} className="mr-2" /> Suggested Projects
                </h4>
                <ul className="space-y-3">
                  {result.suggestions.project_ideas.map((idea, i) => (
                    <li key={i} className="flex items-start text-sm text-on-surface-variant">
                      <div className="h-1.5 w-1.5 bg-secondary rounded-full mt-1.5 mr-3 shrink-0" />
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analyzer;
