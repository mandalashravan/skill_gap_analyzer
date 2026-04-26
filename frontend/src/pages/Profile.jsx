import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Upload,
  Edit2,
  Save,
  X,
  Globe,
  Calendar,
  Award,
  Loader2,
  AlertCircle,
  CheckCircle,
  Lock
} from 'lucide-react';

import { FaLinkedin, FaGithub } from "react-icons/fa";


const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    experience_years: 0,
    education_level: "Bachelor's",
    current_job_title: '',
    notification_preferences: {}
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/accounts/user-profile/');
      setProfile(response.data);
      setFormData({
        bio: response.data.bio || '',
        phone: response.data.phone || '',
        location: response.data.location || '',
        linkedin_url: response.data.linkedin_url || '',
        github_url: response.data.github_url || '',
        portfolio_url: response.data.portfolio_url || '',
        experience_years: response.data.experience_years || 0,
        education_level: response.data.education_level || "Bachelor's",
        current_job_title: response.data.current_job_title || '',
        notification_preferences: response.data.notification_preferences || {}
      });
    } catch (error) {
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/accounts/user-profile/', formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        portfolio_url: profile.portfolio_url || '',
        experience_years: profile.experience_years || 0,
        education_level: profile.education_level || "Bachelor's",
        current_job_title: profile.current_job_title || '',
        notification_preferences: profile.notification_preferences || {}
      });
    }
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const endpoint = type === 'resume' ? '/accounts/upload-resume/' : '/accounts/upload-profile-picture/';
      await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProfile();
      setMessage(`${type === 'resume' ? 'Resume' : 'Profile picture'} uploaded successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Failed to upload ${type === 'resume' ? 'resume' : 'profile picture'}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordMessage('New passwords do not match');
      setTimeout(() => setPasswordMessage(''), 3000);
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setPasswordMessage('New password must be at least 8 characters long');
      setTimeout(() => setPasswordMessage(''), 3000);
      return;
    }
    
    setPasswordSaving(true);
    try {
      await api.post('/accounts/change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      
      setPasswordMessage('Password changed successfully');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      setShowPasswordChange(false);
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error) {
      setPasswordMessage(error.response?.data?.error || 'Failed to change password');
      setTimeout(() => setPasswordMessage(''), 3000);
    } finally {
      setPasswordSaving(false);
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
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">Profile</h2>
          <p className="text-on-surface-variant text-sm sm:text-base">Manage your professional information</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center px-4 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all w-full sm:w-auto justify-center"
          >
            <Edit2 size={18} className="mr-2" /> Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
          message.includes('success') 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-error-container text-on-error-container border-error/20'
        }`}>
          {message.includes('success') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-surface-container p-4 sm:p-6 lg:p-8 rounded-2xl border border-outline-variant">
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            {profile?.profile_picture ? (
              <img 
                src={`http://localhost:8000${profile.profile_picture}`} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-high"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center" style={{ display: profile?.profile_picture ? 'none' : 'flex' }}>
              <User size={48} className="text-primary" />
            </div>
            {editing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <Upload size={16} className="text-on-primary" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'profile-picture')}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface">{profile?.user?.username || 'User'}</h3>
            <p className="text-on-surface-variant mb-4 text-sm sm:text-base">{profile?.current_job_title || 'Professional'}</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <Mail size={16} className="text-on-surface-variant" />
                <span className="text-sm text-on-surface">{profile?.user?.email || 'No email'}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <Phone size={16} className="text-on-surface-variant" />
                <span className="text-sm text-on-surface">{profile?.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <MapPin size={16} className="text-on-surface-variant" />
                <span className="text-sm text-on-surface">{profile?.location || 'No location'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-surface-container p-6 sm:p-8 lg:p-10 rounded-2xl border border-outline-variant space-y-6">
        <h3 className="text-xl lg:text-2xl font-bold">Professional Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-bold mb-2 text-on-surface">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:opacity-50"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-on-surface">Current Job Title</label>
            <input
              type="text"
              value={formData.current_job_title}
              onChange={(e) => setFormData({ ...formData, current_job_title: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:opacity-50"
              placeholder="e.g., Software Developer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-on-surface">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:opacity-50"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-on-surface">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:opacity-50"
              placeholder="City, Country"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-on-surface">Years of Experience</label>
            <input
              type="number"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:opacity-50"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-on-surface">Education Level</label>
            <select
              value={formData.education_level}
              onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:opacity-50"
            >
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h4 className="font-bold text-on-surface">Social Profiles</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <FaLinkedin size={20} className="text-primary" />
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                disabled={!editing}
                className="flex-1 px-3 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:opacity-50"
                placeholder="LinkedIn URL"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FaGithub size={20} className="text-primary" />
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                disabled={!editing}
                className="flex-1 px-3 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:opacity-50"
                placeholder="GitHub URL"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe size={20} className="text-primary" />
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                disabled={!editing}
                className="flex-1 px-3 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:opacity-50"
                placeholder="Portfolio URL"
              />
            </div>
          </div>
        </div>

        {/* Resume Upload */}
        <div className="space-y-4">
          <h4 className="font-bold text-on-surface">Resume</h4>
          {editing && (
            <div className="border-2 border-dashed border-outline rounded-xl p-6 text-center">
              <Upload size={48} className="mx-auto text-on-surface-variant mb-4" />
              <p className="text-on-surface-variant mb-4">
                Upload your resume (PDF or DOCX)
              </p>
              <label className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium cursor-pointer hover:bg-primary/90 transition-colors">
                Choose File
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'resume')}
                  className="hidden"
                />
              </label>
            </div>
          )}
          {profile?.resume_file && (
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
              <span className="text-sm text-on-surface">{profile.resume_file.split('/').pop()}</span>
              <a
                href={`http://localhost:8000${profile.resume_file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`http://localhost:8000${profile.resume_file}`, '_blank');
                }}
              >
                View Resume
              </a>
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-on-surface">Password Settings</h4>
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="text-sm text-primary hover:underline"
            >
              {showPasswordChange ? 'Cancel' : 'Change Password'}
            </button>
          </div>
          
          {showPasswordChange && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-on-surface">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-on-surface">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-on-surface">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              
              {passwordMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  passwordMessage.includes('success') 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                    : 'bg-error-container text-on-error-container border border-error/20'
                }`}>
                  {passwordMessage}
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {passwordSaving ? (
                    <Loader2 size={18} className="mr-2 animate-spin" />
                  ) : (
                    <Lock size={18} className="mr-2" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Action Buttons */}
        {editing && (
          <div className="flex justify-end space-x-3 pt-6 border-t border-outline">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2 bg-surface-container-high text-on-surface rounded-lg border border-outline hover:bg-surface-container-highest transition-all disabled:opacity-50"
            >
              <X size={18} className="mr-2" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : (
                <Save size={18} className="mr-2" />
              )}
              Save Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
