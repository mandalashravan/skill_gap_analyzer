import { Link } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, Rocket, Search, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Hero Section */}
      <header className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary blur-[128px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary blur-[128px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles size={16} />
            <span>Next-Generation Career Pathing</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold font-display mb-8 tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Master Your Career <br /> with AI-Driven Insights
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-on-surface-variant mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Identify your skill gaps, analyze your resume against real job roles, and follow a personalized roadmap to land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-xl shadow-primary/20 flex items-center justify-center"
            >
              Get Started Free <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-surface-container border border-outline rounded-lg font-bold hover:bg-surface-container-high transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">How It Works</h2>
            <p className="text-on-surface-variant text-lg">Three steps to your next career milestone</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Search,
                title: 'Analyze Gaps',
                desc: 'Upload your resume and select a job role. Our AI instantly identifies exactly what skills you\'re missing.',
                color: 'text-primary'
              },
              {
                icon: Rocket,
                title: 'Personalized Roadmap',
                desc: 'Get a step-by-step learning path tailored to your specific needs and the job market requirements.',
                color: 'text-secondary'
              },
              {
                icon: ShieldCheck,
                title: 'Track Progress',
                desc: 'Monitor your development with interactive milestones and celebrate as you become job-ready.',
                color: 'text-emerald-500'
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-surface-container p-8 rounded-2xl border border-outline-variant hover:border-primary/50 transition-all group">
                  <div className={`w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary p-12 rounded-[2rem] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <BrainCircuit size={300} />
            </div>
            <div className="relative z-10 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-on-primary mb-4">Ready to close the gap?</h2>
              <p className="text-on-primary/80 text-lg mb-0">Join thousands of professionals leveling up their careers.</p>
            </div>
            <Link
              to="/register"
              className="relative z-10 px-10 py-5 bg-on-primary text-primary font-bold rounded-xl hover:bg-on-primary/90 transition-all shadow-2xl"
            >
              Start Analyzing Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
