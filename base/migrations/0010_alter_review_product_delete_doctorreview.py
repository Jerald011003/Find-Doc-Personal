# Generated by Django 5.1 on 2024-10-05 14:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_rename_product_doctorreview_doctor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='product',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.doctor'),
        ),
        migrations.DeleteModel(
            name='DoctorReview',
        ),
    ]
