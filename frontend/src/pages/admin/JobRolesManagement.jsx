import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  BookOpen,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const JobRolesManagement = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [expandedRole, setExpandedRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, skillsRes] = await Promise.all([
        api.get('/jobs/'),
        api.get('/skills/')
      ]);
      setJobRoles(rolesRes.data);
      setSkills(skillsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = jobRoles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await api.put(`/jobs/${editingRole.id}/`, formData);
        setJobRoles(roles => roles.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
      } else {
        const response = await api.post('/jobs/create/', formData);
        setJobRoles([...jobRoles, response.data]);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save job role');
    }
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this job role?')) {
      try {
        await api.delete(`/jobs/${roleId}/`);
        setJobRoles(roles => roles.filter(r => r.id !== roleId));
      } catch (err) {
        setError('Failed to delete job role');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingRole(null);
    setShowForm(false);
    setError('');
  };

  const startEdit = (role) => {
    setEditingRole(role);
    setFormData({ name: role.name, description: role.description });
    setShowForm(true);
  };

  const toggleExpanded = (roleId) => {
    setExpandedRole(expandedRole === roleId ? null : roleId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Job Roles Management</h2>
          <p className="text-on-surface-variant">Manage job roles and skill requirements</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
        >
          <Plus size={18} className="mr-2" /> Add Job Role
        </button>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/20 flex items-center space-x-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container rounded-2xl border border-outline p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingRole ? 'Edit Job Role' : 'Add New Job Role'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-on-surface">Role Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-on-surface">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  rows={3}
                  placeholder="Describe the role and responsibilities..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg border border-outline hover:bg-surface-container-highest transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-all"
                >
                  {editingRole ? 'Update' : 'Create'} Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-surface-container p-4 rounded-xl border border-outline">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search job roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Job Roles List */}
      <div className="space-y-4">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-surface-container rounded-xl border border-outline overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                      <Target size={20} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">{role.name}</h3>
                  </div>
                  <p className="text-on-surface-variant text-sm line-clamp-2">{role.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleExpanded(role.id)}
                    className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                  >
                    {expandedRole === role.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <button
                    onClick={() => startEdit(role)}
                    className="p-1.5 sm:p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Edit Role"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="p-1.5 sm:p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Role"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Skills Management Section */}
            {expandedRole === role.id && (
              <div className="border-t border-outline p-6 bg-surface-container-high">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-on-surface">Required Skills</h4>
                  <button className="text-sm text-primary hover:underline">
                    Manage Skills
                  </button>
                </div>
                <div className="text-sm text-on-surface-variant">
                  Skill management interface would go here. This would allow adding/removing skills and setting priorities.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
          <p className="text-on-surface-variant">No job roles found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default JobRolesManagement;
