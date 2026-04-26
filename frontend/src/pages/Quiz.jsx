import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/skills/quizzes/');
        setQuizzes(response.data);
      } catch (err) {
        setError('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const startQuiz = async (quiz) => {
    try {
      setLoading(true);
      const response = await api.get(`/skills/quizzes/${quiz.id}/take/`);
      setSelectedQuiz(response.data);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setAnswers({});
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      const answersArray = selectedQuiz.questions.map((q, idx) => ({
        question_id: q.id,
        selected_option: answers[idx]
      }));

      const response = await api.post(`/skills/quizzes/${selectedQuiz.quiz.id}/take/`, {
        quiz_id: selectedQuiz.quiz.id,
        answers: answersArray
      });

      setScore(response.data.result.score);
      setShowResult(true);
    } catch (err) {
      setError('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setAnswers({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (selectedQuiz) {
    const question = selectedQuiz.questions?.[currentQuestion];
    const total = selectedQuiz.questions?.length || 0;
    
    // Check if question exists
    if (!question) {
      return (
        <div className="max-w-2xl mx-auto bg-surface-container p-8 rounded-3xl border border-outline-variant text-center space-y-6">
          <div className="w-24 h-24 bg-error-container rounded-full flex items-center justify-center mx-auto text-error">
            <AlertCircle size={48} />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display">Quiz Error</h3>
            <p className="text-on-surface-variant mt-2">Unable to load quiz questions. Please try again.</p>
          </div>
          <button 
            onClick={() => setSelectedQuiz(null)}
            className="flex items-center justify-center px-8 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      );
    }

    if (showResult) {
      const percentage = (score / total) * 100;
      return (
        <div className="max-w-2xl mx-auto bg-surface-container p-8 sm:p-12 rounded-3xl border border-outline-variant text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Trophy size={48} />
          </div>
          <div>
            <h3 className="text-3xl font-bold font-display">Quiz Completed!</h3>
            <p className="text-on-surface-variant mt-2">You've finished {selectedQuiz.quiz.title} assessment.</p>
          </div>
          
          <div className="py-8">
            <p className="text-6xl font-bold text-primary">{percentage.toFixed(0)}%</p>
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mt-2">Final Score</p>
            <p className="text-on-surface-variant mt-1">{score} out of {total} correct</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={resetQuiz}
              className="flex items-center justify-center px-8 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <RefreshCw size={18} className="mr-2" /> Retake Quiz
            </button>
            <button 
              onClick={() => setSelectedQuiz(null)}
              className="flex items-center justify-center px-8 py-3 bg-surface-container-high text-on-surface rounded-xl font-bold border border-outline hover:bg-surface-container-highest transition-all"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold font-display">{selectedQuiz.quiz.title}</h3>
            <p className="text-sm text-on-surface-variant">Question {currentQuestion + 1} of {total}</p>
          </div>
          <button onClick={() => setSelectedQuiz(null)} className="text-sm font-bold text-primary hover:underline">Exit Quiz</button>
        </div>

        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
          />
        </div>

        <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm space-y-8">
          <h4 className="text-xl font-medium leading-relaxed">{question.text}</h4>
          
          <div className="grid grid-cols-1 gap-4">
            {['A', 'B', 'C', 'D'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                  answers[currentQuestion] === opt 
                    ? 'border-primary bg-primary/5 text-on-surface' 
                    : 'border-outline hover:border-primary/30 text-on-surface-variant'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold text-sm ${
                  answers[currentQuestion] === opt ? 'bg-primary text-on-primary' : 'bg-surface-container-high'
                }`}>
                  {opt}
                </div>
                <span className="font-medium">{question[`option_${opt.toLowerCase()}`]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={nextQuestion}
            disabled={!answers[currentQuestion]}
            className="w-full py-4 bg-primary text-on-primary font-bold rounded-2xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
          >
            <span>{currentQuestion === total - 1 ? 'Finish Quiz' : 'Next Question'}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display tracking-tight">Skill Validation</h2>
        <p className="text-on-surface-variant">Test your knowledge and earn proficiency badges</p>
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/20 flex items-center space-x-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-surface-container p-12 rounded-2xl border border-outline-variant text-center space-y-4">
          <HelpCircle size={48} className="mx-auto text-on-surface-variant/20" />
          <p className="text-on-surface-variant">No quizzes available at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className="bg-surface-container p-6 rounded-2xl border border-outline-variant hover:border-primary/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2">{quiz.title}</h4>
                <p className="text-sm text-on-surface-variant line-clamp-2">{quiz.description}</p>
                <div className="mt-4 flex items-center text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded w-fit uppercase">
                  {quiz.questions?.length || 0} Questions
                </div>
              </div>
              <button 
                onClick={() => startQuiz(quiz)}
                className="mt-6 w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl border border-outline hover:bg-primary hover:text-on-primary hover:border-primary transition-all flex items-center justify-center group/btn"
              >
                Start Assessment
                <ArrowRight size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quiz;
