# Generated by Django 4.1.7 on 2023-04-14 08:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mysite', '0007_vouchers_walletid_alter_vouchers_ammount'),
    ]

    operations = [
        migrations.DeleteModel(
            name='TemporaryVoucher',
        ),
        migrations.AlterField(
            model_name='vouchers',
            name='voucherID',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]