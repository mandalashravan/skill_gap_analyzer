# 🧠 Digital Skill Gap Analyzer

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-6.0-green?logo=django)](https://www.djangoproject.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive full-stack web application designed to help students and job seekers evaluate their current skill set, identify missing skills based on industry job requirements, and receive a personalized roadmap to become job-ready.

## ✨ Features

### 🎯 Core Functionality
- **Resume Analysis**: Upload PDF/DOC files for automatic skill extraction
- **Skill Gap Analysis**: Compare user skills with job role requirements
- **Job Readiness Scoring**: Calculate percentage match for target roles
- **Personalized Roadmaps**: Step-by-step learning plans with resource suggestions
- **Progress Tracking**: Visual progress monitoring with status updates
- **Quiz System**: Skill validation through interactive assessments
- **PDF Reports**: Professional analysis report exports
- **Analytics Dashboard**: Comprehensive insights and metrics

### 👥 User Management
- **Authentication**: Secure JWT-based login/registration
- **User Profiles**: Extended profiles with resume storage, social links, experience
- **Progress History**: Track skill development over time
- **Achievement Tracking**: Quiz results and completion metrics

### 🛠️ Admin Features
- **User Management**: Complete user administration interface
- **Skills Management**: CRUD operations for skills and categories
- **Job Roles Management**: Define roles and required skills
- **Quiz Management**: Create and manage skill assessments
- **Analytics Dashboard**: System-wide metrics and insights
- **Bulk Import/Export**: Data management capabilities
- **Data Visualization**: Charts and graphs for analytics

## 🏗️ Technical Architecture

### Backend (Django)
- **Framework**: Django 6.0.4 with Django REST Framework
- **Authentication**: JWT tokens with SimpleJWT
- **Database**: SQLite (development), PostgreSQL support
- **File Processing**: PDF and DOCX parsing with pdfplumber, python-docx
- **API Documentation**: RESTful endpoints with comprehensive coverage
- **Admin Panel**: Django admin + custom admin interface

### Frontend (React)
- **Framework**: React 19.2.5 with Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS 4.0 with Material Design tokens
- **State Management**: React Context API
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React and React Icons

## 📁 Project Structure

```
skill_gap_analyzer/
├── backend/                    # Django REST API
│   ├── accounts/               # User authentication & profiles
│   │   ├── models.py          # User, UserProfile models
│   │   ├── serializers.py     # User data serialization
│   │   ├── views.py           # Auth endpoints (login, register, profile)
│   │   └── urls.py            # Auth URL routing
│   ├── skills/                # Skills management
│   │   ├── models.py          # Skill, Quiz, Question models
│   │   ├── serializers.py     # Skill data serialization
│   │   ├── views.py           # Skills & quizzes endpoints
│   │   └── urls.py            # Skills URL routing
│   ├── jobs/                  # Job roles & analytics
│   │   ├── models.py          # JobRole, JobRoleSkill models
│   │   ├── serializers.py     # Job data serialization
│   │   ├── views.py           # Jobs & analytics endpoints
│   │   └── urls.py            # Jobs URL routing
│   ├── analysis/              # Resume analysis & reports
│   │   ├── models.py          # AnalysisReport, SkillProgress models
│   │   ├── serializers.py     # Analysis data serialization
│   │   ├── views.py           # Analysis endpoints
│   │   └── urls.py            # Analysis URL routing
│   ├── roadmap/               # Learning roadmaps
│   │   ├── models.py          # SkillProgress models
│   │   ├── serializers.py     # Roadmap data serialization
│   │   ├── views.py           # Roadmap endpoints
│   │   └── urls.py            # Roadmap URL routing
│   ├── media/                 # User uploaded files
│   ├── backend/               # Django project settings
│   │   ├── settings.py        # Django configuration
│   │   ├── urls.py            # Main URL routing
│   │   └── wsgi.py            # WSGI configuration
│   ├── manage.py              # Django management script
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.jsx     # Main layout component
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   └── Footer.jsx     # Footer component
│   │   ├── context/           # React contexts
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   ├── Analyzer.jsx   # Resume analysis
│   │   │   ├── Roadmap.jsx    # Learning roadmap
│   │   │   ├── Profile.jsx    # User profile
│   │   │   ├── Quiz.jsx       # Quiz taking
│   │   │   ├── Analytics.jsx  # Analytics dashboard
│   │   │   └── admin/         # Admin pages
│   │   │       ├── SkillsManagement.jsx
│   │   │       ├── JobRolesManagement.jsx
│   │   │       ├── QuizzesManagement.jsx
│   │   │       └── UserManagement.jsx
│   │   ├── services/          # API services
│   │   │   └── api.js         # Axios configuration
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Application entry point
│   ├── package.json           # Node.js dependencies
│   └── vite.config.js         # Vite configuration
├── docker-compose.yml         # Docker configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Docker Setup (Optional)
```bash
# Start both backend and frontend with Docker
docker-compose up --build
```

## 🔗 API Endpoints

### Authentication
- `POST /api/accounts/register/` - User registration
- `POST /api/accounts/login/` - User login
- `GET /api/accounts/profile/` - Get user profile
- `PUT /api/accounts/user-profile/` - Update user profile
- `POST /api/accounts/change-password/` - Change password

### Skills
- `GET /api/skills/` - List all skills
- `POST /api/skills/` - Create skill (admin)
- `PUT /api/skills/{id}/` - Update skill (admin)
- `DELETE /api/skills/{id}/` - Delete skill (admin)
- `GET /api/skills/quizzes/` - List quizzes
- `POST /api/skills/quizzes/create/` - Create quiz (admin)
- `PUT /api/skills/quizzes/{id}/` - Update quiz (admin)
- `DELETE /api/skills/quizzes/{id}/` - Delete quiz (admin)

### Job Roles
- `GET /api/jobs/` - List job roles
- `POST /api/jobs/create/` - Create job role (admin)
- `PUT /api/jobs/{id}/` - Update job role (admin)
- `DELETE /api/jobs/{id}/` - Delete job role (admin)
- `GET /api/jobs/analytics/` - System analytics (admin)

### Analysis
- `POST /api/analysis/upload-resume/` - Upload resume for analysis
- `POST /api/analysis/skill-gap/` - Analyze skill gaps
- `GET /api/analysis/history/` - User analysis history
- `GET /api/analysis/analytics/` - User analytics
- `GET /api/roadmap/progress/` - Learning progress

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
python manage.py collectstatic
python manage.py runserver 0.0.0.0:8000

# Frontend
cd frontend
npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Database Schema

### Core Models
- **User**: Django's built-in user model
- **UserProfile**: Extended user profile with resume, social links, experience
- **Skill**: Categorized skills with learning resources
- **JobRole**: Job positions with descriptions and requirements
- **JobRoleSkill**: Many-to-many relationship with priority/weight
- **Quiz**: Skill assessments with questions
- **Question**: Individual quiz questions with multiple choice answers
- **AnalysisReport**: Resume analysis results and recommendations
- **SkillProgress**: Learning roadmap progress tracking

## 🎯 Key Features Implemented

### ✅ User Features
- [x] JWT Authentication (login/register)
- [x] Profile management with resume upload
- [x] Resume analysis with skill extraction
- [x] Skill gap analysis and scoring
- [x] Personalized learning roadmaps
- [x] Progress tracking and analytics
- [x] Interactive quiz system
- [x] Analytics dashboard
- [x] Password change functionality

### ✅ Admin Features
- [x] User management interface
- [x] Skills CRUD operations
- [x] Job roles management
- [x] Quiz creation and management
- [x] System analytics dashboard
- [x] Bulk import/export capabilities
- [x] Responsive design across all devices

### ✅ Technical Features
- [x] RESTful API with comprehensive endpoints
- [x] JWT-based authentication
- [x] File upload processing (PDF/DOCX)
- [x] Responsive Material Design UI
- [x] Real-time progress tracking
- [x] Data visualization and analytics
- [x] Docker containerization
- [x] Environment-based configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Django REST Framework for robust API development
- React and Vite for modern frontend development
- Tailwind CSS for utility-first styling
- Lucide React for beautiful icons
- Material Design for design inspiration

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

*Built with ❤️ for career growth.*