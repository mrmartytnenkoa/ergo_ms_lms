# -*- coding: utf-8 -*-
from django.db import migrations


def add_work_programs_constructor_menu_item(apps, schema_editor):
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
        route_name='LMSWorkProgramsConstructor',
        parent=root_item,
        defaults={
            'name': 'Конструктор рабочих программ',
            'item_type': 'route',
            'is_active': True,
            'order': 54,
        },
    )


def remove_work_programs_constructor_menu_item(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(
        module_source='modules/lms',
        route_name='LMSWorkProgramsConstructor',
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('lms', '0010_clear_study_plans_constructor_menu_icon'),
    ]

    operations = [
        migrations.RunPython(
            add_work_programs_constructor_menu_item,
            remove_work_programs_constructor_menu_item,
        ),
    ]
