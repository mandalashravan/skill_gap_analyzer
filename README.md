# 🧠 Digital Skill Gap Analyzer

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-6.0-green?logo=django)](https://www.djangoproject.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The **Digital Skill Gap Analyzer** is a state-of-the-art career development platform that leverages automated resume parsing and intelligent gap analysis to help users transition into their target job roles. It provides a structured, data-driven learning path to bridge the gap between current skills and industry requirements.

---

## ✨ Key Features

### 🔹 Intelligent Resume Parsing
*   **📂 Multi-format Support**: Upload resumes in **PDF** or **DOCX** formats.
*   **🔍 Automated Extraction**: Real-time extraction of technical skills using keyword matching against a curated industry database.
*   **💡 Instant Visualization**: Immediate feedback on identified skills and profile status.

### 🔹 Strategic Skill Gap Analysis
*   **🎯 Role-Based Matching**: Compare your profile against standard industry roles (Frontend, Backend, AI, Data Science, etc.).
*   **📊 Dynamic Scoring**: Receive a "Job Readiness Score" based on weighted skill importance.
- **🚩 Priority Indicators**: Missing skills are flagged as High, Medium, or Low priority to guide your learning focus.

### 🔹 Personalized Learning Roadmaps
- **🛤️ Step-by-Step Path**: Automatically generated roadmaps based on identified gaps.
- **🕒 Time Estimation**: Estimated hours and weekly milestones for each missing skill.
- **📚 Resource Integration**: Direct links to learning materials and course recommendations.

### 🔹 User Dashboard & Progress Tracking
- **📈 Visual Analytics**: Track your growth over time with interactive charts.
- **✅ Status Management**: Update progress for each skill (Not Started, Learning, Completed).
- **🔒 Secure Profile**: Personal history of all generated reports and progress states.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (with custom "Technical Precision" Design System)
- **Icons**: Lucide React
- **State Management**: React Context API
- **Routing**: React Router Dom v7
- **API Client**: Axios (with environment-based configuration)

### Backend
- **Framework**: Django 6.0
- **API Engine**: Django REST Framework (DRF)
- **Authentication**: SimpleJWT (Stateless JWT auth)
- **Parsing Engine**: `pdfplumber` & `python-docx`
- **Static Hosting**: WhiteNoise (Production-optimized)
- **Production Server**: Gunicorn
- **Database**: SQLite (Dev) / PostgreSQL (via Docker)

---

## 📂 Project Structure

```text
skill_gap_analyzer/
├── backend/                # Django REST API
│   ├── accounts/           # User Authentication & JWT logic
│   ├── analysis/           # Resume extraction & Gap analysis logic
│   ├── jobs/               # Industry job role management
│   ├── roadmap/            # Personalized learning path generation
│   ├── skills/             # Core skill database and management
│   ├── staticfiles/        # Collected production assets
│   ├── .env.example        # Backend environment template
│   ├── Dockerfile          # Backend containerization
│   └── requirements.txt    # Python dependencies
├── frontend/               # React + Vite Application
│   ├── src/
│   │   ├── api/            # Configured Axios instance (Env-aware)
│   │   ├── components/     # UI components (Atomic design)
│   │   ├── pages/          # Full-page views
│   │   └── context/        # Global auth & app state
│   ├── .env.example        # Frontend environment template
│   ├── Dockerfile          # Frontend containerization
│   └── package.json        # NPM dependencies
├── docker-compose.yml      # Orchestration for full-stack deployment
├── DESIGN.md               # UI/UX Specifications
└── ProblemStatement.md     # Project Requirements & Scope
```

---

## 🚀 Getting Started

### Option 1: Docker Deployment (Recommended)
The entire stack is containerized for a seamless setup experience.
1. Clone the repository.
2. Run the orchestration command:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

### Option 2: Manual Local Setup

#### Backend Setup
1. Navigate to the backend directory: `cd backend`.
2. Create a virtual environment: `python -m venv venv`.
3. Activate the environment: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux).
4. Install dependencies: `pip install -r requirements.txt`.
5. Create `.env` based on `.env.example`:
   ```text
   SECRET_KEY=your_secret
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```
6. Run migrations: `python manage.py migrate`.
7. Start server: `python manage.py runserver`.

#### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`.
2. Install dependencies: `npm install`.
3. Create `.env` based on `.env.example`:
   ```text
   VITE_API_URL=http://localhost:8000
   ```
4. Start development server: `npm run dev`.

---

## 🎨 Design Philosophy: "Technical Precision"

The UI is built for performance and clarity:
- **Corporate-Modern Aesthetic**: A deep slate foundation with vibrant emerald and blue accents.
- **Typography**: Space Grotesk (Headlines) and Inter (Body) for a technical yet legible feel.
- **Dark-First**: Optimized for developers and technical users.

---

## 🧪 Testing

The backend features a comprehensive test suite covering API endpoints and resume parsing logic.
- **Run all tests**: `python manage.py test`
- **View results**: Results are exported to `backend/test_results.json` and summarized in `backend/Test_results.md`.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

*Built with ❤️ for career growth.*