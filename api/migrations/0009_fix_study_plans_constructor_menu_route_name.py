# -*- coding: utf-8 -*-
"""
Исправление пункта меню «Конструктор учебных планов»: в route_name должно быть
имя маршрута Vue (LMSStudyPlansConstructor), иначе router.push({ name }) не работает.
Аналог lms.0007 для траекторий обучения.
"""
from django.db import migrations


def fix_route_name(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(
        module_source='modules/lms',
        route_name='/lms/study-plans-constructor',
    ).update(route_name='LMSStudyPlansConstructor', item_type='route')

    MenuItem.objects.filter(
        module_source='modules/lms',
        name='Конструктор учебных планов',
        parent__isnull=False,
    ).exclude(route_name='LMSStudyPlansConstructor').update(
        route_name='LMSStudyPlansConstructor',
        item_type='route',
    )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('lms', '0008_add_study_plans_constructor_menu_item'),
    ]

    operations = [
        migrations.RunPython(fix_route_name, noop_reverse),
    ]
