# -*- coding: utf-8 -*-
"""
Функции для заполнения курсов.

Используется в миграциях данных и командах управления.
"""

import random
from django.utils import timezone
from datetime import timedelta


def get_courses_data():
    """
    Возвращает данные для создания курсов.
    
    Returns:
        list: Список словарей с данными курсов
    """
    return [
        {
            'name': 'Основы Python разработки',
            'description': 'Изучение основ программирования на Python с нуля',
            'category_keywords': ['backend', 'анализ'],
            'summary': 'Курс для начинающих разработчиков. Изучите синтаксис Python, основы ООП, работу с библиотеками.',
        },
        {
            'name': 'React.js для начинающих',
            'description': 'Создание интерактивных пользовательских интерфейсов',
            'category_keywords': ['frontend'],
            'summary': 'Изучите современную библиотеку React для создания динамических веб-приложений.',
        },
        {
            'name': 'Django Framework',
            'description': 'Разработка веб-приложений на Django',
            'category_keywords': ['backend'],
            'summary': 'Создание полноценных веб-приложений с помощью популярного Python фреймворка.',
        },
        {
            'name': 'Машинное обучение с Python',
            'description': 'Введение в ML алгоритмы и библиотеки',
            'category_keywords': ['машинное', 'анализ'],
            'summary': 'Освойте основы машинного обучения, работу с scikit-learn, pandas и numpy.',
        },
        {
            'name': 'JavaScript ES6+',
            'description': 'Современный JavaScript и его возможности',
            'category_keywords': ['frontend'],
            'summary': 'Изучите современные возможности JavaScript: arrow functions, async/await, модули.',
        },
        {
            'name': 'Docker и контейнеризация',
            'description': 'Основы работы с контейнерами',
            'category_keywords': ['контейнеризация', 'devops'],
            'summary': 'Изучите Docker, создание образов, работу с Docker Compose и оркестрацию.',
        },
        {
            'name': 'SQL и базы данных',
            'description': 'Проектирование и работа с реляционными БД',
            'category_keywords': ['sql'],
            'summary': 'Основы SQL, проектирование баз данных, оптимизация запросов.',
        },
        {
            'name': 'Vue.js разработка',
            'description': 'Создание SPA приложений на Vue.js',
            'category_keywords': ['frontend'],
            'summary': 'Изучите прогрессивный фреймворк Vue.js для создания современных веб-приложений.',
        },
        {
            'name': 'Node.js Backend',
            'description': 'Серверная разработка на JavaScript',
            'category_keywords': ['backend'],
            'summary': 'Создание REST API и веб-серверов с помощью Node.js и Express.',
        },
        {
            'name': 'Git и система контроля версий',
            'description': 'Эффективная работа с Git',
            'category_keywords': ['devops'],
            'summary': 'Изучите Git: ветвление, слияние, работа в команде, GitHub/GitLab.',
        },
        {
            'name': 'Основы кибербезопасности',
            'description': 'Защита информации и систем',
            'category_keywords': ['безопасность', 'этичный'],
            'summary': 'Основы информационной безопасности, анализ уязвимостей, методы защиты.',
        },
        {
            'name': 'MongoDB и NoSQL',
            'description': 'Работа с документоориентированными БД',
            'category_keywords': ['nosql'],
            'summary': 'Изучите MongoDB: схемы данных, запросы, агрегация, индексирование.',
        },
        {
            'name': 'Android разработка на Kotlin',
            'description': 'Создание мобильных приложений для Android',
            'category_keywords': ['android'],
            'summary': 'Разработка нативных Android приложений с использованием Kotlin и Android Studio.',
        },
        {
            'name': 'AWS Cloud Computing',
            'description': 'Облачные технологии Amazon Web Services',
            'category_keywords': ['облачные'],
            'summary': 'Изучите основные сервисы AWS: EC2, S3, RDS, Lambda и другие.',
        },
        {
            'name': 'Flutter кроссплатформенная разработка',
            'description': 'Мобильные приложения на Flutter',
            'category_keywords': ['кроссплатформенная'],
            'summary': 'Создание приложений для iOS и Android с помощью Flutter и Dart.',
        }
    ]


def populate_courses(Subject, categories, formats, teachers, count=None):
    """
    Создает курсы на основе данных.
    
    Args:
        Subject: Модель Subject
        categories: Список категорий курсов
        formats: Список форматов курсов
        teachers: Список преподавателей (User объекты)
        count: Количество курсов для создания (None = все)
        
    Returns:
        list: Список созданных курсов
    """
    courses_data = get_courses_data()
    subjects = []
    
    # Если указано количество, ограничиваем список
    if count is not None:
        courses_data = courses_data[:min(count, len(courses_data))]
    
    for course_data in courses_data:
        # Находим подходящую категорию
        category = None
        for cat in categories:
            if any(keyword.lower() in cat.name.lower() for keyword in course_data['category_keywords']):
                category = cat
                break
        
        # Если категория не найдена, выбираем случайную подкатегорию
        if not category:
            subcategories = [cat for cat in categories if cat.parent is not None]
            if subcategories:
                category = random.choice(subcategories)
            elif categories:
                category = random.choice(categories)
        
        subject = Subject.objects.create(
            name=course_data['name'],
            description=course_data['description'],
            summary=course_data['summary'],
            teacher=random.choice(teachers) if teachers else None,
            category=category,
            course_format=random.choice(formats) if formats else None,
            start_date=timezone.now().date() + timedelta(days=random.randint(1, 30)),
            end_date=timezone.now().date() + timedelta(days=random.randint(60, 120)),
            is_published=True,
            is_self_enrollment=random.choice([True, False]),
            completion_tracking=True,
            max_enrollment=random.randint(20, 100)
        )
        subjects.append(subject)
    
    return subjects

