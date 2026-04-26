import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileSearch, Map as MapIcon, X, BrainCircuit, LogOut, History as HistoryIcon, GraduationCap, ShieldCheck, User, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyzer', path: '/analyzer', icon: FileSearch },
    { name: 'Roadmap', path: '/roadmap', icon: MapIcon },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'History', path: '/history', icon: HistoryIcon },
    { name: 'Quizzes', path: '/quiz', icon: GraduationCap },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  // Add Admin Dashboard only if user is admin
  if (user?.is_staff) {
    navItems.push({ name: 'Admin', path: '/admin-dashboard', icon: ShieldCheck });
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const showSidebar = user && [
    '/dashboard', '/analyzer', '/roadmap', '/profile', '/history', '/quiz', '/analytics', '/admin-dashboard'
  ].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Navbar toggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />

      <div className="flex flex-1 relative">
        {/* Sidebar for Desktop */}
        {showSidebar && (
          <aside className="hidden lg:flex w-64 bg-surface-container border-r border-outline-variant flex-col h-[calc(100vh-64px)] sticky top-16">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                        : 'hover:bg-surface-container-high text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-outline-variant">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-md text-error hover:bg-error-container/10 transition-colors font-medium"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div 
              className="absolute left-0 top-0 bottom-0 w-72 bg-surface-container shadow-2xl p-6 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary">
                    <BrainCircuit size={20} />
                  </div>
                  <span className="text-xl font-bold font-display tracking-tight text-on-surface">SkillGap</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>
              
              <nav className="space-y-3 flex-1">
                {user ? (
                  navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-primary text-on-primary' 
                            : 'hover:bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        <Icon size={24} />
                        <span className="text-lg font-medium">{item.name}</span>
                      </Link>
                    );
                  })
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-surface-container-high">
                      <span className="text-lg font-medium">Login</span>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-surface-container-high">
                      <span className="text-lg font-medium">Register</span>
                    </Link>
                  </>
                )}
              </nav>

              {user && (
                <div className="pt-6 border-t border-outline-variant shrink-0">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 p-4 rounded-lg text-error hover:bg-error-container/10 transition-colors font-medium"
                  >
                    <LogOut size={24} />
                    <span className="text-lg">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
