from django.contrib import admin
from .models import Skill, UserSkill, LearningResource, Quiz, Question

admin.site.register(Skill)
admin.site.register(UserSkill)
admin.site.register(LearningResource)
admin.site.register(Quiz)
admin.site.register(Question)
