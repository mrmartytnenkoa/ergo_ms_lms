# -*- coding: utf-8 -*-
"""
Функции для заполнения форматов курсов.

Используется в миграциях данных и командах управления.
"""


def get_formats_data():
    """
    Возвращает данные для создания форматов курсов.
    
    Returns:
        list: Список словарей с данными форматов
    """
    return [
        {'name': 'Базовый курс', 'description': 'Основательное изучение с нуля'},
        {'name': 'Интенсив', 'description': 'Быстрое погружение в тему'},
        {'name': 'Практикум', 'description': 'Практические задания и проекты'},
        {'name': 'Мастер-класс', 'description': 'Углубленное изучение конкретных техник'},
        {'name': 'Онлайн-курс', 'description': 'Самостоятельное изучение'},
        {'name': 'Вебинар', 'description': 'Живые онлайн-занятия'},
    ]


def populate_formats(CourseFormat):
    """
    Создает форматы курсов на основе данных.
    
    Args:
        CourseFormat: Модель CourseFormat
        
    Returns:
        list: Список созданных форматов
    """
    formats_data = get_formats_data()
    formats = []
    
    for format_data in formats_data:
        course_format = CourseFormat.objects.create(**format_data)
        formats.append(course_format)
    
    return formats

