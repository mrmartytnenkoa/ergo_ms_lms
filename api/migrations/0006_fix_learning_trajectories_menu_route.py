# -*- coding: utf-8 -*-
from django.db import migrations
from django.db.models import Q


def fix_trajectories_menu_route(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(
        module_source='modules/lms',
        name='Траектории обучения',
    ).filter(
        Q(route_name__isnull=True) | Q(route_name='')
    ).update(
        route_name='LMSLearningTrajectories',
        item_type='route',
    )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('lms', '0005_add_learning_trajectories_menu_item'),
    ]

    operations = [
        migrations.RunPython(
            fix_trajectories_menu_route,
            noop_reverse,
        ),
    ]
