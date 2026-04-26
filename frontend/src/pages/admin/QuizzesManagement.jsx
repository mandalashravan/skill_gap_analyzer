import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const QuizzesManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({ 
    skill: '', 
    title: '', 
    description: '',
    questions: [
      { text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }
    ]
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizzesRes, skillsRes] = await Promise.all([
        api.get('/skills/quizzes/'),
        api.get('/skills/')
      ]);
      setQuizzes(quizzesRes.data);
      setSkills(skillsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = filterSkill === 'all' || quiz.skill?.id === parseInt(filterSkill);
    return matchesSearch && matchesSkill;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await api.put(`/skills/quizzes/${editingQuiz.id}/`, formData);
        setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? { ...q, ...formData } : q));
      } else {
        const response = await api.post('/skills/quizzes/create/', formData);
        setQuizzes([...quizzes, response.data]);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save quiz');
    }
  };

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.delete(`/skills/quizzes/${quizId}/`);
        setQuizzes(quizzes.filter(q => q.id !== quizId));
      } catch (err) {
        setError('Failed to delete quiz');
      }
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }
      ]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      setFormData({
        ...formData,
        questions: formData.questions.filter((_, i) => i !== index)
      });
    }
  };

  const resetForm = () => {
    setFormData({ 
      skill: '', 
      title: '', 
      description: '',
      questions: [
        { text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }
      ]
    });
    setEditingQuiz(null);
    setShowForm(false);
    setError('');
  };

  const startEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({ 
      skill: quiz.skill || '', 
      title: quiz.title, 
      description: quiz.description || '',
      questions: quiz.questions && quiz.questions.length > 0 ? quiz.questions : [
        { text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }
      ]
    });
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
          <h2 className="text-2xl font-bold font-display">Quizzes Management</h2>
          <p className="text-on-surface-variant">Manage skill assessment quizzes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
        >
          <Plus size={18} className="mr-2" /> Add Quiz
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-surface-container rounded-2xl border border-outline p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingQuiz ? 'Edit Quiz' : 'Add New Quiz'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-on-surface">Skill</label>
                  <select
                    required
                    value={formData.skill}
                    onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  >
                    <option value="">Select a skill</option>
                    {skills.map(skill => (
                      <option key={skill.id} value={skill.id}>{skill.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-on-surface">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    placeholder="e.g., React Fundamentals Quiz"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2 text-on-surface">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  rows={3}
                  placeholder="Describe what this quiz covers..."
                />
              </div>

              {/* Questions Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-on-surface">Questions</label>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add Question
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="bg-surface-container-high p-4 rounded-lg border border-outline">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-on-surface">Question {qIndex + 1}</span>
                        {formData.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-rose-500 hover:text-rose-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          required
                          value={question.text}
                          onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                          className="w-full px-3 py-2 bg-surface-container border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                          placeholder="Question text..."
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {['option_a', 'option_b', 'option_c', 'option_d'].map((option, oIndex) => (
                            <div key={option} className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-on-surface-variant w-8">
                                {String.fromCharCode(65 + oIndex)}.
                              </span>
                              <input
                                type="text"
                                required
                                value={question[option]}
                                onChange={(e) => updateQuestion(qIndex, option, e.target.value)}
                                className="flex-1 px-3 py-2 bg-surface-container border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                              />
                            </div>
                          ))}
                        </div>
                        
                        <select
                          value={question.correct_option}
                          onChange={(e) => updateQuestion(qIndex, 'correct_option', e.target.value)}
                          className="w-full px-3 py-2 bg-surface-container border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                        >
                          <option value="A">A is correct</option>
                          <option value="B">B is correct</option>
                          <option value="C">C is correct</option>
                          <option value="D">D is correct</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-outline">
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
                  {editingQuiz ? 'Update' : 'Create'} Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface-container p-4 rounded-xl border border-outline space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
            />
          </div>
          
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="px-4 py-2 bg-surface-container-high border border-outline rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
          >
            <option value="all">All Skills</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.id}>{skill.name}</option>
            ))}
          </select>

          <div className="flex items-center text-sm text-on-surface-variant">
            {filteredQuizzes.length} of {quizzes.length} quizzes
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-surface-container p-4 sm:p-6 rounded-xl border border-outline hover:border-primary/50 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary">
                <Award size={24} />
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(quiz)}
                  className="p-1.5 sm:p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Edit Quiz"
                >
                  <Edit size={12} />
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="p-1.5 sm:p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Quiz"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <h4 className="text-lg font-bold mb-2">{quiz.title}</h4>
            <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">{quiz.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-lg">
                {quiz.questions?.length || 0} questions
              </span>
              <span className="text-primary font-medium">
                {quiz.skill_name || 'No skill'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <Award size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
          <p className="text-on-surface-variant">No quizzes found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default QuizzesManagement;
