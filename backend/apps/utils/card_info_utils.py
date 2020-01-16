from django.db.models import Q, Count
from rest_framework import serializers
from apps.models import *
class CardInfoSerializer(serializers.ModelSerializer):
	class Meta:
		model = CardInfo
		fields = ('number_id', 'user_name', 'card_number', 'first_name', 'last_name', 'middle_name', 'name','dob',
		'description','home_school', 'department','supervisor','account_type',
		'street', 'ward', 'district', 'home_phone','gender','active','email','position_email','phone_extension')

def get_cardinfo_based_on_number_id(number_id):
	cardinfo = CardInfo.objects.filter(number_id = number_id).first()
	card_json = {}
	if cardinfo and isinstance(cardinfo, CardInfo):
		card_json['name'] = cardinfo.name
		card_json['number_id'] = cardinfo.number_id
		card_json['user_name'] = cardinfo.user_name
		card_json['card_number'] = cardinfo.card_number
		card_json['street'] = cardinfo.street
		card_json['ward'] = cardinfo.ward
		card_json['district'] = cardinfo.district
		card_json['home_phone'] = cardinfo.home_phone
		card_json['gender'] = get_codesetid(cardinfo.gender)
		card_json['active'] = get_codesetid(cardinfo.active)
	return card_json
def get_codesetid(codeset):
	if codeset and isinstance(codeset, CodeSet):
		return codeset.codeset_id
	return False
def get_display_value_of_codesets_based_on_codeset_id(codeset_id):
	codeset = CodeSet.objects.filter(codeset_id = codeset_id).first()
	if codeset and isinstance(codeset, CodeSet):
		return codeset.display_value
	return False
def get_codesets_based_on_code_type(code_type, display_value):
	codesets = CodeSet.objects.filter(code_type = code_type).filter(display_value__icontains = display_value).all()
	codeset_jsons = []
	for codeset in codesets:
		codeset_json = {}
		if codeset and isinstance(codeset, CodeSet):
			codeset_json['codeset_id'] = codeset.codeset_id
			codeset_json['display_value'] = codeset.display_value
			codeset_json['description'] = codeset.description
		codeset_jsons.append(codeset_json)
	return codeset_jsons
def get_cardinfo_based_on_search_term(search_term):
	print('Go to function get_cardinfo_based_on_search_term')
	search_term_list = search_term.split(' ')
	cardinfos = CardInfo.objects.all()
	q = Q()
	cardinfo_list = []
	for search_term in search_term_list:
		q.add((Q(number_id__icontains=search_term) |
		Q(user_name__icontains=search_term) |
		Q(card_number__icontains=search_term)), q.connector)
	cardinfos = cardinfos.filter(q).order_by('user_name')[:20]
	for card in cardinfos:
		card_info = {}
		card_info['number_id'] = card.number_id
		card_info['user_name'] = card.user_name
		card_info['card_number'] = card.card_number
		card_info['name'] = card.name
		card_info['description'] = card.description
		card_info['email'] = card.email
		cardinfo_list.append(card_info)
	return cardinfo_list


  