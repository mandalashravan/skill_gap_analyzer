import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, BrainCircuit } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ toggleMobileMenu, isMobileMenuOpen }) => {
  const { user } = useAuth();

  return (
    <header className="bg-surface-container border-b border-outline-variant sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-on-surface hover:bg-surface-container-high rounded-md"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <BrainCircuit size={20} />
            </div>
            <span className="text-xl font-bold text-on-surface font-display tracking-tight group-hover:text-primary transition-colors">
              SkillGap
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold leading-none">{user?.username || 'Guest'}</span>
              <span className="text-xs text-on-surface-variant leading-tight">{user?.email || 'Welcome'}</span>
            </div>
            <Link to="/profile" className="bg-primary-container p-2 rounded-full hover:bg-primary/80 transition-colors">
              <User size={18} className="text-on-primary-container" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
