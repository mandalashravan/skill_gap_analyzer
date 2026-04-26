# Skill Gap Analyzer - Frontend

A modern React application built with Vite for analyzing skill gaps and providing personalized learning roadmaps.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **Vite** - Fast development server and build tool
- **React Router DOM v7** - Client-side routing
- **Axios** - HTTP client for API communication
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Material Design 3** - Design system implementation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Navbar.jsx      # Navigation bar
│   └── Footer.jsx      # Footer component
├── context/            # React contexts
│   └── AuthContext.jsx # Authentication state
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Analyzer.jsx    # Resume analysis
│   ├── Roadmap.jsx     # Learning roadmap
│   ├── Profile.jsx     # User profile
│   ├── Quiz.jsx        # Quiz taking
│   ├── Analytics.jsx   # Analytics dashboard
│   └── admin/          # Admin panel pages
├── services/           # API services
│   └── api.js         # Axios configuration
├── App.jsx            # Main app component
└── main.jsx           # Application entry point
```

## 🔗 API Integration

The frontend communicates with the Django backend via RESTful API endpoints:

- **Authentication**: Login, registration, profile management
- **Analysis**: Resume upload, skill extraction, gap analysis
- **Roadmap**: Learning progress tracking and updates
- **Quizzes**: Interactive skill assessments
- **Analytics**: User analytics and insights

## 🎨 Design System

Built with Material Design 3 principles:
- **Dark theme** optimized for technical users
- **Responsive design** for mobile, tablet, and desktop
- **Accessibility** features and semantic HTML
- **Smooth animations** and micro-interactions

## 📱 Features

- **Resume Analysis**: Upload and parse PDF/DOCX files
- **Skill Gap Analysis**: Compare skills against job requirements
- **Personalized Roadmaps**: Step-by-step learning plans
- **Interactive Quizzes**: Skill validation and assessment
- **Progress Tracking**: Visual progress monitoring
- **Analytics Dashboard**: Comprehensive insights
- **Admin Panel**: Complete management interface

## 🔧 Environment Variables

Create `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up --build
```

### Manual Deployment
```bash
npm run build
# Serve the dist/ folder with your preferred web server
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
