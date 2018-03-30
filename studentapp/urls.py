from django.contrib import admin
from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', views.index, name='index'),
    path('get_form_vals', views.formVal, name='formVal'),
    path('send_graph', views.getGraph, name='getGraph'),
    path('send_list', views.getList, name='getList'),
    path('get_all_graphs', views.allGraphs, name='allGrpahs'),
    path('get_all_lists', views.allLists, name='allLists'),
    path('delete_graph/<int:id>', views.delete_graph, name='delete_graph'),
    path('delete_list/<int:id>', views.delete_list, name='delete_list'),
    path('get_suggestions', views.suggestions, name='suggestions'),
    path('get_student_data/<int:aadhar_id>/', views.getStudentData, name='getStudentData'),
    path('studentform/new', views.studentform, name = 'studentform'),
    path('chatbot', views.chatbot, name='chatbot'),
    path('get_state_data/<state_name>', views.getStateData, name='getStateData'),
    path('get_district_data/<district_name>', views.getDistrictData, name='getDistrictData'),
    path('get_school_data/<school_name>', views.getSchoolData, name='getSchoolData'),
    path('get_country_data/', views.getCountryData, name='getCountryData'),
    path('get_country_data/', views.getCountryData, name='getCountryData'),
    path('get_filter_data/', views.filter_data, name='filter_data'),
    path('get_student_list', views.get_student_list, name='get_student_list'),
    path('import_data', views.import_data, name='import_data'),
    path('fieldmatching',views.fieldmatching, name='fieldmatching'),
]