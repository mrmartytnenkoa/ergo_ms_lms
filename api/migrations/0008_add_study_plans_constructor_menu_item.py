# -*- coding: utf-8 -*-
from django.db import migrations


def add_study_plans_constructor_menu_item(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')

    root_item = MenuItem.objects.filter(
        module_source='modules/lms',
        route_name='LMS',
        parent__isnull=True,
    ).first()

    if not root_item:
        root_item = MenuItem.objects.filter(
            module_source='modules/lms',
            name='Управление обучением',
            parent__isnull=True,
        ).first()

    if not root_item:
        return

    MenuItem.objects.get_or_create(
        module_source='modules/lms',
        route_name='LMSStudyPlansConstructor',
        parent=root_item,
        defaults={
            'name': 'Конструктор учебных планов',
            'item_type': 'route',
            'is_active': True,
            'order': 53,
        },
    )


def remove_study_plans_constructor_menu_item(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(
        module_source='modules/lms',
        route_name='LMSStudyPlansConstructor',
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('lms', '0007_fix_menu_route_name_path_vs_name'),
    ]

    operations = [
        migrations.RunPython(
            add_study_plans_constructor_menu_item,
            remove_study_plans_constructor_menu_item,
        ),
    ]
