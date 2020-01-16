from django.contrib import admin
from .models import CardInfo, CodeSet
    

class CardInfoAdmin(admin.ModelAdmin):  # add this
    list_display = ('number_id', 'user_name', 'card_number','gender', 'street', 'ward', 'district', 'home_phone','email','position_email') # add this
        
class CodeSetAdmin(admin.ModelAdmin):  # add this
  	list_display = ('codeset_id', 'code_type', 'display_value','description')
	search_fields = ('codeset_id', 'code_type', 'display_value','description')
	list_filter = ('codeset_id', 'code_type', 'display_value','description')
	ordering = ('codeset_id', 'code_type', 'display_value','description')
	readonly_fields = ()
# Register your models here.
admin.site.register(CardInfo, CardInfoAdmin)
admin.site.register(CodeSet, CodeSetAdmin)