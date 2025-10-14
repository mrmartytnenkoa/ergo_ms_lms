from django.apps import AppConfig

class LmsCoursesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modules.lms.api.courses'
    label = 'lms_courses'