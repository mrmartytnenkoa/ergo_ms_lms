# -*- coding: utf-8 -*-
"""
Миграция данных: заполнение меню модуля LMS.

Структура берётся из modules/lms/client/js/menu-config.json.
Порядок элементов определяется последовательностью создания.
"""

from django.db import migrations


def populate_menu(apps, schema_editor):
    """Создаёт элементы меню для модуля LMS."""
    from src.core.cms.adp.menu.migration_utils import MenuMigrationHelper

    # module_source указываем как путь к модулю
    helper = MenuMigrationHelper(apps, 'modules/lms')
    helper.clear_module_items()

    # Корневой элемент (соответствует секции "Управление обучением")
    # routeName: "LMS", icon: "GraduationCap"
    lms_root = helper.create_group(
        'Управление обучением',
        'LMS',
        icon='GraduationCap',
    )

    # Дочерние элементы — порядок определяется последовательностью
    # Список соответствует elements из menu-config.json
    helper.create_routes_batch(
        [
            ('Панель пользователя', 'LMSDashboard'),
            ('Каталог курсов', 'LMSCatalog'),
            ('Мои курсы', 'LMSCourses'),
            ('Календарь', 'LMSCalendar'),
            ('Оценки', 'LMSGrades'),
            ('Достижения', 'LMSBadges'),
            ('Управление курсами', 'LMSLessonsManagement'),
            ('Структура курсов', 'LMSCategoriesAndFormats'),
        ],
        parent=lms_root,
    )


def reverse_populate_menu(apps, schema_editor):
    """Удаляет элементы меню модуля LMS."""
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(module_source='modules/lms').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('cms_adp', '0007_populate_core_menu'),
        ('lms', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(
            populate_menu,
            reverse_populate_menu,
        ),
    ]


