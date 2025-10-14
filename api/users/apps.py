from django.apps import AppConfig

class LmsUsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modules.lms.api.users'
    label = 'lms_users'