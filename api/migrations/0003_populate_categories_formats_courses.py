# -*- coding: utf-8 -*-
"""
Миграция данных: заполнение категорий курсов, форматов, курсов, тем и уроков.

Создает начальные данные для:
- CourseCategory (категории и подкатегории курсов)
- CourseFormat (форматы проведения курсов)
- Subject (примеры курсов)
- Theme (темы курсов)
- Lesson (уроки в темах)
"""

from django.db import migrations


def populate_data(apps, schema_editor):
    """Заполняет таблицы категорий, форматов и курсов начальными данными."""
    # Получаем модели из исторического состояния
    CourseCategory = apps.get_model('lms', 'CourseCategory')
    CourseFormat = apps.get_model('lms', 'CourseFormat')
    Subject = apps.get_model('lms', 'Subject')
    User = apps.get_model('auth', 'User')
    
    # Получаем модели для тем и уроков
    Theme = apps.get_model('lms', 'Theme')
    Lesson = apps.get_model('lms', 'Lesson')
    
    # Импортируем функции заполнения
    try:
        from modules.lms.api.migrations.data.populate_categories import populate_categories
        from modules.lms.api.migrations.data.populate_formats import populate_formats
        from modules.lms.api.migrations.data.populate_courses import populate_courses
        from modules.lms.api.migrations.data.populate_themes_lessons import populate_themes_and_lessons
    except ImportError as e:
        print(f"Ошибка импорта функций заполнения: {e}")
        print("Пропускаем заполнение данных.")
        return
    
    # Проверяем, есть ли уже данные
    if CourseCategory.objects.exists():
        print("Категории уже существуют, пропускаем создание...")
    else:
        print("Создание категорий курсов...")
        categories = populate_categories(CourseCategory)
        print(f"Создано категорий: {len(categories)}")
    
    if CourseFormat.objects.exists():
        print("Форматы уже существуют, пропускаем создание...")
    else:
        print("Создание форматов курсов...")
        formats = populate_formats(CourseFormat)
        print(f"Создано форматов: {len(formats)}")
    
    # Для курсов нужны преподаватели, поэтому создаем их только если есть пользователи
    courses_created = []
    if Subject.objects.exists():
        print("Курсы уже существуют, пропускаем создание...")
        courses_created = list(Subject.objects.all())
    else:
        # Получаем всех пользователей, которые могут быть преподавателями
        teachers = User.objects.all()[:10]  # Берем первых 10 пользователей
        
        if teachers.exists():
            print("Создание примерных курсов...")
            categories = CourseCategory.objects.all()
            formats = CourseFormat.objects.all()
            
            # Создаем только несколько примерных курсов (не все)
            courses_created = populate_courses(
                Subject,
                list(categories),
                list(formats),
                list(teachers),
                count=5  # Создаем только 5 примерных курсов
            )
            print(f"Создано курсов: {len(courses_created)}")
        else:
            print("Нет пользователей для создания курсов. Пропускаем создание курсов.")
    
    # Создаем темы и уроки для всех курсов (новых и существующих), если их еще нет
    if courses_created and not Theme.objects.exists():
        print("Создание тем и уроков для курсов...")
        result = populate_themes_and_lessons(
            Theme,
            Lesson,
            courses_created,
            themes_per_course=3,  # 3 темы на курс
            lessons_per_theme=3   # 3 урока на тему
        )
        print(f"Создано тем: {result['themes']}, уроков: {result['lessons']}")
    elif Theme.objects.exists():
        print("Темы уже существуют, пропускаем создание...")


def reverse_populate_data(apps, schema_editor):
    """Удаляет созданные данные (опционально, для отката миграции)."""
    CourseCategory = apps.get_model('lms', 'CourseCategory')
    CourseFormat = apps.get_model('lms', 'CourseFormat')
    Subject = apps.get_model('lms', 'Subject')
    Theme = apps.get_model('lms', 'Theme')
    Lesson = apps.get_model('lms', 'Lesson')
    
    # Удаляем только те данные, которые были созданы этой миграцией
    # Можно оставить пустым, если не хотите удалять данные при откате
    print("Откат миграции данных: данные не удаляются автоматически.")
    print("Для удаления данных используйте команду: api generate_lms_data --clear")


class Migration(migrations.Migration):

    dependencies = [
        ('lms', '0002_menu_data'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.RunPython(
            populate_data,
            reverse_populate_data,
        ),
    ]

