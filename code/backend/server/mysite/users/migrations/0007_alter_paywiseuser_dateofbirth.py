# Generated by Django 4.1.7 on 2023-05-06 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_paywiseuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paywiseuser',
            name='dateOfBirth',
            field=models.DateField(blank=True, null=True),
        ),
    ]