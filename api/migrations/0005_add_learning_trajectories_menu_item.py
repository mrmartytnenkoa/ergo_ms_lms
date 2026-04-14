# -*- coding: utf-8 -*-
from django.db import migrations


def add_learning_trajectories_menu_item(apps, schema_editor):
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
        route_name='LMSLearningTrajectories',
        parent=root_item,
        defaults={
            'name': 'Траектории обучения',
            'item_type': 'route',
            'is_active': True,
            'order': 52,
        },
    )


def remove_learning_trajectories_menu_item(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(
        module_source='modules/lms',
        route_name='LMSLearningTrajectories',
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('lms', '0004_add_notifications_menu_item'),
    ]

    operations = [
        migrations.RunPython(
            add_learning_trajectories_menu_item,
            remove_learning_trajectories_menu_item,
        ),
    ]
