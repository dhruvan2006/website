# Generated by Django 5.1.2 on 2024-10-22 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('valuation', '0002_valuation'),
    ]

    operations = [
        migrations.AddField(
            model_name='valuationindicator',
            name='color',
            field=models.CharField(default='#000000', max_length=16),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='valuationindicator',
            name='logo',
            field=models.CharField(default='https://www.gnanadhandayuthapani.com/logo.svg', max_length=255),
            preserve_default=False,
        ),
    ]
