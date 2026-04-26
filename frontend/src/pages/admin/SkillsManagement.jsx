import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { DataImportExport } from '../../components/DataImportExport';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Loader2,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills/');
      setSkills(response.data);
    } catch (err) {
      setError('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(skills.map(skill => skill.category))];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || skill.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBulkImport = async (data) => {
    try {
      for (const skillData of data) {
        if (skillData.name && skillData.category) {
          await api.post('/skills/create/', skillData);
        }
      }
      await fetchSkills();
      return { success: true, imported: data.length };
    } catch (error) {
      throw new Error('Failed to import skills');
    }
  };

  const handleBulkExport = async (format) => {
    return filteredSkills.map(skill => ({
      name: skill.name,
      category: skill.category,
      resources: skill.resources?.length || 0
    }));
  };

  const getImportTemplate = () => [
    { name: 'Example Skill 1', category: 'Frontend' },
    { name: 'Example Skill 2', category: 'Backend' },
    { name: 'Example Skill 3', category: 'Database' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill.id}/`, formData);
        setSkills(skills.map(s => s.id === editingSkill.id ? { ...s, ...formData } : s));
      } else {
        const response = await api.post('/skills/create/', formData);
        setSkills([...skills, response.data]);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save skill');
    }
  };

  const handleDelete = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/skills/${skillId}/`);
        setSkills(skills.filter(s => s.id !== skillId));
      } catch (err) {
        setError('Failed to delete skill');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '' });
    setEditingSkill(null);
    setShowForm(false);
    setError('');
  };

  const startEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, category: skill.category });
    setShowForm(true);
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
          <h2 className="text-2xl font-bold font-display">Skills Management</h2>
          <p className="text-on-surface-variant">Manage system skills and categories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
        >
          <Plus size={18} className="mr-2" /> Add Skill
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
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-on-surface">Skill Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  placeholder="e.g., React, Python, SQL"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-on-surface">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  placeholder="e.g., Frontend, Backend, Database"
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
                  {editingSkill ? 'Update' : 'Create'} Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface-container p-3 sm:p-4 rounded-xl border border-outline space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm sm:text-base"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm sm:text-base"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex items-center text-xs sm:text-sm text-on-surface-variant">
            {filteredSkills.length} of {skills.length} skills
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredSkills.map((skill) => (
          <div key={skill.id} className="bg-surface-container p-4 sm:p-6 rounded-xl border border-outline hover:border-primary/50 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                <BookOpen size={20} className="sm:size-24" />
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(skill)}
                  className="p-1.5 sm:p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Edit Skill"
                >
                  <Edit size={12} />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-1.5 sm:p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Skill"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <h4 className="text-base sm:text-lg font-bold mb-2 truncate">{skill.name}</h4>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs sm:text-sm font-medium text-on-surface-variant bg-surface-container-high px-2 sm:px-3 py-1 rounded-lg truncate">
                {skill.category}
              </span>
              <div className="flex items-center text-xs text-on-surface-variant">
                <span className="mr-1">Resources:</span>
                <span className="font-bold text-primary">{skill.resources?.length || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
          <p className="text-on-surface-variant">No skills found matching your criteria</p>
        </div>
      )}

      {/* Bulk Import/Export */}
      <DataImportExport
        onImport={handleBulkImport}
        onExport={handleBulkExport}
        importTemplate={getImportTemplate}
        title="Bulk Data Management"
      />
    </div>
  );
};

export default SkillsManagement;
