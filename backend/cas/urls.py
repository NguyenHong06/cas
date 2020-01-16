
# backend/urls.py

from django.contrib import admin
from django.conf.urls import url, include             
from apps import views    
from rest_framework import routers                        
router = routers.DefaultRouter()                      
router.register(r'cardinfos', views.CardInfoView, 'cardinfos')    
urlpatterns = [
    url('admin/', admin.site.urls),           
    url('api/', include(router.urls)),             
    url(r'^get_cardinfo_based_on_number_id/$', views.get_cardinfo_based_on_number_id, name='get_cardinfo_based_on_number_id'),
    url(r'^get_codesets_based_on_code_type/$', views.get_codesets_based_on_code_type, name='get_codesets_based_on_code_type'),
    url(r'^get_cardinfos_based_on_search_term/$', views.get_cardinfos_based_on_search_term, name='get_cardinfos_based_on_search_term'),
    
   
]