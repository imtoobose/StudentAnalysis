from django.contrib import admin
from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views
from studentapp.views import ocr_view, ocr_form_view #importing class based views


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
    path('ocr/ocr', ocr_view, name='ocr_view'),
    path('ocr/form', ocr_form_view, name='ocr_form_view'),
]