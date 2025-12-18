# -*- coding: utf-8 -*-
"""
Функции для заполнения категорий курсов.

Используется в миграциях данных и командах управления.
"""


def get_categories_data():
    """
    Возвращает данные для создания категорий курсов.
    
    Returns:
        list: Список словарей с данными категорий и подкатегорий
    """
    return [
        {
            'name': 'Веб-разработка',
            'description': 'Курсы по созданию веб-сайтов и веб-приложений',
            'subcategories': [
                {'name': 'Frontend разработка', 'description': 'HTML, CSS, JavaScript, React, Vue.js'},
                {'name': 'Backend разработка', 'description': 'Python, Django, Node.js, PHP'},
                {'name': 'Full-stack разработка', 'description': 'Комплексная веб-разработка'},
            ]
        },
        {
            'name': 'Мобильная разработка',
            'description': 'Разработка мобильных приложений',
            'subcategories': [
                {'name': 'Android разработка', 'description': 'Java, Kotlin, Android Studio'},
                {'name': 'iOS разработка', 'description': 'Swift, Objective-C, Xcode'},
                {'name': 'Кроссплатформенная разработка', 'description': 'React Native, Flutter'},
            ]
        },
        {
            'name': 'Data Science',
            'description': 'Анализ данных и машинное обучение',
            'subcategories': [
                {'name': 'Машинное обучение', 'description': 'ML алгоритмы и модели'},
                {'name': 'Анализ данных', 'description': 'Python, R, статистика'},
                {'name': 'Большие данные', 'description': 'Hadoop, Spark, NoSQL'},
            ]
        },
        {
            'name': 'DevOps и инфраструктура',
            'description': 'Автоматизация и управление инфраструктурой',
            'subcategories': [
                {'name': 'Контейнеризация', 'description': 'Docker, Kubernetes'},
                {'name': 'CI/CD', 'description': 'Jenkins, GitLab CI, GitHub Actions'},
                {'name': 'Облачные технологии', 'description': 'AWS, Azure, Google Cloud'},
            ]
        },
        {
            'name': 'Базы данных',
            'description': 'Проектирование и управление базами данных',
            'subcategories': [
                {'name': 'SQL базы данных', 'description': 'MySQL, PostgreSQL, Oracle'},
                {'name': 'NoSQL базы данных', 'description': 'MongoDB, Redis, Cassandra'},
            ]
        },
        {
            'name': 'Кибербезопасность',
            'description': 'Защита информации и систем',
            'subcategories': [
                {'name': 'Этичный хакинг', 'description': 'Пентестинг и анализ уязвимостей'},
                {'name': 'Сетевая безопасность', 'description': 'Защита сетевой инфраструктуры'},
            ]
        }
    ]


def populate_categories(CourseCategory):
    """
    Создает категории курсов на основе данных.
    
    Args:
        CourseCategory: Модель CourseCategory
        
    Returns:
        list: Список созданных категорий (родительские и дочерние)
    """
    categories_data = get_categories_data()
    categories = []
    
    for cat_data in categories_data:
        parent_cat = CourseCategory.objects.create(
            name=cat_data['name'],
            description=cat_data['description'],
            sort_order=len(categories)
        )
        categories.append(parent_cat)
        
        for i, subcat_data in enumerate(cat_data['subcategories']):
            subcat = CourseCategory.objects.create(
                name=subcat_data['name'],
                description=subcat_data['description'],
                parent=parent_cat,
                sort_order=i
            )
            categories.append(subcat)
    
    return categories

