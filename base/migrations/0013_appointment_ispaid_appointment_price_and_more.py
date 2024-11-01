# Generated by Django 5.1 on 2024-10-22 04:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0012_appointment_google_meet_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='isPaid',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='appointment',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='status',
            field=models.CharField(default='Pending', max_length=50),
        ),
    ]
