# -*- coding: utf-8 -*-
from django.db import migrations


def add_notifications_menu_item(apps, schema_editor):
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
        route_name='LMSNotifications',
        parent=root_item,
        defaults={
            'name': 'Уведомления',
            'item_type': 'route',
            'is_active': True,
            'order': 65,
        },
    )


def remove_notifications_menu_item(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(
        module_source='modules/lms',
        route_name='LMSNotifications',
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('lms', '0003_populate_categories_formats_courses'),
    ]

    operations = [
        migrations.RunPython(
            add_notifications_menu_item,
            remove_notifications_menu_item,
        ),
    ]

