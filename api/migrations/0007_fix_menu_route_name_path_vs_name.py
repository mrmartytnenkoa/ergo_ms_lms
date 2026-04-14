# -*- coding: utf-8 -*-
from django.db import migrations


def fix_path_stored_as_route_name(apps, schema_editor):
    MenuItem = apps.get_model('cms_adp', 'MenuItem')
    MenuItem.objects.filter(
        module_source='modules/lms',
        route_name='/lms/learning-trajectories',
    ).update(route_name='LMSLearningTrajectories', item_type='route')


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('lms', '0006_fix_learning_trajectories_menu_route'),
    ]

    operations = [
        migrations.RunPython(
            fix_path_stored_as_route_name,
            noop_reverse,
        ),
    ]
