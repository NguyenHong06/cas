
# cardinfo/views.py

from django.shortcuts import render
from rest_framework import viewsets   
import requests
from django.http import HttpResponse
import json
from bson import json_util


# from .utils.card_info_utils import CardInfoSerializer 
from .utils import card_info_utils
from .models import CardInfo                  # add this

class CardInfoView(viewsets.ModelViewSet):       # add this
	serializer_class = card_info_utils.CardInfoSerializer          # add this
	queryset = CardInfo.objects.all()

def get_cardinfo_based_on_number_id(request):
    cardinfos = []
    if request.method == 'GET':
		number_id = request.GET.get('number_id', False)
		number_id = str(number_id).strip()
		cardinfo = card_info_utils.get_cardinfo_based_on_number_id(number_id)
		cardinfos.append(cardinfo)
	
    data = json.dumps(cardinfos, default=json_util.default)
    return HttpResponse(data, 'application/json')

def get_cardinfos_based_on_search_term(request):
	cardinfos = []
	if request.method == 'GET':
		search_term = request.GET.get('search_term', False)
		search_term = str(search_term).strip()
		if search_term:
			cardinfos = card_info_utils.get_cardinfo_based_on_search_term(search_term)
	data = json.dumps(cardinfos,default=json_util.default)
	print cardinfos
	return HttpResponse(data, 'application/json')

def get_codesets_based_on_code_type(request):
	cardinfos = []
	if request.method == 'GET':
		code_type = request.GET.get('code_type', False)
		code_type = str(code_type).strip()
		display_value_id = request.GET.get('display_value_id', False)
		if not display_value_id:
			display_value_id = ''
		else: 
			display_value_id = card_info_utils.get_display_value_of_codesets_based_on_codeset_id(display_value_id)
		if code_type:
			cardinfos = card_info_utils.get_codesets_based_on_code_type(code_type, display_value_id)
	data = json.dumps(cardinfos,default=json_util.default)
	print cardinfos
	return HttpResponse(data, 'application/json')
    


    

