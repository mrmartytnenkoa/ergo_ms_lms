# -*- coding: utf-8 -*-
"""У пункта «Конструктор учебных планов» в боковом меню — точка, как у соседних пунктов (без иконки)."""
from django.db import migrations


def clear_icon(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(
        module_source='modules/lms',
        route_name='LMSStudyPlansConstructor',
    ).update(icon=None)


def restore_icon(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(
        module_source='modules/lms',
        route_name='LMSStudyPlansConstructor',
    ).update(icon='ClipboardList')


class Migration(migrations.Migration):
    dependencies = [
        ('lms', '0009_fix_study_plans_constructor_menu_route_name'),
    ]

    operations = [
        migrations.RunPython(clear_icon, restore_icon),
    ]
