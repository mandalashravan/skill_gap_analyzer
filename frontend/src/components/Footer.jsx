import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-container border-t border-outline-variant py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-primary font-display">SkillGap</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Empowering professionals to bridge their skill gaps through AI-driven analysis and personalized learning roadmaps.
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-on-surface">Platform</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            <li><Link to="/analyzer" className="hover:text-primary transition-colors">Analyzer</Link></li>
            <li><Link to="/roadmap" className="hover:text-primary transition-colors">Roadmap</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-on-surface">Support</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-outline-variant text-center">
        <p className="text-xs text-on-surface-variant">
          &copy; {new Date().getFullYear()} SkillGap Analyzer Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
