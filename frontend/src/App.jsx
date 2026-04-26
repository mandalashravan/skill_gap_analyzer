import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import Roadmap from './pages/Roadmap';
import History from './pages/History';
import Quiz from './pages/Quiz';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SkillsManagement from './pages/admin/SkillsManagement';
import JobRolesManagement from './pages/admin/JobRolesManagement';
import QuizzesManagement from './pages/admin/QuizzesManagement';
import Landing from './pages/Landing';
import Layout from './components/Layout';

const HomeRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Landing />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analyzer" element={<Analyzer />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/history" element={<History />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/skills" element={<SkillsManagement />} />
                <Route path="/admin/job-roles" element={<JobRolesManagement />} />
                <Route path="/admin/quizzes" element={<QuizzesManagement />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
