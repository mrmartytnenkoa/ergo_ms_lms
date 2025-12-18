# -*- coding: utf-8 -*-
"""
Функции для заполнения тем и уроков для курсов.

Используется в миграциях данных и командах управления.
"""

import random


def get_theme_names_for_course(course_name):
    """
    Возвращает список названий тем для курса на основе его названия.
    
    Args:
        course_name: Название курса
        
    Returns:
        list: Список названий тем
    """
    theme_templates = {
        'Python': ['Основы синтаксиса', 'Структуры данных', 'ООП', 'Библиотеки', 'Проекты'],
        'React': ['Компоненты', 'Состояние и props', 'Хуки', 'Маршрутизация', 'Управление состоянием'],
        'Django': ['Модели', 'Представления', 'Шаблоны', 'Формы', 'REST API'],
        'JavaScript': ['Переменные и функции', 'DOM манипуляции', 'Асинхронность', 'ES6+ возможности', 'Отладка'],
        'Docker': ['Основы контейнеров', 'Dockerfile', 'Docker Compose', 'Volumes', 'Сети'],
        'SQL': ['SELECT запросы', 'Joins', 'Индексы', 'Транзакции', 'Процедуры'],
        'Vue': ['Основы Vue.js', 'Компоненты', 'Роутинг', 'State Management', 'Продвинутые техники'],
        'Node': ['Основы Node.js', 'Express Framework', 'REST API', 'Базы данных', 'Деплой'],
        'Git': ['Основы Git', 'Ветвление', 'Слияние', 'Работа в команде', 'GitHub/GitLab'],
        'MongoDB': ['Основы MongoDB', 'Схемы данных', 'Запросы', 'Агрегация', 'Индексирование'],
        'Android': ['Основы Android', 'UI компоненты', 'Навигация', 'Работа с данными', 'Публикация'],
        'AWS': ['Основы AWS', 'EC2 и вычисления', 'S3 и хранилище', 'Базы данных', 'DevOps'],
        'Flutter': ['Основы Flutter', 'Widgets', 'Навигация', 'State Management', 'Публикация'],
    }
    
    for key, themes in theme_templates.items():
        if key.lower() in course_name.lower():
            return themes
    
    # Дефолтные темы, если курс не найден в шаблонах
    return ['Введение', 'Основы', 'Практика', 'Продвинутые темы', 'Проект']


def get_lesson_names_for_theme(theme_name, lesson_num):
    """
    Возвращает название урока для темы.
    
    Args:
        theme_name: Название темы
        lesson_num: Номер урока (0-based)
        
    Returns:
        str: Название урока
    """
    lesson_templates = [
        'Введение и основы',
        'Практические примеры',
        'Углубленное изучение',
        'Задачи и упражнения',
        'Проектная работа'
    ]
    return lesson_templates[lesson_num % len(lesson_templates)]


def populate_themes_and_lessons(Theme, Lesson, subjects, themes_per_course=3, lessons_per_theme=3):
    """
    Создает темы и уроки для курсов.
    
    Args:
        Theme: Модель Theme
        Lesson: Модель Lesson
        subjects: Список курсов (Subject объекты)
        themes_per_course: Количество тем на курс (по умолчанию 3)
        lessons_per_theme: Количество уроков на тему (по умолчанию 3)
        
    Returns:
        dict: Словарь с количеством созданных тем и уроков
    """
    created_themes = 0
    created_lessons = 0
    
    for subject in subjects:
        # Получаем названия тем для этого курса
        theme_names = get_theme_names_for_course(subject.name)
        
        # Ограничиваем количество тем
        themes_to_create = min(themes_per_course, len(theme_names))
        
        for theme_num in range(themes_to_create):
            theme_name = theme_names[theme_num] if theme_num < len(theme_names) else f"Тема {theme_num + 1}"
            
            theme = Theme.objects.create(
                name=f"Тема {theme_num + 1}: {theme_name}",
                description=f"Описание темы {theme_num + 1} курса {subject.name}",
                subject=subject,
                sort_order=theme_num,
                is_visible=True,
                completion_required=False
            )
            created_themes += 1
            
            # Создаем уроки для темы
            lessons_to_create = lessons_per_theme
            for lesson_num in range(lessons_to_create):
                lesson_name = get_lesson_names_for_theme(theme_name, lesson_num)
                
                # Выбираем случайный тип урока
                lesson_type = random.choice(['L', 'V', 'A', 'Q'])  # Лекция, Видео, Задание, Тест
                
                lesson = Lesson.objects.create(
                    name=f"Урок {lesson_num + 1}: {lesson_name}",
                    description=f"Подробное описание урока {lesson_num + 1} темы {theme.name}",
                    lessontype=lesson_type,
                    theme=theme,
                    sort_order=lesson_num,
                    is_visible=True,
                    completion_required=False
                )
                created_lessons += 1
    
    return {
        'themes': created_themes,
        'lessons': created_lessons
    }

