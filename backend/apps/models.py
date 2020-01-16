
# cardinfo/models.py
      
from django.db import models
import datetime
from django.utils import timezone
from django.contrib.auth.hashers import make_password

class CodeSet(models.Model):
	codeset_id = models.AutoField(primary_key=True)
	code_type = models.CharField(max_length=255, blank=True)
	display_value = models.CharField(max_length=255, blank=True)
	description = models.CharField(max_length=255, blank=True)
	def __unicode__(self):
		return "{}".format(self.description)	
	def __str__(self):
		return self.codeset_id

class CardInfo(models.Model):
	number_id = models.CharField(max_length=6, primary_key=True)
	user_name = models.CharField(max_length=255, blank=True)
	card_number = models.CharField(max_length=255, blank=True)
	gender = models.ForeignKey(CodeSet, on_delete=models.CASCADE, 
	related_name="gender", limit_choices_to={'code_type': 'gender'}, blank=True, null=True)
	first_name = models.CharField(max_length=255, blank=True, null=True)
	last_name = models.CharField(max_length=255, blank=True, null=True)
	middle_name = models.CharField(max_length=255, blank=True, null=True)
	name = models.CharField(max_length=255, null=True)
	dob = models.DateField(blank=True,default=datetime.date(1900, 1, 1))
	family_ident = models.CharField(max_length=100, blank=True)

	home_school = models.ForeignKey(CodeSet, on_delete=models.CASCADE, 
	related_name="home_school", limit_choices_to={'code_type': 'home_school'}, blank=True, null=True)
	department = models.ForeignKey(CodeSet, on_delete=models.CASCADE, 
	related_name="department", limit_choices_to={'code_type': 'department'}, blank=True, null=True)
	foreign_hire = models.ForeignKey(CodeSet, on_delete=models.CASCADE, 
	related_name="foreign_hire", limit_choices_to={'code_type': 'gender'}, blank=True, null=True)
	description = models.CharField(max_length=255, blank=True)
	supervisor = models.CharField(max_length=6, blank=True, default='')
	account_type = models.ForeignKey(CodeSet, on_delete=models.CASCADE, 
	related_name="account_type", limit_choices_to={'code_type': 'account_type'}, blank=True, null=True)
	crisis_role = models.ForeignKey(CodeSet, on_delete=models.CASCADE, 
	related_name="crisis_role", limit_choices_to={'code_type': 'gender'}, blank=True, null=True)

	email = models.EmailField(max_length=255, blank=True)
	position_email = models.EmailField(max_length=255, blank=True)
	phone_extension = models.CharField(max_length=255, blank=True)
	home_phone = models.CharField(max_length=255, blank=True)
	street = models.CharField(max_length=255, blank=True)
	ward = models.CharField(max_length=255, blank=True)
	district = models.CharField(max_length=255, blank=True)

	first_created = models.DateTimeField(editable=False, default=timezone.now)
	last_modified = models.DateTimeField(default=timezone.now)
	encrypt = models.CharField(max_length=255, blank=True)

	# status
	active = models.ForeignKey(CodeSet, on_delete=models.CASCADE, 
	related_name="active", limit_choices_to={'code_type': 'active'}, blank=True, null=True)

	def save(self, *args, **kwargs):
		self.last_modified = timezone.now()
		if self.middle_name: 
			self.name = '{}, {} {}'.format(self.first_name, self.last_name, self.middle_name)
		else:
			self.name = '{}, {}'.format(self.first_name, self.last_name)
		self.encrypt = make_password(self.number_id,'ps').replace('/', 'd').replace('+', 'p').replace('=', 'e')[-30:]
		return super(CardInfo, self).save(*args, **kwargs)
	
	def __str__(self):
		return self.number_id

