# Generated by Django 5.1.3 on 2024-11-24 01:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mola', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contribution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('count', models.IntegerField(default=0)),
                ('sunfish', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contributions', to='mola.sunfish')),
            ],
        ),
    ]
