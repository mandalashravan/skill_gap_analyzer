import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from skills.models import Skill, LearningResource, Quiz, Question
from jobs.models import JobRole, JobRoleSkill

def seed():
    print("Seeding data...")

    # 1. Create Skills
    skills_data = [
        # Existing
        ('React', 'Frontend'), ('JavaScript', 'Frontend'), ('HTML', 'Frontend'), ('CSS', 'Frontend'),
        ('Tailwind CSS', 'Frontend'), ('TypeScript', 'Frontend'), ('Python', 'Backend'), ('Django', 'Backend'),
        ('Node.js', 'Backend'), ('SQL', 'Database'), ('PostgreSQL', 'Database'), ('Docker', 'DevOps'),
        ('Kubernetes', 'DevOps'), ('AWS', 'Cloud'), ('Git', 'Tools'), ('Pandas', 'Data Science'),
        ('Scikit-learn', 'Data Science'),
        # New Mobile
        ('React Native', 'Mobile'), ('Flutter', 'Mobile'), ('Swift', 'Mobile'), ('Kotlin', 'Mobile'),
        # New Cyber
        ('Penetration Testing', 'Security'), ('Network Security', 'Security'), ('Wireshark', 'Tools'),
        # New UI/UX
        ('Figma', 'Design'), ('Adobe XD', 'Design'), ('User Research', 'Design'),
        # New Cloud/DevOps
        ('Terraform', 'DevOps'), ('Azure', 'Cloud'), ('Google Cloud Platform', 'Cloud'),
    ]

    skills = {}
    for name, cat in skills_data:
        skill, created = Skill.objects.get_or_create(name=name, defaults={'category': cat})
        skills[name] = skill
        if created:
            print(f"Created skill: {name}")

    # 2. Create Job Roles
    roles_data = [
        ('Frontend Developer', 'Building modern web interfaces with React.'),
        ('Backend Developer', 'Developing robust APIs and server-side logic.'),
        ('Full Stack Developer', 'Mastering both frontend and backend development.'),
        ('Data Analyst', 'Extracting insights from data using Python and SQL.'),
        ('DevOps Engineer', 'Automating deployments and managing infrastructure.'),
        ('Mobile App Developer', 'Creating high-performance mobile applications for iOS and Android.'),
        ('Cybersecurity Analyst', 'Protecting systems and networks from digital attacks.'),
        ('UI/UX Designer', 'Designing intuitive and beautiful user experiences.'),
        ('Cloud Architect', 'Designing and managing scalable cloud infrastructure.'),
    ]

    roles = {}
    for name, desc in roles_data:
        role, created = JobRole.objects.get_or_create(name=name, defaults={'description': desc})
        roles[name] = role
        if created:
            print(f"Created job role: {name}")

    # 3. Map Skills to Roles
    mapping = {
        'Frontend Developer': [
            ('React', 'High', 3), ('JavaScript', 'High', 3), ('HTML', 'Medium', 2),
            ('CSS', 'Medium', 2), ('Tailwind CSS', 'Medium', 2), ('TypeScript', 'Low', 1),
        ],
        'Backend Developer': [
            ('Python', 'High', 3), ('Django', 'High', 3), ('SQL', 'High', 3),
            ('PostgreSQL', 'Medium', 2), ('Docker', 'Low', 1), ('Git', 'Medium', 2),
        ],
        'Data Analyst': [
            ('Python', 'High', 3), ('SQL', 'High', 3), ('Pandas', 'High', 3),
            ('Scikit-learn', 'Medium', 2),
        ],
        'DevOps Engineer': [
            ('Docker', 'High', 3), ('Kubernetes', 'High', 3), ('AWS', 'High', 3),
            ('Git', 'Medium', 2), ('Python', 'Medium', 2), ('Terraform', 'Medium', 2),
        ],
        'Mobile App Developer': [
            ('React Native', 'High', 3), ('Flutter', 'High', 3), ('JavaScript', 'Medium', 2),
            ('Git', 'Medium', 2), ('TypeScript', 'Low', 1),
        ],
        'Cybersecurity Analyst': [
            ('Network Security', 'High', 3), ('Penetration Testing', 'High', 3),
            ('Wireshark', 'Medium', 2), ('Python', 'Low', 1),
        ],
        'UI/UX Designer': [
            ('Figma', 'High', 3), ('Adobe XD', 'Medium', 2), ('User Research', 'High', 3),
            ('HTML', 'Low', 1), ('CSS', 'Low', 1),
        ],
        'Cloud Architect': [
            ('AWS', 'High', 3), ('Azure', 'Medium', 2), ('Google Cloud Platform', 'Low', 1),
            ('Terraform', 'High', 3), ('Docker', 'Medium', 2),
        ]
    }

    for role_name, skill_list in mapping.items():
        role = roles.get(role_name)
        if not role: continue
        for skill_name, priority, weight in skill_list:
            skill = skills.get(skill_name)
            if skill:
                JobRoleSkill.objects.get_or_create(
                    job_role=role,
                    skill=skill,
                    defaults={'priority': priority, 'weight': weight}
                )

    # 4. Add Learning Resources
    resources_data = [
        ('React', 'Official React Documentation', 'https://react.dev', 'Article'),
        ('React', 'React - The Complete Guide (Udemy)', 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', 'Course'),
        ('Python', 'Python for Beginners (YouTube)', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 'Tutorial'),
        ('Python', 'Real Python - Python Tutorials', 'https://realpython.com', 'Article'),
        ('Django', 'Django for Beginners (Book)', 'https://djangoforbeginners.com', 'Course'),
        ('Docker', 'Docker Tutorial for Beginners', 'https://www.youtube.com/watch?v=pTFZFxd4hOI', 'Tutorial'),
        ('Figma', 'Figma for UI/UX Design', 'https://www.figma.com/resource-library/design-basics/', 'Tutorial'),
        ('Terraform', 'HashiCorp Terraform Learn', 'https://developer.hashicorp.com/terraform/tutorials', 'Course'),
        ('React Native', 'React Native Express', 'https://www.reactnativeexpress.com/', 'Tutorial'),
    ]

    for skill_name, title, url, rtype in resources_data:
        skill = skills.get(skill_name)
        if skill:
            LearningResource.objects.get_or_create(
                skill=skill,
                title=title,
                defaults={'url': url, 'resource_type': rtype}
            )

    # 5. Create Quizzes
    python_quiz, _ = Quiz.objects.get_or_create(
        skill=skills['Python'],
        title='Python Basics',
        defaults={'description': 'Test your fundamental knowledge of Python programming.'}
    )

    react_quiz, _ = Quiz.objects.get_or_create(
        skill=skills['React'],
        title='React Core Concepts',
        defaults={'description': 'Assess your understanding of components, hooks, and state.'}
    )

    questions_data = [
        (python_quiz, "What is the correct way to create a function in Python?", "function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():", "B"),
        (python_quiz, "Which of the following is an immutable data type in Python?", "List", "Dictionary", "Tuple", "Set", "C"),
        (python_quiz, "How do you start a comment in Python?", "//", "/*", "#", "--", "C"),
        (react_quiz, "Which hook is used to handle side effects in React?", "useState", "useContext", "useEffect", "useReducer", "C"),
        (react_quiz, "What is the primary way to pass data to a child component?", "State", "Props", "Context", "Refs", "B"),
    ]

    for quiz, text, oa, ob, oc, od, correct in questions_data:
        Question.objects.get_or_create(
            quiz=quiz,
            text=text,
            defaults={
                'option_a': oa,
                'option_b': ob,
                'option_c': oc,
                'option_d': od,
                'correct_option': correct
            }
        )

    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed()
